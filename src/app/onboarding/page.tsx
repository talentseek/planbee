'use client';

import OnboardingFlow from '@/components/OnboardingFlow';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
    const router = useRouter();

    const handleComplete = () => {
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-bee-pale">
            <OnboardingFlow onComplete={handleComplete} />
        </div>
    );
}
