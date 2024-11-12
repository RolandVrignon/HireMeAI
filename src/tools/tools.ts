import { tool as createTool } from 'ai';
import { z } from 'zod';

export const weatherTool = createTool({
  description: 'Display the weather for a location',
  parameters: z.object({
    location: z.string(),
  }),
  execute: async function ({ location }) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { weather: 'Sunny', temperature: 75, location };
  },
});

export const educationTool = createTool({
  description: 'Display the education experience for Roland.',
  parameters: z.object({
    image: z.string(),
    title: z.string(),
    subtitle: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    description: z.string(),
    url: z.string(),
  }),
  execute: async function ({ image, title, subtitle, startDate, endDate, description, url }) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { image, title, subtitle, startDate, endDate, description, url };
  },
});

export const tools = {
  displayWeather: weatherTool,
  displayEducation: educationTool
};