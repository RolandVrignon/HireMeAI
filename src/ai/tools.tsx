import { tool as createTool } from 'ai';
import { z } from "zod";

const ResumeTool = createTool({
    description: "Render the resume.",
    parameters: z.object({}),
    execute: async () => {
        return "true";
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
};