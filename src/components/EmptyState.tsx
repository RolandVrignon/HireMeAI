import Image from 'next/image';
import React from 'react';
import { useTheme } from 'next-themes';
import PromptCarousel from './ui/PromptCarousel';

interface EmptyStateProps {
    handleSubmitPrePrompt: (content: string) => void,
    translations: any,
}

const EmptyState: React.FC<EmptyStateProps> = ({ handleSubmitPrePrompt, translations }) => {
    const { theme, resolvedTheme } = useTheme();
    
    return (
        <div className="h-full w-full flex flex-col items-center justify-center px-4 gap-2">
            <div className="w-[100%] relative">
                <Image
                    src={"/images/me-dark-mode.png"}
                    alt="Me"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-auto mb-2"
                    priority
                />
            </div>
            <div className="container">
                <PromptCarousel handleSubmitPrePrompt={handleSubmitPrePrompt} translations={translations}/>
            </div>
        </div>
    );
};

export default EmptyState;