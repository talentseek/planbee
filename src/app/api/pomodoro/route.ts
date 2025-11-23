import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { taskId, duration, startTime, endTime, userId } = body;

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        // 1. Calculate Nectar
        let nectarAmount = 10; // Base
        const sessionDate = new Date(endTime);

        // Early Bird Bonus (Before 10 AM)
        if (sessionDate.getHours() < 10) {
            nectarAmount += 5;
        }

        // Fetch user to check streak
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { currentStreak: true, lastActiveDate: true }
        });

        if (user) {
            // Streak Bonus (> 3 days)
            if (user.currentStreak > 3) {
                nectarAmount += 2;
            }
        }

        // 2. Create the session
        const session = await prisma.focusSession.create({
            data: {
                taskId,
                userId,
                duration: duration || 25,
                startTime: new Date(startTime),
                isCompleted: true,
                nectarEarned: nectarAmount,
            },
        });

        // 3. Update Task (Completed Cells)
        if (taskId) {
            await prisma.task.update({
                where: { id: taskId },
                data: {
                    completedCells: { increment: 1 },
                },
            });
        }

        // 4. Update User (Total Nectar, Total Cells, Streak)
        // Simple streak logic: if lastActiveDate was yesterday, increment. If today, keep. Else reset to 1.
        let newStreak = user?.currentStreak || 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const lastActive = user?.lastActiveDate ? new Date(user.lastActiveDate) : null;
        if (lastActive) lastActive.setHours(0, 0, 0, 0);

        if (!lastActive) {
            newStreak = 1;
        } else if (lastActive.getTime() === today.getTime()) {
            // Already active today, streak stays same
        } else if (today.getTime() - lastActive.getTime() === 86400000) {
            // Consecutive day
            newStreak += 1;
        } else {
            // Broken streak
            newStreak = 1;
        }

        await prisma.user.update({
            where: { id: userId },
            data: {
                totalNectar: { increment: nectarAmount },
                totalCells: { increment: 1 },
                currentStreak: newStreak,
                lastActiveDate: new Date(),
            }
        });

        return NextResponse.json({ ...session, nectarEarned: nectarAmount, newStreak });
    } catch (error) {
        console.error('Pomodoro Log Error:', error);
        return NextResponse.json({ error: 'Failed to log pomodoro session' }, { status: 500 });
    }
}
