"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Loading from "@/components/ui/loading";
import { SERVICE_LOCAL_HOST, useAppData } from "@/context/AppContect";
import { Application, Job } from "@/types";
import axios from "axios";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  CheckCircle2,
  DollarSign,
  MapPin,
  Users,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import Link from "next/link";

function JobIdPage() {
  const { id } = useParams();
  const { user, applyToJob, applications, btnLoading } = useAppData();
  const router = useRouter();

  const [job, setJob] = useState<Job | null>(null);
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(true);

  const [jobApplications, setJobApplications] = useState<Application[]>([]);
  const [filteredStatus, setFilteredStatus] = useState("All");
  const [value, setValue] = useState("");

  // Check if user already applied
  useEffect(() => {
    if (applications && id) {
      applications.forEach((application: any) => {
        if (application.job_id.toString() === id) setApplied(true);
      });
    }
  }, [applications, id]);

  const applyJobHandler = (id: number) => {
    applyToJob(id);
  };

  // Fetch single job
  const fetchSingleJob = async () => {
    try {
      const token = Cookies.get("token");

      const { data } = await axios.get(`${SERVICE_LOCAL_HOST}/api/job/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setJob(data.job);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSingleJob();
  }, [id]);

  // Fetch applications for recruiter
  const fetchApplications = async () => {
    try {
      const token = Cookies.get("token");

      const { data } = await axios.get(
        `${SERVICE_LOCAL_HOST}/api/job/application/all/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setJobApplications(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user && job && user.user_id === job.posted_by_recruiter_id) {
      fetchApplications();
    }
  }, [user, job]);

  const filteredApplications =
    filteredStatus === "All"
      ? jobApplications
      : jobApplications.filter((app) => app.status === filteredStatus);

  // Update application status
  const updateApplicationHandler = async (id: number) => {
    if (!value) return toast.error("Please select a status");

    try {
      const token = Cookies.get("token");

      const { data } = await axios.put(
        `${SERVICE_LOCAL_HOST}/api/job/application/update/${id}`,
        { status: value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(data.message);

      fetchApplications();
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen bg-secondary">
      {loading ? (
        <Loading />
      ) : (
        <>
          {job && (
            <div>
              <Button
                className="mb-6 gap-2"
                variant="ghost"
                onClick={() => router.back()}
              >
                <ArrowLeft size={18} />
                Back To Jobs
              </Button>

              <Card className="overflow-hidden shadow-lg border-2 mb-6">
                {/* Header */}
                <div className="bg-blue-600 p-8 border-b">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1">
                      <span
                        className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                          job.is_active
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {job.is_active ? "Active" : "Inactive"}
                      </span>

                      <h1 className="text-3xl md:text-4xl font-bold mt-4 text-white">
                        {job.title}
                      </h1>

                      <div className="flex items-center gap-2 text-white opacity-80 mt-2">
                        <Building2 size={18} />
                        Company Name
                      </div>
                    </div>

                    {user && user.role === "jobseeker" && (
                      <div>
                        {applied ? (
                          <div className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-100 text-green-600">
                            <CheckCircle2 size={20} />
                            Already Applied
                          </div>
                        ) : (
                          job.is_active && (
                            <Button
                              onClick={() => applyJobHandler(job.job_id)}
                              disabled={btnLoading}
                              className="gap-2 h-12 px-8"
                            >
                              <Briefcase size={18} />
                              {btnLoading ? "Applying..." : "Easy Apply"}
                            </Button>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Job Details */}
                <div className="p-8">
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="flex items-center gap-4 p-5 rounded-xl border">
                      <MapPin size={20} className="text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-semibold">{job.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-5 rounded-xl border">
                      <DollarSign size={20} className="text-green-500" />
                      <div>
                        <p className="text-sm text-gray-500">Salary</p>
                        <p className="font-semibold">
                          $ {job.salary || "Not Disclosed"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-5 rounded-xl border">
                      <Users size={20} className="text-purple-500" />
                      <div>
                        <p className="text-sm text-gray-500">Openings</p>
                        <p className="font-semibold">
                          {job.openings} Positions
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="border rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-4">
                      Job Description
                    </h2>

                    <p className="text-gray-600 whitespace-pre-line">
                      {job.description}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </>
      )}

      {/* Recruiter Applications */}
      {user && job && user.user_id === job.posted_by_recruiter_id && (
        <div className="w-[90%] md:w-2/3 mx-auto mb-10">
          <div className="flex justify-between mb-4 flex-wrap">
            <h2 className="text-2xl font-bold">All Applications</h2>

            <select
              id="filter-status"
              value={filteredStatus}
              onChange={(e) => setFilteredStatus(e.target.value)}
              className="p-2 border-2 border-gray-300 rounded-md bg-white focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Submitted">Submitted</option>
              <option value="Hired">Hired</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {filteredApplications?.length > 0 ? (
            <div className="space-y-4">
              {filteredApplications.map((e) => (
                <div
                  key={e.application_id}
                  className="p-4 border rounded-lg flex justify-between items-center"
                >
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      e.status === "Hired"
                        ? "bg-green-100 text-green-600 dark:bg-green-900/30 border-2 "
                        : e.status === "Rejected"
                          ? "bg-red-100 text-red-600 dark:bg-red-900/30"
                          : "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30"
                    }`}
                  >
                    {e.status}
                  </span>

                  <div className="flex gap-2">
                    <select
                      onChange={(ev) => setValue(ev.target.value)}
                      className="border px-2 py-1 rounded"
                    >
                      <option value="">Update Status</option>
                      <option value="Hired">Hired</option>
                      <option value="Rejected">Rejected</option>
                    </select>

                    <Button
                      onClick={() => updateApplicationHandler(e.application_id)}
                    >
                      Update
                    </Button>
                  </div>
                  <div className="flex gap-3 mb-3">
                    <Link
                      target="_blank"
                      href={e.resume}
                      className="text-blue-500 hover:underline text-sm"
                    >
                      View Resume
                    </Link>

                    <Link
                      target="_blank"
                      href={`/account/${e.applicant_id}`}
                      className="text-blue-500 hover:underline text-sm"
                    >
                      View Profile
                    </Link>
                  </div>
                  <div className="flex gap-2 pt-3 border-t">
                    <select
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      className="flex-1 p-2 border-2 border-gray-300 rounded-md bg-background"
                    >
                      <option value="">Update status</option>
                      <option value="Submitted">Submitted</option>
                      <option value="Hired">Hired</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No applications yet.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default JobIdPage;
