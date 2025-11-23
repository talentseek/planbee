import React from 'react';

interface HexagonProps {
    children: React.ReactNode;
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    color?: string;
    onClick?: () => void;
}

export default function Hexagon({ children, className = '', size = 'md', color = 'bg-white', onClick }: HexagonProps) {
    const sizeClasses = {
        sm: 'w-16 h-16',
        md: 'w-32 h-32',
        lg: 'w-48 h-48',
        xl: 'w-64 h-64',
    };

    return (
        <div
            className={`relative flex items-center justify-center ${sizeClasses[size]} ${className} ${onClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
            onClick={onClick}
        >
            <div
                className={`absolute inset-0 ${color}`}
                style={{
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                }}
            ></div>
            <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
                {children}
            </div>
        </div>
    );
}
