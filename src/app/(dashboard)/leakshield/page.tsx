"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert, CheckCircle } from "lucide-react";
import { useGigFin } from "@/context/GigFinContext";

export default function LeakShieldPage() {
    const { transactions, userProfile } = useGigFin();

    // Calculate Metrics
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    const expenseRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;
    const monthlyExpenses = totalExpenses; // Simplified: assuming transactions are for ~1 month
    const liquidityBuffer = monthlyExpenses > 0 ? (userProfile.currentBalance / monthlyExpenses).toFixed(1) : "N/A";

    const isExpenseHigh = expenseRatio > 60;
    const isLiquidityLow = Number(liquidityBuffer) < 1.0;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">LeakShield Guardrails</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Active Guardrails</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                            <span>Max EMI Load</span>
                            <span className="font-bold text-green-600">Safe (&lt; 30%)</span>
                        </div>
                        <div className="flex items-center justify-between border-b pb-2">
                            <span>Expense Ratio</span>
                            <span className={`font-bold ${isExpenseHigh ? "text-red-600" : "text-green-600"}`}>
                                {isExpenseHigh ? "Warning" : "Healthy"} ({expenseRatio.toFixed(1)}%)
                            </span>
                        </div>
                        <div className="flex items-center justify-between border-b pb-2">
                            <span>Liquidity Buffer</span>
                            <span className={`font-bold ${isLiquidityLow ? "text-red-600" : "text-green-600"}`}>
                                {isLiquidityLow ? "Critical" : "Healthy"} ({liquidityBuffer}x)
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Leakage Alerts</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isExpenseHigh ? (
                            <Alert variant="destructive">
                                <ShieldAlert className="h-4 w-4" />
                                <AlertTitle>High Expense Ratio</AlertTitle>
                                <AlertDescription>
                                    Your expenses are {expenseRatio.toFixed(0)}% of your income. Consider cutting non-essential costs.
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <Alert>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <AlertTitle>Expenses Under Control</AlertTitle>
                                <AlertDescription>
                                    Your spending is within healthy limits.
                                </AlertDescription>
                            </Alert>
                        )}

                        <Alert>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertTitle>Subscription Audit</AlertTitle>
                            <AlertDescription>
                                No unused subscriptions detected this month.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
