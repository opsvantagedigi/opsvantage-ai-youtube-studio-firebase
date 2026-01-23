'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { app } from '../../lib/firebase';

const DashboardPage = () => {
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(app);
    const db = getFirestore(app);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        
        // Fetch user's projects
        try {
          const q = query(
            collection(db, 'projects'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc'),
            limit(10)
          );
          
          const querySnapshot = await getDocs(q);
          const projectsData: any[] = [];
          
          querySnapshot.forEach((doc) => {
            projectsData.push({ id: doc.id, ...doc.data() });
          });
          
          setProjects(projectsData);
        } catch (error) {
          console.error('Error fetching projects:', error);
        } finally {
          setLoading(false);
        }
      } else {
        // User not logged in, redirect to home
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    const auth = getAuth(app);
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-opacity-20 backdrop-blur-lg rounded-xl border border-gray-700 text-white p-4 m-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold font-orbitron gradient-text">OpsVantage Digital AI-YouTube Studio</h1>
          <nav>
            <button 
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            >
              Sign Out
            </button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back, {user?.displayName || user?.email}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="gradient-box rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Active Projects</h3>
            <p className="text-3xl font-bold">{projects.length}</p>
          </div>
          <div className="gradient-box rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Videos Generated</h3>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="gradient-box rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Subscribers</h3>
            <p className="text-3xl font-bold">0</p>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Recent Projects</h2>
            <button 
              onClick={() => router.push('/projects/create')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              Create New Project
            </button>
          </div>
          
          {projects.length === 0 ? (
            <div className="gradient-box rounded-lg p-8 text-center">
              <p className="text-xl">You don&apos;t have any projects yet.</p>
              <p className="mt-2 text-gray-300">Create your first project to start generating AI-powered YouTube videos.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div 
                  key={project.id} 
                  className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer"
                  onClick={() => router.push(`/projects/${project.id}`)}
                >
                  <h3 className="text-xl font-semibold mb-2 gradient-text">{project.name}</h3>
                  <p className="text-gray-400 mb-2">Niche: {project.niche}</p>
                  <p className="text-gray-400 text-sm">Created: {new Date(project.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={() => router.push('/content-strategy')}
              className="gradient-box rounded-lg p-6 text-center hover:opacity-90 transition-opacity"
            >
              <h3 className="text-lg font-semibold">Content Strategy</h3>
            </button>
            <button 
              onClick={() => router.push('/scripts')}
              className="gradient-box rounded-lg p-6 text-center hover:opacity-90 transition-opacity"
            >
              <h3 className="text-lg font-semibold">Generate Scripts</h3>
            </button>
            <button 
              onClick={() => router.push('/monetization')}
              className="gradient-box rounded-lg p-6 text-center hover:opacity-90 transition-opacity"
            >
              <h3 className="text-lg font-semibold">Monetization</h3>
            </button>
            <button 
              onClick={() => router.push('/analytics')}
              className="gradient-box rounded-lg p-6 text-center hover:opacity-90 transition-opacity"
            >
              <h3 className="text-lg font-semibold">Analytics</h3>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;