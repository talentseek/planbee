import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, estimatedCells, projectId, userId } = body;

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        const task = await prisma.task.create({
            data: {
                title,
                estimatedCells: estimatedCells || 1,
                projectId,
                userId,
            },
        });

        return NextResponse.json(task);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, title, estimatedCells, completedCells, status } = body;

        if (!id) {
            return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
        }

        const task = await prisma.task.update({
            where: { id },
            data: {
                ...(title && { title }),
                ...(estimatedCells !== undefined && { estimatedCells }),
                ...(completedCells !== undefined && { completedCells }),
                ...(status && { status }),
            },
        });

        return NextResponse.json(task);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
        }

        await prisma.task.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
    }
}
