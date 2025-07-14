"use client";
import React from "react";
import { useAuth } from "@/app/context/AuthContext";

const AuthTestPage = () => {
  const { user, loading, checkAuth } = useAuth();

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl mb-4">Auth Test Page</h1>

      <div className="space-y-4">
        <div>
          <strong>Loading:</strong> {loading ? "Yes" : "No"}
        </div>

        <div>
          <strong>User:</strong>{" "}
          {user ? JSON.stringify(user, null, 2) : "Not authenticated"}
        </div>

        <button
          onClick={checkAuth}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Recheck Auth
        </button>
      </div>
    </div>
  );
};

export default AuthTestPage;
