import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ReactMarkdown from 'react-markdown';
import { Weather } from "@/components/ai-components/weather";
import { Education } from "@/components/ai-components/education";

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
        <div className={`flex container ${message.role === "user" ? "justify-end" : "justify-start"} items-end gap-2`}>
            {message.role === "assistant" && (
                <Avatar className="hidden md:flex h-8 w-8">
                    <AvatarFallback className='dark:text-foreground'>AI</AvatarFallback>
                </Avatar>
            )}
            { message.content !== "" && (
                <div className={`flex flex-col gap-10 max-w-[80%] rounded-2xl px-4 py-2 ${message.role === "user" ? "bg-blue-600 text-white dark:bg-white/15 dark:text-foreground" : "bg-gray-700/5 text-gray-700 dark:bg-white/5 dark:text-gray-200"} backdrop-blur-md markdown-body`}>
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
            )
            }

            <div className="flex flex-col gap-8">
            {message.toolInvocations?.map(toolInvocation => {
                    const { toolName, toolCallId, state } = toolInvocation;

                    if (state === 'result' && toolName === 'displayWeather') {
                        const { result } = toolInvocation;
                        return (
                            <div key={toolCallId}>
                                <Weather {...result} />
                            </div>
                        );
                    } else if (state === 'result' && toolName === 'displayEducation') {
                        const { result } = toolInvocation;
                        console.log('result:', result);
                        return (
                            <div key={toolCallId} className='flex flex-col gap-10 bg-red-700'>
                                <Education {...result} />
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