import PomodoroTimer from '@/components/PomodoroTimer';

export default function TimerPage() {
    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-bee-gold mb-2">Nectar Collector 🍯</h1>
                <p className="text-bee-gold font-bold text-lg">Focus on your work and collect that sweet productivity.</p>
            </div>

            <PomodoroTimer />
        </div>
    );
}
