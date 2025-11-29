"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, AlertCircle, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function SignUpPage() {
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        dob: "",
        pan: "",
        aadhaar: ""
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        // PAN Regex: 5 letters, 4 digits, 1 letter
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (!panRegex.test(formData.pan)) {
            newErrors.pan = "Invalid PAN Format (e.g., ABCDE1234F)";
        }

        // Aadhaar: 12 digits
        const aadhaarRegex = /^\d{12}$/;
        if (!aadhaarRegex.test(formData.aadhaar)) {
            newErrors.aadhaar = "Aadhaar must be 12 digits";
        }

        if (!formData.name) newErrors.name = "Name is required";
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.password) newErrors.password = "Password is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            login(formData.email, formData.name);
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error on change
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <Card className="w-full max-w-md shadow-xl border-slate-200 dark:border-slate-800">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-2">
                        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <ShieldCheck className="h-6 w-6 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Create GigFin Account</CardTitle>
                    <CardDescription>
                        Enter your details to verify your identity
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                placeholder="As per PAN Card"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                            />
                            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                            />
                            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => handleChange('password', e.target.value)}
                            />
                            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="dob">Date of Birth</Label>
                                <Input
                                    id="dob"
                                    type="date"
                                    value={formData.dob}
                                    onChange={(e) => handleChange('dob', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="pan">PAN Number</Label>
                            <div className="relative">
                                <Input
                                    id="pan"
                                    placeholder="ABCDE1234F"
                                    value={formData.pan}
                                    onChange={(e) => handleChange('pan', e.target.value.toUpperCase())}
                                    className={errors.pan ? "border-red-500" : ""}
                                />
                                {!errors.pan && formData.pan.length === 10 && (
                                    <CheckCircle className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />
                                )}
                            </div>
                            {errors.pan && (
                                <p className="text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" /> {errors.pan}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="aadhaar">Aadhaar Number</Label>
                            <div className="relative">
                                <Input
                                    id="aadhaar"
                                    placeholder="1234 5678 9012"
                                    value={formData.aadhaar}
                                    onChange={(e) => handleChange('aadhaar', e.target.value)}
                                    className={errors.aadhaar ? "border-red-500" : ""}
                                />
                                {!errors.aadhaar && formData.aadhaar.length === 12 && (
                                    <CheckCircle className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />
                                )}
                            </div>
                            {errors.aadhaar && (
                                <p className="text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" /> {errors.aadhaar}
                                </p>
                            )}
                        </div>

                        <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                            Verify & Continue
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                        Already have an account? <Link href="/login" className="text-primary hover:underline">Log in</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
