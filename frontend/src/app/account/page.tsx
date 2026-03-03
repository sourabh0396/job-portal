"use client";

import Loading from "@/components/ui/loading";
import { useAppData } from "@/context/AppContect";
import React from "react";
import Info from "./components/info";
import Skills from "./components/skills";
import Company from "./components/company";

function Account() {
  const { isAuth, user, loading } = useAppData();
  if (loading) return <Loading />;
  return (
    <>
      {user && (
        <div className="w-[90%] md:w-[60%] m-auto">
          <Info user={user} isYourAccount={true} />
          {user.role === "jobseeker" && (
            <Skills user={user} isYourAccount={true} />
          )}
          {user.role === "recruiter" && <Company />}
        </div>
      )}
    </>
  );
}

export default Account;
