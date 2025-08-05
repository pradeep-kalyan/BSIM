
// app/_actions/auth.ts
"use server";
 
import { comparePassword, hashPassword } from "../functions/Hash";
import crypto from "crypto";
import axios from "axios";
import prisma from "../functions/prisma";
import { deleteCookie, generateToken, setCookie } from "../functions/jwt";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAuthenticatedUser, JWTPayload } from "@/app/functions/jwt";

// Type for incoming form data
export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
 
// Type for response format
export interface AuthResponse {
  status: number;
  message: string;
  success?: boolean;
}
 
/**
 * Registers a new user with password security validation
 * @param formData - User registration data
 * @returns Promise resolving to a response object with status and message
 */
export const registerUser = async (
  formData: RegisterFormData
): Promise<AuthResponse> => {
  const { name, email, password } = formData;
 
  // Basic field validation
  if (!name || !email || !password) {
    return {
      status: 400,
      message: "Name, email, and password are required.",
      success: false,
    };
  }
 
  try {
    // Step 1: Generate SHA-1 hash of the password (for Have I Been Pwned API)
    const sha1HashedPassword = crypto
      .createHash("sha1")
      .update(password)
      .digest("hex")
      .toUpperCase();
 
    const hashPrefix = sha1HashedPassword.slice(0, 5);
    const hashSuffix = sha1HashedPassword.slice(5);
 
    try {
      // Step 2: Query Have I Been Pwned API using k-Anonymity model
      const hibpResponse = await axios.get<string>(
        `https://api.pwnedpasswords.com/range/${hashPrefix}`
      );
 
      const passwordBreached = hibpResponse.data.split("\n").some((line) => {
        const [suffix] = line.split(":");
        return suffix === hashSuffix;
      });
 
      if (passwordBreached) {
        return {
          status: 400,
          message:
            "This password has been found in a data breach. Please choose a more secure password.",
          success: false,
        };
      }
    } catch (error) {
      console.error("Error checking password security:", error);
      // Continue with registration even if password check fails
    }
 
    // Step 3: Securely hash the password before saving
    const securelyHashedPassword = await hashPassword(password);
 
    // Check if user already exists
    const userCount = await prisma.user.count();
    if (userCount > 0) {
      const existingUser = await prisma.user.findUnique({
        where: { email: email },
      });
      if (existingUser) {
        return {
          status: 409,
          message: "Email already exists. Please log in or use another email.",
          success: false,
        };
      }
    }
 
    // Create new user if email doesn't exist
    await prisma.user.create({
      data: {
        name: name,
        email: email,
        password_hash: securelyHashedPassword,
        role: "user",
      },
    });
 
    return {
      status: 200,
      message: "User registered successfully.",
      success: true,
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      status: 500,
      message: "Failed to create user. Please try again.",
      success: false,
    };
  }
};
 
/**
 * Authenticates a user and creates a session
 * @param formData - Form data containing email and password
 * @returns Promise resolving to an auth response
 */
export const loginUser = async (formData: FormData): Promise<AuthResponse> => {
  const email = formData.get("mail") as string;
  const password = formData.get("password") as string;
 
  if (!email || !password) {
    return {
      status: 400,
      message: "Please provide both email and password.",
      success: false,
    };
  }
 
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
 
    if (!user) {
      return {
        status: 404,
        message: "Account not found. Please register first.",
        success: false,
      };
    }
 
    const isPasswordValid = await comparePassword(password, user.password_hash);
 
    if (!isPasswordValid) {
      return {
        status: 401,
        message: "Invalid credentials. Please check your email and password.",
        success: false,
      };
    }
 
    // Generate JWT token
    const token = await generateToken({
      id: user.id,
      name: user.name,
      role: user.role,
      email: user.email,
    });
 
    // Set the token in a cookie
    await setCookie(token);
 
    return {
      status: 200,
      message: "Login successful",
      success: true,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      status: 500,
      message: "An error occurred during login. Please try again.",
      success: false,
    };
  }
};

/**
 * Handles user logout by clearing the session cookie
 * @returns Promise resolving to a success message
 */
export const logoutUser = async (): Promise<AuthResponse> => {
  try {
    await deleteCookie();
    return {
      status: 200,
      message: "Logout successful",
      success: true,
    };
  } catch (error) {
    console.error("Logout error:", error);
    return {
      status: 500,
      message: "An error occurred during logout. Please try again.",
      success: false,
    };
  }
};

export async function updateUser(
  id: string,
  data: {
    name?: string;
    email?: string;
    password_hash?: string;
    role?: string;
  }
) {
  try {
    await prisma.user.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
      },
    });
    revalidatePath("/users");
    revalidatePath(`/users/${id}`);
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user");
  }
}

export async function checkAuthStatus(): Promise<JWTPayload> {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

/**
 * Gets the current authenticated user
 * @returns Promise resolving to user data or null if not authenticated
 */
export async function getCurrentUser(): Promise<JWTPayload | null> {
  try {
    const user = await getAuthenticatedUser();
    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Gets the current authenticated user and throws if not found
 * @returns Promise resolving to user data
 * @throws Error if user is not authenticated
 */
export async function requireCurrentUser(): Promise<JWTPayload> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Authentication required");
  }

  return user;
}
