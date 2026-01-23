'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../../lib/firebase';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
// Note: GenKit flows run on the server, so we'll call them via API routes

const ProjectDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [connectingYouTube, setConnectingYouTube] = useState(false);
  const db = getFirestore(app);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        
        try {
          // Fetch project data
          const projectDoc = await getDoc(doc(db, 'projects', id as string));
          if (projectDoc.exists()) {
            setProject({ id: projectDoc.id, ...projectDoc.data() });
          } else {
            router.push('/dashboard');
          }
        } catch (error) {
          console.error('Error fetching project:', error);
          router.push('/dashboard');
        } finally {
          setLoading(false);
        }
      } else {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [id, router]);

  const handleConnectYouTube = async () => {
    if (!user || !id) return;

    setConnectingYouTube(true);

    try {
      // Call the GenKit flow via API route
      const response = await fetch('/api/genkit/connect-youtube-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.uid }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Redirect to YouTube auth URL
      window.location.href = result.authUrl;
    } catch (error) {
      console.error('Error connecting YouTube account:', error);
      alert('Error connecting YouTube account. Please try again.');
    } finally {
      setConnectingYouTube(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Project not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-opacity-20 backdrop-blur-lg rounded-xl border border-gray-700 text-white p-4 m-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold font-orbitron gradient-text">OpsVantage Digital AI-YouTube Studio</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
              <p className="text-gray-400">Niche: {project.niche}</p>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Project Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Project Details</h2>
            <div className="space-y-3">
              <div>
                <span className="text-gray-400">Niche:</span>
                <p>{project.niche}</p>
              </div>
              <div>
                <span className="text-gray-400">Language:</span>
                <p>{project.language}</p>
              </div>
              <div>
                <span className="text-gray-400">Tone:</span>
                <p>{project.tone}</p>
              </div>
              <div>
                <span className="text-gray-400">Target Audience:</span>
                <p>{project.targetAudience}</p>
              </div>
              <div>
                <span className="text-gray-400">Posting Frequency:</span>
                <p>{project.postingFrequency}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">YouTube Connection</h2>
            {project.connectedYouTubeChannelId ? (
              <div className="space-y-3">
                <p className="text-green-500">✓ Connected to YouTube Channel</p>
                <p className="text-gray-400">Channel ID: {project.connectedYouTubeChannelId}</p>
                <button
                  onClick={() => router.push(`/projects/${id}/content-plan`)}
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                >
                  Manage Content Plan
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-yellow-500">⚠ YouTube not connected</p>
                <p className="text-gray-400">Connect your YouTube channel to start generating and uploading videos.</p>
                <button
                  onClick={handleConnectYouTube}
                  disabled={connectingYouTube}
                  className={`mt-4 px-4 py-2 rounded-md transition-colors ${
                    connectingYouTube
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {connectingYouTube ? 'Connecting...' : 'Connect YouTube Account'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Project Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Project Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => router.push(`/projects/${id}/content-strategy`)}
              className="gradient-box rounded-lg p-6 text-center hover:opacity-90 transition-opacity"
            >
              <h3 className="text-lg font-semibold">Content Strategy</h3>
            </button>
            <button
              onClick={() => router.push(`/projects/${id}/scripts`)}
              className="gradient-box rounded-lg p-6 text-center hover:opacity-90 transition-opacity"
            >
              <h3 className="text-lg font-semibold">Generate Scripts</h3>
            </button>
            <button
              onClick={() => router.push(`/projects/${id}/monetization`)}
              className="gradient-box rounded-lg p-6 text-center hover:opacity-90 transition-opacity"
            >
              <h3 className="text-lg font-semibold">Monetization</h3>
            </button>
            <button
              onClick={() => router.push(`/projects/${id}/analytics`)}
              className="gradient-box rounded-lg p-6 text-center hover:opacity-90 transition-opacity"
            >
              <h3 className="text-lg font-semibold">Analytics</h3>
            </button>
          </div>
        </div>

        {/* Recent Content Plan Items */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Recent Content Plan</h2>
            <button
              onClick={() => router.push(`/projects/${id}/content-plan`)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              View All
            </button>
          </div>
          
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left">Title</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Format</th>
                  <th className="py-3 px-4 text-left">Difficulty</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-700">
                  <td className="py-3 px-4">Getting Started Guide</td>
                  <td className="py-3 px-4"><span className="px-2 py-1 bg-yellow-900 text-yellow-300 rounded">Planned</span></td>
                  <td className="py-3 px-4">Long Form</td>
                  <td className="py-3 px-4">Medium</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-3 px-4">Top 10 Tips</td>
                  <td className="py-3 px-4"><span className="px-2 py-1 bg-green-900 text-green-300 rounded">Published</span></td>
                  <td className="py-3 px-4">Shorts</td>
                  <td className="py-3 px-4">Low</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Advanced Techniques</td>
                  <td className="py-3 px-4"><span className="px-2 py-1 bg-blue-900 text-blue-300 rounded">In Progress</span></td>
                  <td className="py-3 px-4">Long Form</td>
                  <td className="py-3 px-4">High</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetailPage;