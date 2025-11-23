'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

interface TaskActionsProps {
    task: {
        id: string;
        title: string;
        estimatedCells: number;
        completedCells: number;
        status: string;
    };
}

export default function TaskActions({ task }: TaskActionsProps) {
    const [deleting, setDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this task?')) {
            return;
        }

        setDeleting(true);
        try {
            const res = await fetch(`/api/tasks?id=${task.id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (res.ok) {
                router.refresh();
            } else {
                alert('Failed to delete task');
            }
        } catch (error) {
            console.error(error);
            alert('Error deleting task');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="flex gap-2">
            <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                title="Delete task"
            >
                <Trash2 size={16} />
            </button>
        </div>
    );
}
