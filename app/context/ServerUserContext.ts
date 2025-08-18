// app/context/ServerUserContext.ts
import { headers } from "next/headers";

export interface ServerUser {
  id: string;
  name: string;
  role: string;
  email: string;
}

/**
 * Get authenticated user data from headers in server components
 * This should only be used in server components and server actions
 */
export async function getServerUser(): Promise<ServerUser | null> {
  try {
    const headersList = await headers();
    const userId = headersList.get("x-user-id");
    const userName = headersList.get("x-user-name");
    const userRole = headersList.get("x-user-role");
    const userEmail = headersList.get("x-user-email");

    if (!userId || !userName || !userRole || !userEmail) {
      return null;
    }

    return {
      id: userId,
      name: userName,
      role: userRole,
      email: userEmail,
    };
  } catch {
    return null;
  }
}

/**
 * Require authenticated user in server components
 * Throws error if user is not authenticated
 */
export async function requireServerUser(): Promise<ServerUser> {
  const user = await getServerUser();

  if (!user) {
    throw new Error("Authentication required");
  }

  return user;
}
