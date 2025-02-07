import { tool as createTool } from 'ai';
import { z } from "zod";

const username = process.env.NEXT_PUBLIC_USER_NAME;
console.log('Tool username:', username)

const ResumeTool = createTool({
    description: `Render ${username}'s resume.`,
    parameters: z.object({}),
    execute: async () => {
        return "true";
    },
});

const ExperienceTool = createTool({
    description: `Render ${username}'s professional experience.`,
    parameters: z.object({
        experiences: z.array(z.object({
            company: z.string().describe("Company or organization name"),
            position: z.string().describe("Job title or position"),
            startDate: z.string().describe("Start date of employment"),
            endDate: z.string().describe("End date of employment"),
            website: z.string().optional().describe("Website of the company")
        }))
    }),
    execute: async ({ experiences }) => {
        console.log('Tool - experiences:', experiences);
        
        // Create a TransformStream to stream the response
        const stream = new TransformStream();
        const writer = stream.writable.getWriter();

        // Write the experiences data in chunks
        for (const experience of experiences) {
            await writer.write(JSON.stringify({ experience }) + '\n');
            // Add small delay between chunks to simulate streaming
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        await writer.close();
        return stream.readable;
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
};