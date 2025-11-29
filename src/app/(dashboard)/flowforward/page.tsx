import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueChart } from "@/components/dashboard/RevenueChart";

export default function FlowForwardPage() {
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
                        <div className="text-4xl font-bold text-primary">45 Days</div>
                        <p className="text-xs text-muted-foreground">Runway in stressed scenario</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Daily Save Target</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">$12.50</div>
                        <p className="text-xs text-muted-foreground">To reach 3-month buffer</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Next Month Projection</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-green-600">+$850</div>
                        <p className="text-xs text-muted-foreground">Estimated Net Cashflow</p>
                    </CardContent>
                </Card>
            </div>

            <RevenueChart />
        </div>
    );
}
