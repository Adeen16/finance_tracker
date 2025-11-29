import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert, CheckCircle } from "lucide-react";

export default function LeakShieldPage() {
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
                            <span className="font-bold text-yellow-600">Warning (&gt; 60%)</span>
                        </div>
                        <div className="flex items-center justify-between border-b pb-2">
                            <span>Liquidity Buffer</span>
                            <span className="font-bold text-green-600">Healthy (2.1x)</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Leakage Alerts</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert variant="destructive">
                            <ShieldAlert className="h-4 w-4" />
                            <AlertTitle>High Fuel Expense</AlertTitle>
                            <AlertDescription>
                                Your fuel spending is 15% higher than peer average this week.
                            </AlertDescription>
                        </Alert>
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
