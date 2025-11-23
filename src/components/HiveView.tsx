'use client';

import React, { useState } from 'react';
import Hexagon from './Hexagon';
import { CheckCircle, Circle, Clock, Sparkles } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Define the shape of the task data we need
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
            <Card className="border-2 border-dashed border-bee-pale bg-bee-pale/30 rounded-[2rem] overflow-hidden">
                <CardContent className="flex flex-col items-center justify-center h-96 text-center p-8 relative">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-honey animate-pulse">
                        <Sparkles className="w-12 h-12 text-bee-gold" />
                    </div>
                    <h3 className="text-2xl font-black text-bee-black mb-3">The Hive is Empty!</h3>
                    <p className="text-bee-brown/70 text-lg max-w-md mx-auto mb-8">
                        Your comb is waiting to be built. Create some tasks to start filling cells with nectar.
                    </p>
                    <div className="flex gap-2 text-sm text-bee-brown/50 font-medium">
                        <span>🐝 No Nectar</span>
                        <span>•</span>
                        <span>Empty Cells</span>
                    </div>
                </CardContent>
            </Card>
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
        console.log('Cell clicked:', taskId);
    };

    return (
        <div
            className="rounded-[2.5rem] shadow-2xl border-4 border-bee-pale p-10 min-h-[600px] flex items-center justify-center overflow-hidden relative transition-all duration-700 bg-gradient-to-br from-bee-pale/50 via-white to-bee-pale/50"
        >
            {/* Background Image */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                <div
                    className="absolute inset-0 bg-repeat opacity-20"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F59E0B' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            {/* Decorative elements */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-bee-yellow/10 rounded-full blur-[100px] animate-pulse pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-bee-gold/10 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>

            {/* Honeycomb Grid */}
            <div className="relative z-10 w-full max-w-6xl perspective-1000 py-12">
                <TooltipProvider>
                    <div
                        className="flex flex-wrap justify-center gap-4"
                    >
                        {tasks.map((task, index) => {
                            const hexState = getHexagonState(task);
                            const progress = getProgress(task);

                            return (
                                <div
                                    key={task.id}
                                    className="group relative -ml-5 first:ml-0 mb-[-44px]" // Negative margins for honeycomb overlap
                                    style={{
                                        animation: `fade-in-up 0.6s ease-out forwards`,
                                        animationDelay: `${index * 0.05}s`,
                                        marginTop: (index % 10) % 2 === 0 ? '0px' : '44px', // Simple staggering
                                    }}
                                >
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="transform transition-transform hover:z-20 hover:scale-110 duration-300">
                                                {/* Hexagon Cell */}
                                                <Hexagon
                                                    size="md"
                                                    state={hexState}
                                                    progress={progress}
                                                    color="bg-white shadow-lg"
                                                    className="transition-all duration-500"
                                                    onClick={() => handleCellClick(task.id)}
                                                >
                                                    <div
                                                        className="absolute inset-0 flex items-center justify-center transition-all duration-300"
                                                    >
                                                        {/* Cell Content */}
                                                        <div className="text-center p-3 relative z-20 flex flex-col items-center justify-center h-full w-full">
                                                            {task.status === 'DONE' ? (
                                                                <div className="space-y-1 animate-in zoom-in duration-300">
                                                                    <CheckCircle className="text-white w-8 h-8 mx-auto drop-shadow-md" />
                                                                    <div className="text-[10px] font-bold text-white drop-shadow-sm">
                                                                        +{task.completedCells * 10}XP
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="space-y-2 w-full px-2">
                                                                    <div
                                                                        className="font-bold text-xs opacity-90 truncate w-full text-bee-black"
                                                                        title={task.title}
                                                                    >
                                                                        {task.title}
                                                                    </div>
                                                                    <div className="flex items-center justify-center gap-1 text-[10px] text-bee-brown font-bold bg-bee-pale/80 rounded-full px-2 py-0.5 mx-auto w-fit shadow-sm">
                                                                        <Circle size={6} fill={task.project.color} color={task.project.color} />
                                                                        <span>{task.completedCells}/{task.estimatedCells}</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </Hexagon>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-white/95 backdrop-blur-xl border-bee-pale p-4 rounded-2xl shadow-xl ring-1 ring-black/5">
                                            <div className="w-56">
                                                <Badge
                                                    variant="outline"
                                                    className="mb-2 border-0 text-white shadow-sm font-bold"
                                                    style={{ backgroundColor: task.project.color }}
                                                >
                                                    {task.project.title}
                                                </Badge>

                                                <div className="font-bold mb-2 text-sm truncate text-bee-black">{task.title}</div>

                                                <div className="flex items-center gap-2 text-gray-500 mb-3">
                                                    {task.status === 'DONE' ? (
                                                        <CheckCircle size={14} className="text-green-500" />
                                                    ) : task.status === 'IN_PROGRESS' ? (
                                                        <Clock size={14} className="text-bee-gold animate-pulse" />
                                                    ) : (
                                                        <Circle size={14} />
                                                    )}
                                                    <span className="text-[11px] font-bold uppercase tracking-wide">{task.status.replace('_', ' ')}</span>
                                                </div>

                                                {/* Progress Bar */}
                                                <div className="mt-2 pt-3 border-t border-gray-100">
                                                    <div className="flex justify-between text-[10px] mb-1.5">
                                                        <span className="text-gray-400 font-bold">NECTAR COLLECTED</span>
                                                        <span className="font-bold text-bee-amber">{task.completedCells} / {task.estimatedCells} Cells</span>
                                                    </div>
                                                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden shadow-inner">
                                                        <div
                                                            className="bg-gradient-to-r from-bee-yellow to-bee-gold h-full transition-all duration-500 rounded-full shadow-sm"
                                                            style={{ width: `${progress}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            );
                        })}
                    </div>
                </TooltipProvider>
            </div>
        </div>
    );
}
