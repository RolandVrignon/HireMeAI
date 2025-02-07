import { mistral } from '@ai-sdk/mistral';
import { smoothStream, streamText } from 'ai';
import { extractTextFromPdf } from '../resume/route';
import { z } from 'zod';

export const maxDuration = 30;

function getLocation() {
  return { lat: 37.7749, lon: -122.4194 };
}

function getWeather({ lat, lon, unit }: { lat: number, lon: number, unit: string }) {
  return { value: 25, description: 'Sunny' };
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    const resumeText = await extractTextFromPdf("resume.pdf");
    
    const systemMessage = `You are a helpful assistant. Here is my resume:\n\n${resumeText}\n\nYou can use tools when specifically asked, otherwise provide normal text responses.`;

    const result = streamText({
      model: mistral('mistral-small-latest'),
      system: systemMessage,
      messages,
      tools: {
        getLocation: {
          description: 'Get the location of the user',
          parameters: z.object({}),
          execute: async () => {
            const { lat, lon } = getLocation();
            console.log('lat:', lat)
            console.log('lon:', lon)
            return `Your location is at latitude ${lat} and longitude ${lon}`;
          },
        },
        getWeather: {
          description: 'Get the weather for a location',
          parameters: z.object({
            lat: z.number().describe('The latitude of the location'),
            lon: z.number().describe('The longitude of the location'),
            unit: z
              .enum(['C', 'F'])
              .describe('The unit to display the temperature in'),
          }),
          execute: async ({ lat, lon, unit }) => {
            const { value, description } = getWeather({ lat, lon, unit });
            return `It is currently ${value}°${unit} and ${description}!`;
          },
        },
      },
    });

    return result.toDataStreamResponse();

} catch (error) {
    console.error('Error in chat endpoint:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
