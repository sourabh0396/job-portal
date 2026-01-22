"use client";
import { CarrerGuideResponse, SERVICE_LOCAL_HOST } from "@/types";
import axios from "axios";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Lightbulb,
  Loader2,
  Sparkles,
  Target,
  TrendingUp,
  X,
} from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { log } from "console";

function CarrerGuide() {
  const [open, setOpen] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [curruntSkills, setCurruntSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<CarrerGuideResponse | null>(null);

  const addSkill = () => {
    if (curruntSkills.trim() && !skills.includes(curruntSkills.trim())) {
      setSkills([curruntSkills.trim(), ...skills]);
      setCurruntSkills("");
    }
  };

  const removeSkills = (skillsToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillsToRemove));
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      addSkill();
    }
  };

  const getCarrerGuidance = async () => {
    if (skills.length === 0) {
      // alert("Add at least one skill");
      toast.error("Please add at least one skill to continue.");
      return;
    }
    // toast.success("Fetching career guidance...");
    setLoading(true);
    try {
      const { data } = await axios.post(`${SERVICE_LOCAL_HOST}/api/ai/career`, {
        skills: skills,
      });
      // setResponse(data);
      setResponse(data.jsonResponse);
      alert("carrer guidance generated");
      toast.success("Your career guidance is ready!");
    } catch (error: any) {
      // alert(error.response.data.message);
      console.error("API Error:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong while generating career guidance";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const resetDialog = () => {
    setOpen(false);
    setSkills([]);
    setCurruntSkills("");
    setResponse(null);
  };

  console.log(skills);

  return (
    <div className="max-w-7xl mx-auto px4 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-blue-50 dark:bg-blue-400 mb-4">
          <Sparkles size={16} className="text-blue-600" />
          <span className="text-sm font-medium">
            AI Powered Carrer Guidence
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Discover Your Carrer Path
        </h2>
        <p className="text-lg opacity-70 max-w-2xl mx-auto mb-8">
          Get personilized Job recomendaion and learing roadmaps based on your
          skills.
        </p>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size={"lg"} className="gap-2 h-12 px-8">
              <Sparkles size={18} />
              Get Carrer Gudance
              <ArrowRight size={18} />
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {!response ? (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center text-2xl gap-2">
                    <Sparkles size={18} className="text-blue-500" />
                    Tell us aout your Skills
                  </DialogTitle>
                  <DialogDescription>
                    Add your technical skills to recieve personalized carrer
                    recomendations
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="skill">Add Skills</Label>
                    <div className="flex gap-2">
                      <Input
                        id="skill"
                        placeholder="e.g, React,Node,JavaScript, Python ..."
                        value={curruntSkills}
                        onChange={(e) => setCurruntSkills(e.target.value)}
                        className="h-11"
                        onKeyPress={handleKeyPress}
                      />
                      <Button onClick={addSkill} className="gap-2">
                        Add
                      </Button>
                    </div>
                  </div>
                  {skills.length > 0 && (
                    <div className="space-y-2">
                      <Label>Your Skills({skills.length})</Label>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                          <div
                            key={skill}
                            className="inline-flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800"
                          >
                            <span className="text-sm font-medium">{skill}</span>
                            <button
                              onClick={() => removeSkills(skill)}
                              className="h-5 w-5 rounded-full bg-red-500 text-white flex in-checked: justify-center"
                            >
                              <X size={13}></X>
                            </button>
                          </div>
                        ))}
                      </div>
                      <Button
                        onClick={getCarrerGuidance}
                        disabled={loading || skills.length === 0}
                        className="w-full h-11 gap-2"
                      >
                        {loading ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Analyzing your skills...
                          </>
                        ) : (
                          <>
                            <Sparkles size={18} className="" />
                            Generate Carrer Guidance
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* when we get response  */}
                <DialogHeader>
                  <DialogTitle className="text-2xl flex items-center gap-2">
                    <Target size={18} className="text-blue-500" />
                    Your Personilized Carrer Guidance
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  {/* summary */}
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-b-blue-300 dark:border-b-blue-900 ">
                    <div className="flex items-start gap-3">
                      <Lightbulb
                        className="text-blue-600 mt-1 shrink-0"
                        size={20}
                      />
                      <div>
                        <h3 className="font-semibold mb-3">Carrer Summary</h3>
                        <p className="text-sm leading-relaxed opacity-90">
                          {response.summary}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* job options */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Briefcase size={20} className="text-blue-600" />
                      Recommended Carrer Paths
                    </h3>
                    <div className="space-y-3">
                      {response.jobOptions.map((job, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-lg border hover:border-blue-500 transition-colors"
                        >
                          {index}

                          <h4 className="font-semibold text-base mb-2">
                            {job.title}
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-medium opacity-70">
                                Responsibilities:
                              </span>
                              <span className="oapcity-80">
                                {job.responsibilities}
                              </span>
                            </div>
                            <span className="font-medium opacity-70">
                              Why this Role:
                            </span>
                            <span className="+opacity-70">{job.why}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills to learn */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp size={18} className="text-blue-600" />
                      Skills to enhance your carrer
                    </h3>
                    <div className="space-y-4">
                      {response.skillsToLearn.map((category, index) => (
                        <div key={index} className="space-y-2 ">
                          <h4
                            key={index}
                            className="text-lg font-semibold text-blue-600"
                          >
                            {category.category}
                          </h4>
                          <div className="space-y-2">
                            {category.skills.map((skillcategory, skindex) => (
                              <div
                                key={skindex}
                                className="p-3 rounded-lg bg-secondary border text-sm"
                              >
                                <p className="font-medium mb-1">
                                  {skillcategory.title}
                                </p>
                                <p className="text-xs opacity-70 mb-1">
                                  <span className="font-medium"> Why:</span>
                                  {skillcategory.why}
                                </p>
                                <p className="text-xs opacity-70 mb-1">
                                  <span className="font-medium"> How:</span>
                                  {skillcategory.how}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Learning Appraoch */}
                  <div className="p-4 rounded-lg border bg-blue-950/20 dark:bg-red-950/20">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <BookOpen size={20} className="text-blue-600" />
                      {response?.learningApproach?.title}
                    </h3>
                    <ul className="space-y-2">
                      {response?.learningApproach?.points.map(
                        (point, index) => (
                          <li
                            key={index}
                            className="text-sm flex items-start gap-2"
                          >
                            <span className="text-blue-600 mt-0.5">
                              <span className="mt-0.5 inline-block h-2 w-2 rounded-full bg-blue-600"></span>
                            </span>
                            <span
                              className="opacity-90"
                              dangerouslySetInnerHTML={{ __html: point }}
                            ></span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                  <Button
                    onClick={resetDialog}
                    variant={"outline"}
                    className="w-full"
                  >
                    Start New Analysis
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default CarrerGuide;
