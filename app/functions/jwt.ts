import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
//jwt
interface JWTPayload {
  id: string;
  name: string;
  role: string;
  issued_at: number;
  expiry: number;
}
//get secret key
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.warn("no secret found");
  }

  return secret as string;
};

//generate token
export const generateToken = (
  payload: Omit<JWTPayload, "iat" | "exp">
): string => {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "10m" });
};

//verify token
export const verifyToken = (token: string): JWTPayload => {
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as JWTPayload;
    return decoded;
  } catch (error) {
    throw new Error(`Invalid Token`);
  }
};

export const setCookie = async (token: string): Promise<void> => {
  (await cookies()).set({
    name: "token",
    value: token,
    httpOnly: true,
    path: "/",
    sameSite:"lax"
  })
};


