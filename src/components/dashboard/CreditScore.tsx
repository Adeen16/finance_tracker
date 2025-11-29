"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Lock, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";
// import { useToast } from "@/components/ui/use-toast"; // Assuming you have a toast hook, or use alert

interface CreditScoreProps {
    score: number;
}

export function CreditScore({ score }: CreditScoreProps) {
    // const { toast } = useToast(); // If shadcn toast is installed

    const isEligible = score >= 650;
    const percentage = ((score - 300) / (850 - 300)) * 100;

    const handleDownload = () => {
        // Mock download
        alert("Downloading Proof of Income PDF...");
    };

    return (
        <Card className="overflow-hidden border-none bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white shadow-xl">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-lg font-medium text-blue-100">
                    <span>Gig-Credit Score</span>
                    {isEligible ? (
                        <Unlock className="h-5 w-5 text-yellow-400" />
                    ) : (
                        <Lock className="h-5 w-5 text-slate-400" />
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center space-y-4">
                    {/* Gauge Visualization */}
                    <div className="relative flex h-32 w-64 items-end justify-center overflow-hidden">
                        {/* Background Arch */}
                        <div className="absolute top-0 h-32 w-64 rounded-t-full bg-slate-700/50" />
                        {/* Active Arch */}
                        <div
                            className="absolute top-0 h-32 w-64 origin-bottom rounded-t-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-transform duration-1000 ease-out"
                            style={{
                                transform: `rotate(${percentage * 1.8 - 180}deg)`,
                            }}
                        />
                        {/* Inner Cover to make it an arc */}
                        <div className="absolute -bottom-1 z-10 flex h-24 w-48 items-end justify-center rounded-t-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
                            <span className="mb-2 text-5xl font-bold text-white">{score}</span>
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-sm font-medium text-blue-200">
                            {isEligible
                                ? "🎉 You are eligible for a ₹50,000 Micro-Loan!"
                                : "Keep tracking to unlock Bike Loans."}
                        </p>
                    </div>

                    <Button
                        onClick={handleDownload}
                        variant="outline"
                        className="w-full border-yellow-500/50 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 hover:text-yellow-300"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Download Proof of Income PDF
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
