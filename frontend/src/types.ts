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
    applyToJob: (job_id: number) => Promise<void>;
    applications: Application[] | null;
    fetchApplications: () => Promise<void>

}

export interface AppProviderProps {
    children: ReactNode;
}

export interface AccountProps {
    user: User;
    isYourAccount: boolean;
}

export type JobType = "Full-time" | "Part-time" | "Contract" | "Intrenship";
export type WorkLocation = "On-site" | "Remote" | "Hybrid";


export interface Job {
    job_id: number;
    title: string;
    description: string;
    salary?: number | null;
    location?: string | null;
    job_type: "Full-time" | "Part-time" | "Contract" | "Intrenship";
    openings: number;
    role: string;
    work_location: "On-site" | "Remote" | "Hybrid";
    company_id: number;
    company_name: string;
    company_logo: string;
    posted_by_recruiter_id: number;
    created_at: string;
    is_active?: boolean;
}

export interface Company {
    // companies
    company_id: number;
    name: string;
    description: string
    website: string
    logo: string;
    logo_public_id: string;
    recruiter_id: number;
    created_at: string;
    // job?: Job[];
    jobs?: Job[];
}

export type ApplicationStatus = "Submited" | "Rejected" | "Hired";

export interface Application {
    application_id: number;
    job_id: number;
    applicant_id: number;
    applicant_email: string;
    status: ApplicationStatus;
    resume: string;
    applied_at: string;
    subscribed?: boolean | null;
    job_title: string;
    job_salary: number;
    job_location: string;
}