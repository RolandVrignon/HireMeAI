import React, { useEffect, useRef, useState, useCallback } from 'react';
import MessageItem from './ui/MessageItem';
import PromptCarousel from './ui/PromptCarousel';
import { ClientMessage } from '@/types/types';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { ChevronDown } from 'lucide-react';
import { Message } from 'ai';
export interface MessageListProps {
    messages: Message[];
    isLoading: boolean;
    handleSubmitPrePrompt: (content: string) => void;
    translations: any;
    isFinished: boolean;
}

const MessageList: React.FC<MessageListProps> = React.memo(({ messages, isLoading, handleSubmitPrePrompt, translations, isFinished }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});  // Pour stocker plusieurs refs
    const lastMessageRef = useRef<HTMLDivElement>(null);
    const endScrollRef = useRef<HTMLDivElement>(null);
    const endRef = useRef<HTMLDivElement>(null);
    const scrollAreaTopRef = useRef<HTMLDivElement>(null);
    const [showArrow, setShowArrow] = useState<boolean>(false);
    const [autoScrollEnabled, setAutoScrollEnabled] = useState<boolean>(true);
    const lastScrollTop = useRef<number>(0);

    const scrollToLastUserMessage = useCallback(() => {
        const container = containerRef.current;
        // Trouver le dernier message utilisateur
        const lastUserMessageId = [...messages]
            .reverse()
            .find(msg => msg.role === 'user')?.id;

        if (container && lastUserMessageId && messageRefs.current[lastUserMessageId]) {
            const messageElement = messageRefs.current[lastUserMessageId];
            const messageTop = messageElement.offsetTop;
            
            container.scrollTo({
                top: messageTop,
                behavior: 'smooth'
            });
        }
    }, [messages]);
    

    useEffect(() => {
        if (showArrow) {
            setShowArrow(false);
        }
    }, [!isLoading]);
    

    useEffect(() => {
        if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
            scrollToLastUserMessage();
        }
    }, [messages, scrollToLastUserMessage]);

    useEffect(() => {
        const viewport = containerRef.current;
        const endElement = endRef.current;
        const endScrollElement = endScrollRef.current;
        
        if (!viewport || !endElement || !endScrollElement) return;

        const handleScroll = () => {
            requestAnimationFrame(() => {
                const endRect = endElement.getBoundingClientRect();
                const endScrollRect = endScrollElement.getBoundingClientRect();
                
                setShowArrow(endRect.top < endScrollRect.top);
            });
        };

        viewport.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => {
            viewport.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const container = containerRef.current;

        if (!container) return;

        const handleScroll = () => {
            const scrollTop = container.scrollTop;

            if (scrollTop < lastScrollTop.current) {
                setAutoScrollEnabled(false);
            }

            lastScrollTop.current = scrollTop;
        };

        container.addEventListener('scroll', handleScroll);

        return () => {
            container.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToBottom = () => {
        const container = containerRef.current;
        const endElement = endRef.current;

        if (container && endElement) {
            const containerHeight = container.clientHeight;
            const endElementOffsetTop = endElement.offsetTop;
            const desiredScrollTop = endElementOffsetTop - containerHeight / 3;

            container.scrollTo({
                top: desiredScrollTop,
                behavior: 'smooth',
            });
        }
    };

    const displayMessages = [...messages];
    if (isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user') {
        displayMessages.push({
            id: 'loading-message',
            role: 'assistant',
            content: '',
            createdAt: new Date()
        });
    }

    return (
        <div className="relative h-full">
            <ScrollArea
                ref={containerRef}
                className="h-full smooth-scroll overflow-auto hide-scrollbar"
            >
                <div className="flex flex-col min-h-full">
                    <div ref={scrollAreaTopRef} className="sticky top-0 min-h-1 w-full z-[1000]" />
                    
                    <div className="flex-1 flex flex-col">
                        {messages.length > 0 && messages[messages.length - 1].role === 'user' && (
                            <div className="flex-1" />
                        )}
                        
                        <div className="flex flex-col gap-2">
                            {displayMessages.map((message: Message, index: number) => {
                                const isLastMessage = index === displayMessages.length - 1;
                                const isLastAssistantMessage = isLastMessage && message.role === 'assistant';
                                
                                return (
                                    <div
                                        key={message.id || index}
                                        ref={(el) => {
                                            if (message.id) {
                                                messageRefs.current[message.id] = el;
                                            }
                                        }}
                                    >
                                        <MessageItem 
                                            message={message} 
                                            isFirst={index === 0} 
                                            isLoading={isLoading}
                                            isLastAssistantMessage={isLastAssistantMessage}
                                            translations={translations}
                                            isFinished={isFinished}
                                            handleSubmitPrePrompt={handleSubmitPrePrompt}
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        <div ref={endScrollRef} className="h-[1px] w-full"/>
                        {messages.length > 0 && messages[messages.length - 1].role !== 'user' && (
                            <div className="flex-1 min-h-[100vh]" />
                        )}
                        <div ref={endRef} className="h-[1px] w-full sticky bottom-0"/>
                    </div>
                </div>
            </ScrollArea>

            {showArrow && (
                <button
                    onClick={() => {
                        setAutoScrollEnabled(true);
                        scrollToBottom();
                    }}
                    className="fixed bottom-4 left-1/2 z-50 transform -translate-x-1/2 h-10 w-10 p-1 flex items-center justify-center rounded-full bg-[#2457ff] dark:bg-zinc-800 text-white shadow-lg dark:hover:bg-zinc-900 hover:bg-[#3b3b3d] focus:outline-none"
                >
                    <ChevronDown />
                </button>
            )}
        </div>
    );
});

export default MessageList;
