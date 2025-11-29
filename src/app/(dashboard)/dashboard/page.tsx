import { api } from "@/services/api";
import { ScoreCard } from "@/components/dashboard/ScoreCard";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { DollarSign, CreditCard, Activity, Droplets } from "lucide-react";

export default async function DashboardPage() {
    const data = await api.getDashboardData("1"); // Mock user ID

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <ScoreCard score={data.score} segment={data.segment} />

                <MetricCard
                    title="Monthly Revenue"
                    value={`$${data.revenue.toLocaleString()}`}
                    description="+20.1% from last month"
                    icon={DollarSign}
                />

                <MetricCard
                    title="Expense Ratio"
                    value={`${(data.expenseRatio * 100).toFixed(1)}%`}
                    description="Target: < 50%"
                    icon={CreditCard}
                />

                <MetricCard
                    title="Liquidity Ratio"
                    value={data.liquidityRatio.toFixed(2)}
                    description="Target: > 1.8"
                    icon={Droplets}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <RevenueChart />

                <div className="col-span-3 grid gap-4">
                    {/* Placeholder for recent activity or other widgets */}
                    <div className="rounded-xl border bg-card text-card-foreground shadow">
                        <div className="flex flex-col space-y-1.5 p-6">
                            <h3 className="font-semibold leading-none tracking-tight">Recent Activity</h3>
                        </div>
                        <div className="p-6 pt-0">
                            <div className="space-y-8">
                                <div className="flex items-center">
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">Uber Payout</p>
                                        <p className="text-sm text-muted-foreground">Today, 9:00 AM</p>
                                    </div>
                                    <div className="ml-auto font-medium">+$250.00</div>
                                </div>
                                <div className="flex items-center">
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">Fuel Station</p>
                                        <p className="text-sm text-muted-foreground">Yesterday, 8:30 PM</p>
                                    </div>
                                    <div className="ml-auto font-medium text-destructive">-$45.00</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
