"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { SERVICE_LOCAL_HOST, useAppData } from "@/context/AppContect";
import { Company, Job } from "@/types";
import { log } from "console";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "@/components/ui/loading";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Building2,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  FileText,
  Globe,
  Laptop,
  MapIcon,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CompanyPage = () => {
  const { id } = useParams();
  const token = Cookies.get("token");

  const { user, isAuth } = useAppData();
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);

  async function fetchComapany() {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${SERVICE_LOCAL_HOST}/api/job/company/${id}`,
      );
      setCompany(data.companyData);
      toast.success("Fetched company successfully");
    } catch (error: any) {
      console.log(error, "Unable to fetch comapny");
    } finally {
      setLoading(false);
    }
  }

  //   const hasFetched = useRef(false);
  useEffect(() => {
    // if (!id || hasFetched.current) return;
    // hasFetched.current = true;
    fetchComapany();
  }, [id]);

  const isRecruiterOwner =
    user && company && user.user_id === company.recruiter_id;

  const [isUpdatedModel, setIsUpdatedModelOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const addModelRef = useRef<HTMLButtonElement>(null);
  const updatedModelRef = useRef<HTMLButtonElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [role, setRole] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");
  const [openings, setOpenings] = useState("");
  const [job_type, setJob_type] = useState("");
  const [work_location, setWork_location] = useState("");
  const [is_active, setIs_active] = useState(true);

  const clearInput = () => {
    setTitle("");
    setDescription("");
    setRole("");
    setSalary("");
    setLocation("");
    setOpenings("");
    setJob_type("");
    setWork_location("");
    setIs_active(true);
  };

  const addJobHandler = async () => {
    setBtnLoading(true);
    try {
      const jobData = {
        title,
        description,
        role,
        salary: Number(salary),
        location,
        openings: Number(openings),
        job_type,
        work_location,
        company_id: id,
      };
      await axios.post(`${SERVICE_LOCAL_HOST}/api/job/new`, jobData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("New job posted sucessfully");
      fetchComapany();
      clearInput();
      addModelRef.current?.click();
    } catch (error: any) {
      console.log(error);
    } finally {
      setBtnLoading(false);
    }
  };

  const deleteHandler = async (jobId: number) => {
    if (confirm("Are you sure you want to delete a job")) {
      setBtnLoading(true);
      try {
        await axios.delete(`${SERVICE_LOCAL_HOST}/api/job/update/${jobId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Job has been deleted sucessfully");
        fetchComapany();
      } catch (error: any) {
        console.log(error);
      } finally {
        setBtnLoading(false);
      }
    }
  };

  const handleOpenUpdateModal = (job: Job) => {
    setSelectedJob(job);
    setTitle(job.title);
    setDescription(job.description);
    setRole(job.role);
    setSalary(String(job.salary || ""));
    setLocation(job.location || "");
    setOpenings(String(job.openings));
    setJob_type(job.job_type);
    setWork_location(job.work_location);
    setIsUpdatedModelOpen(true);
  };

  const handelCloseUpdateModal = () => {
    setIsUpdatedModelOpen(false);
    setSelectedJob(null);
    clearInput();
  };

  const updateJobHandler = async () => {
    if (!selectedJob) return;
    setBtnLoading(true);
    try {
      const updateData = {
        title,
        description,
        role,
        salary: Number(salary),
        location,
        openings: Number(openings),
        job_type,
        work_location,
        is_active,
      };
      await axios.put(
        `${SERVICE_LOCAL_HOST}/api/job/update/${selectedJob.job_id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success("Job updated sucessfully");
      fetchComapany();
      handelCloseUpdateModal();
      addModelRef.current?.click();
    } catch (error: any) {
      console.log(error);
    } finally {
      setBtnLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <div className="min-h-screen bg-secondary/30">
        {company && (
          <div className="max-w-6xl mx-auto px-4 py-8">
            <Card className="overflow-hidden shadow-lg border-2 mb-8">
              <div className="h-32 bg-blue-600"></div>
              <div className="px-8 pb-8">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-16">
                  <div className="relative h-16 w-16 rounded-full p-[3px] shrink-0">
                    {/* Animated Running Border */}
                    <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,_#3b82f6,_#a855f7,_#ec4899,_#3b82f6)] animate-[spin_4s_linear_infinite]"></div>

                    {/* Inner Logo */}
                    <div className="relative h-full w-full rounded-full bg-background overflow-hidden flex items-center justify-center">
                      <img
                        src={company.logo}
                        alt=""
                        className="w-full h-full object-contain select-none"
                      />
                    </div>
                  </div>

                  <div className="flex-1 md:mb-4">
                    <h1 className="text-3xl font-bold mb-2">{company.name}</h1>
                    <p className="text-base leading-relaxed opacity-80 max-w-3xl">
                      {company.description}
                    </p>

                    <Link
                      href={company.website}
                      target="_blank"
                      className="md:mb-4"
                    >
                      <Button className="gap-2">
                        <Globe size={18} /> Visit Website
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>

            <Dialog>
              {/* Job section */}
              <Card className="shadow-lg border-2 overflow-hidden">
                <div className="bg-blue-600 border-b p-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <Briefcase size={20} className="text-blue-600" />
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      Open Positions
                    </h2>

                    <p className="text-sm opacity-70 text-white">
                      {company.jobs?.length || 0} active job
                      {company.jobs?.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                {isRecruiterOwner && (
                  <>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Plus size={18} />
                        Post New Job
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl flex items-center gap-2">
                          Post a New Job
                        </DialogTitle>
                      </DialogHeader>

                      <div className="space-y-5 py-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="title"
                            className="text-sm font-medium flex items-center gap-2"
                          >
                            <Briefcase size={16} /> Job Title
                          </Label>

                          <Input
                            id="title"
                            type="text"
                            placeholder="Enter job title"
                            className="h-11"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
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
                            htmlFor="role"
                            className="text-sm font-medium flex items-center gap-2"
                          >
                            <Building2 size={16} /> Role / Department
                          </Label>

                          <Input
                            id="role"
                            type="text"
                            placeholder="Enter job role"
                            className="h-11"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="salary"
                            className="text-sm font-medium flex items-center gap-2"
                          >
                            <DollarSign size={16} /> Salary
                          </Label>

                          <Input
                            id="salary"
                            type="number"
                            placeholder="Enter salary"
                            className="h-11"
                            value={salary}
                            onChange={(e) => setSalary(e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="openings"
                            className="text-sm font-medium flex items-center gap-2"
                          >
                            <Users size={16} /> Openings
                          </Label>

                          <Input
                            id="openings"
                            type="text"
                            placeholder="Eg. 5"
                            className="h-11"
                            value={openings}
                            onChange={(e) => setOpenings(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="location"
                            className="text-sm font-medium flex items-center gap-2"
                          >
                            <MapIcon size={16} /> Location
                          </Label>

                          <Input
                            id="location"
                            type="text"
                            placeholder="Enter location"
                            className="h-11"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label
                              htmlFor="job_type"
                              className="text-sm font-medium flex items-center gap-1"
                            >
                              <Clock size={16} /> Job Type
                            </Label>

                            <Select
                              value={job_type}
                              onValueChange={setJob_type}
                            >
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder="Select job type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Full-time">
                                  Full-time
                                </SelectItem>
                                <SelectItem value="Part-time">
                                  Part-time
                                </SelectItem>
                                <SelectItem value="Contract">
                                  Contract
                                </SelectItem>
                                <SelectItem value="Internship">
                                  Internship
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor="work_location"
                              className="text-sm font-medium flex items-center gap-1"
                            >
                              <Laptop size={16} /> Work Location
                            </Label>

                            <Select
                              value={work_location}
                              onValueChange={setWork_location}
                            >
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder="Select Work Location" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="On-site">On-site</SelectItem>
                                <SelectItem value="Remote"> Remote </SelectItem>
                                <SelectItem value="Hybrid"> Hybrid </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button
                            disabled={btnLoading}
                            onClick={addJobHandler}
                            className="gap-2"
                          >
                            {btnLoading ? "Posting Job" : "Post Job"}
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </>
                )}

                <div className="p-6">
                  {company.jobs && company.jobs.length > 0 ? (
                    <div className="space-y-4">
                      {company.jobs.map((j) => (
                        <div
                          key={j.job_id}
                          className="p-5 rounded-lg border-2 hover:border-blue-500 transition-all bg-background"
                        >
                          <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-3 flex-wrap">
                                <h3 className="text-xl font-semibold">
                                  {j.title}
                                </h3>
                                <span
                                  className={`text-xs px-3 py-1 rounded-full flex items-center gap-1 ${
                                    j.is_active
                                      ? "bg-green-100 dark:bg-green-900/30 text-green-600"
                                      : "bg-gray-100 dark:bg-gray-800 text-gray-600"
                                  }`}
                                >
                                  {j.is_active ? (
                                    <CheckCircle size={14} />
                                  ) : (
                                    <XCircle size={14} />
                                  )}
                                  {j.is_active ? "Active" : "Inactive"}
                                </span>
                              </div>

                              <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
                                <div className="flex items-center gap-2 opacity-70">
                                  <Building2 size={16} />
                                  <span>{j.role}</span>
                                </div>

                                <div className="flex items-center gap-2 opacity-70">
                                  <DollarSign size={16} />
                                  <span>
                                    {j.salary
                                      ? `₹ ${j.salary.toLocaleString()}`
                                      : "Not Disclosed"}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 opacity-70">
                                  <MapPin size={16} />
                                  <span>{j.location}</span>
                                </div>

                                <div className="flex items-center gap-2 opacity-70">
                                  <Laptop size={16} />
                                  <span>
                                    {j.work_location} ({j.job_type})
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 opacity-70">
                                  <Users size={16} />
                                  <span>{j.openings} openings</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Link href={`/job/${j.job_id}`}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-2"
                                >
                                  <Eye size={16} /> View
                                </Button>
                              </Link>

                              {isRecruiterOwner && (
                                <>
                                  <Button
                                    onClick={() => handleOpenUpdateModal(j)}
                                    variant={"outline"}
                                    size={"sm"}
                                    className="gap-2"
                                  >
                                    <Pencil size={16} />
                                    Edit
                                  </Button>

                                  {/* <Button
                                    onClick={() => deleteHandler(j.job_id)}
                                    variant={"destructive"}
                                    size={"sm"}
                                    disabled={btnLoading}
                                  >
                                    <Trash2 size={16} />
                                  </Button> */}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                          <Briefcase size={32} className="opacity-40" />
                        </div>
                        <p className="text-base opacity-70 mb-2">
                          No jobs posted yet
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            </Dialog>
            <Dialog open={isUpdatedModel} onOpenChange={setIsUpdatedModelOpen}>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl flex items-center gap-2">
                    Update Job
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-5 py-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="title"
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <Briefcase size={16} /> Job Title
                    </Label>

                    <Input
                      id="title"
                      type="text"
                      placeholder="Enter job title"
                      className="h-11"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
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
                      htmlFor="role"
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <Building2 size={16} /> Role / Department
                    </Label>

                    <Input
                      id="role"
                      type="text"
                      placeholder="Enter job role"
                      className="h-11"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="salary"
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <DollarSign size={16} /> Salary
                    </Label>

                    <Input
                      id="salary"
                      type="number"
                      placeholder="Enter salary"
                      className="h-11"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="openings"
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <Users size={16} /> Openings
                    </Label>

                    <Input
                      id="openings"
                      type="text"
                      placeholder="Eg. 5"
                      className="h-11"
                      value={openings}
                      onChange={(e) => setOpenings(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="location"
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <MapIcon size={16} /> Location
                    </Label>

                    <Input
                      id="location"
                      type="text"
                      placeholder="Enter location"
                      className="h-11"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="job_type"
                        className="text-sm font-medium flex items-center gap-1"
                      >
                        <Clock size={16} /> Job Type
                      </Label>

                      <Select value={job_type} onValueChange={setJob_type}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select job type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                          <SelectItem value="Internship">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="work_location"
                        className="text-sm font-medium flex items-center gap-1"
                      >
                        <Laptop size={16} /> Work Location
                      </Label>

                      <Select
                        value={work_location}
                        onValueChange={setWork_location}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select Work Location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="On-site">On-site</SelectItem>
                          <SelectItem value="Remote"> Remote </SelectItem>
                          <SelectItem value="Hybrid"> Hybrid </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="update_is_active"
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        {is_active ? (
                          <CheckCircle size={16} className="text-green-600" />
                        ) : (
                          <XCircle size={16} className="text-gray-50" />
                        )}
                      </Label>
                      <Select
                        value={is_active ? "true" : "false"}
                        onValueChange={setJob_type}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Active</SelectItem>
                          <SelectItem value="false">InActive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      disabled={btnLoading}
                      onClick={updateJobHandler}
                      className="gap-2"
                    >
                      {btnLoading ? "Updating Job" : "Update Job"}
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </>
  );
};

export default CompanyPage;
