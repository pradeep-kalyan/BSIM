"use client";
import React from "react";
import Inputbox from "@/ui/Input-Box";
import { createSimulation } from "@/app/_actions/Sim";
import { useAuth } from "@/app/context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";

const CreateSim = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  console.log("Auth state:", { user, loading }); // Debug log

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Check if user is authenticated
    if (!user?.id) {
      console.error("User must be logged in to create a simulation");
      toast.error("Please log in to create a simulation");
      return;
    }

    // Store reference to the form element before async operations
    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      id: user.id, // User ID for creating the simulation
    };

    // Validate form data
    if (!data.name || !data.description) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const simulationId = await createSimulation(data);
      console.log("Simulation created successfully:", simulationId);
      toast.success("Simulation created successfully!");

      // Optionally redirect to the simulation page
      // router.push(`/simulations/${simulationId}`);

      // Reset the form safely
      if (form) {
        form.reset();
      }
    } catch (error) {
      console.error("Error creating simulation:", error);
      toast.error("Failed to create simulation. Please try again.");
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="w-full h-screen m-5 flex items-center justify-center">
        <div className="text-white/50">Loading...</div>
      </div>
    );
  }

  // If user is not authenticated, show login prompt
  // Note: Middleware should have already redirected, but this is a fallback
  if (!user) {
    return (
      <div className="w-full h-screen m-5 flex items-center justify-center">
        <div className="text-white/50">
          Please{" "}
          <a href="/login" className="text-blue-400 underline">
            log in
          </a>{" "}
          to create a simulation.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen m-5">
      <ToastContainer position="top-right" />
      <h2 className="text-left text-2xl text-white/30">Create Simulation</h2>
      <form onSubmit={handleSubmit} className="max-w-xl">
        <Inputbox
          label={"Name"}
          type={"text"}
          placeholder_text={"eg. Market Analysis"}
          id="name-field"
          name={"name"}
        />
        <Inputbox
          label={"Description"}
          type={"text"}
          placeholder_text={"Description about the simulation"}
          id="description-field"
          name={"description"}
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 mt-4"
        >
          Create Simulation
        </button>
      </form>
    </div>
  );
};

export default CreateSim;
