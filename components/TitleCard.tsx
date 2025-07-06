import React from 'react';

const TitleCard: React.FC = () => {
    return (
        <div className="bg-white rounded-2xl border border-cc-light-blue shadow-sm p-8 md:p-12 text-center">
            <h1 className="text-3xl md:text-5xl font-black text-cc-blue-dark uppercase tracking-wide">
                Plan Estratégico de Marketing Digital Integral
            </h1>
            <div className="mt-4 mb-6">
                <span className="inline-block w-20 h-1.5 bg-cc-primary-blue rounded-full"></span>
                <span className="inline-block w-12 h-1.5 bg-cc-yellow rounded-full -ml-2"></span>
            </div>
            <h2 className="text-lg md:text-xl font-semibold text-cc-blue-dark/80">
                PARA COALICIÓN CANARIA DE LA VICTORIA DE ACENTEJO
            </h2>
            <div className="mt-8 flex justify-center items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-cc-yellow"></div>
                <div className="w-4 h-4 rounded-full bg-cc-primary-blue"></div>
                <div className="w-4 h-4 rounded-full bg-sky-300"></div>
            </div>
        </div>
    );
};

export default TitleCard;
