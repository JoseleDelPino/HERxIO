import React, { useState, useEffect } from 'react';

const NAV_ITEMS = [
  { id: 'resumen', title: 'I. Resumen Ejecutivo' },
  { id: 'analisis', title: 'II. Análisis de Situación' },
  { id: 'publico', title: 'III. Público Objetivo' },
  { id: 'contenidos', title: 'IV. Estrategia de Contenidos' },
  { id: 'plataformas', title: 'V. Estrategia de Plataformas' },
  { id: 'afiliacion', title: 'VI. Afiliación y Movilización' },
  { id: 'crisis', title: 'VII. Plan de Crisis' },
  { id: 'kpis', title: 'VIII. Medición y KPIs' },
  { id: 'cronograma', title: 'IX. Calendario y Cronograma' },
  { id: 'presupuesto', title: 'X. Presupuesto' },
  { id: 'herramientas', title: 'XI. Herramientas y Recursos' },
  { id: 'creativas', title: 'XII. Estrategias Creativas' },
  { id: 'ia-generator', title: 'Generador IA' },
];

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ isOpen, onClose }) => {
  const [activeId, setActiveId] = useState('resumen');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -75% 0px' } 
    );

    NAV_ITEMS.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      NAV_ITEMS.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    onClose(); 
  };

  const navContent = (
     <nav className="flex flex-col p-4 space-y-1">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider px-2 py-2">Menú del Plan</h3>
        {NAV_ITEMS.map(({ id, title }) => (
            <a
                key={id}
                href={`#${id}`}
                onClick={(e) => handleLinkClick(e, id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeId === id
                        ? 'bg-cc-yellow text-cc-blue-dark shadow-md'
                        : 'text-gray-200 hover:bg-cc-blue hover:text-white'
                }`}
            >
                {title}
            </a>
        ))}
    </nav>
  );


  return (
    <>
        {/* Sidebar for Desktop */}
        <aside className="hidden md:block w-64 bg-cc-blue-dark text-white h-screen sticky top-0 flex-shrink-0 overflow-y-auto">
            {navContent}
        </aside>
        
        {/* Overlay for Mobile */}
        <div className={`fixed inset-0 z-40 bg-cc-blue-dark text-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
            <div className="pt-20 overflow-y-auto h-full">
              {navContent}
            </div>
        </div>
    </>
  );
};

export default Navigation;