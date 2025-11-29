"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useGigFin } from './GigFinContext';

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
    const { updateUserProfile } = useGigFin();

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
        localStorage.removeItem('gigfin_data'); // Optional: Clear data on logout? Maybe keep for demo.
        router.push('/');
    };

    const completeOnboarding = (data: FinancialData) => {
        // --- Mock ML Logic ---

        // 1. Liquidity Ratio
        // const liquidityRatio = data.annualIncome / (data.monthlyExpenses * 12);

        // 2. GigCreditScore
        // If debt < 10000 -> 750, else 620
        // We'll update this in the profile/context logic if needed, 
        // but here we just simulate the "Analysis" and update the main Context.

        // 3. Survival Runway
        // const survivalRunway = (data.savingsRate / 100) * data.annualIncome; // Very rough calc

        // Update Global Context with "Predicted" values
        updateUserProfile({
            name: user?.name || 'User',
            currentBalance: Math.round(data.annualIncome / 12) - data.monthlyExpenses, // Initial balance estimate
            savingsGoal: Math.round(data.annualIncome * 0.2), // Suggest 20% savings
            // We could add more specific fields to UserProfile if needed
        });

        setOnboardingComplete(true);

        // Update Persistence
        localStorage.setItem('gigfin_auth', JSON.stringify({
            user,
            isAuthenticated: true,
            onboardingComplete: true
        }));

        router.push('/dashboard');
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
