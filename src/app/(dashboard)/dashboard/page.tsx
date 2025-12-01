"use client";

import dynamic from 'next/dynamic';
import { useGigFin } from "@/context/GigFinContext";
import { ScoreCard } from "@/components/dashboard/ScoreCard";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { CreditScore } from "@/components/dashboard/CreditScore";
import { StreakHeader } from "@/components/dashboard/StreakHeader";

const AdvancedFeaturesGrid = dynamic(() => import("@/components/dashboard/AdvancedFeaturesGrid").then(mod => mod.AdvancedFeaturesGrid), { ssr: false });
const QuickAddTransaction = dynamic(() => import("@/components/dashboard/QuickAddTransaction").then(mod => mod.QuickAddTransaction), { ssr: false });
import { DollarSign, CreditCard, Droplets } from "lucide-react";

export default function DashboardPage() {
    const { transactions, userProfile, calculateKarmaScore } = useGigFin();

    // Derived Metrics
    const karmaScore = calculateKarmaScore();

    // Calculate Streak (Simplified for display)
    // In a real app, this would be more robust, but we use the context's logic implicitly via KarmaScore or recalculate here
    const streak = userProfile.appStreak; // Or calculate from transactions if preferred

    // Calculate Financials
    const totalRevenue = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const expenseRatio = totalRevenue > 0 ? totalExpenses / totalRevenue : 0;
    const liquidityRatio = totalExpenses > 0 ? userProfile.currentBalance / totalExpenses : 0; // Simplified proxy

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>

            {/* Streak & Level Header */}
            <StreakHeader streak={streak} />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <ScoreCard score={karmaScore} segment="Growth Striver" />

                <MetricCard
                    title="Current Balance"
                    value={`₹${userProfile.currentBalance.toLocaleString()}`}
                    description="Available Liquidity"
                    icon={DollarSign}
                />

                <MetricCard
                    title="Expense Ratio"
                    value={`${(expenseRatio * 100).toFixed(1)}%`}
                    description="Target: < 50%"
                    icon={CreditCard}
                />

                <MetricCard
                    title="Net Income"
                    value={`₹${(totalRevenue - totalExpenses).toLocaleString()}`}
                    description="Total Earnings - Expenses"
                    icon={Droplets}
                />
            </div>



            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 space-y-4">
                    <CreditScore score={userProfile.gigCreditScore} />
                    <RevenueChart />
                </div>

                <div className="col-span-3 grid gap-4">
                    <QuickAddTransaction />

                    {/* Recent Activity */}
                    <div className="rounded-xl border bg-card text-card-foreground shadow">
                        <div className="flex flex-col space-y-1.5 p-6">
                            <h3 className="font-semibold leading-none tracking-tight">Recent Activity</h3>
                        </div>
                        <div className="p-6 pt-0">
                            <div className="space-y-4">
                                {transactions.slice(0, 5).map((t) => (
                                    <div key={t.id} className="flex items-center">
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">{t.category}</p>
                                            <p className="text-sm text-muted-foreground">{t.date}</p>
                                        </div>
                                        <div className={`ml-auto font-medium ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                            {t.type === 'income' ? '+' : '-'}₹{t.amount}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Financial Scientist Section */}
            <AdvancedFeaturesGrid />
        </div>
    );
}
