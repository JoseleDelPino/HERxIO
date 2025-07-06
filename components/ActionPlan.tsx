import React from 'react';

interface PlanPhaseProps {
    phase: string;
    title: string;
    duration: string;
    objective: string;
    actions: string[];
}

const PlanPhase: React.FC<PlanPhaseProps> = ({ phase, title, duration, objective, actions }) => (
    <div className="border-l-4 border-cc-yellow pl-8 py-4 relative ml-4">
        <div className="absolute -left-6 top-4 w-10 h-10 bg-cc-blue rounded-full text-white flex items-center justify-center font-bold text-lg shadow-md">{phase}</div>
        <p className="text-sm font-semibold text-gray-500">{duration}</p>
        <h4 className="text-xl font-bold text-cc-blue mb-1">{title}</h4>
        <p className="italic text-gray-600 mb-3">{objective}</p>
        <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
            {actions.map((action, index) => <li key={index}>{action}</li>)}
        </ul>
    </div>
);

const TaskTable: React.FC = () => (
    <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left bg-white shadow-md rounded-lg text-sm">
            <thead className="bg-cc-blue-dark text-white">
                <tr>
                    <th className="p-3">Rol</th>
                    <th className="p-3">Tareas Clave</th>
                </tr>
            </thead>
            <tbody>
                <tr className="border-b">
                    <td className="p-3 font-semibold">Secretario General</td>
                    <td className="p-3">Portavoz principal, liderazgo político, apariciones en videos/directos.</td>
                </tr>
                <tr className="border-b bg-slate-50">
                    <td className="p-3 font-semibold">Comunicación (1 persona)</td>
                    <td className="p-3">Diseño y ejecución de estrategia, gestión de RRSS, análisis de KPIs, gestión de crisis.</td>
                </tr>
                <tr className="border-b">
                    <td className="p-3 font-semibold">Institucional (1 persona)</td>
                    <td className="p-3">Investigación, elaboración de propuestas, enlace con el ayuntamiento.</td>
                </tr>
                 <tr className="border-b bg-slate-50">
                    <td className="p-3 font-semibold">Concejales (2 personas)</td>
                    <td className="p-3">Cara visible, generar contenido "desde la calle", fiscalización, interacción con vecinos.</td>
                </tr>
                 <tr>
                    <td className="p-3 font-semibold">Simpatizantes</td>
                    <td className="p-3">Amplificar el mensaje, apoyo en eventos, recogida de información local.</td>
                </tr>
            </tbody>
        </table>
    </div>
);


const ActionPlan: React.FC = () => {
    return (
        <>
            <p className="text-gray-700 mb-8">El plan se dividirá en fases progresivas, adaptándose al bajo presupuesto y maximizando el impacto a largo plazo.</p>
            <div className="space-y-8">
                <PlanPhase 
                    phase="1" 
                    title="Preparación y Lanzamiento"
                    duration="Julio 2025 - Diciembre 2025"
                    objective="Establecer bases, optimizar perfiles, lanzar contenidos iniciales, empezar a generar interacción."
                    actions={[
                        "Auditoría y optimización de perfiles de RRSS.",
                        "Diseño de la identidad visual y línea gráfica.",
                        "Lanzamiento de las primeras series de contenido ('La Victoria en Datos').",
                        "Inicio de estrategia 'Concejales como Influencers'."
                    ]} 
                />
                <PlanPhase 
                    phase="2" 
                    title="Consolidación y Crecimiento"
                    duration="Enero 2026 - Diciembre 2026"
                    objective="Aumentar engagement, consolidar la comunidad, lanzar la web/blog."
                    actions={[
                        "Lanzamiento de la web/blog (si el presupuesto lo permite).",
                        "Creación de la lista de difusión de WhatsApp/Telegram.",
                        "Campañas específicas de afiliación online.",
                        "Fortalecimiento de la narrativa 'Ilusión y Alternativa'."
                    ]} 
                />
                <PlanPhase 
                    phase="3" 
                    title="Campaña Electoral Intensiva"
                    duration="Enero 2027 - Mayo 2027"
                    objective="Máxima movilización, alcance masivo, posicionamiento claro."
                    actions={[
                        "Aumento de la frecuencia de publicaciones.",
                        "Campañas segmentadas de publicidad digital (Paid Media).",
                        "Foco en la movilización de votantes el día de las elecciones.",
                        "Fiscalización intensiva del PSOE, siempre con propuestas alternativas."
                    ]} 
                />
            </div>
            <div className="mt-12">
                 <h3 className="text-xl font-semibold text-cc-blue-dark mb-4">Distribución de Tareas y Responsabilidades</h3>
                 <TaskTable />
            </div>
        </>
    );
};

export default ActionPlan;