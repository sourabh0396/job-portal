"use client";
import { SERVICE_LOCAL_HOST, useAppData } from "@/context/AppContect";
import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { log } from "console";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "@/components/ui/loading";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  Building2,
  Eye,
  FileText,
  Globe,
  Link2,
  Plus,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Company as CompanyType } from "@/types";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Company = () => {
  const { loading } = useAppData();
  const addRef = useRef<HTMLButtonElement | null>(null);
  const openDialog = () => {
    addRef.current?.click();
  };

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [btnLoading, setBtnLoading] = useState(false);
  const [companies, setCompanies] = useState<CompanyType[]>([]);

  const clearData = () => {
    setName("");
    setDescription("");
    setWebsite("");
    setLogo(null);
  };

  const token = Cookies.get("token");

  const [companyLoading, setCompanyLoading] = useState(true);

  async function fetchCompanies() {
    try {
      const { data } = await axios.get(
        `${SERVICE_LOCAL_HOST}/api/job/company/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setCompanies(data.companies);
      // setCompanies((prev) => [...prev, data.company]);
    } catch (error: any) {
      console.log(error);
    } finally {
      setCompanyLoading(false);
    }
  }
  useEffect(() => {
    fetchCompanies();
  }, []);

  async function addCompanyHandler() {
    if (!name || !description || !website || !logo) {
      return alert("!plese Provide all details");
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("website", website);
    formData.append("file", logo);

    try {
      setBtnLoading(true);
      const { data } = await axios.post(
        `${SERVICE_LOCAL_HOST}/api/job/Company/new`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success(data.message);
      clearData();
      fetchCompanies();
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";

      toast.error(message);
    } finally {
      setBtnLoading(false);
    }
  }

  async function deleteComapany(id: string | number) {
    if (confirm(`Are You Sure you want to delete this company`)) {
      try {
        setBtnLoading(true);
        const { data } = await axios.delete(
          `${SERVICE_LOCAL_HOST}/api/job/Company/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        toast.success(data.message);
        fetchCompanies();
      } catch (error: any) {
        console.log(error);
        toast.error(error.message.data.message);
      } finally {
        setBtnLoading(false);
      }
    }
  }

  if (loading) return <Loading />;
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Card className="shadow-lg border-2 overflow-hidden">
        <div className="bg-blue-500 p-6 border-b">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Building2 size={20} className="text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">My Company</CardTitle>
            <CardDescription className="text-sm mt-1 text-white">
              Manages Your registered Comapnies({companies.length}/3)
            </CardDescription>

            {companies.length < 3 && (
              <Button onClick={openDialog} className="gap-2">
                <Plus size={18} />
                Add Company
              </Button>
            )}
          </div>
          {companyLoading ? (
            <Loading />
          ) : (
            <div className="p-6">
              {companies.length > 0 ? (
                <div className="grid gap-4">
                  {companies.map((companie) => (
                    <div
                      key={companie.company_id}
                      className="flex items-center gap-4 p-4 rounded-lg border-2 hover:border-blue-500 transition-all bg-background"
                    >
                      <div className="relative h-16 w-16 rounded-full p-[2px] shrink-0">
                        {/* Animated Gradient Border */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-spin-slow"></div>

                        {/* Logo Container */}
                        <div className="relative h-full w-full rounded-full bg-background overflow-hidden flex items-center justify-center">
                          <img
                            src={companie.logo}
                            alt=""
                            className="w-full h-full object-contain select-none drop-shadow-md"
                          />
                        </div>
                      </div>

                      {/* Company Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1 truncate">
                          {companie.name}
                        </h3>
                        <p className="text-sm opacity-70 line-clamp-2 mb-2">
                          {companie.description}
                        </p>
                        <a
                          href={companie.website}
                          target="_blank"
                          className="text-xs text-blue-500 hover:underline flex items-center gap-1"
                        >
                          <Globe size={12} />
                          {companie.website}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Link href={`/company/${companie.company_id}`}>
                          <Button
                            variant={"secondary"}
                            size={"icon"}
                            className="h-9 w-9 cursor-pointer border-2"
                          >
                            <Eye size={16} />
                          </Button>
                        </Link>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant={"destructive"}
                          size={"icon"}
                          className="h-9 w-9 cursor-pointer"
                          onClick={() => deleteComapany(companie.company_id)}
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                      <Building2 size={32} className="opacity-40" />
                    </div>

                    <CardDescription className="text-base mb-4">
                      No Companies registered yet
                    </CardDescription>

                    <p className="text-sm opacity-60">
                      Add your first company to start posting jobs
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Add Company Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="hidden" ref={addRef}></Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Building2 className="text-blue-600" />
              Add New Company
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Briefcase size={16} /> Company Name
              </Label>

              <Input
                id="name"
                type="text"
                placeholder="Enter company name"
                className="h-11"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-sm font-medium flex items-center gap-2"
              >
                <FileText size={16} /> Description
              </Label>

              <Input
                id="description"
                type="text"
                placeholder="Enter Description"
                className="h-11"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="website"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Globe size={16} /> Website
              </Label>

              <Input
                id="website"
                type="text"
                placeholder="Website"
                className="h-11"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="logo"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Briefcase size={16} /> Company Logo
              </Label>

              <Input
                id="logo"
                type="file"
                accept="image/*"
                className="h-11 cursor-pointer"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setLogo(e.target.files?.[0] || null)
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              disabled={btnLoading}
              onClick={addCompanyHandler}
              className="w-full h-11"
            >
              {btnLoading ? "Adding Company..." : "Add Company"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Company;
