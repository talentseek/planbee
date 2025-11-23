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
      <section className="bg-white rounded-[2rem] shadow-sm border border-bee-pale p-8">
        <h2 className="text-2xl font-black text-bee-black mb-6 flex items-center gap-2">
          <span className="text-3xl">📅</span> Today&apos;s Plan
        </h2>
        <div className="space-y-4">
          {todoTasks.length === 0 ? (
            <div className="text-center py-12 bg-bee-pale/30 rounded-2xl border-2 border-dashed border-bee-pale">
              <p className="text-bee-brown/60 font-medium text-lg">No tasks found. Create a comb to get started!</p>
            </div>
          ) : (
            todoTasks.map((task) => (
              <Link
                key={task.id}
                href={`/timer?taskId=${task.id}`}
                className="flex items-center justify-between p-5 bg-white rounded-2xl border-2 border-bee-pale hover:border-bee-gold hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-8 h-8 rounded-xl border-4 border-gray-100 group-hover:border-bee-gold transition-colors shadow-sm"
                    style={{ backgroundColor: task.project.color }}
                  ></div>
                  <div>
                    <p className="font-bold text-lg text-bee-black group-hover:text-bee-brown transition-colors">{task.title}</p>
                    <p className="text-sm text-gray-500 font-medium">Comb: {task.project.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="bg-bee-pale text-bee-brown px-3 py-1.5 rounded-lg font-bold border border-bee-gold/20">
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
    <div className="space-y-8 pb-10">
      <header className="flex items-center gap-4">
        <div className="w-16 h-16 bg-bee-gold rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg rotate-3">
          🐝
        </div>
        <div>
          <h1 className="text-4xl font-black text-bee-black tracking-tight">Welcome to The Hive</h1>
          <p className="text-bee-brown/70 font-bold text-lg">Here is what&apos;s buzzing today.</p>
        </div>
      </header>

      <DashboardViewToggle
        dashboardContent={dashboardContent}
        hiveContent={<HiveView tasks={allTasks} />}
      />
    </div>
  );
}
