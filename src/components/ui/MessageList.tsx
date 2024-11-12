import React, { useEffect, useRef } from 'react';
import { Message } from 'ai/react';
import MessageItem from './MessageItem';
import PromptCarousel from './PromptCarousel';

interface MessageListProps {
    messages: Message[];
    onPromptSelect: (content: string) => void;
    onSubmit: () => void;
    isLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, onPromptSelect, onSubmit, isLoading }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [autoScroll, setAutoScroll] = React.useState(true);
    const lastScrollTop = useRef(0);

    const scrollToBottom = () => {
        if (autoScroll && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleScroll = () => {
        if (containerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
            const isScrollingUp = scrollTop < lastScrollTop.current;
            const isNearBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 100;

            if (isScrollingUp) {
                setAutoScroll(false);
            }

            if (isNearBottom) {
                setAutoScroll(true);
            }

            lastScrollTop.current = scrollTop;
        }
    };

    return (
        <div
            ref={containerRef}
            onScroll={handleScroll}
            className="flex flex-col space-y-4 pt-[9vh] md:pt-[5vh] pb-[30vh] overflow-y-auto h-full"
        >
            {messages.map((message) => (
                <MessageItem key={message.id} message={message} />
            ))}
            {!isLoading && (
                <div className="container">
                    <PromptCarousel onPromptSelect={onPromptSelect} onSubmit={onSubmit} />
                </div>
            )
            }
            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList; 