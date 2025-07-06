import React from 'react';

interface KpiGroupProps {
    objective: string;
    kpis: string[];
}

const KpiGroup: React.FC<KpiGroupProps> = ({ objective, kpis }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200 h-full">
        <h4 className="text-lg font-bold text-cc-blue mb-3">{objective}</h4>
        <ul className="space-y-2 list-disc list-inside text-gray-700 text-sm">
            {kpis.map((kpi, index) => <li key={index}>{kpi}</li>)}
        </ul>
    </div>
);


const Kpis: React.FC = () => {
    return (
        <>
            <p className="text-gray-700 mb-8">
                Para asegurar la eficiencia del bajo presupuesto, la medición constante es fundamental. El éxito se medirá a través de los siguientes indicadores clave.
            </p>
            
            <div className="mb-10">
                <h3 className="text-xl font-semibold text-cc-blue-dark mb-4">Métricas Clave por Objetivo</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <KpiGroup 
                        objective="Aumentar presencia y visibilidad" 
                        kpis={[
                            "Alcance (Reach): Nº único de usuarios que vieron el contenido.",
                            "Crecimiento de Seguidores: Aumento neto en cada plataforma.",
                            "Visualizaciones de Video: Vistas de Reels, Historias, etc."
                        ]} 
                    />
                    <KpiGroup 
                        objective="Captar nuevos afiliados y simpatizantes" 
                        kpis={[
                            "Leads Captados: Nº de registros en formularios de contacto/suscripción.",
                            "Nuevas Afiliaciones Online: Nº de formularios de afiliación completados.",
                            "Interacciones en Posts de Afiliación."
                        ]} 
                    />
                    <KpiGroup 
                        objective="Movilizar a nuevos votantes" 
                        kpis={[
                            "Tasa de Engagement: % de interacciones sobre el alcance.",
                            "Clics en Enlaces (CTR): Clics en enlaces a web, noticias, etc.",
                            "Contenido Compartido: Nº de veces que se comparte un post."
                        ]} 
                    />
                    <KpiGroup 
                        objective="Consolidar la imagen del partido" 
                        kpis={[
                            "Evolución del Sentimiento Online: % de menciones positivas vs. negativas.",
                            "Menciones de Candidatos/Partido.",
                            "Consistencia de Marca: Auditoría visual y de mensaje."
                        ]} 
                    />
                </div>
            </div>

            <div>
                <h3 className="text-xl font-semibold text-cc-blue-dark mb-4">Frecuencia de Seguimiento y Herramientas</h3>
                <ul className="space-y-2 list-disc list-inside text-gray-700 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <li><strong>Diario:</strong> Revisión de interacciones, comentarios y mensajes directos en todas las plataformas.</li>
                    <li><strong>Semanal:</strong> Revisión de insights nativos de Facebook, Instagram, TikTok para ver crecimiento, alcance y engagement.</li>
                    <li><strong>Mensual:</strong> Informe consolidado de KPIs. Reunión del equipo para analizar resultados y ajustar estrategias.</li>
                    <li><strong>Herramientas:</strong> Insights de RRSS, Google Alerts, Canva, CapCut, Meta Business Suite.</li>
                </ul>
            </div>
        </>
    );
};

export default Kpis;