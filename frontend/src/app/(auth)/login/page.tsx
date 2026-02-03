"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loading from "@/components/ui/loading";
import { SERVICE_LOCAL_HOST, useAppData } from "@/context/AppContect";
import axios from "axios";
import Cookies from "js-cookie";
import { ArrowRight, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { FormEvent, useState } from "react";
import toast from "react-hot-toast";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const { isAuth, setUser, loading, setIsAuth } = useAppData();

  if (loading) return <Loading />;

  if (isAuth) return redirect("/");
  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      const { data } = await axios.post(
        `${SERVICE_LOCAL_HOST}/api/auth/login`,
        {
          email,
          password,
        },
      );
      toast.success(data.message);
      Cookies.set("token", data.token, {
        expires: 1,
        secure: true,
        path: "/",
      });
      setUser(data.user);
      setIsAuth(true);
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      setIsAuth(false);
    } finally {
      setBtnLoading(false);
    }
  };
  return (
    <div>
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">
              Welcome back to HireJobFinder
            </h1>
            <p className="text-sm opacity-70">
              Sign in to continue your journey
            </p>
          </div>
          <div className="border border-gray-400 rounded-2xl p-8 shadow-lg backdrop-blur-sm">
            <form
              onSubmit={submitHandler}
              action="submit"
              className="space-y-5"
            >
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                  <div className="relative">
                    <Mail className="icon-style" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 h-11"
                    />
                  </div>
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                  <div className="relative">
                    <Lock className="icon-style" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10 h-11"
                    />
                  </div>
                </Label>
              </div>

              <div className="flex items-center justify-end">
                <Link
                  href={"/forget"}
                  className="text-sm text-blue-500 hover:underline transition-all"
                >
                  Forget Password?
                </Link>
              </div>
              <Button disabled={btnLoading}>
                {btnLoading ? "Signing in..." : "Sign In"}
                <ArrowRight size={18} />
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-400">
              <p className="text-center text-sm">
                Dont't have an account?
                <Link
                  href={"/register"}
                  className="text-blue-500 font-medium hover:underline transition-all"
                >
                  Create a New Account?
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
