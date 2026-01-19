import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Search,
  TrendingUp,
} from "lucide-react";

import { Button } from "./ui/button";
import HeroImage from "../../public/businesswoman-standing-background.jpg.jpg";

function Hero() {
  return (
    <section className="relative overflow-hidden bg-pink-100">
      {/* background blur blobs */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-5 py-16 md:py-24 relative">
        <div className="flex flex-col md:flex-row items-center gap-16">
          {/* ================= LEFT CONTENT ================= */}
          <div className="flex-1 space-y-6">
            {/* badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-white/70 backdrop-blur">
              <TrendingUp size={16} className="text-blue-600" />
              <span className="text-sm font-medium">
                #1 Job Platform in India
              </span>
            </div>

            {/* heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Find Your Dream Job at{" "}
              <span className="text-red-500">HireHeaven</span>
            </h1>

            {/* description */}
            <p className="text-lg md:text-xl max-w-2xl text-muted-foreground">
              Connect with top employers and discover opportunities that match
              your skills. Whether you're a job seeker or a recruiter, we've got
              you covered with powerful tools and a seamless experience.
            </p>

            {/* stats */}
            <div className="flex gap-8 pt-4">
              <div>
                <p className="text-3xl font-bold text-blue-600">10k+</p>
                <p className="text-sm text-muted-foreground">Active Jobs</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-600">5k+</p>
                <p className="text-sm text-muted-foreground">Companies</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-600">50k+</p>
                <p className="text-sm text-muted-foreground">Job Seekers</p>
              </div>
            </div>

            {/* buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/jobs">
                <Button size="lg" className="gap-2">
                  <Search size={18} />
                  Browse Jobs
                  <ArrowRight size={18} />
                </Button>
              </Link>

              <Link href="/about">
                <Button size="lg" variant="outline" className="gap-2">
                  <Briefcase size={18} />
                  Learn More
                </Button>
              </Link>
            </div>

            {/* verified points */}
            <div className="flex flex-wrap gap-4 pt-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-blue-600" />
                Free to use
              </span>
              <span className="inline-flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-blue-600" />
                Verified Employees
              </span>
              <span className="inline-flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-blue-600" />
                Secure Platform
              </span>
            </div>
          </div>

          {/* ================= RIGHT IMAGE ================= */}
          <div className="flex-1 flex justify-center relative">
            <div className="relative w-[420px]">
              {/* glow */}
              <div className="absolute -inset-6 bg-blue-400/20 blur-2xl rounded-3xl" />

              {/* image card */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <Image
                  src={HeroImage}
                  alt="Professional woman"
                  width={420}
                  height={520}
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
// import {
//   ArrowRight,
//   BadgeCheck,
//   Briefcase,
//   Search,
//   TrendingUp,
// } from "lucide-react";
// import React from "react";
// import { Button } from "./ui/button";
// import HeroImage from "../../public/happy-latin-businesswoman-standing-with-arms-crossed-against-isolated-background.jpg";
// import Image from "next/image";
// import Link from "next/link";
// function Hero() {
//   return (
//     <section className="relative overflow-hidden bg-pink-100">
//       <div className="absolue inset-0 opacity-5">
//         <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
//         <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
//       </div>

//       <div className="container mx-auto px-5 py-16 md:py-24 relative">
//         <div className="flex flex-col-reverse md:flex-row items-center gap-12 md:gap-16">
//           <div className="flex-1 flex-col md:flex-row items-center gap-12 md:gap-16">
//             <div className="inline-flex items-center gap-2 px-4 py-4 rounded-full border bg-background/50 backdrop-blur-sm bg-secondary">
//               <TrendingUp size={16} className="text-blue-600" />
//               <span className="text-sm font-medium">Job Platform in India</span>
//             </div>

//             <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
//               Find Your dream Job at <span className="inline-block">Hire</span>
//               <span className="text-red-500">JobFinder</span>
//             </h1>

//             {/* description */}
//             <p className="text-lg md:text-xl leading-relaxed opacity-80 max-w-2xl">
//               Connect with top employers and discover opportunities that your
//               skills. Wheather you're a job seeker or recruiter, you covered
//               with powerful tools and seamless experience.
//             </p>

//             {/* stats */}
//             <div className="flex flex-wrap justify-center md:justify-start gap-8 py-4">
//               <div className="text-center md:text-left">
//                 <p className="text-3xl font-bold text-blue-600">10k+</p>
//                 <p className="text-sm opacity-70">Active Jobs</p>
//               </div>
//               <div className="text-center md:text-left">
//                 <p className="text-3xl font-bold text-blue-600">5k+</p>
//                 <p className="text-sm opacity-70">Companies</p>
//               </div>
//               <div className="text-center md:text-left">
//                 <p className="text-3xl font-bold text-blue-600">50k+</p>
//                 <p className="text-sm opacity-70">Job Seekers</p>
//               </div>
//               <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
//                 <Link href="/jobs">
//                   <Button size="lg" className="text-base px-8 h-12 gap-2 group">
//                     <Search size={18} />
//                     Browse Jobs
//                     <ArrowRight
//                       size={18}
//                       className="group-hover:translate-x-1 transition-transform"
//                     />
//                   </Button>
//                 </Link>

//                 <Link href="/about">
//                   <Button size="lg" className="text-base px-8 h-12 gap-2">
//                     <Briefcase size={18} />
//                     Learn More
//                   </Button>
//                 </Link>
//               </div>
//               {/* image section */}
//               <div className="flex items-center gap-2 text-sm opacity-60 pt-4">
//                 <span className="inline-flex items-center gap-2">
//                   <BadgeCheck className="w-5 h-5 text-blue-600" />
//                   Free to use
//                 </span>
//                 <span className="inline-flex items-center gap-2">
//                   <BadgeCheck className="w-5 h-5 text-blue-600" />
//                   Verified Employees
//                 </span>
//                 <span className="inline-flex items-center gap-2">
//                   <BadgeCheck className="w-5 h-5 text-blue-600  " />
//                   Secure Platform
//                 </span>
//               </div>
//             </div>
//             {/* image section */}
//             <div className="flex-1 relative">
//               <div className="relative group">
//                 <div className="absolute -inset-4 bg-blue-400 opacity-20 blur-xl group-hover:opacity-30 transition-opacity">
//                   {/* <img src={HeroImage} alt="" /> */}
//                   <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-background">
//                     <Image
//                       src={HeroImage}
//                       alt="Hero image"
//                       className="object-cover object-center w-full h-full transform transition-transform duration-500 group-hover:scale-150"
//                       priority
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default Hero;
