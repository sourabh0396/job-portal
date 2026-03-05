"use client";

import { Button } from "@/components/ui/button";
import { SERVICE_LOCAL_HOST, useAppData } from "@/context/AppContect";
import axios from "axios";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { FormEvent, useState } from "react";
import toast from "react-hot-toast";

const ForgotPage = () => {
  const [email, setEmail] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const { isAuth } = useAppData();

  // Redirect if already logged in
  if (isAuth) return redirect("/");

  const submitFormHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBtnLoading(true);

    try {
      const { data } = await axios.post(
        `${SERVICE_LOCAL_HOST}/api/auth/forgot`,
        { email },
      );

      console.log("Response:", data);
      toast.success(data.message);
      setEmail("");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setBtnLoading(false); // Button re-enables here
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Forgot Password</h2>

        <form onSubmit={submitFormHandler} className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 font-medium">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Button
            // type="submit"
            disabled={btnLoading}
            className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Submit
            {/* {btnLoading ? "Sending..." : "Submit"} */}
          </Button>

          <Link
            href="/login"
            className="text-blue-500 text-sm hover:underline text-center mt-2"
          >
            Go to Login Page
          </Link>
        </form>
      </div>
    </div>
  );
};

export default ForgotPage;
