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
                    {/* <Badge variant="secondary" className='mt-4 mb-2 antique font-light bg-green-300/40 text-green-950 dark:bg-green-800/40 dark:text-green-300'>
                        {'>'}  {part.toolInvocation.toolName}()
                    </Badge> */}
                    {part.toolInvocation.toolName === 'getResume' && (
                        <>
                            <div className='mb-4'>
                                <PdfThumbnail />
                            </div>
                        </>
                    )}
                    {part.toolInvocation.toolName === 'getExperience' && part.toolInvocation?.result?.experiences.length > 0 && (
                        <>
                            <div className='mb-4'>
                                <Experiences experiences={part.toolInvocation?.args?.experiences} />
                            </div>
                        </>
                    )}
                    {part.toolInvocation.toolName === 'getWeather' && (
                        <div className='mb-4'>
                            <Weather weatherAtLocation={part.toolInvocation?.result} />
                        </div>
                    )}
                    {part.toolInvocation.toolName === 'getPhotos' && (
                        <div className='mb-4'>
                            <PhotoGrid photos={part.toolInvocation?.result?.photos} translations={translations} />
                        </div>
                    )}
                    {part.toolInvocation.toolName === 'getContact' && (
                        <div className='w-full my-2'>
                            <ContactOptions translations={translations} />
                        </div>
                    )}
                    {part.toolInvocation.toolName === 'getFootball' && part.toolInvocation?.result?.matches.length > 0 && (
                        <div className='w-full my-2'>
                            <Football matches={part.toolInvocation?.result?.matches} translations={translations} />
                        </div>
                    )}
                </>
            );
        }
        else if (part.type === 'text') {
            return <MarkdownInterpretor content={part.text} />;
        }
        return null;
    };

    return (
        <div className={`flex ${isFirst && "pb-2"} ${message.role === "user" ? "justify-end" : "justify-start"} items-end`}>
            <div className='flex flex-col w-full'>
                <div className={`flex flex-col w-[100%] rounded-2xl p-2 ${message.role === "user" ? "bg-[#2457ff] text-white dark:bg-white/15" : "bg-gray-700/5 text-gray-700 dark:bg-white/5"} dark:text-foreground backdrop-blur-md markdown-body`}>
                    <div>
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
                        <div className="flex w-full justify-end font-doto text-xs mt-2">
                            {role} - {formattedTime}
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