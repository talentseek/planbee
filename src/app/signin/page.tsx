'use client';

import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isSignUp) {
                await authClient.signUp.email({
                    email,
                    password,
                    name,
                });
                router.push('/onboarding');
            } else {
                await authClient.signIn.email({
                    email,
                    password,
                });
                router.push('/dashboard');
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Authentication failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-bee-yellow via-bee-gold to-bee-amber flex items-center justify-center p-4 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-white/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-bee-brown/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            </div>

            <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl w-full max-w-md p-8 relative z-10 border border-white/50">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/planbeelogo.png" alt="PlanBee Logo" className="w-20 h-20 object-contain drop-shadow-md hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h1 className="text-3xl font-black text-bee-black mb-2 tracking-tight">PlanBee</h1>
                    <p className="text-bee-brown/70 font-medium">{isSignUp ? 'Create your hive' : 'Welcome back to the hive'}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {isSignUp && (
                        <div>
                            <label className="block text-sm font-bold text-bee-brown mb-2 ml-1">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your name"
                                required={isSignUp}
                                className="w-full p-4 text-bee-black rounded-xl border-2 border-bee-pale bg-bee-pale/50 placeholder:text-gray-400 focus:outline-none focus:border-bee-gold focus:bg-white transition-all font-medium"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-bee-brown mb-2 ml-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            className="w-full p-4 text-bee-black rounded-xl border-2 border-bee-pale bg-bee-pale/50 placeholder:text-gray-400 focus:outline-none focus:border-bee-gold focus:bg-white transition-all font-medium"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-bee-brown mb-2 ml-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full p-4 text-bee-black rounded-xl border-2 border-bee-pale bg-bee-pale/50 placeholder:text-gray-400 focus:outline-none focus:border-bee-gold focus:bg-white transition-all font-medium"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 border-2 border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
                            <span className="text-xl">⚠️</span> {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-bee-black text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none mt-4"
                    >
                        {loading ? 'Buzzing...' : isSignUp ? 'Sign Up' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 text-center pt-6 border-t border-bee-pale">
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-bee-brown hover:text-bee-gold font-bold transition-colors text-sm"
                    >
                        {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                    </button>
                </div>
            </div>
        </div>
    );
}
