import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { addMinutes, format, setHours, setMinutes } from 'date-fns';

// Mock Calendar Events
const MOCK_EVENTS = [
    { title: 'Morning Standup', start: '09:00', end: '09:30' },
    { title: 'Lunch', start: '12:00', end: '13:00' },
    { title: 'Team Meeting', start: '15:00', end: '16:00' },
];

export async function POST() {
    try {
        // 1. Fetch TODO tasks
        const tasks = await prisma.task.findMany({
            where: { status: 'TODO' },
            // orderBy: { priority: 'desc' }, // Use priority if available, or just default
        });

        if (tasks.length === 0) {
            return NextResponse.json({ message: 'No tasks to plan', schedule: [] });
        }

        // 2. Define working hours (e.g., 9am - 5pm)
        const today = new Date();
        let currentTime = setMinutes(setHours(today, 9), 0);
        const endTime = setMinutes(setHours(today, 17), 0);

        const schedule = [];
        let taskIndex = 0;

        // 3. Simple greedy scheduling algorithm
        while (currentTime < endTime && taskIndex < tasks.length) {
            const timeString = format(currentTime, 'HH:mm');

            // Check for conflict with events
            const conflict = MOCK_EVENTS.find(e =>
                (timeString >= e.start && timeString < e.end)
            );

            if (conflict) {
                // Skip to end of event
                const [hours, minutes] = conflict.end.split(':').map(Number);
                currentTime = setMinutes(setHours(currentTime, hours), minutes);
                schedule.push({ type: 'event', ...conflict });
                continue;
            }

            // Schedule a Pomodoro (25m + 5m break = 30m slot)
            const task = tasks[taskIndex];
            const sessionEnd = addMinutes(currentTime, 25);

            if (sessionEnd <= endTime) {
                schedule.push({
                    type: 'pomodoro',
                    task: task,
                    start: format(currentTime, 'HH:mm'),
                    end: format(sessionEnd, 'HH:mm'),
                });

                // Advance time (25m work + 5m break)
                currentTime = addMinutes(currentTime, 30);

                // If task is done (mock logic: 1 pomodoro per task for planning), move to next
                // In reality, we'd check estimatedPomodoros vs completed
                taskIndex++;
            } else {
                break; // No more time
            }
        }

        return NextResponse.json({ schedule });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to generate plan' }, { status: 500 });
    }
}
