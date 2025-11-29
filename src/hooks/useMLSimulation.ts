import { useState, useCallback } from 'react';

export interface Leak {
    id: string;
    type: 'Fuel Spike' | 'Hidden Fee';
    amount: number;
    risk: 'High' | 'Medium' | 'Low';
}

export interface Goal {
    title: string;
    current: number;
    target: number;
    probability: number;
}

export const useMLSimulation = () => {
    const [autoPilotStatus, setAutoPilotStatus] = useState(true);

    const [detectedLeaks] = useState<Leak[]>([
        { id: '1', type: 'Fuel Spike', amount: 450, risk: 'High' },
        { id: '2', type: 'Hidden Fee', amount: 120, risk: 'High' },
    ]);

    const [goals] = useState<Goal>({
        title: 'Bike Fund',
        current: 12000,
        target: 50000,
        probability: 85,
    });

    const runStressTest = useCallback((fuelPrice: number, orderVolume: number) => {
        // Simple simulation logic
        // Base score starts at 100
        // Higher fuel price reduces score
        // Higher order volume increases score (up to a point) or stabilizes it

        let score = 100;

        // Penalize for high fuel price (assuming base is ~90)
        if (fuelPrice > 90) {
            score -= (fuelPrice - 90) * 1.5;
        }

        // Adjust for order volume (assuming base is 100%)
        // If volume drops below 100%, score drops
        if (orderVolume < 100) {
            score -= (100 - orderVolume) * 0.8;
        } else {
            // Bonus for high volume, but capped
            score += (orderVolume - 100) * 0.2;
        }

        // Clamp score between 0 and 100
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
