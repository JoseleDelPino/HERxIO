import React from 'react';

interface PersonaCardProps {
    icon: string;
    title: string;
    demographics: string;
    interests: string[];
    concerns: string[];
    media: string;
    objections: string;
    message: string;
}

const PersonaCard: React.FC<PersonaCardProps> = ({ icon, title, demographics, interests, concerns, media, objections, message }) => (
    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col h-full transform hover:-translate-y-2 transition-transform duration-300 border border-slate-200">
        <div className="flex items-center mb-4">
            <span className="text-5xl mr-4">{icon}</span>
            <div>
                <h4 className="text-xl font-bold text-cc-blue">{title}</h4>
                <p className="text-sm text-gray-500">{demographics}</p>
            </div>
        </div>
        <div className="space-y-3 text-sm text-gray-700 flex-grow">
            <p><strong>Intereses:</strong> {interests.join(', ')}.</p>
            <p><strong>Preocupaciones:</strong> {concerns.join(', ')}.</p>
            <p><strong>Consume:</strong> {media}.</p>
            <p><strong>Objeciones:</strong> {objections}</p>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 font-semibold">Mensaje Clave:</p>
            <p className="text-sm font-bold text-cc-blue-dark text-center italic">"{message}"</p>
        </div>
    </div>
);


const TargetAudience: React.FC = () => {
    return (
        <>
             <p className="text-gray-700 mb-6">Para una estrategia digital efectiva con recursos limitados, es crucial segmentar y entender a quién nos dirigimos. La clave es la conexión local y la relevancia de los mensajes.</p>

            <div className="mb-10">
                <h3 className="text-xl font-semibold text-cc-blue-dark mb-4">Segmentos de Votantes Clave</h3>
                <div className="flex flex-wrap gap-3 text-sm">
                    <div className="bg-slate-100 px-3 py-1 rounded-full shadow-sm">Jóvenes (18-35)</div>
                    <div className="bg-slate-100 px-3 py-1 rounded-full shadow-sm">Familias (30-55)</div>
                    <div className="bg-slate-100 px-3 py-1 rounded-full shadow-sm">Autónomos</div>
                    <div className="bg-slate-100 px-3 py-1 rounded-full shadow-sm">Mayores (65+)</div>
                    <div className="bg-slate-100 px-3 py-1 rounded-full shadow-sm">Indecisos</div>
                </div>
            </div>

            <div>
                 <h3 className="text-xl font-semibold text-cc-blue-dark mb-4">Buyer Personas Detalladas</h3>
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <PersonaCard 
                        icon="👩‍🎓"
                        title='"La Joven Conectada"'
                        demographics="Ana, 24 años. Estudiante/Recién graduada."
                        interests={["Sostenibilidad", "cultura local", "empleo juvenil", "ocio"]}
                        concerns={["Falta de oportunidades", "poca oferta de ocio", "desconexión institucional"]}
                        media="Instagram, TikTok, YouTube, WhatsApp."
                        objections="Percibe la política como 'aburrida' o 'desconectada'."
                        message="Un futuro ilusionante para los jóvenes de La Victoria. ¡Tu voz es nuestra alternativa!"
                    />
                     <PersonaCard 
                        icon="👨‍💼"
                        title='"El Autónomo Resiliente"'
                        demographics="Pedro, 48 años. Propietario de pequeño comercio."
                        interests={["Economía local", "fiscalidad", "ayudas a pymes", "desarrollo"]}
                        concerns={["Burocracia", "impuestos", "falta de apoyo al comercio local"]}
                        media="Facebook (grupos locales), periódicos digitales, WhatsApp."
                        objections="Escepticismo ante promesas políticas. No creen que entiendan sus desafíos."
                        message="Impulsemos juntos la economía local de La Victoria. ¡Una alternativa para tu negocio!"
                    />
                     <PersonaCard 
                        icon="👵"
                        title='"La Familia Comunitaria"'
                        demographics="María, 55 años. Residente de toda la vida."
                        interests={["Bienestar familiar", "tradiciones", "servicios públicos", "seguridad"]}
                        concerns={["El futuro de los jóvenes", "gestión de servicios a mayores", "mantenimiento urbano"]}
                        media="Facebook, WhatsApp, TV local."
                        objections="Cansancio de la confrontación. Valora la experiencia y la 'gente de aquí'."
                        message="Con la ilusión de siempre, una alternativa cercana para las familias de La Victoria."
                    />
                 </div>
            </div>
        </>
    );
};

export default TargetAudience;