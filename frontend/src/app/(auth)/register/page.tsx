"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loading from "@/components/ui/loading";
import { SERVICE_LOCAL_HOST, useAppData } from "@/context/AppContect";
import axios from "axios";
import Cookies from "js-cookie";
import { ArrowRight, Briefcase, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { ChangeEvent, FormEvent, useState } from "react";
import toast from "react-hot-toast";

function RegisterPage() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bio, setBio] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const { isAuth, setUser, loading, setIsAuth } = useAppData();

  if (loading) return <Loading />;

  if (isAuth) return redirect("/");

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBtnLoading(true);

    const formData = new FormData();
    formData.append("role", role);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("phoneNumber", phoneNumber);

    if (role === "jobseeker") {
      formData.append("bio", bio);
      if (resume) {
        formData.append("file", resume);
      }
    }
    try {
      const { data } = await axios.post(
        `${SERVICE_LOCAL_HOST}/api/auth/register`,
        formData,
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
            <h1 className="text-4xl font-bold mb-2">Create your account</h1>
            <p className="text-sm opacity-70">
              Join HireJobFinder and start your journey
            </p>
          </div>
          <div className="border border-gray-400 rounded-2xl p-8 shadow-lg backdrop-blur-sm">
            <form
              onSubmit={submitHandler}
              action="submit"
              className="space-y-5"
            >
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium">
                  I want to
                </Label>
                <div className="relative">
                  <Briefcase className="icon-style" />
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 border-2 border-gray-300 rounded-md bg-transparent"
                    required
                  >
                    <option value="">Select Your Role</option>
                    <option value="jobseeker">Find a Job</option>
                    <option value="recruiter">Hire Talent</option>
                  </select>
                </div>
              </div>
              {role && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Name
                    </Label>
                    <div className="relative">
                      <Lock className="icon-style" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="pl-10 h-11"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Lock className="icon-style" />
                      <Input
                        id="phone"
                        type="number"
                        placeholder="+91 0123456789"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                        className="pl-10 h-11"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
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
                  </div>
                </div>
              )}

              {role === "jobseeker" && (
                <div className="space-y-5 pt-4 border-t border-gray-700">
                  <div className="space-y-2">
                    <Label htmlFor="resume" className="text-sm font-medium">
                      Resume PDF
                    </Label>
                    <div className="relative">
                      <Lock className="icon-style" />
                      <Input
                        id="resume"
                        type="file"
                        accept="application/pdf"
                        // value={resume}
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setResume(e.target.files[0]);
                          }
                        }}
                        required
                        className="pl-10 h-11 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-sm font-medium">
                      Bio
                    </Label>
                    <div className="relative">
                      <Lock className="icon-style" />
                      <Input
                        id="bio"
                        type="text"
                        placeholder="Tell me about yourself"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        required
                        className="pl-10 h-11"
                      />
                    </div>
                  </div>
                </div>
              )}
              <Button disabled={btnLoading}>
                {btnLoading ? "plese wait..." : "Register"}
                <ArrowRight size={18} />
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-400">
              <p className="text-center text-sm">
                Already have an account.
                <Link
                  href={"/login"}
                  className="text-blue-500 font-medium hover:underline transition-all"
                >
                  Login Page?
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
