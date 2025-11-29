"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, MinusCircle } from "lucide-react";
import { useGigFin } from "@/context/GigFinContext";

export function QuickAddTransaction() {
    const { addTransaction } = useGigFin();
    const [amount, setAmount] = useState("");
    const [type, setType] = useState<"income" | "expense">("expense");
    const [category, setCategory] = useState("Fuel");
    const [description, setDescription] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount) return;

        addTransaction({
            type,
            amount: parseFloat(amount),
            category,
            date: new Date().toISOString().split('T')[0],
            description: description || category
        });

        // Reset form
        setAmount("");
        setDescription("");
    };

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    {type === 'income' ? <PlusCircle className="h-4 w-4 text-green-500" /> : <MinusCircle className="h-4 w-4 text-red-500" />}
                    Quick Add Transaction
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant={type === 'income' ? 'default' : 'outline'}
                            className={`flex-1 ${type === 'income' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                            onClick={() => setType('income')}
                        >
                            Income
                        </Button>
                        <Button
                            type="button"
                            variant={type === 'expense' ? 'default' : 'outline'}
                            className={`flex-1 ${type === 'expense' ? 'bg-red-600 hover:bg-red-700' : ''}`}
                            onClick={() => setType('expense')}
                        >
                            Expense
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount (₹)</Label>
                        <Input
                            id="amount"
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {type === 'income' ? (
                                    <>
                                        <SelectItem value="Uber">Uber Payout</SelectItem>
                                        <SelectItem value="Lyft">Lyft Payout</SelectItem>
                                        <SelectItem value="Tip">Tips</SelectItem>
                                        <SelectItem value="Bonus">Bonus</SelectItem>
                                    </>
                                ) : (
                                    <>
                                        <SelectItem value="Fuel">Fuel</SelectItem>
                                        <SelectItem value="Food">Food</SelectItem>
                                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                                        <SelectItem value="EMI">Vehicle EMI</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button type="submit" className="w-full">
                        Add {type === 'income' ? 'Income' : 'Expense'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
