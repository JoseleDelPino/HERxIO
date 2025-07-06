import React from 'react';

const PillarCard: React.FC<{ title: string, subtitle:string, children: React.ReactNode, icon: string }> = ({ title, subtitle, children, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-cc-yellow h-full">
        <div className="flex items-center mb-3">
            <span className="text-4xl mr-4">{icon}</span>
            <div>
                <h4 className="text-lg font-bold text-cc-blue">{title}</h4>
                <p className="text-sm font-light text-gray-500">{subtitle}</p>
            </div>
        </div>
        <p className="text-gray-600 text-sm">{children}</p>
    </div>
);

const Strategies: React.FC = () => {
    return (
        <>
            <p className="text-gray-700 mb-8">La estrategia de contenidos se articulará sobre los mensajes centrales de "Ilusión" y "Alternativa", aprovechando las fortalezas del partido y abordando los desafíos. La identidad local y la herencia canaria serán pilares fundamentales.</p>
            
            <div className="mb-10">
                <h3 className="text-xl font-semibold text-cc-blue-dark mb-4">Pilares de Contenido</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <PillarCard title="1. Ilusión por el Futuro Local" subtitle="Visión Positiva y Constructiva" icon="✨">
                        Presentar propuestas concretas y viables para mejorar La Victoria, destacando una visión de progreso y bienestar. Generar esperanza y motivación.
                    </PillarCard>
                     <PillarCard title="2. Alternativa Real y Responsable" subtitle="Fiscalización y Propuestas" icon="🏛️">
                        Criticar constructivamente la gestión actual del PSOE, no solo señalando problemas sino proponiendo soluciones claras y viables.
                    </PillarCard>
                     <PillarCard title="3. Orgullo Victoriero y Canariedad" subtitle="Identidad y Comunidad" icon="💛">
                        Conectar emocionalmente con los vecinos a través de la puesta en valor de la historia, cultura y tradiciones de La Victoria de Acentejo.
                    </PillarCard>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-xl font-semibold text-cc-blue-dark mb-4">Ideas de Formatos de Contenido</h3>
                     <ul className="space-y-2 list-disc list-inside text-gray-700">
                        <li><strong>Mini-documentales locales (Reels/TikTok):</strong> Entrevistas a vecinos, comerciantes, agricultores.</li>
                        <li><strong>"Un día con nuestros Concejales" (Historias):</strong> Contenido informal mostrando el trabajo diario.</li>
                        <li><strong>Infografías y Carouseles:</strong> Simplificar datos complejos sobre la gestión municipal.</li>
                        <li><strong>Preguntas y Respuestas en Vivo (Live Q&A):</strong> Sesiones periódicas para responder a vecinos.</li>
                        <li><strong>"Desmintiendo Bulo" (Reels/Historias):</strong> Formato corto y directo para desmentir fake news.</li>
                        <li><strong>"La Voz del Pueblo" (Encuestas):</strong> Preguntas directas a la comunidad sobre problemas locales.</li>
                    </ul>
                </div>
                 <div>
                    <h3 className="text-xl font-semibold text-cc-blue-dark mb-4">Cómo Contrarrestar Noticias Falsas</h3>
                     <ul className="space-y-2 list-disc list-inside text-gray-700">
                        <li><strong>Comunicación Proactiva:</strong> Publicar información clara y verificable de forma preventiva.</li>
                        <li><strong>Estrategia de Respuesta Rápida:</strong> Protocolo de crisis para evaluar y responder en horas.</li>
                        <li><strong>Fuentes Oficiales:</strong> Citar siempre fuentes verificables al desmentir.</li>
                        <li><strong>Tono Calmado y Argumentado:</strong> Evitar la confrontación. Un tono sereno y basado en hechos es más creíble.</li>
                        <li><strong>Abordar temas sensibles:</strong> No evitar las críticas, afrontarlas con datos y propuestas.</li>
                    </ul>
                </div>
            </div>

        </>
    );
};

export default Strategies;