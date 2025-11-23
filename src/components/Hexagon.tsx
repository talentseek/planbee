'use client';

import React from 'react';

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
    color = 'bg-white',
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
                background: 'linear-gradient(135deg, #FCD34D 0%, #F59E0B 50%, #D97706 100%)',
                backgroundSize: '200% 200%',
            };
        }
        return {};
    };

    return (
        <div
            className={`relative flex items-center justify-center ${sizeClasses[size]} ${className} ${onClick ? 'cursor-pointer hover:scale-110 transition-all duration-300' : ''} ${getStateClasses()}`}
            onClick={onClick}
            style={{
                animation: animated && state !== 'complete' ? 'float 3s ease-in-out infinite' : undefined,
                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
            }}
        >
            {/* Glassmorphic Base Hexagon */}
            <div
                className={`absolute inset-0 transition-all duration-500 ${state === 'complete' ? '' : 'bg-white/40 backdrop-blur-md border border-white/50'}`}
                style={{
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                    ...getBackgroundStyle(),
                }}
            >
                {/* Shimmer effect for completed state */}
                {state === 'complete' && animated && (
                    <div
                        className="absolute inset-0 shimmer-effect"
                        style={{
                            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                        }}
                    />
                )}
            </div>

            {/* Liquid Fill Animation */}
            {state === 'filling' && animated && (
                <div className="absolute inset-0 overflow-hidden" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                    <div
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-bee-gold to-bee-yellow opacity-80 transition-all duration-1000 ease-out"
                        style={{
                            height: `${progress}%`,
                            width: '100%',
                        }}
                    >
                        <div
                            className="absolute top-0 left-0 w-[200%] h-4 bg-white/30"
                            style={{
                                animation: 'liquid-wave 2s linear infinite',
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
                        boxShadow: '0 0 24px rgba(245, 158, 11, 0.6)',
                        background: 'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)'
                    }}
                />
            )}

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
                {children}
            </div>
        </div>
    );
}
