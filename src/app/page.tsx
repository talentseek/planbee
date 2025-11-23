import Link from "next/link";
import { ArrowRight, Hexagon, Clock, BarChart3 } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-bee-pale via-white to-bee-pale overflow-hidden">
            {/* Header */}
            <header className="container mx-auto px-6 py-6 flex justify-between items-center relative z-10">
                <div className="flex items-center gap-3">
                    <img src="/planbeelogo.png" alt="PlanBee Logo" className="w-12 h-12 object-contain hover:scale-110 transition-transform duration-300 drop-shadow-md" />
                    <span className="text-2xl font-bold text-bee-black tracking-tight">PlanBee</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/signin" className="text-bee-brown hover:text-bee-amber font-bold transition-colors">
                        Enter Hive
                    </Link>
                    <Link
                        href="/signin"
                        className="btn-honey px-6 py-2 rounded-xl font-bold"
                    >
                        Start Hatching
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section className="container mx-auto px-6 py-20 text-center relative z-10">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-1/4 w-72 h-72 bg-bee-yellow/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-bee-gold/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

                <h1 className="text-6xl md:text-8xl font-black text-bee-black mb-6 tracking-tight drop-shadow-sm">
                    Defend your <span className="text-bee-gold relative inline-block">
                        Focus
                        <svg className="absolute w-full h-4 -bottom-2 left-0 text-bee-amber opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                            <path d="M0 5 Q 50 15 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                        </svg>
                    </span>.
                </h1>
                <p className="text-2xl text-bee-brown/80 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                    Turn your busy day into a game. Build your comb, fill your cells, and collect nectar.
                </p>
                <Link
                    href="/signin"
                    className="inline-flex items-center gap-3 btn-honey px-10 py-5 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
                >
                    Join the Swarm <ArrowRight size={24} />
                </Link>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-6 py-20 relative z-10">
                <div className="grid md:grid-cols-3 gap-10">
                    <div className="glass-panel p-10 rounded-[2rem] hover:-translate-y-2 transition-transform duration-300 border-b-4 border-bee-gold/20">
                        <div className="w-16 h-16 bg-bee-pale rounded-2xl flex items-center justify-center text-bee-amber mb-6 rotate-3 shadow-inner">
                            <Hexagon size={36} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-2xl font-bold text-bee-black mb-4">Build Your Comb</h3>
                        <p className="text-bee-brown/70 text-lg leading-relaxed">
                            Organize your tasks into Projects (Combs). Visual, tactile, and satisfying to complete.
                        </p>
                    </div>
                    <div className="glass-panel p-10 rounded-[2rem] hover:-translate-y-2 transition-transform duration-300 border-b-4 border-bee-gold/20">
                        <div className="w-16 h-16 bg-bee-pale rounded-2xl flex items-center justify-center text-bee-amber mb-6 -rotate-3 shadow-inner">
                            <Clock size={36} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-2xl font-bold text-bee-black mb-4">Fill Cells</h3>
                        <p className="text-bee-brown/70 text-lg leading-relaxed">
                            Focus for 25 minutes to fill a Cell with nectar. Protect your time from interruptions.
                        </p>
                    </div>
                    <div className="glass-panel p-10 rounded-[2rem] hover:-translate-y-2 transition-transform duration-300 border-b-4 border-bee-gold/20">
                        <div className="w-16 h-16 bg-bee-pale rounded-2xl flex items-center justify-center text-bee-amber mb-6 rotate-3 shadow-inner">
                            <BarChart3 size={36} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-2xl font-bold text-bee-black mb-4">Collect Nectar</h3>
                        <p className="text-bee-brown/70 text-lg leading-relaxed">
                            Earn XP (Nectar) for every cell filled. Maintain your streak and climb the leaderboard.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white/60 backdrop-blur-md py-12 border-t border-bee-gold/10 relative z-10">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-bee-brown/60 font-bold text-lg">&copy; {new Date().getFullYear()} PlanBee. The Hive awaits.</p>
                </div>
            </footer>
        </div>
    );
}
