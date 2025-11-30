"use client";

import { Flame } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { getLevel } from "@/lib/gamification";
import { cn } from "@/lib/utils";

interface StreakHeaderProps {
    streak: number;
}

export function StreakHeader({ streak }: StreakHeaderProps) {
    const level = getLevel(streak);

    return (
        <div className="flex w-full items-center justify-between rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-4">
                <div className={cn("flex items-center justify-center rounded-full p-3", streak > 0 ? "bg-orange-500/10 text-orange-500" : "bg-muted text-muted-foreground")}>
                    <Flame className={cn("h-6 w-6", streak > 0 && "fill-orange-500 animate-pulse")} />
                </div>
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Daily Streak</p>
                    <h3 className="text-2xl font-bold">{streak} Days</h3>
                    <p className="text-xs text-muted-foreground mt-1">Login everyday to not lose the streak.</p>
                </div>
            </div>

            <div className="flex w-1/2 flex-col gap-2 md:w-1/3">
                <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-primary">{level.name}</span>
                    {level.nextThreshold && (
                        <span className="text-muted-foreground text-xs">
                            {Math.ceil(level.nextThreshold - streak)} days to next level
                        </span>
                    )}
                </div>
                <Progress value={level.progress} className="h-2" />
            </div>
        </div>
    );
}
