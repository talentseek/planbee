'use client';

import { useState } from 'react';
import { X, Check, ArrowRight, ArrowLeft, Briefcase, Clock, ListTodo } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

    if (!isOpen) return null;

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-honey w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 bg-bee-yellow flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-bee-black font-bold">
                            {step}/3
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-bee-black">
                                {step === 1 && "Name your Comb"}
                                {step === 2 && "Size the Comb"}
                                {step === 3 && "Plan the Work"}
                            </h2>
                            <p className="text-bee-black/70 text-sm">
                                {step === 1 && "Give your project a clear identity"}
                                {step === 2 && "Estimate the effort required"}
                                {step === 3 && "Break it down into actionable steps"}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-bee-black hover:bg-white/20 p-2 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto flex-1">
                    {step === 1 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <label className="block text-lg font-bold text-bee-black mb-3">Comb Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., Build New Feature"
                                    className="w-full p-4 text-xl text-bee-black rounded-2xl border-2 border-gray-300 bg-white placeholder:text-gray-400 focus:outline-none focus:border-bee-yellow focus:ring-4 focus:ring-bee-yellow/20 transition-all"
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-bold text-bee-black mb-3">Comb Color</label>
                                <div className="flex flex-wrap gap-4">
                                    {COLORS.map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => setColor(c)}
                                            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all hover:scale-110 ${color === c ? 'ring-4 ring-offset-2 ring-bee-black scale-110 shadow-lg' : ''
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
                                        className={`p-6 rounded-2xl border-2 text-left transition-all hover:border-bee-yellow hover:bg-bee-pale/30 ${size.id === s.id
                                            ? 'border-bee-yellow bg-bee-pale ring-2 ring-bee-yellow/50'
                                            : 'border-gray-100 bg-white'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-bold text-lg text-bee-black">{s.label}</span>
                                            {size.id === s.id && <Check className="text-bee-gold" />}
                                        </div>
                                        <div className="text-sm text-gray-600 mb-3 font-medium">{s.desc}</div>
                                        {s.id !== 'custom' && (
                                            <div className="inline-flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-gray-200 text-xs font-bold text-gray-600">
                                                <Clock size={12} />
                                                {s.cells} Cells
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {size.id === 'custom' && (
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        How many Cells?
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="range"
                                            min="1"
                                            max="50"
                                            value={customSize}
                                            onChange={(e) => setCustomSize(parseInt(e.target.value))}
                                            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-bee-gold"
                                        />
                                        <div className="w-16 h-16 bg-white rounded-xl border-2 border-bee-yellow flex items-center justify-center text-xl font-bold text-bee-black shadow-sm">
                                            {customSize}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="bg-bee-pale/50 p-4 rounded-2xl border border-bee-yellow/20 flex items-center gap-4">
                                <div className="w-12 h-12 bg-bee-yellow rounded-xl flex items-center justify-center text-bee-black">
                                    <Briefcase size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-bee-black">{title}</h3>
                                    <p className="text-sm text-gray-600">Target: {totalCells} Cells</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-3">
                                    Break it down (Optional)
                                </label>
                                <div className="flex gap-2 mb-4">
                                    <input
                                        type="text"
                                        value={newTask}
                                        onChange={(e) => setNewTask(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                                        placeholder="Add a task step..."
                                        className="flex-1 p-3 text-bee-black rounded-xl border-2 border-gray-300 bg-white placeholder:text-gray-400 focus:outline-none focus:border-bee-yellow focus:ring-2 focus:ring-bee-yellow/20"
                                    />
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={newTaskEst}
                                        onChange={(e) => setNewTaskEst(parseInt(e.target.value))}
                                        className="w-20 p-3 text-bee-black rounded-xl border-2 border-gray-300 bg-white focus:outline-none focus:border-bee-yellow focus:ring-2 focus:ring-bee-yellow/20 text-center font-bold"
                                        title="Estimated Cells"
                                    />
                                    <button
                                        onClick={handleAddTask}
                                        className="bg-bee-black text-white p-3 rounded-xl hover:bg-gray-800 transition-colors"
                                    >
                                        <Check size={20} />
                                    </button>
                                </div>

                                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                    {tasks.length === 0 ? (
                                        <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                                            <ListTodo className="mx-auto mb-2 opacity-50" />
                                            <p>No tasks added yet</p>
                                        </div>
                                    ) : (
                                        tasks.map((t, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-6 h-6 rounded-full bg-bee-pale flex items-center justify-center text-xs font-bold text-bee-gold">
                                                        {i + 1}
                                                    </div>
                                                    <span className="font-medium text-gray-800">{t.title}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
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
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center shrink-0">
                    {step > 1 ? (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="flex items-center gap-2 text-gray-700 hover:text-bee-black font-bold px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            <ArrowLeft size={18} />
                            Back
                        </button>
                    ) : (
                        <div />
                    )}

                    <button
                        onClick={() => {
                            if (step < 3) {
                                if (step === 1 && !title) return; // Validation
                                setStep(step + 1);
                            } else {
                                handleSubmit();
                            }
                        }}
                        disabled={step === 1 && !title}
                        className={`flex items-center gap-2 bg-bee-yellow text-bee-black px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-bee-gold transition-all transform active:scale-95 ${step === 1 && !title ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        {loading ? (
                            'Creating...'
                        ) : step === 3 ? (
                            <>Create Comb <Check size={18} /></>
                        ) : (
                            <>Next Step <ArrowRight size={18} /></>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
