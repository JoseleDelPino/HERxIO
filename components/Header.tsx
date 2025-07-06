import React from 'react';

interface HeaderProps {
    onMenuToggle: () => void;
    isMenuOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMenuOpen }) => {
    return (
        <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50 border-b border-slate-200">
            <div className="container mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="bg-cc-yellow w-10 h-10 rounded-full flex items-center justify-center shadow-inner">
                        <span className="text-cc-blue-dark font-black text-xl">CC</span>
                    </div>
                    <span className="text-lg font-bold text-cc-blue-dark hidden sm:inline">Plan Estratégico</span>
                </div>
                <div className="md:hidden">
                    <button onClick={onMenuToggle} className="text-cc-blue-dark focus:outline-none z-50 relative">
                         <span className="sr-only">Abrir menú</span>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                            )}
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;