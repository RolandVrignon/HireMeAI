import React from 'react';

interface SkeletonProps {
    lines?: number;
    className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ lines = 4, className = "" }) => {
    const widths = [
        'w-[100%]', 'w-[90%]', 'w-[95%]',
        'w-[100%] h-40',
    ];

    return (
        <div className={`flex flex-col space-y-2 w-full min-w-[300px] ${className}`}>
            {Array.from({ length: lines }, (_, i) => (
                <div
                    key={i}
                    className={`${i === 3 ? 'h-40' : 'h-10'} skeleton-shine bg-gray-200 dark:bg-gray-700/40 rounded-xl ${widths[i % widths.length]}`}
                />
            ))}
        </div>
    );
};

export default Skeleton; 