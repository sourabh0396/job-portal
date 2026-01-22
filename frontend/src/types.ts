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

export const SERVICE_LOCAL_HOST = "http://localhost:5000"

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