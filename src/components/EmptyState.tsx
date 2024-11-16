import React from 'react';
import PromptCarousel from './ui/PromptCarousel';

interface EmptyStateProps {
    handleSubmitPrePrompt: (content: string) => void,
    translations: any,
}

const EmptyState: React.FC<EmptyStateProps> = ({ handleSubmitPrePrompt, translations }) => {
    return (
        <div className="h-full w-full flex flex-col items-center justify-center px-4 gap-2">
            <h1 className="text-xl text-center text-foreground font-semibold">
                {translations.title}
            </h1>
            <p className="text-sm text-center text-muted-foreground">
                {translations.description}
            </p>
            <div className="container">
                <PromptCarousel handleSubmitPrePrompt={handleSubmitPrePrompt} translations={translations}/>
            </div>
        </div>
    );
};

export default EmptyState; 