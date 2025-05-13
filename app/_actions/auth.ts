"use server";
import { comparePassword, hashPassword } from "../functions/Hash.js";
import crypto from "crypto";
import axios from "axios";
import prisma from "../functions/prisma";
import { redirect } from "next/dist/server/api-utils/index.js";

// Type for incoming form data
interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Type for response format
interface RegisterResponse {
  status: number;
  message: string;
}

export const registerUser = async (
  formData: RegisterFormData
): Promise<RegisterResponse> => {
  const { name, email, password } = formData;

  // Basic field validation
  if (!name || !email || !password) {
    return {
      status: 400,
      message: "Name, email, and password are required.",
    };
  }

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
      };
    }
  } catch (error) {
    return {
      status: 500,
      message:
        "Error while checking password security. Please try again later.",
    };
  }

  // Step 3: Securely hash the password before saving
  const securelyHashedPassword = await hashPassword(password);

  // Save the user to the database
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { mail: email },
    });

    if (existingUser) {
      return {
        status: 409,
        message: "Email already exists. Please log in or use another email.",
      };
    }

    // Create new user if email doesn't exist
    await prisma.user.create({
      data: {
        name: name,
        mail: email,
        password: securelyHashedPassword,
        role: "user",
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      status: 500,
      message: "Failed to create user . Please try again.",
    };
  }

  return {
    status: 200,
    message: "User registered successfully.",
  };
};

const loginUser = async (formData: FormData) => {
  const mail = formData.get("mail") as string;
  const password = formData.get("password") as string;

  if (!mail || !password) {
    return { status: 400, message: "Please provide both email and password." };
  }

  await prisma.user.findFirst({ where: { mail } }).then((user) => {
    if (!user) {
      return { status: 400, message: "Invalid credentials" };
    } else {
      comparePassword(password, user.password).then((match) => {
        if (!match) {
          return { status: 400, message: "Invalid credentials" };
        }
      });
      redirect("/dashboard")
    }
  });
};
