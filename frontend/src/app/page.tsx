"use client";
import CarrerGuide from "@/components/carrerguide";
import Hero from "@/components/hero";
import ResumeAnalyzer from "@/components/resume-analyser";
import Loading from "@/components/ui/loading";
import { useAppData } from "@/context/AppContect";
import Image from "next/image";

export default function Home() {
  const { loading } = useAppData();
  if (loading) return <Loading />;
  return (
    <div>
      <Hero />
      <CarrerGuide />
      <ResumeAnalyzer />
    </div>
  );
}
