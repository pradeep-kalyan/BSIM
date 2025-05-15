"use server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// JWT Payload interface
interface JWTPayload {
  id: string;
  name: string;
  role: string;
  iat?: number; // issued at timestamp (added by JWT)
  exp?: number; // expiry timestamp (added by JWT)
}

// Get secret key
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error("JWT_SECRET environment variable is not set");
    throw new Error("JWT secret is required for authentication");
  }

  return secret;
};

// Generate token
export const generateToken = async (
  payload: Omit<JWTPayload, "iat" | "exp">
): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, getJwtSecret(), { expiresIn: "10m" }, (err, token) => {
      if (err || !token) {
        return reject(new Error("Failed to generate token"));
      }
      resolve(token);
    });
  });
};

// Verify token
export const verifyToken = async (
  token: string
): Promise<JWTPayload | null> => {
  try {
    if (!token) {
      return null;
    }
    const decoded = jwt.verify(token, getJwtSecret()) as JWTPayload;
    return decoded;
  } catch (error) {
    const status = "Invalid Token";
    return null;
  }
};

// Set cookie
export const setCookie = async (token: string): Promise<void> => {
  // Set cookie expiry to match JWT expiry (10 minutes)
  const tenMinutesInSeconds = 10 * 60;
  const expiryDate = new Date(Date.now() + tenMinutesInSeconds * 1000);

  (await cookies()).set({
    name: "token",
    value: token,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    expires: expiryDate,
    secure: process.env.NODE_ENV === "production", // Only use secure in production
  });
};

// Get cookie
export const getCookie = async (): Promise<string | null> => {
  const token = (await cookies()).get("token");
  if (!token || !token.value) {
    return null;
  }
  return token.value;
};

// Logout handler
export const logoutHandler = async (): Promise<string> => {
  try {
    await deleteCookie();
    console.log("User logged out and token cookie deleted.");
    const status = "logout successful";
    return status;
  } catch (error) {
    console.error("Logout failed:", error);
    const status = `logout failed ${error}`;
    return status;
  }
};

// Delete cookie
export const deleteCookie = async (): Promise<void> => {
  try {
    (await cookies()).delete({ name: "token", path: "/" });
  } catch (error) {
    console.error("Failed to delete cookie:", error);
    throw new Error("Error deleting cookie");
  }
};
