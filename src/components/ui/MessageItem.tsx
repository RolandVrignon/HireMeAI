import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ReactMarkdown from 'react-markdown';
import { Weather } from "@/components/ai-components/weather";
import { Education } from "@/components/ai-components/education";
import { ClientMessage } from '@/app/actions';

interface MessageItemProps {
    message: ClientMessage,
    isFirst: boolean,
}   

const MessageItem: React.FC<MessageItemProps> = ({ message, isFirst }) => {

    const formattedTime = message?.date?.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });

    const role = message.role === "user" ? "Me" : "Roland AI"

    return (
        <div className={`flex ${isFirst ? "pb-2" : "py-2"} ${message.role === "user" ? "justify-end" : "justify-start"} items-end`}>
            {/* {message.role === "assistant" && (
                <Avatar className="hidden md:flex h-8 w-8">
                    <AvatarFallback className='dark:text-foreground'>AI</AvatarFallback>
                </Avatar>
            )} */}
            <div className={`flex flex-col max-w-[100%] rounded-2xl p-2 ${message.role === "user" ? "bg-blue-600 text-white dark:bg-white/15 dark:text-foreground" : "bg-gray-700/5 text-gray-700 dark:bg-white/5 dark:text-gray-200"} backdrop-blur-md markdown-body`}>
                <div>
                    {message.display}
                </div>
                { formattedTime && (
                    <div className="flex w-full justify-end font-doto text-xs mt-2">
                        {role} - {formattedTime}
                    </div>
                )}
            </div>
            {/* {message.role === "user" && (
                <Avatar className="hidden md:flex h-8 w-8">
                    <AvatarFallback className='dark:text-foreground'>U</AvatarFallback>
                </Avatar>
            )} */}
        </div>
    );
};

export default MessageItem; 