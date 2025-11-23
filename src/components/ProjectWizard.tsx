'use client';

import { useState } from 'react';
import { X, Check, ArrowRight, ArrowLeft, Briefcase, Clock, ListTodo } from 'lucide-react';
import { useRouter } from 'next/navigation';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

interface ProjectWizardProps {
    isOpen: boolean;
    onClose: () => void;
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

const SIZES = [
    { id: 'small', label: 'Small Comb', cells: 2, desc: 'Quick task (1-2 hours)' },
    { id: 'medium', label: 'Medium Comb', cells: 5, desc: 'Solid effort (Half day)' },
    { id: 'large', label: 'Large Comb', cells: 10, desc: 'Big project (Full day+)' },
    { id: 'custom', label: 'Custom', cells: 0, desc: 'Set your own goal' },
];

export default function ProjectWizard({ isOpen, onClose }: ProjectWizardProps) {
    const [step, setStep] = useState(1);
    const [title, setTitle] = useState('');
    const [color, setColor] = useState(COLORS[0]);
    const [size, setSize] = useState(SIZES[1]);
    const [customSize, setCustomSize] = useState(5);
    const [tasks, setTasks] = useState<{ title: string; estimatedCells: number }[]>([]);
    const [newTask, setNewTask] = useState('');
    const [newTaskEst, setNewTaskEst] = useState(1);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const totalCells = size.id === 'custom' ? customSize : size.cells;

    const handleAddTask = () => {
        if (newTask.trim()) {
            setTasks([...tasks, { title: newTask, estimatedCells: newTaskEst }]);
            setNewTask('');
            setNewTaskEst(1);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    title,
                    color,
                    tasks
                }),
            });

            if (res.ok) {
                onClose();
                router.refresh();
                // Reset state
                setStep(1);
                setTitle('');
                setTasks([]);
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
            <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
                <DialogHeader className="p-6 bg-primary/10 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-foreground font-bold bg-primary">
                            {step}/3
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold">
                                {step === 1 && "Name your Comb"}
                                {step === 2 && "Size the Comb"}
                                {step === 3 && "Plan the Work"}
                            </DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                                {step === 1 && "Give your project a clear identity"}
                                {step === 2 && "Estimate the effort required"}
                                {step === 3 && "Break it down into actionable steps"}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="p-8 overflow-y-auto flex-1">
                    {step === 1 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-3">
                                <Label className="text-lg font-bold">Comb Title</Label>
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., Build New Feature"
                                    className="p-4 text-xl h-auto"
                                    autoFocus
                                />
                            </div>

                            <div className="space-y-3">
                                <Label className="text-lg font-bold">Comb Color</Label>
                                <div className="flex flex-wrap gap-4">
                                    {COLORS.map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => setColor(c)}
                                            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all hover:scale-110 ${color === c ? 'ring-4 ring-offset-2 ring-primary scale-110 shadow-lg' : ''
                                                }`}
                                            style={{ backgroundColor: c }}
                                        >
                                            {color === c && <Check size={24} className="text-white" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {SIZES.map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() => setSize(s)}
                                        className={`p-6 rounded-2xl border-2 text-left transition-all hover:border-primary/50 hover:bg-secondary/30 ${size.id === s.id
                                            ? 'border-primary bg-secondary/50 ring-2 ring-primary/20'
                                            : 'border-border bg-card'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-bold text-lg">{s.label}</span>
                                            {size.id === s.id && <Check className="text-primary" />}
                                        </div>
                                        <div className="text-sm text-muted-foreground mb-3 font-medium">{s.desc}</div>
                                        {s.id !== 'custom' && (
                                            <Badge variant="outline" className="gap-1">
                                                <Clock size={12} />
                                                {s.cells} Cells
                                            </Badge>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {size.id === 'custom' && (
                                <div className="bg-secondary/20 p-6 rounded-2xl border border-border">
                                    <Label className="block text-sm font-bold mb-2">
                                        How many Cells?
                                    </Label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="range"
                                            min="1"
                                            max="50"
                                            value={customSize}
                                            onChange={(e) => setCustomSize(parseInt(e.target.value))}
                                            className="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                                        />
                                        <div className="w-16 h-16 bg-card rounded-xl border-2 border-primary flex items-center justify-center text-xl font-bold shadow-sm">
                                            {customSize}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="bg-secondary/30 p-4 rounded-2xl border border-primary/20 flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground">
                                    <Briefcase size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold">{title}</h3>
                                    <p className="text-sm text-muted-foreground">Target: {totalCells} Cells</p>
                                </div>
                            </div>

                            <div>
                                <Label className="block text-sm font-bold mb-3">
                                    Break it down (Optional)
                                </Label>
                                <div className="flex gap-2 mb-4">
                                    <Input
                                        value={newTask}
                                        onChange={(e) => setNewTask(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                                        placeholder="Add a task step..."
                                        className="flex-1"
                                    />
                                    <Input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={newTaskEst}
                                        onChange={(e) => setNewTaskEst(parseInt(e.target.value))}
                                        className="w-24 text-center font-bold"
                                        title="Estimated Cells"
                                    />
                                    <Button
                                        onClick={handleAddTask}
                                        size="icon"
                                    >
                                        <Check size={20} />
                                    </Button>
                                </div>

                                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                    {tasks.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-xl">
                                            <ListTodo className="mx-auto mb-2 opacity-50" />
                                            <p>No tasks added yet</p>
                                        </div>
                                    ) : (
                                        tasks.map((t, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 bg-card border border-border rounded-xl shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-primary-foreground text-foreground">
                                                        {i + 1}
                                                    </div>
                                                    <span className="font-medium">{t.title}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Clock size={14} />
                                                    <span>{t.estimatedCells}</span>
                                                    <button
                                                        onClick={() => setTasks(tasks.filter((_, idx) => idx !== i))}
                                                        className="ml-2 text-red-400 hover:text-red-600"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-border bg-secondary/10 flex justify-between items-center shrink-0">
                    {step > 1 ? (
                        <Button
                            variant="ghost"
                            onClick={() => setStep(step - 1)}
                            className="gap-2"
                        >
                            <ArrowLeft size={18} />
                            Back
                        </Button>
                    ) : (
                        <div />
                    )}

                    <Button
                        onClick={() => {
                            if (step < 3) {
                                if (step === 1 && !title) return; // Validation
                                setStep(step + 1);
                            } else {
                                handleSubmit();
                            }
                        }}
                        disabled={step === 1 && !title}
                        className={`gap-2 font-bold shadow-lg ${step === 1 && !title ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        {loading ? (
                            'Creating...'
                        ) : step === 3 ? (
                            <>Create Comb <Check size={18} /></>
                        ) : (
                            <>Next Step <ArrowRight size={18} /></>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
