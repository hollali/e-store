"use client";
// pages/sign-up.tsx
import { useState } from "react";
import { signIn } from "next-auth/react";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex justify-center px-2 mt-10 mb-10"> {/* Changed from items-center to justify-start and added mt-4 */}
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg text-center">
        <h1 className="text-2xl md:text-4xl font-bold mb-6">Sign Up</h1>
        <div className="flex justify-center gap-4 mb-4">
          <button
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => signIn("google")}
          >
            <GoogleIcon className="mr-2" />
            Google
          </button>
          <button
            className="flex items-center px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
            onClick={() => signIn("facebook")}
          >
            <FacebookIcon className="mr-2" />
            Facebook
          </button>
        </div>
        <div className="mb-4">or</div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            id="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
