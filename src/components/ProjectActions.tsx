'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Edit2, Trash2, Plus } from 'lucide-react';
import EditProjectModal from '@/components/EditProjectModal';
import AddTaskModal from '@/components/AddTaskModal';

interface ProjectActionsProps {
    project: {
        id: string;
        title: string;
        color: string;
    };
}

export default function ProjectActions({ project }: ProjectActionsProps) {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            return;
        }

        setDeleting(true);
        try {
            const res = await fetch(`/api/projects?id=${project.id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (res.ok) {
                router.push('/projects');
                router.refresh();
            } else {
                alert('Failed to delete project');
            }
        } catch (error) {
            console.error(error);
            alert('Error deleting project');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            <div className="flex gap-2">
                <button
                    onClick={() => setShowAddTaskModal(true)}
                    className="flex items-center gap-2 bg-bee-yellow hover:bg-bee-gold text-bee-black px-4 py-2 rounded-xl font-bold transition-colors shadow-sm"
                >
                    <Plus size={18} />
                    Add Task
                </button>
                <button
                    onClick={() => setShowEditModal(true)}
                    className="flex items-center gap-2 bg-white hover:bg-gray-50 text-bee-black px-4 py-2 rounded-xl font-bold transition-colors border-2 border-gray-200"
                >
                    <Edit2 size={18} />
                    Edit
                </button>
                <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-bold transition-colors disabled:opacity-50"
                >
                    <Trash2 size={18} />
                    {deleting ? 'Deleting...' : 'Delete'}
                </button>
            </div>

            <EditProjectModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                project={project}
            />

            <AddTaskModal
                isOpen={showAddTaskModal}
                onClose={() => setShowAddTaskModal(false)}
                projectId={project.id}
            />
        </>
    );
}
