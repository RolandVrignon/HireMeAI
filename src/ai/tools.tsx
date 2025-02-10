import { tool as createTool } from 'ai';
import { z } from "zod";
import { extractTextFromPdf } from '@/utils/pdf';

const username = process.env.NEXT_PUBLIC_USER_NAME;

// const ResumeTool = createTool({
//     description: `This tool allows the chatbot to render ${username}'s resume. Use this tool sparingly and strategically to enhance responses when relevant. It's beneficial to occasionally showcase the resume to provide concrete examples and credibility, but avoid overuse. The tool should complement natural conversation rather than dominate it.`,
//     parameters: z.object({
//         introduction: z.string().max(100).describe(`A brief introduction to ${username}'s resume. It should be at least two sentences describing the resume in the language of last user's message.`)
//     }),
// });

const ResumeTool = createTool({
    description: `Render ${username}'s resume.`,
    parameters: z.object({}),
    execute: async () => {
        const resume = `You should now provide a really short and concise sentence in user's language to the user to introduce ${username}'s resume, highlighting the key points of their career path and professional journey. Not more than 20 words !!!!`;
        return resume;
    }
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

const WeatherTool = createTool({
    description: 'Get the current weather at a location',
    parameters: z.object({
        latitude: z.number(),
        longitude: z.number(),
    }),
    execute: async ({ latitude, longitude }) => {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`,
        );

        const weatherData = await response.json();
        return weatherData;
    },
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
    getWeather: WeatherTool,
};