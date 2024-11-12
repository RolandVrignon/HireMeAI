import React, { useEffect, useRef } from 'react';
import { Message } from 'ai/react';
import MessageItem from './MessageItem';

interface MessageListProps {
    messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
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
            className="flex container flex-col space-y-4 pt-[9vh] md:pt-[5vh] pb-[30vh] overflow-y-auto h-full"
        >
            {messages.map((message) => (
                <MessageItem key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList; 