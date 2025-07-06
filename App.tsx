import React, { useState } from 'react';
import Header from './components/Header';
import SwotAnalysis from './components/SwotAnalysis';
import TargetAudience from './components/TargetAudience';
import Strategies from './components/Strategies';
import ActionPlan from './components/ActionPlan';
import Kpis from './components/Kpis';
import IdeaGenerator from './components/IdeaGenerator';
import Footer from './components/Footer';
import Navigation from './components/Navigation';
import Budget from './components/Budget';
import TitleCard from './components/TitleCard';
import ContentCard from './components/ContentCard';
import ExecutiveSummary from './components/ExecutiveSummary';


const SubSection: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`mt-8 ${className}`}>
        <h3 className="text-xl font-semibold text-cc-blue-dark mb-4">{title}</h3>
        <div className="space-y-4 text-gray-700">{children}</div>
    </div>
);

const PlatformCard: React.FC<{ title: string, children: React.ReactNode}> = ({ title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm transform hover:-translate-y-1 transition-transform border border-slate-200">
        <h4 className="text-lg font-semibold text-cc-blue mb-3 border-b-2 border-cc-yellow pb-2">{title}</h4>
        <div className="space-y-3 text-gray-600 text-sm">{children}</div>
    </div>
);


const App: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-cc-blue-dark">
      <div className="flex">
        <Navigation isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        
        <div className="flex-1 flex flex-col min-w-0">
          <Header onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} isMenuOpen={isMobileMenuOpen} />
          
          <main className="container mx-auto max-w-4xl px-4 py-8 space-y-12">
            <TitleCard />
            <ExecutiveSummary />

            <ContentCard id="analisis" title="II. Análisis de la Situación Actual y Puntos de Partida" icon="📊">
                <SubSection title="Evaluación Actual de la Presencia Digital del Partido">
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li><strong>Redes Sociales:</strong> Baja interacción en las plataformas actuales. Se presume presencia en Facebook e Instagram. Es probable que no se esté aprovechando Twitter/X ni TikTok, y el uso de WhatsApp/Telegram para movilización no está estandarizado.</li>
                        <li><strong>Web:</strong> No se menciona una web/blog existente, lo que sugiere una oportunidad para crear un centro de información y captación de leads.</li>
                        <li><strong>Contenido:</strong> La interacción es baja, lo que indica que el contenido actual podría no estar resonando lo suficiente con la audiencia, o la frecuencia y el formato no son los óptimos.</li>
                        <li><strong>Gestión de Reputación:</strong> El partido se ve afectado por la propagación de noticias falsas y una percepción negativa en ciertos temas. Esto requiere una estrategia proactiva de desmentido y construcción de narrativa positiva.</li>
                    </ul>
                </SubSection>
                <SwotAnalysis />
            </ContentCard>
            
            <ContentCard id="publico" title="III. Definición de Públicos Objetivo y Buyer Personas" icon="🎯">
                <TargetAudience />
            </ContentCard>
            
            <ContentCard id="contenidos" title="IV. Estrategia de Contenidos y Mensajes Clave" icon="📝">
                <Strategies />
            </ContentCard>

            <ContentCard id="plataformas" title="V. Estrategia por Plataformas Digitales" icon="📲">
                <p className="text-gray-700 mb-6">Dada la limitación de recursos, la estrategia se centrará en optimizar las plataformas de mayor impacto y potencial de engagement en el ámbito local.</p>
                <div className="space-y-6">
                    <PlatformCard title="1. Facebook (Comunidad y Familias)">
                        <p><strong>Objetivos:</strong> Aumentar el alcance orgánico, fomentar el debate constructivo, compartir información detallada, captar simpatizantes mayores y familias.</p>
                        <p><strong>Contenido:</strong> Publicaciones sobre problemas y propuestas locales, infografías, vídeos largos (entrevistas, debates), encuestas, eventos.</p>
                    </PlatformCard>
                     <PlatformCard title="2. Instagram (Jóvenes y Contenido Visual)">
                        <p><strong>Objetivos:</strong> Aumentar reconocimiento de marca, conectar con jóvenes, generar engagement visual, destacar el lado humano.</p>
                        <p><strong>Contenido:</strong> Reels (propuestas, día a día, desmintiendo bulos), Historias (encuestas, "detrás de escena"), Carruseles (infografías).</p>
                    </PlatformCard>
                     <PlatformCard title="3. TikTok (Exploración y Viralidad Local)">
                         <p><strong>Objetivos:</strong> Ampliar el alcance a audiencias muy jóvenes, humanizar el mensaje político, generar contenido viral y cercano.</p>
                         <p><strong>Contenido:</strong> Vídeos cortos con tendencias adaptadas a mensajes locales, momentos divertidos del equipo, explicaciones sencillas.</p>
                    </PlatformCard>
                    <PlatformCard title="4. Twitter/X (Noticias Rápidas y Debates)">
                         <p><strong>Objetivos:</strong> Compartir noticias de última hora, interactuar con medios, fiscalizar de forma ágil, participar en debates.</p>
                         <p><strong>Contenido:</strong> Tweets cortos, hilos para desglosar temas complejos, participación en hashtags relevantes.</p>
                    </PlatformCard>
                     <PlatformCard title="5. WhatsApp/Telegram (Movilización Directa)">
                         <p><strong>Objetivos:</strong> Comunicación directa y segmentada, movilización electoral, compartir información exclusiva.</p>
                         <p><strong>Contenido:</strong> Grupos de difusión (noticias, eventos), grupos cerrados para coordinación, audios/vídeos cortos de líderes.</p>
                    </PlatformCard>
                     <PlatformCard title="Web/Blog (Recomendación)">
                         <p>Será el centro neurálgico de la estrategia, un espacio de autoridad y control.</p>
                         <p><strong>Contenido Clave:</strong> Página de inicio con mensaje central, Quiénes Somos, Nuestro Proyecto (propuestas detalladas), Noticias/Blog, Contacto/Afiliación, Transparencia.</p>
                    </PlatformCard>
                </div>
            </ContentCard>

            <ContentCard id="afiliacion" title="VI. Estrategias de Afiliación y Movilización" icon="🤝">
                <SubSection title="Tácticas Digitales para Captar Nuevos Afiliados">
                    <ul className="list-disc list-inside space-y-2">
                       <li><strong>Formulario de Afiliación Online:</strong> Fácil acceso en la web y enlaces directos desde redes sociales.</li>
                       <li><strong>Contenido Exclusivo para Afiliados:</strong> Crear percepción de valor (acceso a reuniones online, documentos, etc.).</li>
                       <li><strong>Campañas de Micro-segmentación:</strong> Dirigir mensajes personalizados a perfiles afines en redes.</li>
                       <li><strong>Testimonios de Afiliados:</strong> Vídeos o textos de afiliados explicando por qué se unieron.</li>
                    </ul>
                </SubSection>
                <SubSection title="Estrategias para Convertir Simpatizantes en Votantes Activos">
                     <ul className="list-disc list-inside space-y-2">
                       <li><strong>Campaña de Recuerdo de Voto:</strong> Mensajes constantes sobre la importancia de votar en las semanas previas.</li>
                       <li><strong>Mensajes Personalizados:</strong> Usar email y WhatsApp/Telegram para recordatorios el día de las elecciones.</li>
                       <li><strong>"Embajadores Digitales":</strong> Animar a simpatizantes activos a ser portavoces del mensaje.</li>
                       <li><strong>Contar la historia de éxito:</strong> Mostrar el trabajo de los concejales para demostrar capacidad de gobernar.</li>
                    </ul>
                </SubSection>
                 <SubSection title="Uso de Micro-Influencers Locales">
                     <ul className="list-disc list-inside space-y-2">
                       <li><strong>Concejales como Influencers:</strong> Deben ser formados para crear contenido auténtico y cercano.</li>
                       <li><strong>Líderes de Opinión Locales:</strong> Identificar y colaborar con personas respetadas en la comunidad.</li>
                       <li><strong>Miembros del Equipo:</strong> El Secretario General y responsables deben tener una presencia activa y coordinada.</li>
                    </ul>
                </SubSection>
            </ContentCard>
            
            <ContentCard id="crisis" title="VII. Plan de Crisis Digital y Reputación" icon="🛡️">
                 <SubSection title="Protocolo para Responder a Noticias Falsas y Crisis de Imagen">
                    <ol className="list-decimal list-inside space-y-3">
                        <li><strong>Monitorización Activa:</strong> Detección diaria de menciones del partido, concejales y palabras clave en redes y medios.</li>
                        <li><strong>Detección y Evaluación (1-2h):</strong> Evaluar el alcance, credibilidad y potencial de daño de la noticia o crítica.</li>
                        <li><strong>Preparación de Respuesta (2-4h):</strong> Recopilar hechos y datos verificables. Decidir la estrategia (desmentido, clarificación, ignorar).</li>
                        <li><strong>Ejecución de la Respuesta:</strong> Publicar desmentidos claros. Responder a críticas con argumentos y diálogo.</li>
                        <li><strong>Seguimiento y Análisis:</strong> Monitorear el impacto de la respuesta y aprender de cada crisis.</li>
                    </ol>
                 </SubSection>
            </ContentCard>

            <ContentCard id="kpis" title="VIII. Plan de Medición y KPIs" icon="📈">
                <Kpis />
            </ContentCard>
            
            <ContentCard id="cronograma" title="IX. Calendario y Cronograma" icon="🗓️">
                <ActionPlan />
            </ContentCard>
            
            <ContentCard id="presupuesto" title="X. Distribución de Presupuesto" icon="💰">
                <Budget />
            </ContentCard>

            <ContentCard id="herramientas" title="XI. Herramientas y Recursos Low Cost" icon="🛠️">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <PlatformCard title="Diseño y Vídeo">
                       <p><strong>Canva (Gratuito):</strong> Para crear diseños atractivos (infografías, posts).</p>
                       <p><strong>CapCut / InShot (Gratuito):</strong> Para edición de video rápida para Reels/TikTok.</p>
                    </PlatformCard>
                     <PlatformCard title="Gestión y Programación">
                       <p><strong>Meta Business Suite (Gratuito):</strong> Para gestionar y programar en Facebook e Instagram.</p>
                       <p><strong>WhatsApp Business / Telegram:</strong> Para comunicación directa y organizada.</p>
                    </PlatformCard>
                    <PlatformCard title="Análisis y Monitorización">
                       <p><strong>Insights Nativos de RRSS (Gratuito):</strong> Analítica de Facebook, Instagram, TikTok, etc.</p>
                       <p><strong>Google Alerts (Gratuito):</strong> Para recibir notificaciones de menciones online.</p>
                    </PlatformCard>
                     <PlatformCard title="Listas de Contacto">
                       <p><strong>Mailchimp (Plan Gratuito):</strong> Para construir una lista de correo y enviar boletines.</p>
                       <p><strong>Google Forms (Gratuito):</strong> Para crear formularios de contacto y afiliación.</p>
                    </PlatformCard>
                </div>
            </ContentCard>

            <ContentCard id="creativas" title="XII. Estrategias Creativas" icon="💡">
                 <SubSection title="Enfoque en la Comunidad Local y Engagement Directo">
                    <ul className="list-disc list-inside space-y-2">
                        <li><strong>"Café con CC":</strong> Organizar reuniones informales con vecinos y compartir extractos en redes.</li>
                        <li><strong>"El Rincón del Vecino Online":</strong> Espacio semanal en vivo para responder preguntas directas.</li>
                        <li><strong>Contenido Generado por el Usuario (CGU):</strong> Incentivar a los vecinos a compartir fotos/videos de La Victoria.</li>
                    </ul>
                 </SubSection>
                 <SubSection title="Diferenciación y 'Alternativa Real' e 'Ilusionante'">
                     <ul className="list-disc list-inside space-y-2">
                       <li><strong>Narrativa de Contraste Constructivo:</strong> Al criticar, siempre ofrecer una alternativa clara y viable.</li>
                       <li><strong>Puesta en Valor del Patrimonio Canario:</strong> Usar la historia de La Victoria como elemento diferenciador.</li>
                       <li><strong>Transparencia Activa:</strong> Mostrar cómo el partido gestionaría los recursos de forma más eficiente.</li>
                    </ul>
                </SubSection>
            </ContentCard>

             <ContentCard id="ia-generator" title="Generador de Ideas con IA" icon="🤖">
                <IdeaGenerator />
            </ContentCard>

          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default App;