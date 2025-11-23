'use client';

import React, { useState } from 'react';
import { LayoutGrid, Hexagon } from 'lucide-react';

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
                <div className="bg-white p-1 rounded-lg border border-gray-200 shadow-sm inline-flex">
                    <button
                        onClick={() => setView('dashboard')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${view === 'dashboard'
                                ? 'bg-bee-gold text-white shadow-sm'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <LayoutGrid size={16} />
                        Dashboard
                    </button>
                    <button
                        onClick={() => setView('hive')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${view === 'hive'
                                ? 'bg-bee-gold text-white shadow-sm'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <Hexagon size={16} />
                        Hive View
                    </button>
                </div>
            </div>

            <div className="transition-opacity duration-300 ease-in-out">
                {view === 'dashboard' ? dashboardContent : hiveContent}
            </div>
        </div>
    );
}
