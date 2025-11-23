import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const completed = await prisma.focusSession.count({
            where: {
                userId: session.user.id,
                startTime: {
                    gte: today,
                },
            },
        });

        return NextResponse.json({ completed });
    } catch (error) {
        console.error('Failed to fetch daily stats', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
