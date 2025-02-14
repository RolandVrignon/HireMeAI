import React, { useState, useEffect } from 'react';
import { Tilt } from '../ui/tilt';
import { LinkPreview } from '../ui/link-preview';
interface Experience {
    company?: string;
    position?: string;
    startDate?: string;
    endDate?: string;
    description?: string | string[];
    technologies?: string[];
    website?: string;
}

interface ExperiencesProps {
    experiences: Experience[];
}

export const Experiences: React.FC<ExperiencesProps> = ({ experiences }) => {

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (experiences && experiences.length > 0) {
        console.log('experiences:', experiences)

            setIsLoading(false);
        }
    }, [experiences]);

    return (
        <div className="space-y-2 w-full">
            {isLoading ? (
                <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
                </div>
            ) : (
                experiences.map((experience, index) => (
                    <Tilt key={index} className="relative rounded-lg p-2 dark:bg-white/5 text-gray-700 dark:text-white backdrop-blur-md">
                        <div className="flex justify-between items-start mb-2">
                        <div>
                            {experience.company && (
                                <p className="font-bold text-lg">{experience.company}</p>
                            )}
                            {experience.position && (
                                <p className="text-gray-600 dark:text-gray-300">{experience.position}</p>
                            )}
                            {experience.website && (
                                <LinkPreview url={experience.website} className='font-doto text-xs text-gray-600 dark:text-gray-300'>{experience.website}</LinkPreview>
                            )}
                        </div>
                        {(experience.startDate || experience.endDate) && (
                            <div className="absolute text-xs top-2 right-2">
                                {experience.startDate}{experience.startDate && experience.endDate && ' - '}{experience.endDate}
                            </div>
                        )}
                    </div>
                </Tilt>
            )))}
        </div>
    );
}; 