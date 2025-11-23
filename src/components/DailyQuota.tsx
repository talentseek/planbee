'use client';

import { useEffect, useState } from 'react';
import { Progress } from "@/components/ui/progress";

export default function DailyQuota() {
    const [completed, setCompleted] = useState(0);
    const [target, setTarget] = useState(8); // Default to Worker Bee
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user settings for target
                const settingsRes = await fetch('/api/user/settings');
                if (settingsRes.ok) {
                    const settings = await settingsRes.json();
                    if (settings.intensityMode === 'GLIDER') setTarget(4);
                    else if (settings.intensityMode === 'HERO_MODE') setTarget(12);
                    else setTarget(8);
                }

                // Fetch today's completed pomodoros
                // We might need a new endpoint or use an existing one.
                // For now, let's assume we can get this count.
                // If no specific endpoint exists, we might need to create one.
                // Let's check /api/pomodoro or similar.
                // Assuming /api/stats/daily exists or we create it.
                const statsRes = await fetch('/api/stats/daily');
                if (statsRes.ok) {
                    const stats = await statsRes.json();
                    setCompleted(stats.completed || 0);
                }
            } catch (error) {
                console.error('Failed to fetch daily quota', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const progress = Math.min(100, (completed / target) * 100);

    if (loading) {
        return (
            <div className="p-4 bg-sidebar-accent/50 rounded-xl border border-sidebar-border animate-pulse">
                <div className="h-3 bg-sidebar-border rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-sidebar-border rounded w-full"></div>
            </div>
        );
    }

    return (
        <div className="p-4 bg-sidebar-accent/50 rounded-xl border border-sidebar-border">
            <p className="text-xs text-sidebar-foreground/60 mb-2 uppercase tracking-wider font-bold">Daily Quota</p>
            <Progress value={progress} className="h-3 bg-sidebar-accent border border-sidebar-border" indicatorClassName="bg-gradient-to-r from-primary to-orange-500" />
            <p className="text-xs text-right text-primary mt-2 font-mono">{completed} / {target} Cells Filled</p>
        </div>
    );
}
