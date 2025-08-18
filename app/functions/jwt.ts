// app/functions/jwt.ts
"use server";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

// JWT Payload interface
export interface JWTPayload {
  id: string;
  name: string;
  role: string;
  email: string; // Added email to the payload
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
    // Set token expiry to 6 hours (6 * 60 * 60 seconds)
    const expirationTime = Math.floor(Date.now() / 1000) + 6 * 60 * 60;

    // Get the JWT secret first, then use it to sign
    const secret = await getJwtSecret();
    const token = await new SignJWT({ ...payload })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(expirationTime)
      .sign(secret);

    return token;
  } catch {
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
  } catch {
    return null;
  }
};

/**
 * Sets the JWT token in an HTTP-only cookie
 * @param token - The JWT token to store in the cookie
 */
export const setCookie = async (token: string): Promise<void> => {
  // Set cookie expiry to match JWT expiry (6 hours)
  const sixHoursInSeconds = 6 * 60 * 60;
  const expiryDate = new Date(Date.now() + sixHoursInSeconds * 1000);

  const cookieStore = await cookies();
  cookieStore.set({
    name: "token",
    value: token,
    httpOnly: true,
    path: "/",
    sameSite: "strict", // Changed from 'lax' to 'strict' for better security
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
    throw new Error(
      `Logout failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
};

export const getCurrentUser = async (): Promise<JWTPayload | null> => {
  try {
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
  } catch {
    return null;
  }
};

/**
 * Checks if a token is close to expiry (within 1 hour)
 * @param payload - The JWT payload containing expiry time
 * @returns boolean indicating if token needs refresh
 */
export const isTokenNearExpiry = async (
  payload: JWTPayload
): Promise<boolean> => {
  if (!payload.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  const oneHourBeforeExpiry = payload.exp - 60 * 60; // 1 hour before expiry

  return currentTime >= oneHourBeforeExpiry;
};

/**
 * Refreshes the user session by generating a new token
 * @param payload - Current user payload
 * @returns Promise resolving to new token or null if refresh fails
 */
export const refreshSession = async (
  payload: Omit<JWTPayload, "iat" | "exp">
): Promise<string | null> => {
  try {
    const newToken = await generateToken(payload);
    await setCookie(newToken);
    return newToken;
  } catch {
    return null;
  }
};

/**
 * Gets the authenticated user and refreshes session if needed
 * @returns Promise resolving to the authenticated user payload if valid, null otherwise
 */
export const getAuthenticatedUserWithRefresh =
  async (): Promise<JWTPayload | null> => {
    const token = await getTokenFromCookie();
    if (!token) {
      return null;
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return null;
    }

    // Check if token needs refresh and refresh if necessary
    if (await isTokenNearExpiry(payload)) {
      const refreshed = await refreshSession({
        id: payload.id,
        name: payload.name,
        email: payload.email,
        role: payload.role,
      });

      if (!refreshed) {
        return null;
      }
    }

    return payload;
  };
