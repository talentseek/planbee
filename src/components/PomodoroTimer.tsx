'use client';

import { useState, useEffect, useRef, Suspense, useCallback } from 'react';
import { Play, Pause, RotateCcw, Coffee, Hexagon as HexagonIcon } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { useSearchParams } from 'next/navigation';

function CellTimerContent() {
    const searchParams = useSearchParams();
    const initialTaskId = searchParams.get('taskId');
    const { data: session } = authClient.useSession();

    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<'cell' | 'breather' | 'refuel'>('cell'); // cell=25, breather=5, refuel=15
    const [taskId, setTaskId] = useState<string | null>(initialTaskId);
    const [taskTitle, setTaskTitle] = useState<string>('');
    const [fillPercent, setFillPercent] = useState(0);

    const startTimeRef = useRef<Date | null>(null);
    const totalTimeRef = useRef(25 * 60);

    // Fetch task details if taskId is present
    useEffect(() => {
        if (taskId) {
            fetch('/api/projects')
                .then(res => res.json())
                .then(projects => {
                    let found = false;
                    for (const p of projects) {
                        for (const t of p.tasks) {
                            if (t.id === taskId) {
                                setTaskTitle(t.title);
                                found = true;
                                break;
                            }
                        }
                        if (found) break;
                    }
                });
        }
    }, [taskId]);

    const handleComplete = useCallback(async () => {
        if (mode === 'cell') {
            // Play success sound (placeholder)
            const audio = new Audio('/sounds/pop.mp3'); // Needs to be added
            audio.play().catch(() => { }); // Ignore if file missing

            if (taskId) {
                try {
                    await fetch('/api/pomodoro', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            taskId,
                            userId: session?.user?.id,
                            duration: 25,
                            startTime: startTimeRef.current,
                            endTime: new Date(),
                        }),
                    });
                    // Optimistic update or toast here
                } catch (error) {
                    console.error('Failed to log cell', error);
                }
            }
            alert('Cell Filled! +10ml Nectar collected.');
        } else {
            alert('Wings rested. Ready to fly again?');
        }
    }, [mode, taskId, session]);

    // Handle timer completion separately
    useEffect(() => {
        if (timeLeft === 0 && isActive) {
            // Use setTimeout to avoid synchronous state update warning during render cycle
            const timer = setTimeout(() => {
                setIsActive(false);
                handleComplete();
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [timeLeft, isActive, handleComplete]);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    const newTime = prev - 1;
                    const total = totalTimeRef.current;
                    const elapsed = total - newTime;
                    setFillPercent((elapsed / total) * 100);
                    return newTime;
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const toggleTimer = () => {
        if (!isActive) {
            startTimeRef.current = new Date();
        }
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        const duration = mode === 'cell' ? 25 * 60 : (mode === 'breather' ? 5 * 60 : 15 * 60);
        setTimeLeft(duration);
        totalTimeRef.current = duration;
        setFillPercent(0);
    };

    const switchMode = (newMode: 'cell' | 'breather' | 'refuel') => {
        setMode(newMode);
        setIsActive(false);
        const duration = newMode === 'cell' ? 25 * 60 : (newMode === 'breather' ? 5 * 60 : 15 * 60);
        setTimeLeft(duration);
        totalTimeRef.current = duration;
        setFillPercent(0);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="glass-panel flex flex-col items-center justify-center p-8 rounded-3xl max-w-md mx-auto relative overflow-hidden">
            {/* Honeycomb background accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-bee-yellow opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <div className="flex gap-2 mb-8 bg-white/50 p-1 rounded-xl relative z-10 backdrop-blur-sm">
                <button
                    onClick={() => switchMode('cell')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'cell'
                        ? 'bg-bee-gold text-white shadow-honey'
                        : 'text-bee-brown hover:bg-bee-pale'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <HexagonIcon size={16} />
                        Cell
                    </div>
                </button>
                <button
                    onClick={() => switchMode('breather')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'breather'
                        ? 'bg-bee-gold text-white shadow-honey'
                        : 'text-bee-brown hover:bg-bee-pale'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <Coffee size={16} />
                        Breather
                    </div>
                </button>
            </div>

            <div className="relative mb-8 z-10">
                <div className="w-64 h-64 flex items-center justify-center relative">
                    {/* Hexagon Border/Background */}
                    <div className="absolute inset-0 bg-bee-pale" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
                    <div className="absolute inset-1 bg-white" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>

                    {/* Filling Liquid */}
                    <div
                        className="absolute bottom-0 left-0 right-0 bg-bee-gold transition-all duration-1000 ease-linear"
                        style={{
                            height: `${fillPercent}%`,
                            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                            opacity: 0.8
                        }}
                    ></div>

                    <div className="text-6xl font-bold text-bee-brown font-mono relative z-20 drop-shadow-sm">
                        {formatTime(timeLeft)}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 z-10">
                <button
                    onClick={toggleTimer}
                    className="w-16 h-16 btn-honey rounded-full flex items-center justify-center transition-all"
                >
                    {isActive ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                </button>

                <button
                    onClick={resetTimer}
                    className="w-12 h-12 bg-white hover:bg-bee-pale text-bee-brown rounded-full flex items-center justify-center transition-colors shadow-sm border border-bee-pale"
                >
                    <RotateCcw size={20} />
                </button>
            </div>

            <div className="mt-8 w-full z-10">
                <label className="block text-sm font-bold text-bee-brown mb-2 uppercase tracking-wider text-xs">Sealing Cell For:</label>
                {taskId ? (
                    <div className="p-3 rounded-xl border border-bee-gold bg-white/80 text-bee-brown font-medium flex items-center justify-between shadow-sm">
                        <span>{taskTitle || 'Loading task...'}</span>
                        <button onClick={() => { setTaskId(null); setTaskTitle(''); }} className="text-xs text-bee-amber hover:text-red-500 font-bold">CHANGE</button>
                    </div>
                ) : (
                    <select
                        className="w-full p-3 text-bee-brown rounded-xl border-2 border-bee-pale bg-white focus:outline-none focus:border-bee-gold font-medium"
                        onChange={(e) => setTaskId(e.target.value)}
                    >
                        <option value="">Select a Comb (Task)...</option>
                        <option value="test-task-id">Test Task</option>
                    </select>
                )}
            </div>

            {/* Worker Bee Tips */}
            <div className="mt-6 text-center animate-in fade-in slide-in-from-bottom-2 duration-700 delay-500">
                <p className="text-xs text-bee-brown/60 italic">
                    <span className="font-bold text-bee-gold">Worker Bee Tip:</span> &quot;Don&apos;t overload the comb. 8 Cells is a solid day&apos;s work.&quot;
                </p>
            </div>
        </div>
    );
}

export default function PomodoroTimer() {
    return (
        <Suspense fallback={<div>Loading Hive...</div>}>
            <CellTimerContent />
        </Suspense>
    );
}
