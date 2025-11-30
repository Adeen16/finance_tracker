"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Activity, ShieldCheck, TrendingUp, Settings, FileText, Briefcase } from "lucide-react";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Jobs", href: "/jobs", icon: Briefcase },
    { name: "Analysis", href: "/analysis", icon: FileText },
    { name: "GigLens Score", href: "/giglens-score", icon: Activity },
    { name: "LeakShield", href: "/leakshield", icon: ShieldCheck },
    { name: "FlowForward", href: "/flowforward", icon: TrendingUp },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
            <div className="flex h-16 items-center border-b px-6">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                    <Activity className="h-6 w-6" />
                    <span>GigLens</span>
                </Link>
            </div>
            <nav className="flex-1 space-y-1 p-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                    : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
            <div className="border-t p-4">
                <div className="flex items-center gap-3 rounded-md bg-sidebar-accent/20 p-3">
                    <div className="h-8 w-8 rounded-full bg-primary/20" />
                    <div className="text-sm">
                        <p className="font-medium">Demo User</p>
                        <p className="text-xs text-muted-foreground">Gig Worker</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
