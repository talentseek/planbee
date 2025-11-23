"use client";

import React, { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, Trash2, Lock, User, AlertTriangle } from "lucide-react";

export default function SettingsPage() {
    const router = useRouter();
    const { data: session } = authClient.useSession();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Intensity mode state
    const [intensity, setIntensity] = useState<'GLIDER' | 'WORKER_BEE' | 'HERO_MODE'>('WORKER_BEE');

    // Load user's current intensity on mount
    React.useEffect(() => {
        const loadUserSettings = async () => {
            if (session?.user?.id) {
                try {
                    const res = await fetch('/api/user/settings');
                    if (res.ok) {
                        const data = await res.json();
                        setIntensity(data.intensityMode || 'WORKER_BEE');
                    }
                } catch (error) {
                    console.error('Failed to load user settings:', error);
                }
            }
        };
        loadUserSettings();
    }, [session?.user?.id]);

    const handleIntensityChange = async (newIntensity: 'GLIDER' | 'WORKER_BEE' | 'HERO_MODE') => {
        setIntensity(newIntensity);
        try {
            const res = await fetch('/api/user/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ intensityMode: newIntensity }),
            });
            if (!res.ok) {
                console.error('Failed to update intensity');
            }
        } catch (error) {
            console.error('Error updating intensity:', error);
        }
    };

    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/signin");
                },
            },
        });
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError("");
        setPasswordSuccess("");
        setIsChangingPassword(true);

        if (newPassword !== confirmPassword) {
            setPasswordError("New passwords do not match");
            setIsChangingPassword(false);
            return;
        }

        if (newPassword.length < 8) {
            setPasswordError("Password must be at least 8 characters");
            setIsChangingPassword(false);
            return;
        }

        try {
            await authClient.changePassword({
                newPassword: newPassword,
                currentPassword: currentPassword,
                revokeOtherSessions: true,
            }, {
                onSuccess: () => {
                    setPasswordSuccess("Password changed successfully");
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                },
                onError: (ctx) => {
                    setPasswordError(ctx.error.message);
                }
            });
        } catch (err) {
            console.error(err);
            setPasswordError("An error occurred while changing password");
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        try {
            await authClient.deleteUser({
                fetchOptions: {
                    onSuccess: () => {
                        router.push("/");
                    },
                    onError: (ctx) => {
                        alert(ctx.error.message);
                    }
                }
            });
        } catch (error) {
            console.error("Failed to delete account", error);
            alert("Failed to delete account");
        } finally {
            setIsDeleting(false);
        }
    };

    if (!session) {
        return <div className="p-8">Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-bee-black">Settings</h1>
                <p className="text-gray-500">Manage your account and preferences</p>
            </header>

            {/* Profile Section */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-bee-pale rounded-full flex items-center justify-center text-bee-gold">
                        <User size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-bee-black">Profile</h2>
                        <p className="text-gray-500">Your personal information</p>
                    </div>
                </div>
                <div className="grid gap-4 max-w-md">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-800">
                            {session.user.name}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-800">
                            {session.user.email}
                        </div>
                    </div>
                </div>
            </section>

            {/* Intensity Mode Section */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-bee-pale rounded-full flex items-center justify-center text-bee-gold">
                        <span className="text-2xl">🐝</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-bee-black">Flight Path</h2>
                        <p className="text-gray-500">Choose your daily intensity level</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 max-w-3xl">
                    {/* Garden Glider */}
                    <button
                        onClick={() => handleIntensityChange('GLIDER')}
                        className={`p-6 rounded-2xl border-2 cursor-pointer transition-all text-left ${intensity === 'GLIDER'
                            ? 'border-bee-gold bg-bee-pale/30 shadow-honey scale-105'
                            : 'border-gray-100 hover:border-bee-pale hover:bg-gray-50'
                            }`}
                    >
                        <div className="text-2xl mb-2">🦋</div>
                        <h3 className="font-bold text-bee-brown">Garden Glider</h3>
                        <p className="text-sm text-gray-500 mt-1">Light pace. Target: 4 Cells (2 hrs).</p>
                    </button>

                    {/* Worker Bee */}
                    <button
                        onClick={() => handleIntensityChange('WORKER_BEE')}
                        className={`p-6 rounded-2xl border-2 cursor-pointer transition-all text-left ${intensity === 'WORKER_BEE'
                            ? 'border-bee-gold bg-bee-pale/30 shadow-honey scale-105'
                            : 'border-gray-100 hover:border-bee-pale hover:bg-gray-50'
                            }`}
                    >
                        <div className="text-2xl mb-2">🐝</div>
                        <h3 className="font-bold text-bee-brown">Worker Bee</h3>
                        <p className="text-sm text-gray-500 mt-1">Standard. Target: 8 Cells (4 hrs).</p>
                        <span className="inline-block mt-2 text-xs bg-bee-gold text-white px-2 py-0.5 rounded-full">Recommended</span>
                    </button>

                    {/* Hero Mode */}
                    <button
                        onClick={() => handleIntensityChange('HERO_MODE')}
                        className={`p-6 rounded-2xl border-2 cursor-pointer transition-all text-left ${intensity === 'HERO_MODE'
                            ? 'border-bee-gold bg-bee-pale/30 shadow-honey scale-105'
                            : 'border-gray-100 hover:border-bee-pale hover:bg-gray-50'
                            }`}
                    >
                        <div className="text-2xl mb-2">🦸</div>
                        <h3 className="font-bold text-bee-brown">Hero Mode</h3>
                        <p className="text-sm text-gray-500 mt-1">Intense. Target: 12+ Cells.</p>
                    </button>
                </div>
            </section>

            {/* Security Section */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <Lock size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-bee-black">Security</h2>
                        <p className="text-gray-500">Update your password</p>
                    </div>
                </div>

                <form onSubmit={handleChangePassword} className="max-w-md space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-bee-gold focus:ring-1 focus:ring-bee-gold"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-bee-gold focus:ring-1 focus:ring-bee-gold"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-bee-gold focus:ring-1 focus:ring-bee-gold"
                            required
                        />
                    </div>

                    {passwordError && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                            {passwordError}
                        </div>
                    )}
                    {passwordSuccess && (
                        <div className="p-3 bg-green-50 text-green-600 rounded-lg text-sm">
                            {passwordSuccess}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={isChangingPassword}
                        className="font-medium"
                    >
                        {isChangingPassword ? "Updating..." : "Update Password"}
                    </Button>
                </form>
            </section>

            {/* Danger Zone */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-red-100">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-red-600">Danger Zone</h2>
                        <p className="text-gray-500">Irreversible actions</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-red-100 rounded-xl bg-red-50/50">
                        <div>
                            <h3 className="font-medium text-gray-900">Sign Out</h3>
                            <p className="text-sm text-gray-500">Sign out of your account on this device</p>
                        </div>
                        <Button
                            onClick={handleLogout}
                            variant="outline"
                            className="w-full flex items-center gap-3 p-6 rounded-xl hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 font-medium border-primary/10 text-muted-foreground"
                        >
                            <LogOut size={18} />
                            Sign Out
                        </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-red-200 rounded-xl bg-red-50">
                        <div>
                            <h3 className="font-medium text-red-700">Delete Account</h3>
                            <p className="text-sm text-red-600">Permanently delete your account and all data</p>
                        </div>
                        {!showDeleteConfirm ? (
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                <Trash2 size={18} />
                                Delete Account
                            </button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-red-600 font-medium">Are you sure?</span>
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={isDeleting}
                                    className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                                >
                                    {isDeleting ? "Deleting..." : "Yes, Delete"}
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
