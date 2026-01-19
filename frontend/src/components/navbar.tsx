"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Briefcase,
  Home,
  HomeIcon,
  Info,
  LogIn,
  LogOut,
  LogOutIcon,
  Menu,
  User,
  X,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ModeToggle } from "./mode.toggle";

export const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen); //oppose to isopen
  };
  const isAuth = true;
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
                <span className="text-red-500">JobFinder</span>
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

            <Link href={"/job"} onClick={toggleMenu}>
              <Button variant={"ghost"} className="flex items-center space-x-1">
                <Briefcase size={18} />
                Job
              </Button>
            </Link>

            <Link href={"/about"}>
              <Button variant={"ghost"} className="flex items-center space-x-1">
                <Info size={16} />
                About
              </Button>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuth ? (
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <Avatar className="h-9 w-9 ring-offset-2 ring-offset-background ring-blue-500/20 cursor-pointer hover:ring-blue-500/40 transition-all">
                      {/* <AvatarImage src={} alt="" /> */}
                      <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600"></AvatarFallback>
                    </Avatar>
                  </button>
                </PopoverTrigger>

                <PopoverContent className="w-56 p-2" align="end">
                  <div className="px-3 py-2 mb-2 border-b">
                    <p className="text-sm font-semibold">Sourabh</p>
                    <p className="text-xs opacity-60 truncate">
                      sourabhpatil0369@gmail.com
                    </p>
                  </div>

                  <Link href={"/account"}>
                    <Button
                      className="w-full justify-start gap-2"
                      variant={"ghost"}
                    >
                      <User size={16} />
                      My Profile
                    </Button>
                  </Link>
                  <Button
                    className="w-full justify-start gap-2 mt-1"
                    onClick={logoutHandler}
                  >
                    <LogOut size={16}>LogOut</LogOut>
                  </Button>
                </PopoverContent>
              </Popover>
            ) : (
              <Link href={"/login"}>
                <Button variant={"ghost"} className="gap-2">
                  <User size={16} />
                  Sign In
                </Button>
              </Link>
            )}
            <ModeToggle />
          </div>

          {/* mobile menu btn */}
          <div className="md:hidden flex items-center gap-3">
            <ModeToggle />
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* mobile view */}
        <div
          className={`md:hidden border-t overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-90 opacity-100" : "max-0 opacity-0"
          }`}
        >
          <div className="px-3 py-3 space-y-1 bg-background/95 backdrop-blur-md">
            <Link href={"/"} onClick={toggleMenu}>
              <Button
                variant={"ghost"}
                className="w-full justify-start gap-3 h-11"
              >
                <Home size={18} />
                Home
              </Button>
            </Link>
            <Link href={"/job"} onClick={toggleMenu}>
              <Button
                variant={"ghost"}
                className="w-full justify-start gap-3 h-11"
              >
                <Briefcase size={18} />
                Job
              </Button>
            </Link>
            <Link href={"/about"} onClick={toggleMenu}>
              <Button
                variant={"ghost"}
                className="w-full justify-start gap-3 h-11"
              >
                <Info size={18} />
                About
              </Button>
            </Link>
            {isAuth ? (
              <>
                <Link href={"/about"} onClick={toggleMenu}>
                  <Button
                    variant={"ghost"}
                    className="w-full justify-start gap-3 h-11"
                  >
                    <Info size={18} />
                    MyProfile
                  </Button>
                </Link>
                <Button
                  variant={"ghost"}
                  className="w-full justify-start gap-3 h-11"
                  onClick={() => {
                    logoutHandler();
                    toggleMenu();
                  }}
                >
                  <LogOutIcon size={18} />
                  LogOut
                </Button>
              </>
            ) : (
              <Link href={"/login"} onClick={toggleMenu}>
                <Button className="w-full justify-start gap-3 h-11 mt-2">
                  <User size={18} />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};
