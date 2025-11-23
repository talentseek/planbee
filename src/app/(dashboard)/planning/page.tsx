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
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            <header className="flex items-center justify-between bg-white p-6 rounded-[2rem] shadow-sm border border-bee-pale">
                <div>
                    <h1 className="text-3xl font-black text-bee-black mb-1">Daily Plan</h1>
                    <p className="text-bee-brown/70 font-medium text-lg">Optimize your day around your calendar.</p>
                </div>
                <button
                    onClick={generatePlan}
                    disabled={loading}
                    className="flex items-center gap-3 bg-bee-black text-white px-8 py-4 rounded-xl hover:bg-bee-brown hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none font-bold text-lg"
                >
                    {loading ? <RefreshCw size={24} className="animate-spin" /> : <Calendar size={24} />}
                    <span>Generate Plan</span>
                </button>
            </header>

            <div className="bg-white rounded-[2rem] shadow-sm border border-bee-pale overflow-hidden">
                <div className="p-6 border-b border-bee-pale bg-bee-pale/30">
                    <h2 className="font-black text-xl text-bee-black flex items-center gap-2">
                        <span>📅</span> Today&apos;s Schedule
                    </h2>
                </div>

                <div className="divide-y divide-bee-pale">
                    {schedule.length === 0 ? (
                        <div className="p-16 text-center">
                            <div className="w-20 h-20 bg-bee-pale rounded-full flex items-center justify-center mx-auto mb-6">
                                <Calendar size={40} className="text-bee-gold opacity-50" />
                            </div>
                            <h3 className="text-xl font-bold text-bee-black mb-2">No plan generated yet</h3>
                            <p className="text-bee-brown/60 max-w-md mx-auto">
                                Click the &quot;Generate Plan&quot; button above to organize your day and fill your cells.
                            </p>
                        </div>
                    ) : (
                        schedule.map((item, index) => (
                            <div key={index} className="flex items-center p-6 hover:bg-bee-pale/20 transition-colors group">
                                <div className="w-24 text-sm font-mono font-bold text-bee-brown/60">
                                    {item.start}
                                </div>

                                <div className="flex-1">
                                    {item.type === 'event' ? (
                                        <div className="bg-gray-100 text-gray-600 px-4 py-3 rounded-xl inline-flex items-center gap-3 font-medium">
                                            <Calendar size={16} />
                                            <span>{item.title}</span>
                                        </div>
                                    ) : (
                                        <Link href={`/timer?taskId=${item.task?.id}`} className="flex items-center gap-4 group cursor-pointer">
                                            <div className="w-2 h-12 rounded-full bg-bee-yellow group-hover:bg-bee-gold transition-colors shadow-sm"></div>
                                            <div>
                                                <p className="font-bold text-lg text-bee-black group-hover:text-bee-brown transition-colors">{item.task?.title}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs font-bold text-bee-gold bg-bee-pale px-2 py-0.5 rounded-md border border-bee-gold/20">
                                                        CELL SESSION
                                                    </span>
                                                    {item.task?.project && (
                                                        <span className="text-xs text-gray-400 font-medium">
                                                            • {item.task.project.title}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    )}
                                </div>

                                <div className="text-bee-pale group-hover:text-bee-gold transition-colors">
                                    {item.type === 'pomodoro' && (
                                        <Link href={`/timer?taskId=${item.task?.id}`} className="p-2 hover:bg-bee-pale rounded-full transition-colors">
                                            <ArrowRight size={24} />
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
