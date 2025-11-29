"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// --- Types ---

export interface Transaction {
    id: string;
    type: 'income' | 'expense' | 'withdrawal';
    amount: number;
    category: string;
    date: string; // YYYY-MM-DD
    description?: string;
}

export interface Loan {
    id: string;
    totalAmount: number;
    remainingAmount: number;
    installmentAmount: number;
    nextDueDate: string;
    status: 'active' | 'paid' | 'defaulted';
}

export interface BankDetails {
    accountNo: string;
    ifsc: string;
    bankName: string;
}

export interface UserProfile {
    name: string;
    age: number;
    gender: string;
    occupation: string;
    email: string;
    location: string;
    bankDetails: BankDetails;
    currentBalance: number; // Acts as walletBalance
    savingsGoal: number;
    appStreak: number;
    theme: 'dark' | 'light';
}

export interface AppConfig {
    fuelPrice: number;
    dailyTarget: number;
}

interface GigFinContextType {
    transactions: Transaction[];
    loans: Loan[];
    userProfile: UserProfile;
    appConfig: AppConfig;
    addTransaction: (data: Omit<Transaction, 'id'>) => void;
    applyForLoan: (amount: number) => void;
    withdrawMoney: (amount: number) => { success: boolean; message: string };
    calculateKarmaScore: () => number;
    updateAppConfig: (config: Partial<AppConfig>) => void;
    updateUserProfile: (profile: Partial<UserProfile>) => void;
    toggleTheme: () => void;
}

// --- Initial Data ---

const INITIAL_TRANSACTIONS: Transaction[] = [
    { id: '1', type: 'income', amount: 1200, category: 'Uber', date: new Date(Date.now() - 86400000 * 0).toISOString().split('T')[0], description: 'Daily Payout' },
    { id: '2', type: 'expense', amount: 300, category: 'Fuel', date: new Date(Date.now() - 86400000 * 0).toISOString().split('T')[0], description: 'Petrol' },
    { id: '3', type: 'income', amount: 950, category: 'Uber', date: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0], description: 'Daily Payout' },
    { id: '4', type: 'income', amount: 1100, category: 'Uber', date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], description: 'Daily Payout' },
    { id: '5', type: 'expense', amount: 150, category: 'Food', date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], description: 'Lunch' },
    { id: '6', type: 'income', amount: 800, category: 'Uber', date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0], description: 'Daily Payout' },
    { id: '7', type: 'income', amount: 0, category: 'Uber', date: new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0], description: 'Day Off' },
    { id: '8', type: 'income', amount: 1300, category: 'Uber', date: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0], description: 'Daily Payout' },
];

const INITIAL_PROFILE: UserProfile = {
    name: 'Raju Kumar',
    age: 28,
    gender: 'Male',
    occupation: 'Swiggy Partner',
    email: 'raju.kumar@example.com',
    location: 'Hyderabad',
    bankDetails: {
        accountNo: 'XXXX-XXXX-8899',
        ifsc: 'HDFC0001234',
        bankName: 'HDFC Bank'
    },
    currentBalance: 4500,
    savingsGoal: 50000,
    appStreak: 12,
    theme: 'light'
};

const INITIAL_CONFIG: AppConfig = {
    fuelPrice: 102,
    dailyTarget: 800,
};

// --- Context ---

const GigFinContext = createContext<GigFinContextType | undefined>(undefined);

export function GigFinProvider({ children }: { children: ReactNode }) {
    const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
    const [loans, setLoans] = useState<Loan[]>([]);
    const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_PROFILE);
    const [appConfig, setAppConfig] = useState<AppConfig>(INITIAL_CONFIG);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from LocalStorage
    useEffect(() => {
        const savedData = localStorage.getItem('gigfin_data');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData) as {
                    transactions?: Transaction[];
                    loans?: Loan[];
                    userProfile?: UserProfile;
                    appConfig?: AppConfig;
                };
                if (parsed.transactions) setTransactions(parsed.transactions);
                if (parsed.loans) setLoans(parsed.loans);
                if (parsed.userProfile) setUserProfile(prev => ({ ...prev, ...parsed.userProfile }));
                if (parsed.appConfig) setAppConfig(parsed.appConfig);
            } catch (e) {
                console.error("Failed to load data", e);
            }
        }
        setIsLoaded(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Save to LocalStorage
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('gigfin_data', JSON.stringify({
                transactions,
                loans,
                userProfile,
                appConfig
            }));
        }
    }, [transactions, loans, userProfile, appConfig, isLoaded]);

    // Theme Effect
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(userProfile.theme);
    }, [userProfile.theme]);

    // --- Logic Layer ---

    const calculateKarmaScore = () => {
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);

        const recentTx = transactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate >= sevenDaysAgo && tDate <= today && t.type === 'income';
        });

        const uniqueDaysWorked = new Set(recentTx.filter(t => t.amount > 0).map(t => t.date)).size;
        const consistencyScore = (uniqueDaysWorked / 7) * 40;

        const totalEarnings = recentTx.reduce((sum, t) => sum + t.amount, 0);
        const avgEarnings = uniqueDaysWorked > 0 ? totalEarnings / uniqueDaysWorked : 0;
        const performanceScore = avgEarnings >= appConfig.dailyTarget ? 30 : (avgEarnings > 0 ? 15 : 0);

        // Simple streak calculation
        const loyaltyScore = Math.min(userProfile.appStreak * 2, 30);

        return Math.min(Math.round(consistencyScore + performanceScore + loyaltyScore), 100);
    };

    const addTransaction = (data: Omit<Transaction, 'id'>) => {
        const newTx: Transaction = { ...data, id: Date.now().toString() };
        setTransactions(prev => [newTx, ...prev]);

        if (data.type === 'income') {
            setUserProfile(prev => ({ ...prev, currentBalance: prev.currentBalance + data.amount }));
        } else {
            setUserProfile(prev => ({ ...prev, currentBalance: prev.currentBalance - data.amount }));
        }
    };

    const applyForLoan = (amount: number) => {
        if (userProfile.currentBalance <= 0) {
            alert("Insufficient balance history to approve loan.");
            return;
        }

        const newLoan: Loan = {
            id: Date.now().toString(),
            totalAmount: amount,
            remainingAmount: amount,
            installmentAmount: amount / 4,
            nextDueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
            status: 'active'
        };

        setLoans(prev => [...prev, newLoan]);

        addTransaction({
            type: 'income',
            amount: amount,
            category: 'Gig-Tabby Loan',
            date: new Date().toISOString().split('T')[0],
            description: 'Loan Disbursement'
        });
    };

    const withdrawMoney = (amount: number): { success: boolean; message: string } => {
        if (amount > userProfile.currentBalance) {
            return { success: false, message: 'Insufficient Funds' };
        }

        addTransaction({
            type: 'withdrawal',
            category: 'Salary Transfer',
            amount: amount,
            date: new Date().toISOString().split('T')[0],
            description: 'Instant Withdrawal'
        });

        return { success: true, message: 'Transfer Initiated' };
    };

    const updateAppConfig = (config: Partial<AppConfig>) => {
        setAppConfig(prev => ({ ...prev, ...config }));
    };

    const updateUserProfile = (profile: Partial<UserProfile>) => {
        setUserProfile(prev => ({ ...prev, ...profile }));
    };

    const toggleTheme = () => {
        setUserProfile(prev => ({
            ...prev,
            theme: prev.theme === 'light' ? 'dark' : 'light'
        }));
    };

    return (
        <GigFinContext.Provider value={{
            transactions,
            loans,
            userProfile,
            appConfig,
            addTransaction,
            applyForLoan,
            withdrawMoney,
            calculateKarmaScore,
            updateAppConfig,
            updateUserProfile,
            toggleTheme
        }}>
            {children}
        </GigFinContext.Provider>
    );
}

export const useGigFin = () => {
    const context = useContext(GigFinContext);
    if (context === undefined) {
        throw new Error('useGigFin must be used within a GigFinProvider');
    }
    return context;
};
