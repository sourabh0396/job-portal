import { Card } from "@/components/ui/card";
import { AccountProps } from "@/types";
import React, { ChangeEvent, useRef, useState } from "react";
import avatarImage from "../../../../public/avatarImage.png";
import Image from "next/image";
import {
  Briefcase,
  Camera,
  Edit,
  FileText,
  Mail,
  NotepadText,
  Phone,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppData } from "@/context/AppContect";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const Info: React.FC<AccountProps> = ({ user, isYourAccount }) => {
  // const [btnLoading, setBtnLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const editRef = useRef<HTMLButtonElement | null>(null);
  const resumeRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bio, setBio] = useState("");

  const [open, setOpen] = useState(false);

  const { updateProfilePic, updateResume, btnLoading, updateUserProfile } =
    useAppData();

  // console.log(isYourAccount, "is this account ✅");
  const handleClick = () => {
    inputRef.current?.click();
  };

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      updateProfilePic(formData);
    }
  };

  const handleEditClick = () => {
    editRef.current?.click();
    setName(user.name);
    setPhoneNumber(String(user.phone_number));
    setBio(user.bio || "");
    setOpen(true);
  };

  const updateProfileHandler = () => {
    updateUserProfile(name, phoneNumber, bio);
  };

  const handleResumeClick = () => {
    resumeRef.current?.click();
  };

  const changeResume = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        alert("plese upload a pdf file");
        return;
      }
      const formData = new FormData();
      formData.append("file", file);
      updateResume(formData);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Card className="overflow-hidden shadow-lg border rounded-xl">
        {/* Blue Cover Section */}
        <div className="h-30 bg-blue-500 relative" />

        {/* Avatar */}
        <div className="relative px-8">
          <div className="absolute -top-16">
            <div className="relative w-30 h-30">
              <div className="rounded-full border-4 border-white overflow-hidden shadow-xl bg-white">
                <Image
                  src={user.profile_pic ? user.profile_pic : avatarImage}
                  alt="Profile picture"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>

              {isYourAccount && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={handleClick}
                    className="absolute bottom-0 right-0 rounded-full h-10 w-10 shadow-lg z-10"
                  >
                    <Camera size={18} />
                  </Button>

                  <Input
                    type="file"
                    className="hidden"
                    accept="image?*"
                    ref={inputRef}
                    onChange={changeHandler}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* User Info Section */}
        <div className="pt-15 pb-8 px-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="space-y-1 ">
              <h1 className="text-3xl font-bold">{user.name}</h1>

              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Briefcase size={16} />
                <span className="capitalize">{user.role}</span>
              </div>
            </div>

            {/* Optional: Edit Button */}
            {isYourAccount && (
              <Button
                variant={"ghost"}
                size={"icon"}
                className="h-8 w-8"
                onClick={handleEditClick}
              >
                <Edit size={16} />
              </Button>
            )}
          </div>
          {/* Bio */}
          {user.role === "jobseeker" && user.bio && (
            <div className="mt-6 p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2 text-sm font-medium opacity-70">
                <FileText size={16} />
                <span>About</span>
              </div>
              <p className="text-base leading-relaxed">{user.bio}</p>
            </div>
          )}
          {/* Contact Info */}

          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Mail size={20} className="text-blue-800" />
              Contact Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-lg border hover:border-blue-500 transition-colors">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Mail size={18} className="text-blue-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs opacity-70 font-medium">Email</p>
                  <p className="text-sm truncate">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg border hover:border-blue-500 transition-colors">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Phone size={18} className="text-blue-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs opacity-70 font-medium">Phone</p>
                  <p className="text-sm truncate">{user.phone_number}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Resume section */}
          {user.role === "jobseeker" && user.resume && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mt-4 flex items-center gap-2">
                <NotepadText size={20} className="text-blue-600" />
                Resume
              </h2>

              <div className="flex items-center gap-3 p-4 rounded-lg border hover:border-blue-500 transition-colors">
                <div className="h-12 w-12 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center">
                  <NotepadText size={20} className="text-red-600" />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium">Resume Document</p>
                  {/* <Link
                    href={user.resume}
                    className="text-sm text-blue-500 hover:underline"
                    target="_blank"
                  >
                    View Resume PDF
                  </Link> */}
                  <a
                    href={user.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    download="Resume.pdf"
                    className="text-sm text-blue-500 hover:underline"
                  >
                    View Resume PDF
                  </a>
                  {/* Edit Button */}

                  <Button
                    variant={"outline"}
                    size={"sm"}
                    onClick={handleResumeClick}
                    className="gap-2"
                  >
                    Update
                  </Button>
                  <input
                    type="file"
                    ref={resumeRef}
                    className="hidden"
                    accept="application/pdf"
                    onChange={changeResume}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
      {/* dialog box */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTitle asChild>
          <Button ref={editRef} variant={"outline"} className="hidden">
            Edit Profile
          </Button>
        </DialogTitle>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium flex items-center gap-2"
              >
                <UserIcon size={16} /> Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter Your Name"
                className="h-11"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Phone size={16} /> Phone Number
              </Label>
              <Input
                id="phone"
                type="number"
                placeholder="Enter Your Phone Number"
                className="h-11"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            {user.role === "jobseeker" && (
              <div className="space-y-2">
                <Label
                  htmlFor="bio"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <FileText size={16} /> Bio
                </Label>
                <Input
                  id="bio"
                  type="text"
                  placeholder="ENter Your Bio"
                  className="h-11"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
            )}

            <DialogFooter>
              <Button
                disabled={btnLoading}
                onClick={updateProfileHandler}
                className="w-full  h-11"
                type="submit"
              >
                {btnLoading ? "Saving Changes..." : "save Changes"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Info;
