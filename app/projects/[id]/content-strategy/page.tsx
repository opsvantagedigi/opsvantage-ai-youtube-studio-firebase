'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../../../lib/firebase';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
// Note: GenKit flows run on the server, so we'll call them via API routes

const ContentStrategyPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [project, setProject] = useState<any>(null);
  const [contentPlan, setContentPlan] = useState<any[]>([]);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
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
            
            // Fetch existing content plan
            const contentPlansQuery = query(
              collection(db, 'contentPlans'),
              where('projectId', '==', id as string)
            );
            const contentPlansSnapshot = await getDocs(contentPlansQuery);
            
            if (!contentPlansSnapshot.empty) {
              const plans: any[] = [];
              contentPlansSnapshot.forEach(doc => {
                plans.push({ id: doc.id, ...doc.data() });
              });
              
              // Use the most recent plan
              if (plans.length > 0) {
                setContentPlan(plans[0].items || []);
              }
            }
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

  const handleGenerateContentStrategy = async () => {
    if (!user || !id) return;

    setGenerating(true);

    try {
      // Call the GenKit flow via API route
      const response = await fetch('/api/genkit/generate-content-strategy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          projectId: id as string
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setContentPlan(result.contentPlan);
      alert('Content strategy generated successfully!');
    } catch (error) {
      console.error('Error generating content strategy:', error);
      alert('Error generating content strategy. Please try again.');
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
              <h1 className="text-3xl font-bold mb-2">Content Strategy for {project.name}</h1>
              <p className="text-gray-400">AI-generated content plan for your YouTube channel</p>
            </div>
            <button
              onClick={() => router.push(`/projects/${id}`)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
            >
              Back to Project
            </button>
          </div>
        </div>

        {/* Action Card */}
        <div className="gradient-box rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">Generate Content Strategy</h2>
              <p className="text-gray-300">Create an AI-powered content plan tailored to your niche and audience</p>
            </div>
            <button
              onClick={handleGenerateContentStrategy}
              disabled={generating}
              className={`mt-4 md:mt-0 px-6 py-3 rounded-md font-medium ${
                generating 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } transition-colors`}
            >
              {generating ? 'Generating...' : 'Generate Strategy'}
            </button>
          </div>
        </div>

        {/* Content Plan */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Content Plan</h2>
            <p className="text-gray-400">{contentPlan.length} items planned</p>
          </div>
          
          {contentPlan.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
              <p className="text-xl">No content plan generated yet.</p>
              <p className="mt-2 text-gray-300">Click &quot;Generate Strategy&quot; to create your AI-powered content plan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contentPlan.map((item, index) => (
                <div 
                  key={item.id || index} 
                  className="bg-gray-800 rounded-lg p-6 border border-gray-700"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold gradient-text">{item.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      item.status === 'published' ? 'bg-green-900 text-green-300' :
                      item.status === 'in_progress' ? 'bg-blue-900 text-blue-300' :
                      'bg-yellow-900 text-yellow-300'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-400">Format:</span> {item.format}
                    </div>
                    <div>
                      <span className="text-gray-400">Difficulty:</span> {item.estimatedDifficulty}
                    </div>
                    {item.scheduledDate && (
                      <div>
                        <span className="text-gray-400">Scheduled:</span> {new Date(item.scheduledDate).toLocaleDateString()}
                      </div>
                    )}
                    {item.targetKeywords && item.targetKeywords.length > 0 && (
                      <div>
                        <span className="text-gray-400">Keywords:</span> {item.targetKeywords.slice(0, 3).join(', ')}
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => router.push(`/projects/${id}/scripts?planItemId=${item.id}`)}
                    className="mt-4 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors text-sm"
                  >
                    Generate Script
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Niche Options */}
        {project.niche && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Niche Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h3 className="font-semibold mb-2">Primary Niche</h3>
                <p>{project.niche}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h3 className="font-semibold mb-2">Target Audience</h3>
                <p>{project.targetAudience}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h3 className="font-semibold mb-2">Content Tone</h3>
                <p>{project.tone}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ContentStrategyPage;