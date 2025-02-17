import React from 'react';
import { Typewriter } from './typewriter';

interface TypewriterTitleProps {
    name?: string;
    className?: string;
    translations: any;
}

const TypewriterTitle: React.FC<TypewriterTitleProps> = ({ name = process.env.NEXT_PUBLIC_ASSISTANT_NAME, className, translations }) => {
    
    const text = [
        "code dreams into reality",
        "build the future, one line at a time",
        "crafting digital symphonies",
        "transform chaos into elegance",
        "unlocking the power of imagination",
        "tinkering with code to create magic",
        "solve problems with creativity",
        "turning coffee into code",
        "exploring endless possibilities",
        "designing experiences that matter",
        "making the impossible possible",
        "creating solutions that feel like art",
        "hacking my way to innovation",
        "writing the future in code",
        "embracing failure as fuel for growth",
        "code, collaborate, innovate",
        "building bridges in the digital world",
        "inspired by challenges, driven by passion",
        "thinking outside the algorithm",
        "the world is my IDE"
    ];
    
    return (
        <div className="flex flex-col font-doto">
            <div className="flex dark:text-white text-gray-700 font-bold">
                {name}
                <span className="ml-1">© {new Date().getFullYear()}</span>
            </div>
            <Typewriter
                text={text}
                speed={70}
                className={`dark:text-yellow-500 text-[#2457ff] ${className || ''}`}
                waitTime={1500}
                deleteSpeed={40}
                cursorChar={"_"}
            />
        </div>
    );
};

export default TypewriterTitle;
