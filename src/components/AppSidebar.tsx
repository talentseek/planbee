"use client"

import * as React from "react"
import { Home, Hexagon, Calendar, Clock, Settings, LogOut, ChevronUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSkeleton,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const router = useRouter()
    const { state } = useSidebar()

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/signin")
                },
            },
        })
    }

    return (
        <Sidebar collapsible="icon" {...props} className="border-r-bee-gold/20 bg-sidebar">
            <SidebarHeader>
                <div className="flex items-center gap-2 p-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-honey rotate-45">
                        <span className="-rotate-45 font-bold">B</span>
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                        <span className="truncate font-bold text-sidebar-foreground text-lg">PlanBee</span>
                        <span className="truncate text-xs text-sidebar-foreground/70">Hive Defense System</span>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="The Hive">
                                    <a href="/" className="text-sidebar-foreground hover:text-primary hover:bg-sidebar-accent">
                                        <Home />
                                        <span>The Hive</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Combs (Projects)">
                                    <a href="/projects" className="text-sidebar-foreground hover:text-primary hover:bg-sidebar-accent">
                                        <Hexagon />
                                        <span>Combs (Projects)</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Flight Plan">
                                    <a href="/planning" className="text-sidebar-foreground hover:text-primary hover:bg-sidebar-accent">
                                        <Calendar />
                                        <span>Flight Plan</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Cell Timer">
                                    <a href="/timer" className="text-sidebar-foreground hover:text-primary hover:bg-sidebar-accent">
                                        <Clock />
                                        <span>Cell Timer</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Beekeeper">
                                    <a href="/settings" className="text-sidebar-foreground hover:text-primary hover:bg-sidebar-accent">
                                        <Settings />
                                        <span>Beekeeper</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <div className="p-4 group-data-[collapsible=icon]:hidden">
                    <div className="p-4 bg-sidebar-accent/50 rounded-xl border border-sidebar-border">
                        <p className="text-xs text-sidebar-foreground/60 mb-2 uppercase tracking-wider font-bold">Daily Quota</p>
                        <Progress value={25} className="h-3 bg-sidebar-accent border border-sidebar-border" indicatorClassName="bg-gradient-to-r from-primary to-orange-500" />
                        <p className="text-xs text-right text-primary mt-2 font-mono">2 / 8 Cells Filled</p>
                    </div>
                </div>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={handleSignOut} className="text-red-500 hover:text-red-600 hover:bg-red-500/10">
                            <LogOut />
                            <span>Sign Out</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
