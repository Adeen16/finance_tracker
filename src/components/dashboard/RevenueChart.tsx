"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

import { useGigFin } from "@/context/GigFinContext";
import { useMemo } from "react";

export function RevenueChart() {
    const { transactions } = useGigFin();

    const data = useMemo(() => {
        const last6Months = new Array(6).fill(0).map((_, i) => {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            return {
                month: d.getMonth(),
                year: d.getFullYear(),
                name: d.toLocaleString('default', { month: 'short' }),
                revenue: 0,
                expenses: 0
            };
        }).reverse();

        transactions.forEach(t => {
            const tDate = new Date(t.date);
            const monthData = last6Months.find(m => m.month === tDate.getMonth() && m.year === tDate.getFullYear());
            if (monthData) {
                if (t.type === 'income') monthData.revenue += t.amount;
                if (t.type === 'expense') monthData.expenses += t.amount;
            }
        });

        return last6Months;
    }, [transactions]);

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Revenue vs Expenses (Last 6 Months)</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data}>
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `₹${value}`}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            formatter={(value: number) => [`₹${value}`, undefined]}
                        />
                        <Bar dataKey="revenue" fill="var(--color-primary)" radius={[4, 4, 0, 0]} name="Income" />
                        <Bar dataKey="expenses" fill="var(--color-destructive)" radius={[4, 4, 0, 0]} name="Expenses" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
