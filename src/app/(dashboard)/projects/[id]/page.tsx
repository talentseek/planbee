import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import ProjectActions from '@/components/ProjectActions';
import TaskActions from '@/components/TaskActions';

export const dynamic = 'force-dynamic';

interface ProjectPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { id } = await params;
    const project = await prisma.project.findUnique({
        where: { id },
        include: {
            tasks: {
                include: {
                    _count: {
                        select: { focusSessions: true }
                    }
                },
            },
        }
    });

    if (!project) {
        notFound();
    }

    const totalCompleted = project.tasks.reduce((acc, task) => acc + task.completedCells, 0);
    const estimatedCells = project.tasks.reduce((acc, task) => acc + task.estimatedCells, 0);
    const progress = estimatedCells > 0
        ? Math.min(100, (totalCompleted / estimatedCells) * 100)
        : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-bee-black font-medium mb-4 transition-colors"
                >
                    <ArrowLeft size={16} />
                    Back to Projects
                </Link>

                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div
                                className="w-4 h-12 rounded-full"
                                style={{ backgroundColor: project.color }}
                            />
                            <h1 className="text-4xl font-bold text-bee-black">{project.title}</h1>
                        </div>
                        <p className="text-gray-600 font-medium">
                            Created {new Date(project.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <ProjectActions project={{
                        id: project.id,
                        title: project.title,
                        color: project.color
                    }} />
                </div>

                {/* Progress Section */}
                {estimatedCells > 0 && (
                    <div className="mt-6 bg-white p-6 rounded-2xl border border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-bee-black">Project Progress</h3>
                            <div className="flex items-center gap-2 text-sm">
                                <Clock size={16} className="text-bee-gold" />
                                <span className="font-bold text-bee-black">
                                    {totalCompleted} / {estimatedCells} Cells
                                </span>
                            </div>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                    width: `${progress}%`,
                                    backgroundColor: project.color
                                }}
                            />
                        </div>
                        <p className="text-sm text-gray-600 mt-2 font-medium">{Math.round(progress)}% Complete</p>
                    </div>
                )}
            </div>

            {/* Tasks Section */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                    <h2 className="text-xl font-bold text-bee-black">Tasks</h2>
                </div>

                <div className="divide-y divide-gray-100">
                    {project.tasks.length === 0 ? (
                        <div className="p-12 text-center text-gray-400">
                            <p>No tasks yet. Add one to get started!</p>
                        </div>
                    ) : (
                        project.tasks.map((task) => (
                            <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-bee-black">{task.title}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${task.status === 'DONE'
                                                ? 'bg-green-100 text-green-700'
                                                : task.status === 'IN_PROGRESS'
                                                    ? 'bg-bee-pale text-bee-gold'
                                                    : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {task.status.replace('_', ' ')}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                            <div className="flex items-center gap-1">
                                                <Clock size={14} />
                                                <span className="font-medium">
                                                    {task.completedCells} / {task.estimatedCells} Cells
                                                </span>
                                            </div>
                                            {task._count.focusSessions > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <CheckCircle2 size={14} />
                                                    <span className="font-medium">{task._count.focusSessions} sessions</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <TaskActions task={{
                                            id: task.id,
                                            title: task.title,
                                            estimatedCells: task.estimatedCells,
                                            completedCells: task.completedCells,
                                            status: task.status
                                        }} />
                                        <Link
                                            href={`/timer?taskId=${task.id}`}
                                            className="bg-bee-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors text-sm font-bold"
                                        >
                                            Start
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
