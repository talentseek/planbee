import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            include: {
                tasks: true,
            },
        });
        return NextResponse.json(projects);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, color, tasks } = body;

        // Get userId from session
        const session = await auth.api.getSession({ headers: request.headers });

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;

        // Create project with tasks if provided
        const project = await prisma.project.create({
            data: {
                title,
                color,
                userId,
                ...(tasks && tasks.length > 0 && {
                    tasks: {
                        create: tasks.map((task: { title: string; estimatedCells: number }) => ({
                            title: task.title,
                            estimatedCells: task.estimatedCells,
                            userId,
                        })),
                    },
                }),
            },
            include: {
                tasks: true,
            },
        });

        return NextResponse.json(project);
    } catch (error) {
        console.error('Project creation error:', error);
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, title, color, estimatedCells } = body;

        if (!id) {
            return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
        }

        const project = await prisma.project.update({
            where: { id },
            data: {
                ...(title && { title }),
                ...(color && { color }),
                ...(estimatedCells !== undefined && { estimatedCells }),
            },
        });

        return NextResponse.json(project);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
        }

        await prisma.project.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}
