import { mistral } from "@ai-sdk/mistral";
import { smoothStream, streamText } from "ai";
import { extractTextFromPdf } from '@/utils/pdf';   
import { tools } from "@/ai/tools";
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    let messagesFiltered = messages.map((message: any) => ({
      role: message.role,
      content: message.content
    }));

    console.log('messagesFiltered:', messagesFiltered)

    let resumeText;
    try {
      resumeText = await extractTextFromPdf("resume.pdf");
    } catch (error) {
      console.error("Error extracting PDF:", error);
      return new Response("Error processing resume", { status: 500 });
    }

    const systemMessage = `You are a helpful assistant. Here is my resume:\n\n${resumeText}\n\nYou should absolutely use tools if a tool fullfills users request, otherwise provide normal well formatted text responses that answer the user's question and are concise.`;

    const result = streamText({
      model: mistral("mistral-large-latest"),
      system: systemMessage,
      messages: messagesFiltered,
      maxSteps: 2,
      tools,
      experimental_transform: smoothStream({delayInMs: 25, chunking: "word"}),
      toolCallStreaming: true,
    });

    return result.toDataStreamResponse();

  } catch (error) {
    console.error("Error in chat endpoint:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  return new Response("Hello, world!");
}