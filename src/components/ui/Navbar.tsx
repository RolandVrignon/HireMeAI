import React from 'react';
import { ModeToggle } from './ModeToggle';

const Navbar: React.FC = () => {
    return (
        <div className="h-[7vh] md:h-[5vh] w-full items-center justify-center bg-blue-700/5 dark:bg-white/5 backdrop-blur-md rounded-3xl">
          <div className="flex h-full items-center justify-end px-2">
            <ModeToggle/>
          </div>
        </div>
    );
};

export default Navbar; 