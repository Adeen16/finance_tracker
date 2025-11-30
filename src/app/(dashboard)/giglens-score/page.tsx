"use client";

import { ScoreCard } from "@/components/dashboard/ScoreCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGigFin } from "@/context/GigFinContext";

export default function GigLensScorePage() {
    const { calculateKarmaScore, userProfile } = useGigFin();
    const score = calculateKarmaScore();
    const segment = score >= 80 ? "Growth Striver" : score >= 50 ? "Stable Earner" : "Needs Improvement";

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">GigLens Score</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <ScoreCard score={score} segment={segment} />

                <Card>
                    <CardHeader>
                        <CardTitle>Score Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Margin Health</span>
                                <span className="text-sm text-green-600 font-bold">Excellent</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-secondary">
                                <div className="h-2 w-[85%] rounded-full bg-green-500" />
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Liquidity</span>
                                <span className="text-sm text-yellow-600 font-bold">Good</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-secondary">
                                <div className="h-2 w-[65%] rounded-full bg-yellow-500" />
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Expense Ratio</span>
                                <span className="text-sm text-green-600 font-bold">Healthy</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-secondary">
                                <div className="h-2 w-[75%] rounded-full bg-green-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Peer Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">You are in the top 15% of your segment.</p>
                    {/* Add comparison chart here later */}
                </CardContent>
            </Card>
        </div>
    );
}
