import React from 'react';
import { Typewriter } from './typewriter';

interface TypewriterTitleProps {
    name?: string;
    className?: string;
    translations: any;
}

const TypewriterTitle: React.FC<TypewriterTitleProps> = ({ name = process.env.NEXT_PUBLIC_ASSISTANT_NAME, className, translations }) => {
    
    const text = translations.typewriter;
    
    return (
        <div className="flex flex-col font-doto">
            <div className="flex dark:text-white text-gray-700">
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
