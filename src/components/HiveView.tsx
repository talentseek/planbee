'use client';

import React from 'react';
import Hexagon from './Hexagon';
import { CheckCircle, Circle, Clock } from 'lucide-react';

// Define the shape of the task data we need
// This should match what we fetch in the page
interface TaskWithProject {
    id: string;
    title: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'ARCHIVED';
    estimatedCells: number;
    completedCells: number;
    project: {
        id: string;
        title: string;
        color: string;
    };
}

interface HiveViewProps {
    tasks: TaskWithProject[];
}

export default function HiveView({ tasks }: HiveViewProps) {
    if (tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-white rounded-2xl border border-gray-100 p-8">
                <p className="text-lg font-medium mb-2">The Hive is empty!</p>
                <p className="text-sm">Create some tasks to start building your comb.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[600px] flex items-center justify-center overflow-hidden relative">
            {/* Background Pattern Hint */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(#F59E0B 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}>
            </div>

            <div className="flex flex-wrap justify-center max-w-5xl gap-4">
                {/* 
          Honeycomb Layout Strategy:
          We use a flex container with wrapping. 
          To get the offset look, we can use CSS nth-child selectors in the global CSS or inline styles if complex.
          For a simple responsive honeycomb, standard flex wrap with negative margins often works best.
          Here we will use a simple grid of hexagons.
        */}
                {tasks.map((task) => (
                    <div key={task.id} className="group relative">
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-xs rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl">
                            <div className="font-bold text-bee-gold mb-1">{task.project.title}</div>
                            <div className="font-medium mb-1 truncate">{task.title}</div>
                            <div className="flex items-center gap-1 text-gray-400">
                                {task.status === 'DONE' ? <CheckCircle size={12} /> : <Circle size={12} />}
                                <span>{task.status}</span>
                            </div>
                            <div className="mt-1 pt-1 border-t border-gray-700 flex justify-between">
                                <span>Cells:</span>
                                <span>{task.completedCells} / {task.estimatedCells}</span>
                            </div>
                            {/* Arrow */}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                        </div>

                        <Hexagon
                            size="md"
                            color={task.status === 'DONE' ? undefined : 'bg-gray-100'} // Use default color logic or override
                            className="transition-all duration-300 hover:scale-110 hover:z-10"
                        >
                            <div
                                className="absolute inset-0 flex items-center justify-center"
                                style={{ backgroundColor: task.status === 'DONE' ? task.project.color : `${task.project.color}20` }}
                            >
                                {/* Inner Content */}
                                <div className="text-center p-2">
                                    {task.status === 'DONE' ? (
                                        <CheckCircle className="text-white w-8 h-8 mx-auto opacity-80" />
                                    ) : (
                                        <div className="font-bold text-gray-700 text-xs opacity-60 truncate max-w-[80px]">
                                            {task.title}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Hexagon>
                    </div>
                ))}
            </div>
        </div>
    );
}
