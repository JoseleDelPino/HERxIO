import React from 'react';
import BudgetChart from './charts/BudgetChart';
import { BUDGET_DATA } from '../constants';

const Budget: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="bg-white p-4 rounded-xl shadow-inner border border-slate-200 h-80 md:h-96">
                <h3 className="text-center font-semibold text-cc-blue-dark mb-2">Asignación de Recursos (%)</h3>
                <BudgetChart data={BUDGET_DATA} />
            </div>
            <div>
                <p className="text-gray-700 mb-4">
                    El presupuesto se ha distribuido priorizando la creación de contenido de calidad y la publicidad segmentada para maximizar el alcance y la eficiencia. Se propone una inversión flexible, capaz de adaptarse a las necesidades y oportunidades que surjan.
                </p>
                <ul className="space-y-3">
                    {BUDGET_DATA.map((item, index) => (
                         <li key={item.name} className="flex items-center">
                            <span className={`w-3 h-3 rounded-full mr-3`} style={{ backgroundColor: ['#003366', '#004C99', '#0066CC', '#3399FF', '#66B2FF'][index] }}></span>
                            <span className="font-medium text-gray-800">{item.name}:</span>
                            <span className="ml-2 text-gray-600">{item.value}%</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Budget;