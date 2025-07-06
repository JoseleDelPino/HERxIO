import React, { useState, useCallback } from 'react';
import { generateMarketingIdea } from '../services/geminiService';

const IdeaGenerator: React.FC = () => {
    const [topic, setTopic] = useState<string>('actividades para jóvenes');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [idea, setIdea] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleGenerateIdea = useCallback(async () => {
        if (!topic) {
            setError('Por favor, introduce un tema para generar la idea.');
            return;
        }
        setIsLoading(true);
        setError('');
        setIdea('');
        try {
            const result = await generateMarketingIdea(topic);
            setIdea(result);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Ocurrió un error inesperado.");
            }
        } finally {
            setIsLoading(false);
        }
    }, [topic]);
    
    // Check if the API key is missing. If so, don't render the component.
    if (!process.env.API_KEY) {
        return <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md">
            <p className="font-bold">Función no disponible</p>
            <p>El generador de ideas con IA no está configurado. Se requiere una API Key.</p>
        </div>;
    }

    return (
        <div className="bg-cc-blue-dark p-6 md:p-8 rounded-xl shadow-2xl text-white">
            <p className="text-center text-lg mb-2 text-gray-300">¿Necesitas inspiración? Introduce un tema y deja que la IA cree una propuesta de campaña.</p>
            <p className="text-center text-sm mb-6 text-gray-400">Ejemplos: "apoyo al comercio local", "mejora de parques", "sostenibilidad".</p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Introduce un tema..."
                    className="w-full px-4 py-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-cc-yellow focus:outline-none transition"
                    disabled={isLoading}
                />
                <button
                    onClick={handleGenerateIdea}
                    className="bg-cc-yellow text-cc-blue-dark font-bold px-8 py-3 rounded-md hover:bg-yellow-300 transition-colors duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-cc-blue-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generando...
                        </>
                    ) : (
                        'Generar Idea'
                    )}
                </button>
            </div>

            {error && <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-md text-center">{error}</div>}
            
            {idea && (
                <div className="mt-8 p-6 bg-gray-800/50 rounded-lg border border-gray-700 animate-fade-in">
                    <h4 className="text-xl font-bold text-cc-yellow mb-4">Propuesta de Campaña Generada</h4>
                    <pre className="whitespace-pre-wrap font-sans text-gray-300">{idea}</pre>
                </div>
            )}
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default IdeaGenerator;