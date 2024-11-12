"use client"

import React, { useEffect, useState } from 'react';
import { InfiniteMovingCards } from './infinite-moving-cards';

interface Prompt {
    title: string;
    content: string;
}

const prompts: Prompt[] = [
    {
        title: "Technologies",
        content: "What are the main technologies and programming languages that Roland masters?"
    },
    {
        title: "Projects",
        content: "Can you tell me about Roland's most significant projects and their technical challenges?"
    },
    {
        title: "Experience",
        content: "What is Roland's professional experience in web development?"
    },
    {
        title: "Motivation",
        content: "What drives Roland as a developer and what are his career goals?"
    },
    {
        title: "Skills",
        content: "What are Roland's key strengths as a developer?"
    },
    {
        title: "Learning",
        content: "How does Roland stay updated with the latest technologies?"
    }
];

interface PromptCarouselProps {
    onPromptSelect: (content: string) => void;
}

const PromptCarousel: React.FC<PromptCarouselProps> = ({ onPromptSelect }) => {
    return (
        <InfiniteMovingCards 
            items={prompts.map(prompt => ({
                title: prompt.title,
                content: prompt.content
            }))}
            direction="left"
            speed="slow"
            pauseOnHover={true}
            className="my-4"
        />
    );
};

export default PromptCarousel;