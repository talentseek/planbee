
'use client';

import React, { useState } from 'react';
import Hexagon from './Hexagon';
import { CheckCircle, Circle, Clock, Sparkles } from 'lucide-react';

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
    const [celebratingId, setCelebratingId] = useState<string | null>(null);

    if (tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-gradient-to-br from-bee-pale to-white rounded-2xl border border-bee-yellow/20 p-8 relative overflow-hidden">
                {/* Background honeycomb pattern */}
                <div className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(#F59E0B 1px, transparent 1px)',
                        backgroundSize: '30px 30px'
                    }}>
                </div>
                <Sparkles className="w-16 h-16 mb-4 text-bee-gold opacity-50" />
                <p className="text-lg font-medium mb-2 relative z-10">The Hive is empty!</p>
                <p className="text-sm relative z-10">Create some tasks to start building your comb.</p>
            </div>
        );
    }

    // Calculate progress for IN_PROGRESS tasks
    const getProgress = (task: TaskWithProject) => {
        if (task.estimatedCells === 0) return 0;
        return Math.min(100, (task.completedCells / task.estimatedCells) * 100);
    };

    // Determine hexagon state based on task status
    const getHexagonState = (task: TaskWithProject): 'empty' | 'filling' | 'complete' => {
        if (task.status === 'DONE') return 'complete';
        if (task.status === 'IN_PROGRESS') return 'filling';
        return 'empty';
    };

    const handleCellClick = (taskId: string) => {
        // Future: Navigate to timer with this task
        console.log('Cell clicked:', taskId);
    };

    return (
        <div
            className="rounded-2xl shadow-lg border border-bee-yellow/30 p-8 min-h-[600px] flex items-center justify-center overflow-hidden relative transition-all duration-700"
            style={{
                backgroundImage: 'url(/background.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Reduced Overlay for better visibility of background */}
            <div className="absolute inset-0 bg-gradient-to-br from-bee-white/40 via-bee-pale/30 to-bee-white/40 backdrop-blur-[2px]"></div>

            {/* Decorative elements - Ambient Orbs */}
            <div className="absolute top-10 left-10 w-64 h-64 bg-bee-yellow/20 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-bee-gold/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>

            {/* Honeycomb Grid */}
            <div className="relative z-10 w-full max-w-6xl perspective-1000">
                <div
                    className="grid gap-4 justify-center"
                    style={{
                        gridTemplateColumns: 'repeat(auto-fit, 140px)',
                    }}
                >
                    {tasks.map((task, index) => {
                        const hexState = getHexagonState(task);
                        const progress = getProgress(task);

                        return (
                            <div
                                key={task.id}
                                className="group relative"
                                style={{
                                    // Offset every other row for honeycomb effect
                                    transform: index % 2 === 0 ? 'translateY(0)' : 'translateY(40px)',
                                    animation: `fade-in-up 0.6s ease-out forwards`,
                                    animationDelay: `${index * 0.05}s`,
                                }}
                            >
                                {/* Enhanced Glassmorphic Tooltip */}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 w-56 glassmorphic-tooltip text-white text-xs rounded-xl py-3 px-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 shadow-2xl scale-95 group-hover:scale-100 backdrop-blur-xl border border-white/10">
                                    {/* Project Badge */}
                                    <div
                                        className="inline-block px-2 py-1 rounded-md text-[10px] font-bold mb-2 shadow-sm"
                                        style={{
                                            backgroundColor: task.project.color,
                                            color: '#fff',
                                        }}
                                    >
                                        {task.project.title}
                                    </div>

                                    <div className="font-semibold mb-2 text-sm truncate">{task.title}</div>

                                    <div className="flex items-center gap-2 text-bee-yellow/80 mb-2">
                                        {task.status === 'DONE' ? (
                                            <CheckCircle size={14} className="text-green-400" />
                                        ) : task.status === 'IN_PROGRESS' ? (
                                            <Clock size={14} className="text-blue-400 animate-pulse" />
                                        ) : (
                                            <Circle size={14} />
                                        )}
                                        <span className="text-[11px] font-medium">{task.status.replace('_', ' ')}</span>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mt-2 pt-2 border-t border-bee-gold/20">
                                        <div className="flex justify-between text-[10px] mb-1">
                                            <span className="text-gray-300">Progress</span>
                                            <span className="font-bold text-bee-yellow">{task.completedCells} / {task.estimatedCells} Cells</span>
                                        </div>
                                        <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-bee-yellow to-bee-gold h-full transition-all duration-500 rounded-full"
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Tooltip Arrow */}
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-gray-900/85"></div>
                                </div>

                                {/* Celebration Effect */}
                                {celebratingId === task.id && (
                                    <div className="absolute inset-0 pointer-events-none z-30">
                                        {[...Array(8)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="absolute top-1/2 left-1/2 w-2 h-2 bg-bee-gold rounded-full"
                                                style={{
                                                    animation: 'particle-burst 1s ease-out forwards',
                                                    '--tx': `${Math.cos((i * 45 * Math.PI) / 180) * 100}px`,
                                                    '--ty': `${Math.sin((i * 45 * Math.PI) / 180) * 100}px`,
                                                } as React.CSSProperties}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Hexagon Cell */}
                                <Hexagon
                                    size="md"
                                    state={hexState}
                                    progress={progress}
                                    color="bg-white/10" // More transparent base
                                    className="transition-all duration-500 hover:scale-110 hover:z-10"
                                    onClick={() => handleCellClick(task.id)}
                                >
                                    <div
                                        className="absolute inset-0 flex items-center justify-center transition-all duration-300"
                                        style={{
                                            backgroundColor: task.status === 'DONE'
                                                ? 'transparent'
                                                : 'transparent', // Let the glass effect shine
                                        }}
                                    >
                                        {/* Cell Content */}
                                        <div className="text-center p-3 relative z-20">
                                            {task.status === 'DONE' ? (
                                                <div className="space-y-1">
                                                    <CheckCircle className="text-white w-10 h-10 mx-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
                                                    <div className="text-[10px] font-bold text-white drop-shadow-md">
                                                        +{task.completedCells * 10}ml
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-1">
                                                    <div
                                                        className="font-bold text-xs opacity-90 truncate max-w-[90px] mb-1 drop-shadow-sm"
                                                        style={{ color: task.project.color }}
                                                    >
                                                        {task.title}
                                                    </div>
                                                    <div className="flex items-center justify-center gap-1 text-[10px] text-gray-600 font-medium">
                                                        <Circle size={8} fill={task.project.color} color={task.project.color} />
                                                        <span>{task.completedCells}/{task.estimatedCells}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Hexagon>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
