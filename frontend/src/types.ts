import React, { ReactNode } from "react";

export interface JobOptions {
    title: string,
    responsibilities: string,
    why: string
}

export interface SkillsToLearn {
    title: string,
    why: string,
    how: string
}
export interface SkillCategory {
    category: string,
    skills: SkillsToLearn[];
}

export interface LearningApproach {
    title: string,
    points: string[];
}

export interface CarrerGuideResponse {
    summary: string,
    jobOptions: JobOptions[],
    skillsToLearn: SkillCategory[],
    learningApproach: LearningApproach;
}


export interface ScoreBreakDown {
    formatting: { score: number; feedback: string };
    keywords: { score: number; feedback: string };
    structure: { score: number; feedback: string };
    readability: { score: number; feedback: string };
}
export interface Suggestion {
    category: string;
    issue: string;
    recommendation: string;
    priority: "high" | "medium" | "low";
}
export interface ResumeAnalysisResponse {
    atsScore: number;
    scoreBreakdown: ScoreBreakDown;
    suggestions: Suggestion[];
    strengths: string[];
    summary: string;
}

export interface User {
    user_id: number;
    name: string;
    email: string;
    password: string;
    phone_number: number;
    role: "jobseeker" | "recruiter";
    bio: string | null;
    resume: string | null;
    resume_public_id: string | null;
    profile_pic: string | null;
    profile_pic_public_id: string | null;
    skills: string[];
    subscription: string | null;
}

export interface AppContextType {
    user: User | null;
    loading: boolean;
    btnLoading: boolean;
    isAuth: boolean;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
    logOutUser: () => Promise<void>;
    updateProfilePic: (formData: any) => Promise<void>;
    updateResume: (formData: any) => Promise<void>;
    updateUserProfile: (name: string, phoneNumber: string, bio: string,) => Promise<void>;
    addSkilltoUser: (skill: string, setSkill: React.Dispatch<React.SetStateAction<string>>) => Promise<void>
    removeSkillfromUser: (skill: string) => Promise<void>;

}

export interface AppProviderProps {
    children: ReactNode;
}

export interface AccountProps {
    user: User;
    isYourAccount: boolean;
}