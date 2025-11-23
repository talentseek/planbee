"use client"

import * as React from "react"
import { Home, Hexagon, Calendar, Clock, Settings, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
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
    SidebarRail,
} from "@/components/ui/sidebar"
import DailyQuota from "@/components/DailyQuota"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const router = useRouter()

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
        <Sidebar collapsible="icon" {...props} className="border-r-border bg-sidebar">
            <SidebarHeader>
                <div className="flex items-center gap-2 p-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Image src="/planbeelogo.png" alt="PlanBee" width={32} height={32} className="object-contain" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                        <span className="truncate font-bold text-sidebar-foreground text-lg">PlanBee</span>
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
                                    <Link href="/" className="text-sidebar-foreground hover:text-primary hover:bg-sidebar-accent">
                                        <Home />
                                        <span>The Hive</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Combs (Projects)">
                                    <Link href="/projects" className="text-sidebar-foreground hover:text-primary hover:bg-sidebar-accent">
                                        <Hexagon />
                                        <span>Combs (Projects)</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Flight Plan">
                                    <Link href="/planning" className="text-sidebar-foreground hover:text-primary hover:bg-sidebar-accent">
                                        <Calendar />
                                        <span>Flight Plan</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Cell Timer">
                                    <Link href="/timer" className="text-sidebar-foreground hover:text-primary hover:bg-sidebar-accent">
                                        <Clock />
                                        <span>Cell Timer</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Beekeeper">
                                    <Link href="/settings" className="text-sidebar-foreground hover:text-primary hover:bg-sidebar-accent">
                                        <Settings />
                                        <span>Beekeeper</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <div className="p-4 group-data-[collapsible=icon]:hidden">
                    <DailyQuota />
                </div>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={handleSignOut} className="text-muted-foreground hover:text-primary hover:bg-primary/10">
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
