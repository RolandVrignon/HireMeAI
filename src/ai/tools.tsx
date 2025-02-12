import { tool as createTool } from 'ai';
import { z } from "zod";
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function getImageDimensions(filepath: string) {
    const metadata = await sharp(filepath).metadata();
    return {
        width: metadata.width || 800,
        height: metadata.height || 600
    };
}

const username = process.env.NEXT_PUBLIC_USER_NAME;

const ResumeTool = createTool({
    description: `Render ${username}'s resume.`,
    parameters: z.object({}),
    execute: async () => {
        const resume = `You should now provide a really short and concise sentence in user's last message language to the user to introduce ${username}'s resume as this message already provides the resume to the user. Not more than 20 words !!!!`;
        return resume;
    }
});

const ExperienceTool = createTool({
    description: `This tool allows the chatbot to render ${username}'s professional experience. Use this tool sparingly and strategically to enhance responses when relevant. It's beneficial to showcase the experience to provide concrete examples of skills and achievements, but avoid overuse. The tool should complement natural conversation rather than dominate it.`,
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
        const result = {
            content: `You should now provide a really short and concise sentence in user's last message language to the user to introduce ${username}'s professional experience as this message already provides thes experiences to the user. Not more than 20 words !!!!`,
            experiences: experiences
        }
        return result;
    }
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
    description: "Display the contact form.",
    parameters: z.object({}),
    execute: async () => {
        const contact = `You should now provide a really short and concise sentence in user's last message language to the user to introduce ${username}'s Contact form as this message already contains the contact form. Not more than 20 words !!!!`;
        return contact;
    },
});

const PhotosTool = createTool({
    description: `This tool allows the chatbot to display ${username}'s photo gallery. Use this tool to show relevant photos when discussing projects, experiences, or personal achievements.`,
    parameters: z.object({}),
    execute: async () => {
        const photosDir = path.join(process.cwd(), 'public/photos');
        const files = fs.readdirSync(photosDir);

        const shuffleArray = (array: string[]) => {
            let seed = Math.floor(Date.now() / (1000 * 60 * 60));

            const seededRandom = () => {
                const newSeed = (seed * 9301 + 49297) % 233280;
                seed = newSeed;
                return newSeed / 233280;
            };

            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(seededRandom() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        };

        const shuffledFiles = shuffleArray(files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file)));

        const photos = await Promise.all(shuffledFiles
            .map(async (file, index) => {
                const dimensions = await getImageDimensions(`${photosDir}/${file}`);
                return {
                    url: `/photos/${file}`,
                    alt: `Photo ${index + 1}`,
                    width: dimensions.width,
                    height: dimensions.height
                };
            }));

        const result = {
            content: `You should now provide a really short and concise sentence in user's last message language to the user to introduce ${username}'s Photography hobby as this message already contains the photos. Not more than 20 words !!!!`,
            photos: photos
        }

        return result;
    }
});

export const tools = {
    getResume: ResumeTool,
    getExperience: ExperienceTool,
    getWeather: WeatherTool,
    getPhotos: PhotosTool,
    getContact: ContactTool,
};