import React from 'react';
import { SWOT_ITEMS } from '../constants';

interface SwotCardProps {
  title: string;
  items: string[];
  bgColor: string;
  icon: React.ReactNode;
}

const SwotCard: React.FC<SwotCardProps> = ({ title, items, bgColor, icon }) => (
  <div className={`rounded-xl shadow-lg p-6 ${bgColor} flex flex-col h-full`}>
    <div className="flex items-center mb-4">
        <div className="text-3xl mr-3">{icon}</div>
        <h3 className="text-2xl font-semibold text-white">{title}</h3>
    </div>
    <ul className="space-y-2 list-disc list-inside text-white/90 flex-grow">
      {items.map((item, index) => <li key={index}>{item}</li>)}
    </ul>
  </div>
);

const SwotAnalysis: React.FC = () => {
  return (
    <div className="mt-4">
        <h3 className="text-xl font-semibold text-cc-blue-dark mb-4">Análisis DAFO Digital Específico</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SwotCard title="Fortalezas (F)" items={SWOT_ITEMS.strengths} bgColor="bg-green-600" icon={<span>&#x1F4AA;</span>} />
            <SwotCard title="Oportunidades (O)" items={SWOT_ITEMS.opportunities} bgColor="bg-sky-600" icon={<span>&#x1F31F;</span>}/>
            <SwotCard title="Debilidades (D)" items={SWOT_ITEMS.weaknesses} bgColor="bg-red-600" icon={<span>&#x1F4A6;</span>}/>
            <SwotCard title="Amenazas (A)" items={SWOT_ITEMS.threats} bgColor="bg-yellow-600" icon={<span>&#x26A0;&#xFE0F;</span>}/>
        </div>
    </div>
  );
};

export default SwotAnalysis;