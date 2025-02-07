import React, { useState, useEffect } from 'react';

interface Experience {
    company?: string;
    position?: string;
    startDate?: string;
    endDate?: string;
    description?: string | string[];
    technologies?: string[];
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
        <div className="space-y-6 w-full">
            {isLoading ? (
                <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
                </div>
            ) : (
                experiences.map((experience, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                        <div>
                            {experience.company && (
                                <h3 className="font-bold text-lg">{experience.company}</h3>
                            )}
                            {experience.position && (
                                <p className="text-gray-600 dark:text-gray-300">{experience.position}</p>
                            )}
                        </div>
                        {(experience.startDate || experience.endDate) && (
                            <div className="text-sm text-gray-500">
                                {experience.startDate}{experience.startDate && experience.endDate && ' - '}{experience.endDate}
                            </div>
                        )}
                    </div>
                    
                    {experience.description && (
                        <ul className="list-disc list-inside space-y-1 mb-2">
                            <li className="text-gray-700 dark:text-gray-300">
                                {typeof experience.description === 'string' 
                                    ? experience.description 
                                    : experience.description.join(' ')}
                            </li>
                        </ul>
                    )}
                    
                    {experience.technologies && experience.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {experience.technologies.map((tech, idx) => (
                                <span 
                                    key={idx} 
                                    className="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-full"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )))}
        </div>
    );
}; 