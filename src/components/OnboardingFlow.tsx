'use client';

import { useState } from 'react';
import { ArrowRight, Check, Calendar as CalendarIcon } from 'lucide-react';
import Hexagon from './Hexagon';

export default function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
    const [step, setStep] = useState(1);
    const [intensity, setIntensity] = useState<'glider' | 'worker' | 'hero'>('worker');

    const nextStep = () => setStep(step + 1);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bee-pale/90 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden relative border border-bee-gold/20">
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gray-100">
                    <div
                        className="h-full bg-bee-gold transition-all duration-500 ease-out"
                        style={{ width: `${(step / 3) * 100}%` }}
                    ></div>
                </div>

                <div className="p-12 text-center">
                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="flex justify-center mb-8 relative">
                                <div className="absolute inset-0 bg-bee-yellow blur-3xl opacity-30 rounded-full"></div>
                                <Hexagon size="xl" color="bg-bee-gold" className="animate-pulse shadow-honey text-white">
                                    <span className="text-6xl font-bold">B</span>
                                </Hexagon>
                            </div>
                            <h2 className="text-4xl font-bold text-bee-brown mb-4">Welcome to the Hive.</h2>
                            <p className="text-xl text-gray-600 mb-10 max-w-md mx-auto">
                                Let's turn your busy day into a focused one. Defend your time and collect nectar.
                            </p>
                            <button
                                onClick={nextStep}
                                className="btn-honey px-8 py-4 rounded-xl font-bold text-lg inline-flex items-center gap-2 hover:scale-105 transition-transform"
                            >
                                Enter the Hive <ArrowRight size={20} />
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                            <h2 className="text-3xl font-bold text-bee-brown mb-2">Choose your Flight Path</h2>
                            <p className="text-gray-600 mb-8">How much energy do you have today?</p>

                            <div className="grid md:grid-cols-3 gap-4 mb-10 text-left">
                                {/* Glider */}
                                <div
                                    onClick={() => setIntensity('glider')}
                                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${intensity === 'glider'
                                            ? 'border-bee-gold bg-bee-pale/30 shadow-honey scale-105'
                                            : 'border-gray-100 hover:border-bee-pale hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="text-2xl mb-2">🦋</div>
                                    <h3 className="font-bold text-bee-brown">Garden Glider</h3>
                                    <p className="text-sm text-gray-500 mt-1">Light pace. Target: 4 Cells (2 hrs).</p>
                                </div>

                                {/* Worker Bee */}
                                <div
                                    onClick={() => setIntensity('worker')}
                                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${intensity === 'worker'
                                            ? 'border-bee-gold bg-bee-pale/30 shadow-honey scale-105'
                                            : 'border-gray-100 hover:border-bee-pale hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="text-2xl mb-2">🐝</div>
                                    <h3 className="font-bold text-bee-brown">Worker Bee</h3>
                                    <p className="text-sm text-gray-500 mt-1">Standard. Target: 8 Cells (4 hrs).</p>
                                    <span className="inline-block mt-2 text-xs bg-bee-gold text-white px-2 py-0.5 rounded-full">Recommended</span>
                                </div>

                                {/* Hero Mode */}
                                <div
                                    onClick={() => setIntensity('hero')}
                                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${intensity === 'hero'
                                            ? 'border-bee-gold bg-bee-pale/30 shadow-honey scale-105'
                                            : 'border-gray-100 hover:border-bee-pale hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="text-2xl mb-2">🦸</div>
                                    <h3 className="font-bold text-bee-brown">Hero Mode</h3>
                                    <p className="text-sm text-gray-500 mt-1">Intense. Target: 12+ Cells.</p>
                                </div>
                            </div>

                            <button
                                onClick={nextStep}
                                className="btn-honey px-8 py-3 rounded-xl font-bold inline-flex items-center gap-2"
                            >
                                Confirm Intensity <ArrowRight size={20} />
                            </button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                            <div className="w-20 h-20 bg-bee-pale rounded-full flex items-center justify-center mx-auto mb-6 text-bee-amber">
                                <CalendarIcon size={40} />
                            </div>
                            <h2 className="text-3xl font-bold text-bee-brown mb-4">Scout the Perimeter</h2>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                Connect your calendar so we can find safe gaps for your Cells. We'll mark your focus time as <strong>"Busy: Defending the Hive"</strong>.
                            </p>

                            <div className="space-y-3 mb-10 max-w-sm mx-auto">
                                <button className="w-full p-4 rounded-xl border border-gray-200 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left group">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" alt="Google" className="w-6 h-6" />
                                    <span className="font-medium text-gray-700 group-hover:text-bee-brown">Connect Google Calendar</span>
                                </button>
                                <button className="w-full p-4 rounded-xl border border-gray-200 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left group">
                                    <span className="w-6 h-6 bg-gray-200 rounded-md flex items-center justify-center text-xs font-bold text-gray-500">iCal</span>
                                    <span className="font-medium text-gray-700 group-hover:text-bee-brown">Connect Apple Calendar</span>
                                </button>
                            </div>

                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={onComplete}
                                    className="btn-honey px-8 py-3 rounded-xl font-bold inline-flex items-center justify-center gap-2"
                                >
                                    Finish Setup <Check size={20} />
                                </button>
                                <button
                                    onClick={onComplete}
                                    className="text-gray-400 text-sm hover:text-bee-brown transition-colors"
                                >
                                    Skip for now
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
