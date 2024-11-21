Partager


Vous avez dit :
import React, { useEffect, useRef, useState } from 'react';
import MessageItem from './ui/MessageItem';
import PromptCarousel from './ui/PromptCarousel';
import { ClientMessage } from '@/types/types';
import { ScrollArea } from '@radix-ui/react-scroll-area';

export interface MessageListProps {
    conversation: ClientMessage[];
    isLoading: boolean;
    handleSubmitPrePrompt: (content: string) => void;
    translations: any;
}

const MessageList: React.FC<MessageListProps> = ({ conversation, isLoading, handleSubmitPrePrompt, translations }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const lastMessageRef = useRef<HTMLDivElement>(null);
    const endRef = useRef<HTMLDivElement>(null);
    const [showArrow, setShowArrow] = useState<Boolean>(false);

    useEffect(() => {
        const container = containerRef.current;
        const endElement = endRef.current;

        if (!container || !endElement) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setShowArrow(!entry.isIntersecting);
            },
            { root: container, threshold: 1.0 }
        );

        observer.observe(endElement);

        return () => {
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        if (
            conversation.length > 0 &&
            conversation[conversation.length - 1].role === 'user'
        ) {
            const container = containerRef.current;
            const lastMessage = lastMessageRef.current;

            if (container && lastMessage) {
                const lastMessageOffset = conversation.length > 1 ? lastMessage.offsetTop - container.offsetTop + 8 : lastMessage.offsetTop - container.offsetTop - 8;
                console.log('lastMessageOffset:', lastMessageOffset)
                container.scrollTop = lastMessageOffset;
            }
        }
    }, [conversation]);

    const scrollToBottom = () => {
        const container = containerRef.current;
        const lastMessage = lastMessageRef.current;

        if (container && lastMessage) {
            const containerHeight = container.offsetHeight;
            const lastMessageOffset = lastMessage.offsetTop - container.offsetTop;

            const scrollPosition = lastMessageOffset - containerHeight / 2;
            container.scrollTo({ top: scrollPosition, behavior: 'smooth' });
        }
    };

    return (
        <div className="relative h-full">
            <ScrollArea ref={containerRef} className="yolo smooth-scroll flex flex-col overflow-auto h-full hide-scrollbar pb-[100vh]">
                {conversation.map((message: ClientMessage, index: number) => (
                    <div
                        key={index}
                        ref={index === conversation.length - 1 ? lastMessageRef : null}
                    >
                        <MessageItem
                            message={message}
                            isFirst={index === 0}
                        />
                    </div>
                ))}
                {!isLoading && (
                    <div className="px-1">
                        <PromptCarousel handleSubmitPrePrompt={handleSubmitPrePrompt} translations={translations} />
                    </div>
                )}
                <div ref={endRef} />
            </ScrollArea>

            {showArrow && (
                <button
                    onClick={scrollToBottom}
                    className="fixed bottom-4 right-4 w-12 h-12 p-0 flex items-center justify-center rounded-xl bg-blue-500 text-white shadow-lg hover:bg-blue-600 focus:outline-none"
                    >
                    ↓
                </button>
            )}
        </div>
    );
};

export default MessageList;
