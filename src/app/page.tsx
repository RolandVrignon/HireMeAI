"use client";

import { useChat } from 'ai/react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Weather } from "@/components/weather";
import { ModeToggle } from '@/components/ui/theme-switch';
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <AuroraBackground>
      <div className="flex flex-col h-screen w-full z-40">

        <div className="h-[7vh] md:h-[5vh] w-full absolute top-0 z-30 items-center justify-center backdrop-blur-md">
          <div className="container flex h-full items-center justify-end">
            <ModeToggle/>
          </div>
        </div>

        <div className="h-screen w-full flex-grow overflow-hidden">
          <div className="h-full overflow-y-auto" style={{ paddingBottom: '5vh' }}>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full space-y-8">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="text-foreground">👋</AvatarFallback>
                  </Avatar>
                  <h1 className="text-xl text-center text-foreground font-semibold">
                    Hi it's Roland's AI Assistant<br />Talk with me to know me better!
                  </h1>
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-4 pt-[9vh] md:pt-[5vh] pb-[30vh]">
                {messages.map((message) => (
                  <div key={message.id} className={`flex container ${message.role === "user" ? "justify-end" : "justify-start"} items-end gap-2 p-0`}>
                    {message.role === "assistant" && (
                      <Avatar className="hidden md:flex h-8 w-8">
                        <AvatarFallback className='dark:text-foreground'>AI</AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${message.role === "user" ? "bg-black/15 dark:bg-white/15 text-foreground" : "bg-black/5 dark:bg-white/5 text-foreground"} backdrop-blur-md markdown-body`}>
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                      {message.toolInvocations?.map(toolInvocation => {
                        const { toolName, toolCallId, state } = toolInvocation;

                        if (state === 'result' && toolName === 'displayWeather') {
                          const { result } = toolInvocation;
                          return (
                            <div key={toolCallId}>
                              <Weather {...result} />
                            </div>
                          );
                        } else if (toolName === 'displayWeather' && state !== 'result') {
                          return <div key={toolCallId}>Loading weather...</div>;
                        }
                        return null;
                      })}
                    </div>
                    {message.role === "user" && (
                      <Avatar className="hidden md:flex h-8 w-8">
                        <AvatarFallback className='dark:text-foreground'>U</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="h-[10vh] w-full absolute bg-red-50/5 bottom-0  backdrop-blur-md items-center justify-center">
          <form onSubmit={handleSubmit} className="container p-0 w-full h-full flex items-center">
            <div className="max-w-4xl w-full mx-auto flex items-center gap-2">
              <Input
                className="flex-grow bg-zinc-800 text-white placeholder-zinc-400 rounded-xl"
                placeholder="Type a message..."
                value={input}
                onChange={handleInputChange}
              />
              <Button
                size="icon"
                className="bg-zinc-800 hover:bg-zinc-700 text-white"
                type="submit"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AuroraBackground>
  );
}
