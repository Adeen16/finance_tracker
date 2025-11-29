"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Lock, Zap, TrendingUp, Calendar, Star, Flame, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';

// --- Types ---
interface Transaction {
    id: string;
    date: string; // YYYY-MM-DD
    amount: number;
    type: 'income' | 'expense';
}

interface KarmaScoreDashboardProps {
    transactions?: Transaction[];
}

// --- Mock Data (if props not provided) ---
const MOCK_TRANSACTIONS: Transaction[] = Array.from({ length: 14 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return {
        id: `tx-${i}`,
        date: date.toISOString().split('T')[0],
        amount: Math.random() > 0.3 ? 850 + Math.random() * 200 : 0, // Some days 0, others ~950
        type: 'income',
    };
});

export function KarmaScoreDashboard({ transactions = MOCK_TRANSACTIONS }: KarmaScoreDashboardProps) {
    const [withdrawAmount, setWithdrawAmount] = useState<number>(0);

    // --- 1. The "KarmaScore" Algorithm ---
    const { score, consistency, avgEarnings, streak, weekEarnings } = useMemo(() => {
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);

        // Filter last 7 days
        const recentTx = transactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate >= sevenDaysAgo && tDate <= today && t.type === 'income';
        });

        // Consistency (40%): Days worked in last 7 days
        const uniqueDaysWorked = new Set(recentTx.filter(t => t.amount > 0).map(t => t.date)).size;
        const consistencyScore = (uniqueDaysWorked / 7) * 100;

        // Performance (30%): Avg Daily Earnings vs Target (₹800)
        const totalWeekEarnings = recentTx.reduce((sum, t) => sum + t.amount, 0);
        const avgDaily = totalWeekEarnings / 7;
        const target = 800;
        const performanceScore = Math.min((avgDaily / target) * 100, 100); // Cap at 100%

        // Loyalty (30%): Streak (Normalized, assume 14 days is max score for this demo context)
        // Simple streak calc
        let currentStreak = 0;
        const sortedDates = Array.from(new Set(transactions.filter(t => t.amount > 0).map(t => t.date)))
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

        // Check if today/yesterday exists to start streak
        if (sortedDates.length > 0) {
            const last = new Date(sortedDates[0]);
            const diff = Math.floor((today.getTime() - last.getTime()) / (1000 * 3600 * 24));
            if (diff <= 1) {
                // Iterate
                currentStreak = 1;
                let prev = last;
                for (let i = 1; i < sortedDates.length; i++) {
                    const curr = new Date(sortedDates[i]);
                    const d = Math.floor((prev.getTime() - curr.getTime()) / (1000 * 3600 * 24));
                    if (d === 1) {
                        currentStreak++;
                        prev = curr;
                    } else {
                        break;
                    }
                }
            }
        }

        const loyaltyScore = Math.min((currentStreak / 14) * 100, 100); // Cap at 14 days for max points

        // Final Weighted Score
        const finalScore = Math.round(
            (consistencyScore * 0.4) +
            (performanceScore * 0.3) +
            (loyaltyScore * 0.3)
        );

        return {
            score: finalScore,
            consistency: uniqueDaysWorked,
            avgEarnings: Math.round(avgDaily),
            streak: currentStreak,
            weekEarnings: totalWeekEarnings
        };
    }, [transactions]);

    // --- 2. Visual UI Logic ---
    const getColor = (s: number) => {
        if (s < 50) return "#ef4444"; // Red
        if (s < 75) return "#eab308"; // Yellow
        return "#22c55e"; // Green
    };

    const scoreColor = getColor(score);
    const isUnlocked = score >= 60;
    const availableLimit = Math.floor(weekEarnings * 0.60);

    // Gauge Data
    const gaugeData = [
        { name: 'Score', value: score, fill: scoreColor },
        { name: 'Remaining', value: 100 - score, fill: '#e2e8f0' },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Karma Score Gauge & Factors */}
            <Card className="lg:col-span-1 border-none shadow-lg bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        KarmaScore
                    </CardTitle>
                    <CardDescription>Your financial reputation</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                    {/* Score Gauge */}
                    <div className="h-48 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={gaugeData}
                                    cx="50%"
                                    cy="70%"
                                    startAngle={180}
                                    endAngle={0}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={0}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {gaugeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 pointer-events-none">
                            <span className="text-4xl font-bold" style={{ color: scoreColor }}>{score}/100</span>
                            <span className="text-sm font-medium text-muted-foreground">
                                {score >= 75 ? "Good Standing" : score >= 50 ? "Fair" : "Needs Improvement"}
                            </span>
                        </div>
                    </div>

                    {/* Factors Display */}
                    <div className="grid grid-cols-3 gap-2 w-full mt-4">
                        <div className="flex flex-col items-center p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
                            <Calendar className="h-4 w-4 text-blue-500 mb-1" />
                            <span className="text-xs text-muted-foreground">Consistency</span>
                            <span className="text-sm font-bold">{consistency}/7 Days</span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
                            <TrendingUp className="h-4 w-4 text-green-500 mb-1" />
                            <span className="text-xs text-muted-foreground">Avg. Earn</span>
                            <span className="text-sm font-bold">₹{avgEarnings}</span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
                            <Flame className="h-4 w-4 text-orange-500 mb-1" />
                            <span className="text-xs text-muted-foreground">Streak</span>
                            <span className="text-sm font-bold">{streak} Days</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Right Column: Salary-on-Demand */}
            <Card className="lg:col-span-2 border-l-4 border-l-blue-500 shadow-md">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Wallet className="h-6 w-6 text-blue-600" />
                            Salary-on-Demand
                        </div>
                        {isUnlocked ? (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                                <Zap className="h-3 w-3 mr-1 fill-green-700" /> Unlocked
                            </Badge>
                        ) : (
                            <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">
                                <Lock className="h-3 w-3 mr-1" /> Locked
                            </Badge>
                        )}
                    </CardTitle>
                    <CardDescription>
                        Withdraw your earnings instantly. Limit resets weekly.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Available to Withdraw</p>
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                                ₹{availableLimit.toLocaleString()}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1">
                                (60% of ₹{weekEarnings.toLocaleString()} earned this week)
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium mb-1">Withdraw Amount</p>
                            <div className="text-2xl font-bold text-blue-600">
                                ₹{withdrawAmount.toLocaleString()}
                            </div>
                        </div>
                    </div>

                    {/* Slider */}
                    <div className="space-y-4">
                        <Slider
                            disabled={!isUnlocked}
                            value={[withdrawAmount]}
                            min={0}
                            max={availableLimit}
                            step={100}
                            onValueChange={(vals) => setWithdrawAmount(vals[0])}
                            className={cn("py-4", !isUnlocked && "opacity-50 cursor-not-allowed")}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>₹0</span>
                            <span>₹{availableLimit.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Action Button */}
                    <Button
                        className={cn(
                            "w-full h-12 text-lg font-bold transition-all",
                            isUnlocked
                                ? "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30"
                                : "bg-slate-200 text-slate-500 hover:bg-slate-200"
                        )}
                        disabled={!isUnlocked || withdrawAmount === 0}
                        onClick={() => alert(`Processing withdrawal of ₹${withdrawAmount}...`)}
                    >
                        {isUnlocked ? (
                            <>
                                <Zap className="mr-2 h-5 w-5 fill-white" /> Withdraw Now
                            </>
                        ) : (
                            <>
                                <Lock className="mr-2 h-5 w-5" /> Boost Score to 60 to Unlock
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
