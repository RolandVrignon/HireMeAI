import React, { useEffect, useRef } from 'react';
import { Message } from 'ai/react';
import MessageItem from './MessageItem';
import PromptCarousel from './PromptCarousel';
import { ClientMessage } from '@/app/actions';

interface MessageListProps {
    conversation: any,
    isLoading: boolean,
    handleSubmitPrePrompt: (content : string) => void
}

const MessageList: React.FC<MessageListProps> = ({ conversation, isLoading, handleSubmitPrePrompt}) => {
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
    }, [conversation, isLoading]);

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
            {conversation.map((message: ClientMessage) => (
                <MessageItem message={message} />
            ))}
            { !isLoading && (
                <div className="container">
                    <PromptCarousel handleSubmitPrePrompt={handleSubmitPrePrompt} />
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList; 