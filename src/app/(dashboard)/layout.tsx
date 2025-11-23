import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="flex-1 p-6 w-full bg-background transition-all duration-300 ease-in-out">
                <div className="mb-4 flex items-center gap-2">
                    <SidebarTrigger />
                </div>
                {children}
            </main>
        </SidebarProvider>
    );
}
