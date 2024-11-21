import React, { useEffect, useRef, useState } from 'react';
import MessageItem from './ui/MessageItem';
import PromptCarousel from './ui/PromptCarousel';
import { ClientMessage } from '@/types/types';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { ChevronDown } from 'lucide-react'
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
    const [showArrow, setShowArrow] = useState<boolean>(false);

    // Observer pour détecter si endRef est visible
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

    // Auto-scroll lors de la mise à jour de la conversation
    useEffect(() => {

        if (conversation.length > 0 && conversation[conversation.length - 1].role === 'user') {
            console.log('conversation[conversation.length - 1]:', conversation[conversation.length - 1]);
            const container = containerRef.current;
            const lastMessage = lastMessageRef.current;

            if (container && lastMessage) {
                const lastMessageOffset = conversation.length > 1 ? lastMessage.offsetTop - container.offsetTop + 8 : lastMessage.offsetTop - container.offsetTop - 8;
                container.scrollTop = lastMessageOffset;
            }
        }
    }, [conversation]);

    // Fonction pour faire défiler jusqu'à endRef et le centrer
    const scrollToBottom = () => {
        const container = containerRef.current;
        const endElement = endRef.current;

        if (container && endElement) {
            // Calculer la position pour centrer endRef
            const containerHeight = container.clientHeight;
            const endElementOffsetTop = endElement.offsetTop;
            const desiredScrollTop = endElementOffsetTop - containerHeight / 2;

            container.scrollTo({
                top: desiredScrollTop,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div className="relative h-full">
            <ScrollArea
                ref={containerRef}
                className={`smooth-scroll flex flex-col overflow-auto h-full hide-scrollbar pb-[100vh]`}
            >
                {conversation.map((message: ClientMessage, index: number) => (
                    <div
                        key={index}
                        ref={index === conversation.length - 1 ? lastMessageRef : null}
                    >                        <MessageItem
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
                    className="fixed bottom-4 left-1/2 z-50 transform -translate-x-1/2 h-10 w-10 p-1 flex items-center justify-center rounded-full bg-blue-600 dark:bg-zinc-800 text-white shadow-lg dark:hover:bg-zinc-900 hover:bg-blue-700 focus:outline-none"
                    >
                    <ChevronDown />
                </button>
            )}
        </div>
    );
};

export default MessageList;
