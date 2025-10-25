import React from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Simple mock login
    localStorage.setItem("user", JSON.stringify({ name: "Saksh Vibra" }));
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-200 to-blue-400">
      <h1 className="text-4xl font-bold mb-6 text-white drop-shadow-md">
        Welcome to Vibra 🌈
      </h1>
      <button
        onClick={handleLogin}
        className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl shadow hover:bg-blue-100 transition"
      >
        Sign in with Google
      </button>
    </div>
  );
}
