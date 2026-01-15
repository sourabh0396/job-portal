"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { HomeIcon } from "lucide-react";

export const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen); //oppose to isopen
  };
  const isAuth = false;
  const logoutHandler = () => {};

  return (
    <>
      <nav className="z-50 sticky top-0 bg-background/80 border-b backdrop:backdrop-blur-md shadow-sm">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href={"/"} className="flex items-center gap-1 group">
              <div className="text-2xl font-bold tracking-tight">
                <span className="bg-linear-to-r from bg-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Hire
                </span>
                <span className="text-red-500">Jobs</span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            <Link href={"/"}>
              <Button variant={"ghost"} className="flex items-center space-x-1">
                <HomeIcon size={16} />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};
