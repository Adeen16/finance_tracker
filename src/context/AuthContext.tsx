"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useGigFin } from './GigFinContext';
import { getGigWorkerPrediction } from '@/lib/api';

interface User {
    email: string;
    name: string;
}

interface FinancialData {
    annualIncome: number;
    monthlyExpenses: number;
    debtAmount: number;
    savingsRate: number; // as percentage 0-100
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    onboardingComplete: boolean;
    login: (email: string, name: string) => void;
    logout: () => void;
    completeOnboarding: (data: FinancialData) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [onboardingComplete, setOnboardingComplete] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const router = useRouter();
    const pathname = usePathname();
    const { updateUserProfile, initializeUserTransactions } = useGigFin();

    // Load Auth State
    useEffect(() => {
        const storedAuth = localStorage.getItem('gigfin_auth');
        if (storedAuth) {
            const { user, isAuthenticated, onboardingComplete } = JSON.parse(storedAuth);
            setUser(user);
            setIsAuthenticated(isAuthenticated);
            setOnboardingComplete(onboardingComplete);
        }
        setIsLoaded(true);
    }, []);

    // Route Protection
    useEffect(() => {
        if (!isLoaded) return;

        const publicRoutes = ['/', '/signup', '/login'];
        const isPublic = publicRoutes.includes(pathname);

        if (!isAuthenticated && !isPublic) {
            router.push('/signup'); // Redirect to signup/login if not auth
        } else if (isAuthenticated && !onboardingComplete && pathname !== '/onboarding') {
            router.push('/onboarding'); // Force onboarding
        } else if (isAuthenticated && onboardingComplete && isPublic) {
            router.push('/dashboard'); // Redirect to dashboard if already auth
        }
    }, [isAuthenticated, onboardingComplete, pathname, isLoaded, router]);

    const login = (email: string, name: string) => {
        const newUser = { email, name };
        setUser(newUser);
        setIsAuthenticated(true);

        // Persist
        localStorage.setItem('gigfin_auth', JSON.stringify({
            user: newUser,
            isAuthenticated: true,
            onboardingComplete: false // Default to false until they finish
        }));

        router.push('/onboarding');
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        setOnboardingComplete(false);
        localStorage.removeItem('gigfin_auth');
        localStorage.removeItem('gigfin_data');
        router.push('/');
    };

    const completeOnboarding = async (data: FinancialData) => {
        try {
            // Prepare data for ML API
            const predictionData = {
                annual_income: data.annualIncome,
                incentives: 2000, // Default or from form if added
                platform_commission: 20, // Default
                total_expenses: data.monthlyExpenses,
                weekly_work_hours: 40, // Default
                orders_per_month: 120, // Default
                debt_amount: data.debtAmount,
                savings_rate: data.savingsRate
            };

            // Call ML API
            const response = await getGigWorkerPrediction(predictionData);
            const { predictions } = response;

            console.log("ML Prediction Results:", predictions);

            // Update Global Context with Predicted values
            updateUserProfile({
                name: user?.name || 'User',
                currentBalance: Math.round(data.annualIncome / 12) - data.monthlyExpenses,
                goals: [{
                    id: 'init-1',
                    title: 'Emergency Fund',
                    targetAmount: Math.round(data.annualIncome * 0.2),
                    currentAmount: 0,
                    deadline: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
                    priority: 'High',
                    category: 'Emergency'
                }],
                // Map ML predictions to profile
                gigCreditScore: predictions.gig_credit_score || 650,
                approvalProbability: predictions.approval_probability || 0,
                maxLoanAmount: predictions.max_loan_amount || 0

            });

            // Generate Synthetic Transactions based on Input
            initializeUserTransactions(data.annualIncome, data.monthlyExpenses);

            setOnboardingComplete(true);

            // Update Persistence
            localStorage.setItem('gigfin_auth', JSON.stringify({
                user,
                isAuthenticated: true,
                onboardingComplete: true
            }));

            router.push('/dashboard');
        } catch (error) {
            console.error("Onboarding Failed:", error);
            alert("Financial Analysis failed. Please try again.");
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            onboardingComplete,
            login,
            logout,
            completeOnboarding
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
