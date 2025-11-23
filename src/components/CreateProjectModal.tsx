'use client';

import { useState } from 'react';
import { X, Check } from 'lucide-react';

import { useRouter } from 'next/navigation';

interface CreateProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const COLORS = [
    '#FCD34D', // Bee Yellow
    '#F59E0B', // Bee Gold
    '#EF4444', // Red
    '#3B82F6', // Blue
    '#10B981', // Green
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#6B7280', // Gray
];

export default function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
    const [title, setTitle] = useState('');
    const [color, setColor] = useState(COLORS[0]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    title,
                    color,
                }),
            });

            if (res.ok) {
                setTitle('');
                setColor(COLORS[0]);
                onClose();
                router.refresh(); // Refresh server components
            } else {
                alert('Failed to create project');
            }
        } catch (error) {
            console.error(error);
            alert('Error creating project');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 bg-bee-yellow flex items-center justify-between">
                    <h2 className="text-xl font-bold text-bee-black">New Comb</h2>
                    <button onClick={onClose} className="text-bee-black hover:bg-white/20 p-2 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Comb Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Build PlanBee"
                            required
                            className="w-full p-3 text-bee-black rounded-xl border-2 border-gray-300 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-bee-yellow transition-all"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Comb Color</label>
                        <div className="flex flex-wrap gap-3">
                            {COLORS.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setColor(c)}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${color === c ? 'ring-2 ring-offset-2 ring-bee-black' : ''
                                        }`}
                                    style={{ backgroundColor: c }}
                                >
                                    {color === c && <Check size={16} className="text-white" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-bee-black text-white px-6 py-2 rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? 'Creating...' : 'Create Comb'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
