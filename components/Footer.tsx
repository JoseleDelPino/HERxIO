
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-cc-blue-dark text-white mt-12">
            <div className="container mx-auto max-w-6xl px-4 py-8 text-center">
                <p className="font-bold text-lg">Coalición Canaria | La Victoria de Acentejo</p>
                <p className="text-gray-400 mt-2">Un plan para conectar, escuchar y avanzar juntos.</p>
                <div className="mt-4 flex justify-center space-x-6">
                    <a href="#" className="text-gray-300 hover:text-cc-yellow transition-colors">Facebook</a>
                    <a href="#" className="text-gray-300 hover:text-cc-yellow transition-colors">Instagram</a>
                    <a href="#" className="text-gray-300 hover:text-cc-yellow transition-colors">Website</a>
                </div>
                <p className="text-xs text-gray-500 mt-8">&copy; {new Date().getFullYear()} - Plan Estratégico de Marketing Digital. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
};

export default Footer;
