import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import PromptCarousel from './PromptCarousel';

interface EmptyStateProps {
    onPromptSelect: (content: string) => void;
    onSubmit: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onPromptSelect, onSubmit }) => {
    return (
        <div className="absolute container top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
            <div className="flex flex-col items-center space-y-8">
                <div className="space-y-4 text-center">
                    <h1 className="text-xl text-foreground font-semibold">
                        Hi it's Roland's AI Assistant<br />Talk with me to know me better!
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Select a topic or ask me anything about Roland's development expertise
                    </p>
                </div>
                <PromptCarousel onPromptSelect={onPromptSelect} onSubmit={onSubmit} />
            </div>
        </div>
    );
};

export default EmptyState; 