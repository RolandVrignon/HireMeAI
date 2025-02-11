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
            <div className="w-[70%] relative">
                <Image
                    src={resolvedTheme === 'dark' ? "/images/me-light-mode.png" : "/images/me-blue-mode.png"}
                    alt="Me"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-auto mb-10"
                    priority
                />
            </div>
            <p className="text-sm text-center text-muted-foreground">
                {typeof translations.description === 'string' && translations.description.includes('\n') 
                    ? translations.description.split('\n').map((line: string, index: number) => (
                        <React.Fragment key={index}>
                            {line}
                            {index < translations.description.split('\n').length - 1 && (
                                <>
                                    <br />
                                    <br />
                                </>
                            )}
                        </React.Fragment>
                    ))
                    : translations.description}
            </p>
            <div className="container">
                <PromptCarousel handleSubmitPrePrompt={handleSubmitPrePrompt} translations={translations}/>
            </div>
        </div>
    );
};

export default EmptyState;