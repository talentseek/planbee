'use client';

import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface EditProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: {
        id: string;
        title: string;
        color: string;
    };
}

const COLORS = [
    '#FCD34D', // Bee Yellow
    '#F59E0B', // Bee Gold
    '#D97706', // Bee Amber
    '#EF4444', // Red
    '#3B82F6', // Blue
    '#10B981', // Green
    '#8B5CF6', // Purple
    '#EC4899', // Pink
];

export default function EditProjectModal({ isOpen, onClose, project }: EditProjectModalProps) {
    const [title, setTitle] = useState(project.title);
    const [color, setColor] = useState(project.color);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/projects', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    id: project.id,
                    title,
                    color
                }),
            });

            if (res.ok) {
                onClose();
                router.refresh();
            } else {
                alert('Failed to update project');
            }
        } catch (error) {
            console.error(error);
            alert('Error updating project');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-honey w-full max-w-md overflow-hidden">
                <div className="p-6 bg-bee-yellow flex items-center justify-between">
                    <h2 className="text-xl font-bold text-bee-black">Edit Project</h2>
                    <button onClick={onClose} className="text-bee-black hover:bg-white/20 p-2 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full p-3 text-bee-black rounded-xl border-2 border-gray-300 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-bee-yellow transition-all"
                            autoFocus
                        />
                    </div>



                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hive Color</label>
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
                            className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-bee-black text-white px-6 py-2 rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
