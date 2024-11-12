import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ReactMarkdown from 'react-markdown';
import { Weather } from "@/components/ai-components/weather";
import { Education } from "@/components/ai-components/education";
import { ClientMessage } from '@/app/actions';

interface MessageItemProps {
    message: ClientMessage,
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
    return (
        <div className={`flex container ${message.role === "user" ? "justify-end" : "justify-start"} items-end gap-2`}>
            {message.role === "assistant" && (
                <Avatar className="hidden md:flex h-8 w-8">
                    <AvatarFallback className='dark:text-foreground'>AI</AvatarFallback>
                </Avatar>
            )}
            <div className={`flex flex-col gap-10 max-w-[80%] rounded-2xl p-2 ${message.role === "user" ? "bg-blue-600 text-white dark:bg-white/15 dark:text-foreground" : "bg-gray-700/5 text-gray-700 dark:bg-white/5 dark:text-gray-200"} backdrop-blur-md markdown-body`}>
                {message.display}
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