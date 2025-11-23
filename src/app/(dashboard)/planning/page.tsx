'use client';

import { useState } from 'react';
import { Calendar, RefreshCw, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ScheduleItem {
    type: 'event' | 'pomodoro';
    title?: string;
    task?: { id: string; title: string; project?: { title: string; color: string } };
    start: string;
    end: string;
}

export default function PlanningPage() {
    const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
    const [loading, setLoading] = useState(false);

    const generatePlan = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/plan', { method: 'POST' });
            const data = await res.json();
            setSchedule(data.schedule || []);
        } catch (error) {
            console.error('Failed to plan', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-bee-gold">Daily Plan</h1>
                    <p className="text-bee-gold font-bold text-lg">Optimize your day around your calendar.</p>
                </div>
                <button
                    onClick={generatePlan}
                    disabled={loading}
                    className="flex items-center gap-2 bg-bee-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                    {loading ? <RefreshCw size={20} className="animate-spin" /> : <Calendar size={20} />}
                    <span>Generate Plan</span>
                </button>
            </header>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                    <h2 className="font-bold text-bee-black">Today's Schedule</h2>
                </div>

                <div className="divide-y divide-gray-100">
                    {schedule.length === 0 ? (
                        <div className="p-12 text-center text-gray-400">
                            <Calendar size={48} className="mx-auto mb-4 opacity-20" />
                            <p>No plan generated yet. Click the button above to organize your day.</p>
                        </div>
                    ) : (
                        schedule.map((item, index) => (
                            <div key={index} className="flex items-center p-4 hover:bg-gray-50 transition-colors">
                                <div className="w-20 text-sm font-mono text-gray-500">
                                    {item.start}
                                </div>

                                <div className="flex-1">
                                    {item.type === 'event' ? (
                                        <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg inline-flex items-center gap-2">
                                            <Calendar size={14} />
                                            <span className="font-medium">{item.title}</span>
                                        </div>
                                    ) : (
                                        <Link href={`/timer?taskId=${item.task?.id}`} className="flex items-center gap-3 group cursor-pointer">
                                            <div className="w-2 h-12 rounded-full bg-bee-yellow group-hover:bg-bee-gold transition-colors"></div>
                                            <div>
                                                <p className="font-bold text-bee-black group-hover:text-bee-gold transition-colors">{item.task?.title}</p>
                                                <p className="text-xs text-gray-500">Pomodoro Session</p>
                                            </div>
                                        </Link>
                                    )}
                                </div>

                                <div className="text-gray-400">
                                    {item.type === 'pomodoro' && (
                                        <Link href={`/timer?taskId=${item.task?.id}`} className="hover:text-bee-gold transition-colors">
                                            <ArrowRight size={16} />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
