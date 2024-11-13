import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import PromptCarousel from './PromptCarousel';

interface EmptyStateProps {
    handleSubmitPrePrompt: (content: string) => void
}

const EmptyState: React.FC<EmptyStateProps> = ({ handleSubmitPrePrompt }) => {
    return (
        <div className="h-full w-full flex flex-col items-center justify-center px-4 gap-2">
            <h1 className="text-xl text-center text-foreground font-semibold">
                Hi it's Roland's AI Assistant<br />Talk with me to know me better!
            </h1>
            <p className="text-sm text-center text-muted-foreground">
                Select a topic or ask me anything about Roland's development expertise
            </p>
            <div className="container">
                <PromptCarousel handleSubmitPrePrompt={handleSubmitPrePrompt} />
            </div>
        </div>
    );
};

export default EmptyState; 