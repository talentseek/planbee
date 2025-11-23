'use client';

import { BarChart3, CheckCircle2, Clock, TrendingUp } from 'lucide-react';

interface ReportingDashboardProps {
    totalPomodoros: number;
    completedTasks: number;
    activeProjects: number;
}

export default function ReportingDashboard({ totalPomodoros, completedTasks, activeProjects }: ReportingDashboardProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-bee-pale flex items-center justify-center text-bee-gold">
                    <Clock size={24} />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">Total Pomodoros</p>
                    <h3 className="text-2xl font-bold text-bee-black">{totalPomodoros}</h3>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                    <CheckCircle2 size={24} />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">Tasks Completed</p>
                    <h3 className="text-2xl font-bold text-bee-black">{completedTasks}</h3>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                    <TrendingUp size={24} />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">Active Projects</p>
                    <h3 className="text-2xl font-bold text-bee-black">{activeProjects}</h3>
                </div>
            </div>
        </div>
    );
}
