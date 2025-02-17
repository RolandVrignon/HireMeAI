import React, { use, useEffect } from 'react';
import { Message } from 'ai';
import { SkeletonCard } from './SkeletonCard';
import { MarkdownInterpretor } from '../ai-components/markdownInterpretor';
import { PdfThumbnail } from '../ai-components/pdfThumbnail';
import { Badge } from '@/components/ui/badge';
import { Experiences } from '../ai-components/Experiences';
import { Weather } from '../ai-components/weather';
import { PhotoGrid } from '../ai-components/PhotoGrid';
import ContactOptions from './ContactOptions';
import PromptCarousel from './PromptCarousel';
import Football from '../ai-components/Football';
import { Locations } from '../ai-components/Locations';
export interface MessageItemProps {
    message: Message;
    isFirst: boolean;
    isLoading: boolean;
    isLastAssistantMessage: boolean;
    translations: any;
    isFinished: boolean;
    handleSubmitPrePrompt: (content: string) => void;
}

const MessageItem: React.FC<MessageItemProps> = React.memo(({ message, isFirst, isLoading, isLastAssistantMessage, translations, isFinished, handleSubmitPrePrompt }) => {
    const formattedTime = message?.createdAt?.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });

    const role = message.role === "user" ? "Me" : process.env.NEXT_PUBLIC_ASSISTANT_NAME;

    const renderPart = (part: any) => {
        if (part.type === 'tool-invocation') {

            return (
                <>
                    {part.toolInvocation.toolName === 'getResume' && (
                        <div className='w-full'>
                            <PdfThumbnail />
                        </div>
                    )}
                    {part.toolInvocation.toolName === 'getExperience' && part.toolInvocation?.result?.experiences.length > 0 && (
                        <div className='w-full'>
                            <Experiences experiences={part.toolInvocation?.args?.experiences} />
                        </div>
                    )}
                    {part.toolInvocation.toolName === 'getWeather' && (
                        <div className='w-full'>
                            <Weather weatherAtLocation={part.toolInvocation?.result} />
                        </div>
                    )}
                    {part.toolInvocation.toolName === 'getLocation' && (
                        <div className='w-full'>
                            <Locations locations={part.toolInvocation?.result?.cities} handleSubmitPrePrompt={handleSubmitPrePrompt} />
                        </div>
                    )}
                    {part.toolInvocation.toolName === 'getPhotos' && (
                        <div className='w-full'>
                            <PhotoGrid photos={part.toolInvocation?.result?.photos} translations={translations} />
                        </div>
                    )}
                    {part.toolInvocation.toolName === 'getContact' && (
                        <div className='w-full'>
                            <ContactOptions translations={translations} />
                        </div>
                    )}
                    {part.toolInvocation.toolName === 'getFootball' && part.toolInvocation?.result?.matches.length > 0 && (
                        <div className='w-full'>
                            <Football matches={part.toolInvocation?.result?.matches} translations={translations} />
                        </div>
                    )}
                </>
            );
        }
        else if (part.type === 'text') {
            return (
                <div className='w-full'>
                    <MarkdownInterpretor content={part.text} />
                </div>
            )
        }
        return null;
    };

    return (
        <div className={`flex ${isFirst && "pb-2"} ${message.role === "user" ? "justify-end" : "justify-start"} items-end`}>
            <div className='flex flex-col w-full'>
                <div className={`flex flex-col w-[100%] rounded-2xl p-2 ${message.role === "user" ? "bg-[#2457ff] text-white dark:bg-white/15" : "bg-gray-700/5 text-gray-700 dark:bg-white/5"} dark:text-foreground backdrop-blur-md markdown-body`}>
                    <div className='flex flex-col gap-2'>
                        {isLoading && isLastAssistantMessage && message.role === 'assistant' ? (
                            <SkeletonCard />
                        ) : (
                            message.parts?.map((part, index) => (
                                <React.Fragment key={index}>
                                    {renderPart(part)}
                                </React.Fragment>
                            ))
                        )}
                    </div>
                    {formattedTime && (
                        <div className="flex w-full gap-2 justify-end font-doto font-bold text-xs mt-2">
                            <span>{role}</span>
                            <span className="text-[#2457ff] dark:text-yellow-500">{formattedTime}</span>
                        </div>
                    )}
                </div>
                {(isFinished && message.role !== 'user' && isLastAssistantMessage) && (
                    <div className="w-full mt-3">
                        <PromptCarousel handleSubmitPrePrompt={handleSubmitPrePrompt} translations={translations} />
                    </div>
                )}
            </div>
        </div>
    );
});

export default MessageItem;