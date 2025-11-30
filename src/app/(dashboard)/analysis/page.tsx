"use client";

import { useState } from "react";
import { CsvUploader } from "@/components/analysis/CsvUploader";
import { parseCsv, ParsedData } from "@/lib/csv";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function AnalysisPage() {
    const [data, setData] = useState<ParsedData | null>(null);
    const [loading, setLoading] = useState(false);

    const handleUpload = async (file: File) => {
        setLoading(true);
        try {
            // Simulate processing delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            const parsed = await parseCsv(file);
            setData(parsed);
        } catch (error) {
            console.error("Error parsing CSV:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Financial Analysis</h2>
            </div>

            {!data ? (
                <div className="mx-auto max-w-2xl">
                    <CsvUploader onUpload={handleUpload} />
                    {loading && (
                        <div className="mt-8 flex justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">
                                    ₹{data.totalRevenue.toFixed(2)}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">
                                    ₹{data.totalExpenses.toFixed(2)}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Net Income</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    ₹{(data.totalRevenue - data.totalExpenses).toFixed(2)}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Transactions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {data.transactions.slice(0, 5).map((tx, i) => (
                                    <div key={i} className="flex items-center justify-between border-b py-2 last:border-0">
                                        <div>
                                            <p className="font-medium">{tx.date}</p>
                                            <p className="text-xs text-muted-foreground capitalize">{tx.type}</p>
                                        </div>
                                        <div className={tx.type === "income" ? "text-green-600" : "text-red-600"}>
                                            {tx.type === "income" ? "+" : "-"}₹{tx.amount.toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4">
                                <Button variant="outline" className="w-full" onClick={() => setData(null)}>
                                    Upload New File
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
