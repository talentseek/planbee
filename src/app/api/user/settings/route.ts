import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        // Get userId from session
        const session = await auth.api.getSession({ headers: request.headers });

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                intensityMode: true,
                workStartTime: true,
                workEndTime: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Failed to fetch user settings:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { intensityMode, workStartTime, workEndTime } = body;

        // Get userId from session
        const session = await auth.api.getSession({ headers: request.headers });

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                ...(intensityMode && { intensityMode }),
                ...(workStartTime && { workStartTime }),
                ...(workEndTime && { workEndTime }),
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error('Failed to update user settings:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
