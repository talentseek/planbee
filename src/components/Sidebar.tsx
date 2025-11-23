'use client';

import Link from 'next/link';
import { Home, Hexagon, Calendar, Clock, Settings, LogOut } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
    const router = useRouter();

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push('/signin');
                },
            },
        });
    };

    return (
        <aside className="w-64 bg-bee-brown text-bee-white h-screen fixed left-0 top-0 flex flex-col p-4 border-r border-bee-gold/20">
            <div className="mb-8 flex items-center gap-2">
                <div className="w-8 h-8 bg-bee-gold rounded-lg rotate-45 flex items-center justify-center text-bee-brown font-bold shadow-honey">
                    <span className="-rotate-45">B</span>
                </div>
                <h1 className="text-2xl font-bold text-bee-gold tracking-tight">PlanBee</h1>
            </div>

            <nav className="flex-1 space-y-2">
                <Link href="/" className="flex items-center gap-3 p-3 rounded-xl hover:bg-bee-amber/20 transition-colors text-bee-pale hover:text-bee-gold font-medium">
                    <Home size={20} />
                    <span>The Hive</span>
                </Link>
                <Link href="/projects" className="flex items-center gap-3 p-3 rounded-xl hover:bg-bee-amber/20 transition-colors text-bee-pale hover:text-bee-gold font-medium">
                    <Hexagon size={20} />
                    <span>Combs (Projects)</span>
                </Link>
                <Link href="/planning" className="flex items-center gap-3 p-3 rounded-xl hover:bg-bee-amber/20 transition-colors text-bee-pale hover:text-bee-gold font-medium">
                    <Calendar size={20} />
                    <span>Flight Plan</span>
                </Link>
                <Link href="/timer" className="flex items-center gap-3 p-3 rounded-xl hover:bg-bee-amber/20 transition-colors text-bee-pale hover:text-bee-gold font-medium">
                    <Clock size={20} />
                    <span>Cell Timer</span>
                </Link>
                <Link href="/settings" className="flex items-center gap-3 p-3 rounded-xl hover:bg-bee-amber/20 transition-colors text-bee-pale hover:text-bee-gold font-medium">
                    <Settings size={20} />
                    <span>Beekeeper</span>
                </Link>
            </nav>

            <div className="space-y-4">
                <div className="p-4 bg-bee-black/30 rounded-xl border border-bee-gold/10">
                    <p className="text-xs text-bee-pale/60 mb-1 uppercase tracking-wider font-bold">Daily Quota</p>
                    <div className="w-full bg-bee-black/50 h-3 rounded-full overflow-hidden border border-bee-gold/20">
                        <div className="bg-gradient-to-r from-bee-yellow to-bee-gold h-full w-1/3 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                    </div>
                    <p className="text-xs text-right text-bee-gold mt-2 font-mono">2 / 8 Cells Filled</p>
                </div>

                <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/20 transition-colors text-bee-pale hover:text-red-400 font-medium border border-bee-gold/10 hover:border-red-500/30"
                >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
