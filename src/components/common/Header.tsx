import React from 'react';
import Synopdle_Logo from '../../assets/s_logo_white.png';

const Header: React.FC = () => {
    return (
        <header className="flex justify-between text-white py-4 px-6">
            <div className="flex items-center">
                <img src={Synopdle_Logo} alt="Synopdle Logo" className="w-10 h-10 mr-2" />
                <h1 className="text-2xl font-extrabold leading-none tracking-tight text-white">Synopdle</h1>
            </div>
        </header>
    );
    
};

export default Header;