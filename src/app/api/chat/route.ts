import { mistral } from "@ai-sdk/mistral";
import { createDataStreamResponse, smoothStream, streamText } from "ai";
import { extractTextFromPdf } from "@/utils/pdf";
import { tools } from "@/ai/tools";
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    let messagesFiltered = messages.map((message: any) => ({
      role: message.role,
      content: message.content,
    }));

    let resumeText;
    try {
      resumeText = await extractTextFromPdf("resume.pdf");
    } catch (error) {
      console.error("Error extracting PDF:", error);
      return new Response("Error processing resume", { status: 500 });
    }

    const toolDescriptions = Object.entries(tools)
      .map(([key, value]) => `${value.name}: ${value.description}`)
      .join("\n");

    const username = process.env.NEXT_PUBLIC_USER_NAME || "John";

    const systemPrompt = `You are ${username}'s personal AI assistant on his portfolio website. Your job is to make ${username} shine. When someone asks about ${username}'s qualities, skills, work ethic, or personality, be funny, witty, and slightly over-the-top enthusiastic — like a hype man. Use humor and bold statements to make ${username} memorable. Always put ${username} in the best light possible. Be disruptive and original in your answers, never boring or generic. Never use emojis in your responses.`;
    const resumePrompt = `${username}'s resume :\n\n${resumeText}`;
    const hobbyPrompt = `${username}'s hobby is photography. He uses a analog camera to capture street photography.`;
    const motivationPrompt = `${username} is driven by the ambition to someday start his own venture. However, he first want to build his skill set and gain valuable experience by joining innovative projects alongside talented teams. I place great importance on fulfilling his responsibilities with care and ensuring tasks are carried out to the highest standards.`;
    const githubPrompt = `${username} is active on GitHub and contributes regularly to open source and personal projects.`;
    const formatPrompt = `You should answer in the language of the user's last message. You should not answer questions that are not related to ${username} or any tools provided.`;
    const toolsPrompt = `Available tools and their purposes:\n${toolDescriptions}\n\nTools should work in any language and asynchronous way.`;

    const systemMessage = `${systemPrompt}\n\n${resumePrompt}\n\n${hobbyPrompt}\n\n${motivationPrompt}\n\n${githubPrompt}\n\n${toolsPrompt}\n\n${formatPrompt}`;

    const toolsFiltered = Object.fromEntries(
      Object.entries(tools).map(([key, value]) => [key, value.tool]),
    );

    return createDataStreamResponse({
      execute: (dataStream) => {
        const result = streamText({
          model: mistral("mistral-small-latest"),
          system: systemMessage,
          messages: messagesFiltered,
          maxSteps: 5,
          tools: toolsFiltered, // Utilisation des outils filtrés
          experimental_transform: smoothStream({
            delayInMs: 25,
            chunking: "word",
          }),
          toolCallStreaming: true,
          experimental_telemetry: {
            isEnabled: true,
            functionId: "stream-text",
          },
        });

        result.mergeIntoDataStream(dataStream, {
          sendReasoning: true,
        });
      },
      onError: () => {
        return "An error occurred during the chat response";
      },
    });
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  return new Response("Hello, world!");
}
