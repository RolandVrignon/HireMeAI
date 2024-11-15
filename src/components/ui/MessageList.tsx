import React, { useEffect, useRef } from 'react';
import { Message } from 'ai/react';
import MessageItem from './MessageItem';
import PromptCarousel from './PromptCarousel';
import { ClientMessage } from '../../app/actions';

interface MessageListProps {
    conversation: any,
    isLoading: boolean,
    handleSubmitPrePrompt: (content : string) => void,
    translations: any,
}

const MessageList: React.FC<MessageListProps> = ({ conversation, isLoading, handleSubmitPrePrompt, translations}) => {
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
        console.log('conversation:', conversation)
    }, [conversation])

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
            className="flex flex-col overflow-auto h-full hide-scrollbar pb-[30vh]"
        >
            {conversation.map((message: ClientMessage, index: number) => (
                <MessageItem 
                    key={index} 
                    message={message} 
                    isFirst={index === 0}
                />
            ))}
            { !isLoading && (
                <div className="px-1">
                    <PromptCarousel handleSubmitPrePrompt={handleSubmitPrePrompt} translations={translations} />
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList;
