import Image from 'next/image';
import React from 'react';
import { useTheme } from 'next-themes';
import PromptCarousel from './ui/PromptCarousel';
import TypewriterTitle from './ui/typewritertitle';
import { UIInterface } from '@/types/types';

interface EmptyStateProps {
    handleSubmitPrePrompt: (content: string) => void,
    translations: any,
    ui: UIInterface
}

const EmptyState: React.FC<EmptyStateProps> = ({ handleSubmitPrePrompt, translations, ui }) => {

    return (
        <div className="h-full w-full flex flex-col items-start justify-center px-4 gap-2">
            <div className="w-[100%] relative">
                <Image
                    src="/images/me-light-mode.png"
                    alt="Me"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-auto mb-2 block dark:hidden"
                    priority
                />
                <Image
                    src="/images/me-dark-mode.png" 
                    alt="Me"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-auto mb-2 hidden dark:block"
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