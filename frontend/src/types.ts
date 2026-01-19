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

export const SERVICE_LOCAL_HOST = "http://localhost:5000"