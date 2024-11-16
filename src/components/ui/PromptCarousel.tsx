"use client"

import React, { useEffect, useState } from 'react';
import { InfiniteMovingCards } from './infinite-moving-cards';
import { Prompt } from "@/types/types"

const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

interface PromptCarouselProps {
    handleSubmitPrePrompt: (content: string) => void;
    translations: any;
}

const PromptCarousel: React.FC<PromptCarouselProps> = ({ handleSubmitPrePrompt, translations }) => {

    const [prompts, setPrompts] = useState<Prompt[]>([]);

    useEffect(() => {
        setPrompts(shuffleArray(translations.questions || []))
    }, [translations])

    return (
        <InfiniteMovingCards 
            items={prompts.map(prompt => ({
                title: prompt.title,
                content: prompt.content
            }))}
            direction="right"
            speed="normal"
            pauseOnHover={false}
            handleSubmitPrePrompt={handleSubmitPrePrompt}
        />
    );
};

export default PromptCarousel;
