import React from 'react';
import { ModeToggle } from './ModeToggle';

const Navbar: React.FC = () => {
    return (
        <div className="h-[7vh] md:h-[5vh] w-full absolute top-0 z-30 items-center justify-center backdrop-blur-md">
          <div className="container flex h-full items-center justify-end">
            <ModeToggle/>
          </div>
        </div>
    );
};

export default Navbar; 