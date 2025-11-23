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
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-bee-pale flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-2xl bg-bee-pale flex items-center justify-center text-bee-gold shadow-inner">
                    <Clock size={28} />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Total Cells</p>
                    <h3 className="text-3xl font-black text-bee-black">{totalPomodoros}</h3>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-bee-pale flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 shadow-inner">
                    <CheckCircle2 size={28} />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Tasks Done</p>
                    <h3 className="text-3xl font-black text-bee-black">{completedTasks}</h3>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-bee-pale flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                    <TrendingUp size={28} />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Active Combs</p>
                    <h3 className="text-3xl font-black text-bee-black">{activeProjects}</h3>
                </div>
            </div>
        </div>
    );
}
