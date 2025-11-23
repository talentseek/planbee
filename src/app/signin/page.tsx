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
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-bee-yellow via-bee-gold to-bee-amber flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-honey w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-bee-black mb-2">🐝 PlanBee</h1>
                    <p className="text-gray-600">{isSignUp ? 'Create your hive' : 'Welcome back to the hive'}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {isSignUp && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your name"
                                required={isSignUp}
                                className="w-full p-3 text-bee-black rounded-xl border-2 border-gray-300 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-bee-yellow transition-all"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            className="w-full p-3 text-bee-black rounded-xl border-2 border-gray-300 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-bee-yellow transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full p-3 text-bee-black rounded-xl border-2 border-gray-300 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-bee-yellow transition-all"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-xl">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-bee-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-bee-gold hover:text-bee-amber font-medium transition-colors"
                    >
                        {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                    </button>
                </div>
            </div>
        </div>
    );
}
