import { useState, useCallback, useMemo } from 'react';
import { Transaction } from '@/context/GigFinContext';

export interface Leak {
    id: string;
    type: 'Fuel Spike' | 'Hidden Fee' | 'Subscription' | 'High Expense';
    amount: number;
    risk: 'High' | 'Medium' | 'Low';
}

export interface Goal {
    title: string;
    current: number;
    target: number;
    probability: number;
}

export const useMLSimulation = (transactions: Transaction[] = [], currentBalance: number = 0, savingsGoal: number = 0) => {
    const [autoPilotStatus, setAutoPilotStatus] = useState(true);

    // Dynamic Leaks Detection
    const detectedLeaks = useMemo(() => {
        const leaks: Leak[] = [];

        // 1. Detect Fuel Spikes (if any fuel expense > avg)
        const fuelTx = transactions.filter(t => t.category === 'Fuel');
        if (fuelTx.length > 0) {
            const avgFuel = fuelTx.reduce((sum, t) => sum + t.amount, 0) / fuelTx.length;
            const spikes = fuelTx.filter(t => t.amount > avgFuel * 1.2); // 20% higher than avg
            spikes.forEach((spike, idx) => {
                leaks.push({
                    id: `fuel-${idx}`,
                    type: 'Fuel Spike',
                    amount: spike.amount - avgFuel,
                    risk: 'High'
                });
            });
        }

        // 2. Detect High Expenses (if single expense > 10% of balance)
        const highExpenses = transactions.filter(t => t.type === 'expense' && t.amount > currentBalance * 0.1);
        highExpenses.forEach((exp, idx) => {
            leaks.push({
                id: `high-exp-${idx}`,
                type: 'High Expense',
                amount: exp.amount,
                risk: 'Medium'
            });
        });

        // Fallback for demo if no real leaks found
        if (leaks.length === 0) {
            leaks.push({ id: 'demo-1', type: 'Hidden Fee', amount: 120, risk: 'Low' });
        }

        return leaks.slice(0, 3); // Limit to top 3
    }, [transactions, currentBalance]);

    // Dynamic Goal Probability
    const goals = useMemo(() => {
        const progress = savingsGoal > 0 ? (currentBalance / savingsGoal) : 0;
        // Probability increases with progress and recent income consistency (mocked consistency here)
        const baseProb = Math.min(95, Math.round(progress * 100) + 10);

        return {
            title: 'Savings Goal',
            current: currentBalance,
            target: savingsGoal,
            probability: Math.min(99, baseProb),
        };
    }, [currentBalance, savingsGoal]);

    const runStressTest = useCallback((fuelPrice: number, orderVolume: number) => {
        let score = 100;
        if (fuelPrice > 90) score -= (fuelPrice - 90) * 1.5;
        if (orderVolume < 100) score -= (100 - orderVolume) * 0.8;
        else score += (orderVolume - 100) * 0.2;
        return Math.max(0, Math.min(100, Math.round(score)));
    }, []);

    const toggleAutoPilot = () => setAutoPilotStatus(prev => !prev);

    return {
        autoPilotStatus,
        toggleAutoPilot,
        detectedLeaks,
        goals,
        runStressTest
    };
};
