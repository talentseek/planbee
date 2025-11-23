'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AddTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
}

import { authClient } from '@/lib/auth-client';

// ...

export default function AddTaskModal({ isOpen, onClose, projectId }: AddTaskModalProps) {
    const [title, setTitle] = useState('');
    const [estimatedCells, setEstimatedCells] = useState(1);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { data: session } = authClient.useSession();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    title,
                    estimatedCells,
                    projectId,
                    userId: session?.user?.id // Pass userId
                }),
            });

            if (res.ok) {
                // Reset form
                setTitle('');
                setEstimatedCells(1);
                onClose();
                router.refresh();
            } else {
                alert('Failed to create task');
            }
        } catch (error) {
            console.error(error);
            alert('Error creating task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-honey w-full max-w-md overflow-hidden">
                <div className="p-6 bg-bee-yellow flex items-center justify-between">
                    <h2 className="text-xl font-bold text-bee-black">Add New Task</h2>
                    <button onClick={onClose} className="text-bee-black hover:bg-white/20 p-2 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Design new feature"
                            required
                            className="w-full p-3 text-bee-black rounded-xl border-2 border-gray-300 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-bee-yellow transition-all"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Cells</label>
                        <input
                            type="number"
                            min="1"
                            max="50"
                            value={estimatedCells}
                            onChange={(e) => setEstimatedCells(parseInt(e.target.value))}
                            className="w-full p-3 text-bee-black rounded-xl border-2 border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-bee-yellow transition-all font-bold"
                        />
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
                            className="bg-bee-black text-white px-6 py-2 rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            <Plus size={18} />
                            {loading ? 'Creating...' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
