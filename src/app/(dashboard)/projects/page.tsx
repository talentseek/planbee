import { prisma } from '@/lib/prisma';
import ProjectCard from '@/components/ProjectCard';
import AddProjectButton from '@/components/AddProjectButton';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
    const projects = await prisma.project.findMany({
        include: {
            tasks: {
                select: {
                    completedCells: true,
                    estimatedCells: true,
                    status: true,
                }
            },
            _count: {
                select: { tasks: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-bee-gold">Projects</h1>
                    <p className="text-bee-gold font-bold text-lg">Manage your hives and honey.</p>
                </div>
                <AddProjectButton />
            </div>

            {projects.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                    <p className="text-gray-400 mb-4">No projects found. Start building your hive!</p>
                    <AddProjectButton />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            )}
        </div>
    );
}
