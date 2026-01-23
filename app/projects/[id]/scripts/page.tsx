'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../../../lib/firebase';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
// Note: GenKit flows run on the server, so we'll call them via API routes

const ScriptsPage = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const planItemId = searchParams.get('planItemId');
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [project, setProject] = useState<any>(null);
  const [scripts, setScripts] = useState<any[]>([]);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [idea, setIdea] = useState('');
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
            
            // Fetch existing scripts for this project
            const scriptsQuery = query(
              collection(db, 'scripts'),
              where('projectId', '==', id as string)
            );
            const scriptsSnapshot = await getDocs(scriptsQuery);
            
            const scriptsData: any[] = [];
            scriptsSnapshot.forEach(doc => {
              scriptsData.push({ id: doc.id, ...doc.data() });
            });
            
            setScripts(scriptsData);
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

  const handleGenerateScript = async () => {
    if (!user || !id || !idea.trim()) return;

    setGenerating(true);

    try {
      // Call the GenKit flow via API route
      const response = await fetch('/api/genkit/generate-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idea: idea.trim(),
          projectId: id as string,
          planItemId: planItemId || undefined
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Add the new script to the list
      setScripts(prev => [result, ...prev]);
      setIdea('');
      alert('Script generated successfully!');
    } catch (error) {
      console.error('Error generating script:', error);
      alert('Error generating script. Please try again.');
    } finally {
      setGenerating(false);
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
              <h1 className="text-3xl font-bold mb-2">Scripts for {project.name}</h1>
              <p className="text-gray-400">AI-generated scripts for your YouTube videos</p>
            </div>
            <button
              onClick={() => router.push(`/projects/${id}`)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
            >
              Back to Project
            </button>
          </div>
        </div>

        {/* Generate Script Card */}
        <div className="gradient-box rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Generate New Script</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="idea" className="block text-sm font-medium mb-2">
                Video Idea or Topic
              </label>
              <input
                type="text"
                id="idea"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Enter a video idea, topic, or concept..."
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleGenerateScript}
                disabled={generating || !idea.trim()}
                className={`px-6 py-3 rounded-md font-medium ${
                  generating || !idea.trim()
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } transition-colors`}
              >
                {generating ? 'Generating...' : 'Generate Script'}
              </button>
            </div>
          </div>
        </div>

        {/* Scripts List */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Generated Scripts</h2>
            <p className="text-gray-400">{scripts.length} scripts</p>
          </div>
          
          {scripts.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
              <p className="text-xl">No scripts generated yet.</p>
              <p className="mt-2 text-gray-300">Create your first script using the form above.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {scripts.map((script, index) => (
                <div 
                  key={script.id || index} 
                  className="bg-gray-800 rounded-lg p-6 border border-gray-700"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold gradient-text">{script.seoMetadata?.title || `Script ${index + 1}`}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => router.push(`/projects/${id}/scripts/${script.id}`)}
                        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md text-sm transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => {/* Implement script editing */}}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-md text-sm transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-300 mb-4 line-clamp-2">
                    {script.scriptText?.substring(0, 200)}...
                  </div>
                  
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-1 bg-gray-700 rounded">Words: {script.scriptText?.split(' ').length || 0}</span>
                    <span className="px-2 py-1 bg-gray-700 rounded">Created: {new Date(script.createdAt).toLocaleDateString()}</span>
                    {script.seoMetadata?.tags && (
                      <span className="px-2 py-1 bg-purple-900 text-purple-300 rounded">Tags: {script.seoMetadata.tags.length}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ScriptsPage;