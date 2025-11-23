'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AddTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
}

export default function AddTaskModal({ isOpen, onClose, projectId }: AddTaskModalProps) {
    const [title, setTitle] = useState('');
    const [estimatedCells, setEstimatedCells] = useState(1);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { data: session } = authClient.useSession();

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
                    userId: session?.user?.id
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
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Add New Task</DialogTitle>
                    <DialogDescription>
                        Break down your project into manageable tasks.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Task Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Design new feature"
                            required
                            autoFocus
                            className="font-medium"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="estimatedCells">Estimated Cells (25m each)</Label>
                        <Input
                            id="estimatedCells"
                            type="number"
                            min="1"
                            max="50"
                            value={estimatedCells}
                            onChange={(e) => setEstimatedCells(parseInt(e.target.value))}
                            className="font-bold text-lg"
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="gap-2 font-bold"
                        >
                            <Plus size={18} />
                            {loading ? 'Creating...' : 'Create Task'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
