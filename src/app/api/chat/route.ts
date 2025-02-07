import { mistral } from "@ai-sdk/mistral";
import { smoothStream, streamText } from "ai";
import { extractTextFromPdf } from "../resume/route";
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

    const resumeText = await extractTextFromPdf("resume.pdf");

    const systemMessage = `You are a helpful assistant. Here is my resume:\n\n${resumeText}\n\nYou can use tools when specifically asked, otherwise provide normal text responses.`;

    const result = streamText({
      model: mistral("mistral-small-latest"),
      system: systemMessage,
      prompt: messagesFiltered[messagesFiltered.length - 1].content,
      maxSteps: 1,
      tools,
      experimental_transform: smoothStream(),
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
