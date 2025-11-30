"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { useGigFin } from "@/context/GigFinContext";

export default function FlowForwardPage() {
    const { userProfile, transactions } = useGigFin();

    // Calculate Metrics
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);

    const dailyExpense = totalExpenses / 30; // Assuming 30 days data
    const runwayDays = dailyExpense > 0 ? Math.floor(userProfile.currentBalance / dailyExpense) : 999;

    const netCashflow = totalIncome - totalExpenses;
    const projectedCashflow = Math.round(netCashflow); // Simple projection: same as last month

    const remainingGoal = Math.max(0, userProfile.savingsGoal - userProfile.currentBalance);
    const dailySaveTarget = Math.round(remainingGoal / 90); // Target to reach goal in 3 months

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">FlowForward</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Safe Days</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-4xl font-bold ${runwayDays < 30 ? "text-red-600" : "text-primary"}`}>
                            {runwayDays > 365 ? "365+" : runwayDays} Days
                        </div>
                        <p className="text-xs text-muted-foreground">Runway in stressed scenario</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Daily Save Target</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">₹{dailySaveTarget}</div>
                        <p className="text-xs text-muted-foreground">To reach goal in 3 months</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Next Month Projection</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-4xl font-bold ${projectedCashflow >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {projectedCashflow >= 0 ? "+" : "-"}₹{Math.abs(projectedCashflow)}
                        </div>
                        <p className="text-xs text-muted-foreground">Estimated Net Cashflow</p>
                    </CardContent>
                </Card>
            </div>

            <RevenueChart />
        </div>
    );
}
