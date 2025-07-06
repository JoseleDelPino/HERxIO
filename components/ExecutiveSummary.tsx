import React from 'react';
import ContentCard from './ContentCard';

const PlatformSubCard: React.FC<{ icon: string, name: string }> = ({ icon, name }) => (
    <div className="bg-white p-4 rounded-lg text-center shadow-sm border border-slate-200">
        <span className="text-4xl">{icon}</span>
        <p className="mt-2 font-semibold text-cc-blue-dark text-sm">{name}</p>
    </div>
);

const ExecutiveSummary: React.FC = () => {
    return (
        <ContentCard id="resumen" title="Resumen Ejecutivo" icon="📄">
            <p className="text-gray-700 leading-relaxed">
                Este plan estratégico de marketing digital busca transformar la presencia online de Coalición Canaria de La Victoria de Acentejo, pasando de una baja interacción a una plataforma dinámica y atractiva que movilice a votantes y capte nuevos afiliados.
            </p>
            <p className="mt-4 text-gray-700 leading-relaxed">
                Con un enfoque en la <span className="bg-cc-light-yellow px-1.5 py-0.5 rounded-md font-semibold text-gray-800">eficiencia de recursos limitados</span>, se propone una estrategia basada en la autenticidad local, la fiscalización constructiva y la conexión emocional con los vecinos.
            </p>

            <div className="mt-6 p-4 bg-slate-100/70 rounded-lg border border-slate-200">
                <h3 className="font-semibold text-cc-blue-dark flex items-center mb-2"><span className="text-xl mr-2">💡</span> Mensajes Clave</h3>
                 <div className="flex flex-wrap gap-3">
                    <span className="px-4 py-1.5 text-sm font-bold rounded-full bg-cc-yellow text-cc-blue-dark shadow">Ilusión</span>
                    <span className="px-4 py-1.5 text-sm font-bold rounded-full bg-cc-primary-blue text-white shadow">Alternativa</span>
                </div>
            </div>

            <p className="mt-6 text-gray-700 leading-relaxed">
                Los mensajes clave de "Ilusión" y "Alternativa" se integrarán en todos los contenidos, contrarrestando la percepción negativa y las noticias falsas.
            </p>
            
            <div className="mt-6 p-4 bg-cc-light-yellow rounded-lg border border-yellow-200">
                <h3 className="font-semibold text-yellow-900 flex items-center mb-3"><span className="text-xl mr-2">🎯</span> Objetivos Principales</h3>
                <ul className="space-y-1.5">
                    <li className="flex items-center text-yellow-800"><span className="w-2 h-2 rounded-full bg-yellow-500 mr-3"></span>Mejorar significativamente los resultados electorales en 2027</li>
                    <li className="flex items-center text-yellow-800"><span className="w-2 h-2 rounded-full bg-yellow-500 mr-3"></span>Aumentar la visibilidad en redes sociales</li>
                    <li className="flex items-center text-yellow-800"><span className="w-2 h-2 rounded-full bg-yellow-500 mr-3"></span>Consolidar una marca política sólida a largo plazo</li>
                </ul>
            </div>
            
             <div className="mt-6 p-4 bg-cc-light-blue rounded-lg border border-sky-200">
                <h3 className="font-semibold text-sky-900 flex items-center mb-3"><span className="text-xl mr-2">📲</span> Plataformas Prioritarias</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                    <PlatformSubCard icon="📘" name="Facebook" />
                    <PlatformSubCard icon="📸" name="Instagram" />
                    <PlatformSubCard icon="💬" name="WhatsApp/Telegram" />
                </div>
            </div>

        </ContentCard>
    );
};

export default ExecutiveSummary;
