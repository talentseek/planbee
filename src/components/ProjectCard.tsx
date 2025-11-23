import Link from 'next/link';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    const progressVal = estimate > 0 ? Math.min(100, (totalCompleted / estimate) * 100) : 0;
    const completedTasks = project.tasks.filter(t => t.status === 'DONE').length;

    return (
        <Link href={`/projects/${project.id}`} className="block group">
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-l-8" style={{ borderLeftColor: project.color }}>
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                            {project.title}
                        </CardTitle>
                        <Badge variant="secondary" className="font-bold flex items-center gap-1">
                            <Clock size={12} />
                            {totalCompleted} / {estimate > 0 ? estimate : '?'} Cells
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    {estimate > 0 && (
                        <div className="mb-4 space-y-1.5">
                            <div className="flex justify-between text-xs text-muted-foreground font-medium">
                                <span>Completion</span>
                                <span>{Math.round(progressVal)}%</span>
                            </div>
                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                        width: `${progressVal}%`,
                                        backgroundColor: project.color
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <CheckCircle2 size={16} />
                            <span>{completedTasks} / {project._count.tasks} tasks</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Calendar size={16} />
                            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
