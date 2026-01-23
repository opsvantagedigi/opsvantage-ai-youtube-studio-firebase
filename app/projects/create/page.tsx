'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../../lib/firebase';
import { getFirestore, collection, addDoc, updateDoc, doc } from 'firebase/firestore';

const CreateProjectPage = () => {
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    niche: '',
    language: 'en',
    tone: 'professional',
    targetAudience: '',
    postingFrequency: '1_per_week'
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const db = getFirestore(app);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Create the project in Firestore
      const projectData = {
        ...formData,
        userId: user.uid,
        connectedYouTubeChannelId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'projects'), projectData);

      // Update user's default project
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        defaultProjectId: docRef.id
      });

      // Redirect to the project page
      router.push(`/projects/${docRef.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Error creating project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-opacity-20 backdrop-blur-lg rounded-xl border border-gray-700 text-white p-4 m-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold font-orbitron gradient-text">OpsVantage Digital AI-YouTube Studio</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Project</h1>
          <p className="text-gray-400">Set up a new YouTube project for AI-powered content creation</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">Project Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Tech Tips Daily"
            />
          </div>

          <div>
            <label htmlFor="niche" className="block text-sm font-medium mb-2">Niche</label>
            <input
              type="text"
              id="niche"
              name="niche"
              value={formData.niche}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Technology, Education, Gaming"
            />
          </div>

          <div>
            <label htmlFor="targetAudience" className="block text-sm font-medium mb-2">Target Audience</label>
            <input
              type="text"
              id="targetAudience"
              name="targetAudience"
              value={formData.targetAudience}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Tech enthusiasts, Students, Gamers"
            />
          </div>

          <div>
            <label htmlFor="language" className="block text-sm font-medium mb-2">Language</label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="ja">Japanese</option>
            </select>
          </div>

          <div>
            <label htmlFor="tone" className="block text-sm font-medium mb-2">Content Tone</label>
            <select
              id="tone"
              name="tone"
              value={formData.tone}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="humorous">Humorous</option>
              <option value="educational">Educational</option>
              <option value="motivational">Motivational</option>
            </select>
          </div>

          <div>
            <label htmlFor="postingFrequency" className="block text-sm font-medium mb-2">Posting Frequency</label>
            <select
              id="postingFrequency"
              name="postingFrequency"
              value={formData.postingFrequency}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1_per_week">Once per week</option>
              <option value="2_per_week">Twice per week</option>
              <option value="3_per_week">Three times per week</option>
              <option value="daily">Daily</option>
            </select>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 rounded-md font-medium ${
                loading 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } transition-colors`}
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
            
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-md font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateProjectPage;