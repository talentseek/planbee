import { Play, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import DashboardViewToggle from '@/components/DashboardViewToggle';
import HiveView from '@/components/HiveView';

export const dynamic = 'force-dynamic';

import ReportingDashboard from '@/components/ReportingDashboard';

export default async function Home() {
  // Fetch stats and tasks
  const tasksCount = await prisma.task.count({ where: { status: 'DONE' } });
  // Count pomodoros - cascade delete should remove orphaned sessions
  const pomodorosCount = await prisma.focusSession.count();
  const activeProjectsCount = await prisma.project.count();

  const todoTasks = await prisma.task.findMany({
    where: { status: 'TODO' },
    take: 5,
    include: { project: true },
    // orderBy: { priority: 'desc' } // Use priority if available
  });

  // Fetch all tasks for the Hive View
  const allTasks = await prisma.task.findMany({
    include: { project: true },
    orderBy: { updatedAt: 'desc' }
  });

  const dashboardContent = (
    <div className="space-y-8">
      <ReportingDashboard
        totalPomodoros={pomodorosCount}
        completedTasks={tasksCount}
        activeProjects={activeProjectsCount}
      />

      {/* Today's Plan Section */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-bee-black mb-4">Today's Plan</h2>
        <div className="space-y-4">
          {todoTasks.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No tasks found. Create a project to get started!</p>
          ) : (
            todoTasks.map((task) => (
              <Link
                key={task.id}
                href={`/timer?taskId=${task.id}`}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-bee-yellow transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-6 h-6 rounded-full border-2 border-gray-300 group-hover:border-bee-gold"
                    style={{ borderColor: task.project.color }}
                  ></div>
                  <div>
                    <p className="font-medium text-gray-800 group-hover:text-bee-black">{task.title}</p>
                    <p className="text-xs text-gray-500">Project: {task.project.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="bg-bee-pale text-bee-gold px-2 py-1 rounded-md font-medium">
                    {task.estimatedCells} Cells
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-bee-gold">Welcome to The Hive 🐝</h1>
        <p className="text-bee-gold font-bold text-lg">Here is what's buzzing today.</p>
      </header>

      <DashboardViewToggle
        dashboardContent={dashboardContent}
        hiveContent={<HiveView tasks={allTasks} />}
      />
    </div>
  );
}
