'use client';

import React from 'react';
import { cn } from "@/lib/utils";

interface HexagonProps {
    children: React.ReactNode;
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    color?: string;
    onClick?: () => void;
    state?: 'empty' | 'filling' | 'complete';
    progress?: number; // 0-100 for filling animation
    animated?: boolean;
}

export default function Hexagon({
    children,
    className = '',
    size = 'md',
    // color = 'bg-card',
    onClick,
    state = 'empty',
    progress = 0,
    animated = true
}: HexagonProps) {
    const sizeClasses = {
        sm: 'w-16 h-16',
        md: 'w-32 h-32',
        lg: 'w-48 h-48',
        xl: 'w-64 h-64',
    };

    // Determine animation classes based on state
    const getStateClasses = () => {
        if (!animated) return '';

        switch (state) {
            case 'filling':
                return 'animate-pulse';
            case 'complete':
                return 'hexagon-shadow-glow';
            default:
                return '';
        }
    };

    // Create gradient for completed state
    const getBackgroundStyle = () => {
        if (state === 'complete') {
            return {
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                boxShadow: 'inset 0 0 20px rgba(255,255,255,0.3)',
            };
        }
        return {};
    };

    return (
        <div
            className={cn(
                "relative flex items-center justify-center transition-all duration-300",
                sizeClasses[size],
                className,
                onClick && "cursor-pointer hover:scale-105 active:scale-95",
                getStateClasses()
            )}
            onClick={onClick}
            style={{
                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
            }}
        >
            {/* Glassmorphic Base Hexagon */}
            <div
                className={cn(
                    "absolute inset-0 transition-all duration-500",
                    state === 'complete' 
                        ? 'bg-amber-500' 
                        : 'bg-white/40 backdrop-blur-sm border-2 border-white/50'
                )}
                style={{
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                    ...getBackgroundStyle(),
                }}
            >
                {/* Inner Border/Highlight */}
                 <div 
                    className="absolute inset-[2px] bg-transparent pointer-events-none"
                    style={{
                        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                        border: '1px solid rgba(255,255,255,0.4)'
                    }}
                />
            </div>

            {/* Liquid Fill Animation */}
            {state === 'filling' && animated && (
                <div className="absolute inset-0 overflow-hidden" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                    <div
                        className="absolute bottom-0 left-0 right-0 bg-amber-400/80 transition-all duration-1000 ease-out"
                        style={{
                            height: `${progress}%`,
                            width: '100%',
                        }}
                    >
                        <div
                            className="absolute top-0 left-0 w-[200%] h-2 bg-white/40"
                            style={{
                                animation: 'liquid-wave 3s linear infinite',
                                transformOrigin: 'center bottom'
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Hover glow effect */}
            {onClick && (
                <div
                    className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                        background: 'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)'
                    }}
                />
            )}

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center p-4 w-full h-full">
                {children}
            </div>
        </div>
    );
}
