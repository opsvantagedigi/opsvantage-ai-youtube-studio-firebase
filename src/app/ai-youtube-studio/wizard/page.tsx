'use client';

import { Logo } from "@/components/Logo";
import Link from "next/link";
import { useState, useTransition, useMemo, FC, FormEvent, ChangeEvent, useEffect } from "react";
import { generateScript, saveProject } from "../../actions"; // Import saveProject
import Calendar from 'react-calendar';
import './WizardPage.css';
import ProtectedRoute from "@/components/ProtectedRoute";
import { auth } from '../../firebase'; // Import auth
import { User, onAuthStateChanged } from 'firebase/auth'; // Import User and onAuthStateChanged
import { useRouter } from 'next/navigation'; // Import useRouter

// Type definitions (unchanged)
interface WizardData {
    niche?: string;
    videoIdea?: string;
    script?: string;
    startDate: Date;
    videosPerDay: number;
    duration: number;
}
interface StepProps {
    onNext: (data?: Partial<WizardData>) => void;
    onBack?: () => void;
    wizardData: WizardData;
    setWizardData: (data: WizardData) => void;
}
interface IdeaStepProps extends StepProps {}
interface ScriptStepProps { script: string; onBack: () => void; onNext: () => void; }
interface SchedulingStepProps extends StepProps {}
interface ConfirmationStepProps { onBack: () => void; onConfirm: () => void; wizardData: WizardData; }

// Child components (IdeaStep, ScriptStep, etc.) remain the same
const niches = ["Technology", "History", "Finance", "Gaming", "Science", "Health & Fitness", "Travel", "Cooking", "DIY & Crafts", "Education"];
const BASE_PRICE_PER_VIDEO = 10;
const DURATION_DISCOUNT: { [key: number]: number } = { 1: 1.0, 2: 0.9, 3: 0.85, 4: 0.8 };

const IdeaStep: FC<IdeaStepProps> = ({ onNext, wizardData, setWizardData }) => {
    const [isPending, startTransition] = useTransition();
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (wizardData.videoIdea && wizardData.videoIdea.trim() && wizardData.niche) {
            startTransition(() => onNext(wizardData));
        } else {
            alert("Please select a niche and enter your video idea.");
        }
    };
    const handleNicheChange = (e: ChangeEvent<HTMLSelectElement>) => setWizardData({ ...wizardData, niche: e.target.value });
    const handleIdeaChange = (e: ChangeEvent<HTMLTextAreaElement>) => setWizardData({ ...wizardData, videoIdea: e.target.value });

    return (
        <div className="glass-box">
            <h2 className="text-4xl font-bold mb-2 font-display bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-500">Step 1: Describe Your Video</h2>
            <p className="text-lg mb-6 text-gray-300">Select a niche and describe your video idea.</p>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="niche" className="block text-left text-lg font-medium mb-2">Select a Niche</label>
                    <select id="niche" value={wizardData.niche || ''} onChange={handleNicheChange} className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 transition-all text-white">
                        <option value="" disabled>Choose a category...</option>
                        {niches.map(niche => (<option key={niche} value={niche}>{niche}</option>))}
                    </select>
                </div>
                <textarea value={wizardData.videoIdea || ''} onChange={handleIdeaChange} placeholder="e.g., 'A 10-minute video about...'" className="w-full h-40 p-4 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 placeholder-gray-500" />
                <button type="submit" className="cta-button cta-glow mt-6 w-full" disabled={isPending}>{isPending ? 'Processing...' : 'Next: Generate Script'}</button>
            </form>
        </div>
    );
};

const ScriptStep: FC<ScriptStepProps> = ({ script, onBack, onNext }) => (
    <div className="glass-box">
        <h2 className="text-4xl font-bold mb-4 font-display">Step 2: Review Your Script</h2>
        <div className="text-left bg-gray-800 p-4 rounded-lg whitespace-pre-wrap font-mono text-sm overflow-y-auto max-h-96">{script}</div>
        <div className="flex justify-between mt-6">
            <button onClick={onBack} className="secondary-cta-button">Back to Idea</button>
            <button onClick={() => onNext()} className="cta-button cta-glow">Next: Scheduling</button>
        </div>
    </div>
);

const SchedulingStep: FC<SchedulingStepProps> = ({ onBack, onNext, wizardData, setWizardData }) => {
    const { startDate, videosPerDay, duration } = wizardData;
    const totalPrice = useMemo(() => {
        if (!videosPerDay || !duration) return 0;
        const totalVideos = videosPerDay * duration * 7;
        const discount = DURATION_DISCOUNT[duration];
        return totalVideos * BASE_PRICE_PER_VIDEO * discount;
    }, [videosPerDay, duration]);

    const handleDateChange = (value: any) => {
        if (value && !Array.isArray(value)) {
          setWizardData({ ...wizardData, startDate: value as Date });
        }
    };

    return (
        <div className="glass-box">
             <h2 className="text-4xl font-bold mb-4 font-display">Step 3: Schedule Your Content</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-2xl font-bold mb-4 text-left">Select a Start Date</h3>
                    <Calendar onChange={handleDateChange} value={startDate} minDate={new Date()} />
                </div>
                <div>
                    <div>
                        <div className="mb-4">
                            <label htmlFor="videosPerDay" className="block text-left text-lg font-medium mb-2">Videos Per Day</label>
                            <input type="number" id="videosPerDay" min="1" max="10" value={videosPerDay || 1} onChange={(e) => setWizardData({...wizardData, videosPerDay: parseInt(e.target.value)})} className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700" />
                        </div>
                        <div>
                            <label htmlFor="duration" className="block text-left text-lg font-medium mb-2">Duration (weeks)</label>
                            <select id="duration" value={duration || 1} onChange={(e) => setWizardData({...wizardData, duration: parseInt(e.target.value)})} className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700">
                                {[1, 2, 3, 4].map(w => <option key={w} value={w}>{w} week{w > 1 ? 's' : ''}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="mt-6 p-4 rounded-lg bg-gray-800 border border-green-500">
                        <h3 className="text-xl font-bold text-green-400">Estimated Price</h3>
                        <p className="text-4xl font-display font-bold">${totalPrice.toFixed(2)}</p>
                    </div>
                </div>
            </div>
            <div className="flex justify-between mt-8">
                <button onClick={onBack} className="secondary-cta-button">Back to Script</button>
                {onNext && <button onClick={() => onNext()} className="cta-button cta-glow">Next: Review & Confirm</button>}
            </div>
        </div>
    );
};

const ConfirmationStep: FC<ConfirmationStepProps> = ({ onBack, onConfirm, wizardData }) => {
    const { niche, videoIdea, startDate, videosPerDay, duration } = wizardData;
    const totalPrice = useMemo(() => {
        if (!videosPerDay || !duration) return 0;
        const totalVideos = videosPerDay * duration * 7;
        const discount = DURATION_DISCOUNT[duration];
        return totalVideos * BASE_PRICE_PER_VIDEO * discount;
    }, [videosPerDay, duration]);

    return (
        <div className="glass-box text-left">
            <h2 className="text-4xl font-bold mb-6 font-display text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-500">Step 4: Review & Confirm</h2>
            <div className="space-y-4">
                <div><strong className="text-green-400">Niche:</strong> {niche}</div>
                <div><strong className="text-green-400">Video Idea:</strong><p className="mt-1 text-gray-300 p-2 bg-gray-800 rounded">{videoIdea}</p></div>
                <div><strong className="text-green-400">Start Date:</strong> {startDate.toLocaleDateString()}</div>
                <div><strong className="text-green-400">Videos Per Day:</strong> {videosPerDay}</div>
                <div><strong className="text-green-400">Duration:</strong> {duration} week{duration > 1 ? 's' : ''}</div>
                <div className="mt-6 pt-4 border-t border-gray-700 text-center">
                    <p className="text-xl font-bold text-green-400">Total Price</p>
                    <p className="text-5xl font-display font-bold">${totalPrice.toFixed(2)}</p>
                </div>
            </div>
            <div className="flex justify-between mt-8">
                <button onClick={onBack} className="secondary-cta-button">Back to Scheduling</button>
                <button onClick={onConfirm} className="cta-button cta-glow w-1/2">Confirm & Save Project</button>
            </div>
        </div>
    );
}


export default function WizardPage() {
  const [step, setStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>({ videosPerDay: 1, duration: 1, startDate: new Date() });
  const [isPending, startTransition] = useTransition();
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleNext = (data?: Partial<WizardData>) => {
    const updatedData = { ...wizardData, ...data };
    setWizardData(updatedData);
    if (step === 1) {
        if(updatedData.videoIdea && updatedData.niche) {
            startTransition(async () => {
                const script = await generateScript(updatedData.videoIdea!, updatedData.niche!);
                setWizardData(prev => ({...prev, script}));
                setStep(2);
            });
        }
    } else {
        setStep(s => s + 1);
    }
  };

  const handleConfirm = async () => {
      if (!user) {
          alert("You must be logged in to save a project.");
          return;
      }

      startTransition(async () => {
        const result = await saveProject(wizardData, user.uid);
        if (result.success) {
            alert("Project saved successfully! Redirecting to dashboard.");
            router.push('/ai-youtube-studio/dashboard');
        } else {
            alert(`Error: ${result.error}`);
        }
      });
  }

  const handleBack = () => setStep(s => s - 1);

  return (
    <ProtectedRoute>
      <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center font-sans">
          <header className="glass-header absolute top-0 left-0 w-full flex items-center justify-between p-6">
              <div className="flex items-center"><Logo /><Link href="/ai-youtube-studio" className="text-2xl font-bold ml-3 font-display">OpsVantage AI-YouTube Studio</Link></div>
              <nav><Link href="/ai-youtube-studio/dashboard" className="text-lg font-medium hover:text-gray-400 transition-colors">Dashboard</Link></nav>
          </header>
          <main className="text-center w-full max-w-4xl px-4">
              {isPending && (
                  <div className="glass-box"><h2 className="text-4xl font-bold mb-4 font-display">Working...</h2><p className="text-lg">Please wait a moment.</p></div>
              )}
              {!isPending && step === 1 && <IdeaStep onNext={handleNext} wizardData={wizardData} setWizardData={setWizardData} />}
              {step === 2 && wizardData.script && <ScriptStep script={wizardData.script} onBack={handleBack} onNext={handleNext} />}
              {step === 3 && <SchedulingStep onBack={handleBack} onNext={handleNext} wizardData={wizardData} setWizardData={setWizardData} />}
              {step === 4 && <ConfirmationStep onBack={handleBack} onConfirm={handleConfirm} wizardData={wizardData} />}
          </main>
          <footer className="absolute bottom-0 w-full text-center p-6 text-sm text-gray-500">&copy; 2024 OpsVantage AI-YouTube Studio. All rights reserved.</footer>
      </div>
    </ProtectedRoute>
  );
}
