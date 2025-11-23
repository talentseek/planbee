import Link from "next/link";
import { ArrowRight, Hexagon, Clock, BarChart3 } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-bee-pale to-white">
            {/* Header */}
            <header className="container mx-auto px-6 py-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-bee-gold rounded-xl rotate-45 flex items-center justify-center text-white font-bold shadow-honey transform hover:rotate-180 transition-transform duration-500">
                        <span className="-rotate-45">B</span>
                    </div>
                    <span className="text-2xl font-bold text-bee-brown tracking-tight">PlanBee</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/signin" className="text-bee-brown hover:text-bee-amber font-bold transition-colors">
                        Enter Hive
                    </Link>
                    <Link
                        href="/signin"
                        className="btn-honey px-6 py-2 rounded-xl font-bold hover:scale-105 transition-transform"
                    >
                        Start Hatching
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section className="container mx-auto px-6 py-20 text-center relative">
                <div className="absolute top-10 left-10 w-20 h-20 bg-bee-yellow opacity-20 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-32 h-32 bg-bee-gold opacity-10 rounded-full blur-3xl"></div>

                <h1 className="text-5xl md:text-7xl font-bold text-bee-brown mb-6 tracking-tight">
                    Defend your <span className="text-bee-gold relative inline-block">
                        Focus
                        <svg className="absolute w-full h-3 -bottom-1 left-0 text-bee-yellow opacity-50" viewBox="0 0 100 10" preserveAspectRatio="none">
                            <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                        </svg>
                    </span>.
                </h1>
                <p className="text-xl text-bee-brown/80 mb-10 max-w-2xl mx-auto font-medium">
                    Turn your busy day into a game. Build your comb, fill your cells, and collect nectar.
                </p>
                <Link
                    href="/signin"
                    className="inline-flex items-center gap-2 btn-honey px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-honey"
                >
                    Join the Swarm <ArrowRight size={20} />
                </Link>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-6 py-20">
                <div className="grid md:grid-cols-3 gap-10">
                    <div className="glass-panel p-8 rounded-3xl hover:translate-y-[-5px] transition-transform duration-300">
                        <div className="w-14 h-14 bg-bee-pale rounded-2xl flex items-center justify-center text-bee-amber mb-6 rotate-3">
                            <Hexagon size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-bee-brown mb-3">Build Your Comb</h3>
                        <p className="text-bee-brown/70">
                            Organize your tasks into Projects (Combs). Visual, tactile, and satisfying to complete.
                        </p>
                    </div>
                    <div className="glass-panel p-8 rounded-3xl hover:translate-y-[-5px] transition-transform duration-300">
                        <div className="w-14 h-14 bg-bee-pale rounded-2xl flex items-center justify-center text-bee-amber mb-6 -rotate-3">
                            <Clock size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-bee-brown mb-3">Fill Cells</h3>
                        <p className="text-bee-brown/70">
                            Focus for 25 minutes to fill a Cell with nectar. Protect your time from interruptions.
                        </p>
                    </div>
                    <div className="glass-panel p-8 rounded-3xl hover:translate-y-[-5px] transition-transform duration-300">
                        <div className="w-14 h-14 bg-bee-pale rounded-2xl flex items-center justify-center text-bee-amber mb-6 rotate-3">
                            <BarChart3 size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-bee-brown mb-3">Collect Nectar</h3>
                        <p className="text-bee-brown/70">
                            Earn XP (Nectar) for every cell filled. Maintain your streak and climb the leaderboard.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white/50 backdrop-blur-sm py-10 border-t border-bee-pale">
                <div className="container mx-auto px-6 text-center text-bee-brown/60 font-medium">
                    <p>&copy; {new Date().getFullYear()} PlanBee. The Hive awaits.</p>
                </div>
            </footer>
        </div>
    );
}
