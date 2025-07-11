// app/functions/Hash.ts
import bcrypt from "bcryptjs";

/**
 * Hashes a password using bcrypt with a salt
 * @param password - The plain text password to hash
 * @returns Promise resolving to the hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

/**
 * Compares a plain text password with a hashed password
 * @param password - The plain text password to compare
 * @param hashedPassword - The hashed password to compare against
 * @returns Promise resolving to true if the passwords match, false otherwise
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};
