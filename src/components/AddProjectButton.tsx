'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import ProjectWizard from './ProjectWizard';
import { Button } from "@/components/ui/button";

export default function AddProjectButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Button
                onClick={() => setIsModalOpen(true)}
                className="gap-2 font-bold shadow-sm hover:shadow-md"
            >
                <Plus size={20} />
                <span>New Project</span>
            </Button>

            <ProjectWizard
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
