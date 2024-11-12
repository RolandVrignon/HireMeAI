import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ReactMarkdown from 'react-markdown';
import { Weather } from "@/components/ai-components/weather";

interface MessageItemProps {
    message: {
        id: string;
        role: string;
        content: string;
        toolInvocations?: any[]; // Ajustez le type selon votre structure
    };
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
    return (
        <div className={`flex container ${message.role === "user" ? "justify-end" : "justify-start"} items-end gap-2 p-0`}>
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
    );
};

export default MessageItem; 