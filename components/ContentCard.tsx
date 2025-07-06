import React from 'react';

interface ContentCardProps {
    id: string;
    icon: string;
    title: string;
    children: React.ReactNode;
}

const ContentCard: React.FC<ContentCardProps> = ({ id, icon, title, children }) => {
    return (
        <div id={id} className="scroll-mt-24 bg-white rounded-2xl border border-cc-light-blue shadow-sm">
            <div className="px-6 py-4 md:px-8 md:py-5 border-b border-cc-light-blue bg-gradient-to-b from-slate-50 to-white/50 rounded-t-2xl">
                <h2 className="text-xl md:text-2xl font-bold text-cc-blue-dark flex items-center">
                    <span className="text-2xl md:text-3xl mr-3">{icon}</span>
                    <span className="uppercase tracking-wider">{title}</span>
                </h2>
            </div>
            <div className="p-6 md:p-8">
                {children}
            </div>
        </div>
    );
};

export default ContentCard;
