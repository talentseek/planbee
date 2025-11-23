'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>New Comb</DialogTitle>
                    <DialogDescription>
                        Create a new project container for your tasks.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Comb Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Build PlanBee"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Comb Color</Label>
                        <div className="flex flex-wrap gap-3">
                            {COLORS.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setColor(c)}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${color === c ? 'ring-2 ring-offset-2 ring-primary' : ''
                                        }`}
                                    style={{ backgroundColor: c }}
                                >
                                    {color === c && <Check size={16} className="text-white" />}
                                </button>
                            ))}
                        </div>
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
                            className="font-bold"
                        >
                            {loading ? 'Creating...' : 'Create Comb'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
