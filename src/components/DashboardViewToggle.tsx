'use client';

import { useState } from 'react';
import { LayoutGrid, Hexagon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardViewToggleProps {
    dashboardContent: React.ReactNode;
    hiveContent: React.ReactNode;
}

export default function DashboardViewToggle({
    dashboardContent,
    hiveContent,
}: DashboardViewToggleProps) {
    const [view, setView] = useState<'dashboard' | 'hive'>('dashboard');

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <div className="bg-muted p-1 rounded-lg flex items-center gap-1">
                    <button
                        onClick={() => setView('dashboard')}
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                            view === 'dashboard'
                                ? "bg-white text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-white/50"
                        )}
                    >
                        <LayoutGrid size={16} />
                        Dashboard
                    </button>
                    <button
                        onClick={() => setView('hive')}
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                            view === 'hive'
                                ? "bg-white text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-white/50"
                        )}
                    >
                        <Hexagon size={16} />
                        Hive View
                    </button>
                </div>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {view === 'dashboard' ? dashboardContent : hiveContent}
            </div>
        </div>
    );
}
