import Link from 'next/link';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';

interface ProjectCardProps {
    project: {
        id: string;
        title: string;
        color: string;
        createdAt: Date;
        tasks: { completedCells: number; estimatedCells: number; status: string }[];
        _count: {
            tasks: number;
        };
    };
}

export default function ProjectCard({ project }: ProjectCardProps) {
    const totalCompleted = project.tasks.reduce((acc, task) => acc + task.completedCells, 0);
    const estimate = project.tasks.reduce((acc, task) => acc + task.estimatedCells, 0);
    const progress = estimate > 0 ? Math.min(100, (totalCompleted / estimate) * 100) : 0;
    const completedTasks = project.tasks.filter(t => t.status === 'DONE').length;

    return (
        <Link href={`/projects/${project.id}`} className="block group">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all group-hover:shadow-honey group-hover:-translate-y-1 overflow-hidden relative">
                {/* Color accent */}
                <div
                    className="absolute top-0 left-0 w-2 h-full transition-all group-hover:w-3"
                    style={{ backgroundColor: project.color }}
                />

                <div className="pl-4">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-bee-black group-hover:text-bee-amber transition-colors">
                            {project.title}
                        </h3>
                        <div className="bg-bee-pale text-bee-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <Clock size={12} />
                            {totalCompleted} / {estimate > 0 ? estimate : '?'}
                        </div>
                    </div>

                    {estimate > 0 && (
                        <div className="mb-4">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Progress</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                        width: `${progress}%`,
                                        backgroundColor: project.color
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                            <CheckCircle2 size={16} />
                            <span>{completedTasks} / {project._count.tasks} tasks</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar size={16} />
                            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
