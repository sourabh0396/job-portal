"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { SERVICE_LOCAL_HOST } from "@/context/AppContect";
import Cookies from "js-cookie";
import { Briefcase, Filter, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/loading";
import JobCard from "@/components/job-card";
import { Job } from "@/types";

const locations: string[] = [
  "Delhi",
  "Mumbai",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Remote",
];

const JobPage = () => {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");

  const token = Cookies.get("token");
  const ref = useRef<HTMLButtonElement>(null);
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${SERVICE_LOCAL_HOST}/api/job/all?title=${title}&location=${location}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [title, location]);

  const clickEvent = () => {
    ref.current?.click();
  };

  const clearFilter = () => {
    setTitle("");
    setLocation("");
    fetchJobs();
    ref.current?.click();
  };

  const hasActiveFilters = title || location;
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* HEADER */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-3">
            Find Your <span className="text-blue-600">Dream Job</span>
          </h1>

          <p className="opacity-70">
            Discover {jobs.length} opportunities waiting for you
          </p>
        </div>

        {/* FILTER CARD */}
        <div className="bg-white dark:bg-slate-900 shadow-lg rounded-2xl p-6 mb-10 backdrop-blur-lg border">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="flex items-center border rounded-xl px-3">
              <Search size={18} className="opacity-50" />

              <input
                type="text"
                placeholder="Search job title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 outline-none bg-transparent"
              />
            </div>

            {/* Location */}
            <div className="flex items-center border rounded-xl px-3">
              <MapPin size={18} className="opacity-50" />

              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2 bg-transparent outline-none"
              >
                <option value="">All Locations</option>

                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Button */}
            <Button
              ref={ref}
              onClick={fetchJobs}
              className="h-11 rounded-xl gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Filter size={18} />
              {loading ? "Searching..." : "Search Jobs"}
            </Button>

            <Button
              variant="outline"
              onClick={clearFilter}
              disabled={!hasActiveFilters}
              className="h-11 rounded-xl"
            >
              Clear Filter
            </Button>
          </div>
        </div>

        {/* JOB LIST */}

        {loading ? (
          <Loading />
        ) : (
          <>
            {jobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <JobCard job={job} key={job.job_id} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="flex justify-center mb-4">
                  <div className="p-6 rounded-full bg-gray-200 dark:bg-gray-700">
                    <Briefcase size={40} className="opacity-50" />
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-2">No Jobs Found</h3>

                <p className="opacity-60">Try adjusting your search filters</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default JobPage;
