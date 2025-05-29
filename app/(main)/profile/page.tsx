"use client";
import React, { useEffect, useState } from "react";
import { checkAuthStatus } from "@/app/_actions/auth_actions";
import { JWTPayload } from "@/app/functions/jwt";

const Page = () => {
  const [user, setUser] = useState<JWTPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await checkAuthStatus();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div className="p-8">Loading user profile...</div>;
  }

  if (!user) {
    return <div className="p-8">Unable to load user profile</div>;
  }

  return (
    <div className="p-8 bg-amber-500 h-full">
      <h1 className="text-white text-3xl font-bold mb-6">User Profile</h1>
      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
        <div className="flex flex-col space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Name</p>
                <p className="font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-gray-600">User ID</p>
                <p className="font-medium">{user.id}</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h2 className="text-xl font-semibold mb-2">Account Settings</h2>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
