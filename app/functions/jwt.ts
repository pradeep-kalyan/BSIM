// app/functions/jwt.ts
"use server";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

// JWT Payload interface
export interface JWTPayload {
  id: string;
  name: string;
  role: string;
  email:string;
  iat?: number; // issued at timestamp (added by JWT)
  exp?: number; // expiry timestamp (added by JWT)
}

/**
 * Retrieves the JWT secret key from environment variables
 * @returns The encoded secret key as Uint8Array
 * @throws Error if JWT_SECRET is not set
 */
export const getJwtSecret = async (): Promise<Uint8Array> => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim() === "") {
    throw new Error("JWT secret is required for authentication");
  }
  return new TextEncoder().encode(secret);
};


/**
 * Generates a JWT token for the given user payload
 * @param payload - User data to be encoded in the token
 * @returns Promise resolving to the JWT token string
 */
export const generateToken = async (
  payload: Omit<JWTPayload, "iat" | "exp">
): Promise<string> => {
  try {
    // Set token expiry to 30 minutes
    const expirationTime = Math.floor(Date.now() / 1000) + 30 * 60;
    // Get the JWT secret first, then use it to sign
    const secret = await getJwtSecret();
    const token = await new SignJWT({ ...payload })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(expirationTime)
      .sign(secret);

    return token;
  } catch (error) {
    console.error("Failed to generate token:", error);
    throw new Error("Failed to generate token");
  }
};

/**
 * Verifies a JWT token and returns the payload if valid
 * @param token - The JWT token to verify
 * @returns Promise resolving to the payload if valid, null otherwise
 */
export const verifyToken = async (
  token: string
): Promise<JWTPayload | null> => {
  try {
    if (!token) {
      return null;
    }

    // Check if token is a string before using trim()
    if (typeof token !== "string" || token.trim() === "") {
      return null;
    }

    const secret = await getJwtSecret();
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as JWTPayload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};

/**
 * Sets the JWT token in an HTTP-only cookie
 * @param token - The JWT token to store in the cookie
 */
export const setCookie = async (token: string): Promise<void> => {
  // Set cookie expiry to match JWT expiry (30 minutes)
  const thirtyMinutesInSeconds = 30 * 60;
  const expiryDate = new Date(Date.now() + thirtyMinutesInSeconds * 1000);

  const cookieStore = await cookies();
  cookieStore.set({
    name: "token",
    value: token,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    expires: expiryDate,
    secure: process.env.NODE_ENV === "production", // Only use secure in production
  });
};

/**
 * Retrieves the JWT token from cookies
 * @returns The token string if present, undefined otherwise
 */
export const getTokenFromCookie = async (): Promise<string | undefined> => {
  // Make sure to await the cookies() function
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
};

/**
 * Deletes the auth token cookie
 */
export const deleteCookie = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete("token");
};

/**
 * Gets the currently authenticated user from the token in cookies
 * @returns Promise resolving to the authenticated user payload if valid, null otherwise
 */
export const getAuthenticatedUser = async (): Promise<JWTPayload | null> => {
  const token = await getTokenFromCookie();
  if (!token) {
    return null;
  }
  return verifyToken(token);
};

/**
 * Handles user logout by deleting the auth token cookie
 * @returns Promise resolving to a success message
 */
export const logoutHandler = async (): Promise<string> => {
  try {
    await deleteCookie();
    return "Logout successful";
  } catch (error) {
    console.error("Logout failed:", error);
    throw new Error(
      `Logout failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
};

export const getCurrentUser = async (): Promise<JWTPayload | null> => {
  try {
    const cookieStore = cookies();
    const token = await getTokenFromCookie();

    if (!token) return null;

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );

    return {
      id: payload.id as string,
      name: payload.name as string,
      email: payload.email as string,
      role: payload.role as string,
    };
  } catch (error) {
    console.error("Error verifying JWT:", error);
    return null;
  }
}