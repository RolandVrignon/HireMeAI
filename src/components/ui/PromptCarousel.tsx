"use client"

import React, {useEffect} from 'react';
import { InfiniteMovingCards } from './infinite-moving-cards';

interface Prompt {
    title: string;
    content: string;
}

// Fonction de mélange Fisher-Yates
const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const basePrompts: Prompt[] = [
    {
        title: "💻 Technologies",
        content: "What are the main technologies and programming languages that Roland masters?"
    },
    {
        title: "🔨 Projects",
        content: "Can you tell me about Roland's most significant projects and their technical challenges?"
    },
    {
        title: "👨‍🎓 Experience",
        content: "What is Roland's professional experience in web development?"
    },
    {
        title: "🏋️‍♂️ Motivation",
        content: "What drives Roland as a developer and what are his career goals?"
    },
    {
        title: "👨‍🎓 Skills",
        content: "What are Roland's key strengths as a developer?"
    },
    {
        title: "🔨 Learning",
        content: "What is Roland's educational experience and what training has he undergone?"
    }
];

const prompts = shuffleArray(basePrompts);

interface PromptCarouselProps {
    handleSubmitPrePrompt: (content : string) => void
}

const PromptCarousel: React.FC<PromptCarouselProps> = ({ handleSubmitPrePrompt }) => {
    return (
        <InfiniteMovingCards 
            items={prompts.map(prompt => ({
                title: prompt.title,
                content: prompt.content
            }))}
            direction="left"
            speed="slow"
            pauseOnHover={false}
            handleSubmitPrePrompt={handleSubmitPrePrompt}
            className="my-4"
        />
    );
};

export default PromptCarousel;