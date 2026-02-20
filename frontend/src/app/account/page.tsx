"use client";

import Loading from "@/components/ui/loading";
import { useAppData } from "@/context/AppContect";
import React from "react";
import Info from "./components/info";

function Account() {
  const { isAuth, user, loading } = useAppData();
  if (loading) return <Loading />;
  return (
    <>
      {user && (
        <div className="w-[90%] md:w-[60%] m-auto">
          <Info user={user} isYourAccount={true} />
        </div>
      )}
    </>
  );
}

export default Account;
