
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { ChartData } from '../../types';

interface AudienceChartProps {
    data: ChartData[];
}

const AudienceChart: React.FC<AudienceChartProps> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" stroke="#003366" />
                <YAxis stroke="#003366" />
                <Tooltip 
                    cursor={{fill: 'rgba(255, 215, 0, 0.2)'}}
                    contentStyle={{
                        background: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '0.5rem'
                    }}
                />
                <Bar dataKey="value" fill="#FFD700" name="Porcentaje" unit="%" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default AudienceChart;
