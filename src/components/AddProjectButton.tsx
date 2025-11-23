'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import ProjectWizard from './ProjectWizard';

export default function AddProjectButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-bee-yellow hover:bg-bee-gold text-bee-black font-bold py-2 px-4 rounded-xl transition-colors shadow-sm hover:shadow-md"
            >
                <Plus size={20} />
                <span>New Project</span>
            </button>

            <ProjectWizard
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
