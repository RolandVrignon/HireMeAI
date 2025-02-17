import { useEffect, useState } from 'react';
import { Tilt } from '@/components/ui/tilt';

interface LocationsProps {
    locations: string[];
    handleSubmitPrePrompt: (location: string) => void;
}

export const Locations: React.FC<LocationsProps> = ({ locations, handleSubmitPrePrompt}) => {

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (locations && locations.length > 0) {
            setIsLoading(false);
        }
    }, [locations]);

    return (
        <div className='w-full'>
            {isLoading ? (
                <div className='grid grid-cols-2 gap-2'>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className='p-2 rounded-md bg-gray-700/5 dark:bg-white/5'>Loading...</div>
                    ))}
                </div>
            ) : (
                <div className='grid grid-cols-2 gap-2'>
                    {locations.map((location) => (
                        <Tilt rotationFactor={10} key={location} className='rounded-md bg-gray-700/5 dark:bg-white/5'>
                            <div
                                className='p-2 hover:cursor-pointer'
                                onClick={() => handleSubmitPrePrompt(location)}
                            >
                                {location}
                            </div>
                        </Tilt>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Locations;