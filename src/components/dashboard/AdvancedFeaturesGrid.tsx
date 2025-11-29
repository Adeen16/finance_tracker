"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Bot, AlertTriangle, Activity, Target, Zap } from "lucide-react";
import { useMLSimulation } from "@/hooks/useMLSimulation";
import { cn } from "@/lib/utils";

export function AdvancedFeaturesGrid() {
    const { autoPilotStatus, toggleAutoPilot, detectedLeaks, goals, runStressTest } = useMLSimulation();

    // Local state for sliders
    const [fuelPrice, setFuelPrice] = useState(102);
    const [orderVolume, setOrderVolume] = useState(85);

    const survivalScore = runStressTest(fuelPrice, orderVolume);

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
                <Bot className="h-6 w-6 text-primary" />
                AI Financial Scientist
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. GigLens Autopilot */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">GigLens Autopilot</CardTitle>
                        <Zap className={cn("h-4 w-4", autoPilotStatus ? "text-green-500 fill-green-500" : "text-muted-foreground")} />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-muted-foreground">Status</span>
                            <div className="flex items-center gap-2">
                                <span className={cn("text-sm font-bold", autoPilotStatus ? "text-green-600" : "text-muted-foreground")}>
                                    {autoPilotStatus ? "Active" : "Paused"}
                                </span>
                                <Switch checked={autoPilotStatus} onCheckedChange={toggleAutoPilot} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-muted-foreground uppercase">Ingestion Sources</p>
                            <div className="flex gap-2">
                                <Badge variant="secondary" className="bg-green-500/10 text-green-600 hover:bg-green-500/20">WhatsApp</Badge>
                                <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20">SMS</Badge>
                                <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20">Uber API</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Invisible-Leak Scanner */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Invisible-Leak Scanner</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {detectedLeaks.map((leak) => (
                                <div key={leak.id} className="flex items-center justify-between rounded-md border p-2">
                                    <div>
                                        <p className="text-sm font-medium">{leak.type}</p>
                                        <p className="text-xs text-destructive font-bold">{leak.risk} Risk</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-destructive">-₹{leak.amount}</p>
                                        <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary">
                                            Investigate
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* 3. Stress-Test Simulator */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Stress-Test Simulator</CardTitle>
                        <Activity className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                                <span>Fuel Price</span>
                                <span className="font-bold">₹{fuelPrice}</span>
                            </div>
                            <Slider
                                value={[fuelPrice]}
                                min={90}
                                max={120}
                                step={1}
                                onValueChange={(vals) => setFuelPrice(vals[0])}
                            />
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                                <span>Order Volume</span>
                                <span className="font-bold">{orderVolume}%</span>
                            </div>
                            <Slider
                                value={[orderVolume]}
                                min={50}
                                max={150}
                                step={5}
                                onValueChange={(vals) => setOrderVolume(vals[0])}
                            />
                        </div>
                        <div className="mt-4 rounded-lg bg-muted p-3 text-center">
                            <p className="text-xs text-muted-foreground mb-1">Survival Score</p>
                            <div className={cn("text-3xl font-bold", survivalScore > 80 ? "text-green-600" : survivalScore < 50 ? "text-destructive" : "text-yellow-600")}>
                                {survivalScore}/100
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 4. Goal Planner */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Goal Planner</CardTitle>
                        <Target className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="font-bold">{goals.title}</span>
                            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                                {goals.probability}% Probability
                            </Badge>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>₹{goals.current.toLocaleString()} saved</span>
                                <span>Target: ₹{goals.target.toLocaleString()}</span>
                            </div>
                            <Progress value={(goals.current / goals.target) * 100} className="h-2" />
                        </div>
                        <div className="rounded-md bg-primary/5 p-3 text-xs text-primary">
                            <span className="font-bold">Recommendation:</span> Save ₹150 more daily to reach your goal by December.
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
