import { tool as createTool } from 'ai';
import { z } from "zod";

const username = process.env.NEXT_PUBLIC_USER_NAME;

const ResumeTool = createTool({
    description: `This tool allows the chatbot to render ${username}'s resume. Use this tool sparingly and strategically to enhance responses when relevant. It's beneficial to occasionally showcase the resume to provide concrete examples and credibility, but avoid overuse. The tool should complement natural conversation rather than dominate it.`,
    parameters: z.object({
        introduction: z.string().max(100).describe(`A brief introduction to ${username}'s resume. It should be at least two sentences describing the resume in the language of last user's message.`)
    }),
});

const ExperienceTool = createTool({
    description: `This tool allows the chatbot to render ${username}'s professional experience. Use this tool sparingly and strategically to enhance responses when relevant. It's beneficial to showcase the experience to provide concrete examples of skills and achievements, but avoid overuse. The tool should complement natural conversation rather than dominate it.`,
    parameters: z.object({
        introduction: z.string().max(100).describe(`A brief introduction to ${username}'s professional experience. It should be at least two sentences describing the resume in the language of last user's message.`),
        experiences: z.array(z.object({
            company: z.string().describe("Company or organization name"),
            position: z.string().describe("Job title or position"),
            startDate: z.string().describe("Start date of employment"),
            endDate: z.string().describe("End date of employment"),
            website: z.string().optional().describe("Website of the company")
        }))
    }),
});

const ContactTool = createTool({
    description: "Render the contact form.",
    parameters: z.object({}),
    execute: async () => {
        return "true";
    },
});

export const tools = {
    getResume: ResumeTool,
    getExperience: ExperienceTool,
};