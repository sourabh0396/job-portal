import CarrerGuide from "@/components/carrerguide";
import Hero from "@/components/hero";
import ResumeAnalyzer from "@/components/resume-analyser";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Hero />
      <CarrerGuide />
      <ResumeAnalyzer />
    </div>
  );
}
