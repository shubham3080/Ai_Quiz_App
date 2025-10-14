"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [userName, setUserName] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    useEffect(() => {
        const jwtToken = localStorage.getItem("token");
        if (jwtToken) {
            try {
                const decoded: { id: string; name: string } = jwtDecode(jwtToken);
                setUserName(decoded.name);
            } catch (error) {
                router.push("/login");
            }
        } else {
            router.push("/login");
            return;
        }
        setIsLoading(false);
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div>
                            <h1 className="text-lg font-medium text-gray-900">
                                Welcome, <span className="font-semibold capitalize">{userName.split(' ')[0]}</span>!
                            </h1>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50 hover:border-red-400 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}