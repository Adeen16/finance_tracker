"use client";

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock, Zap, TrendingUp, Calendar, Flame, Wallet, Star } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { SalarySlider } from "@/components/dashboard/SalarySlider";
import { useGigFin } from "@/context/GigFinContext";

export function KarmaScoreDashboard() {
    const { transactions, calculateKarmaScore } = useGigFin();

    // --- 1. The "KarmaScore" Algorithm (Using Context Logic) ---
    const score = calculateKarmaScore();

    // Calculate Factors for Display
    const { consistency, avgEarnings, streak } = useMemo(() => {
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);

        const recentTx = transactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate >= sevenDaysAgo && tDate <= today && t.type === 'income';
        });

        const uniqueDaysWorked = new Set(recentTx.filter(t => t.amount > 0).map(t => t.date)).size;
        const totalWeekEarnings = recentTx.reduce((sum, t) => sum + t.amount, 0);
        const avgDaily = uniqueDaysWorked > 0 ? totalWeekEarnings / uniqueDaysWorked : 0;

        // Streak (Simplified for display - ideally comes from context/profile)
        let currentStreak = 0;
        const sortedDates = Array.from(new Set(transactions.filter(t => t.type === 'income' && t.amount > 0).map(t => t.date)))
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
        if (sortedDates.length > 0) currentStreak = 1; // Minimal check

        return {
            consistency: uniqueDaysWorked,
            avgEarnings: Math.round(avgDaily),
            streak: currentStreak
        };
    }, [transactions]);

    // --- 2. Visual UI Logic ---
    const getColor = (s: number) => {
        if (s < 50) return "#ef4444"; // Red
        if (s < 75) return "#eab308"; // Yellow
        return "#22c55e"; // Green
    };

    const scoreColor = getColor(score);

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
            <div className="lg:col-span-2">
                <SalarySlider />
            </div>
        </div>
    );
}
