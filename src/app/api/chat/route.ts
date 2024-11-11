import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { tools } from '@/ai/tools';

export async function POST(request: Request) {
  const { messages } = await request.json();

  console.log("We were here !")

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    system: `Tu t'appelles Roland AI.`,
    messages,
    maxSteps: 5,
    tools,
  });

  return result.toDataStreamResponse();
}