'use client';

import { Logo } from "@/components/Logo";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase';
import { getProjects } from '../actions';
import { useRouter } from "next/navigation";

interface Project {
    id: string;
    niche: string;
    videoIdea: string;
    script?: string;
    // Add other project fields as necessary
}

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const result = await getProjects(currentUser.uid);
                if (result.success && result.projects) {
                    setProjects(result.projects as Project[]);
                }
            } else {
                router.push('/'); // Redirect if user logs out
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    const handleSignOut = async () => {
        try {
            await auth.signOut();
            router.push('/');
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    if (loading) {
        return <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center"><p>Loading dashboard...</p></div>;
    }

    return (
        <ProtectedRoute>
            <div className="bg-gray-900 text-white min-h-screen flex flex-col font-sans">
                <header className="glass-header w-full flex items-center justify-between p-6">
                    <div className="flex items-center">
                        <Logo />
                        <h1 className="text-2xl font-bold ml-3 font-orbitron">Dashboard</h1>
                    </div>
                    <nav className="flex items-center gap-4">
                        <Link href="/" className="text-lg font-medium hover:text-gray-400 transition-colors">Home</Link>
                        <button onClick={handleSignOut} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                            Logout
                        </button>
                    </nav>
                </header>

                <main className="flex-grow container mx-auto px-6 py-8">
                    {projects.length === 0 ? (
                        <div className="text-center mt-20">
                            <h2 className="text-3xl font-bold mb-4">No Projects Yet!</h2>
                            <p className="text-lg mb-8">It looks like you haven't created any video projects. Let's change that!</p>
                            <Link href="/wizard" className="inline-block px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-green-400 to-blue-500 rounded-full shadow-lg hover:scale-105 transform transition-transform duration-300 ease-in-out">
                                Create Your First Video
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {projects.map(project => (
                                <div key={project.id} className="glass-box-dashboard p-6 rounded-lg flex flex-col">
                                    <h3 className="text-xl font-bold mb-2 font-orbitron">{project.niche}</h3>
                                    <p className="text-gray-300 flex-grow">{project.videoIdea}</p>
                                    <div className="mt-6 text-right">
                                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                                            View Project
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>

                <footer className="w-full text-center p-6 text-sm text-gray-500">
                    &copy; 2024 OpsVantage AI-YouTube Studio. All rights reserved.
                </footer>
            </div>
        </ProtectedRoute>
    );
}
