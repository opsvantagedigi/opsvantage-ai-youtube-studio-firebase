'use client';

import { Logo } from "@/components/Logo";
import Link from "next/link";
import { useState, useTransition, useMemo } from "react";
import { generateScript } from "../actions";
import Calendar from 'react-calendar';
import './WizardPage.css';

const niches = [
    "Technology", "History", "Finance", "Gaming", "Science",
    "Health & Fitness", "Travel", "Cooking", "DIY & Crafts", "Education"
];

const BASE_PRICE_PER_VIDEO = 10;
const DURATION_DISCOUNT = { 1: 1.0, 2: 0.9, 3: 0.85, 4: 0.8 };

const IdeaStep = ({ onNext, wizardData, setWizardData }) => {
    const [isPending, startTransition] = useTransition();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (wizardData.videoIdea && wizardData.videoIdea.trim() && wizardData.niche) {
            startTransition(() => onNext(wizardData));
        } else {
            alert("Please select a niche and enter your video idea.");
        }
    };
    return (
        <div className="glass-box">
            <h2 className="text-4xl font-bold mb-2 font-display bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-500">Step 1: Describe Your Video</h2>
            <p className="text-lg mb-6 text-gray-300">Select a niche and describe your video idea.</p>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="niche" className="block text-left text-lg font-medium mb-2">Select a Niche</label>
                    <select id="niche" value={wizardData.niche || ''} onChange={(e) => setWizardData({...wizardData, niche: e.target.value})} className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 transition-all text-white">
                        <option value="" disabled>Choose a category...</option>
                        {niches.map(niche => (<option key={niche} value={niche}>{niche}</option>))}
                    </select>
                </div>
                <textarea value={wizardData.videoIdea || ''} onChange={(e) => setWizardData({...wizardData, videoIdea: e.target.value})} placeholder="e.g., 'A 10-minute video about...'" className="w-full h-40 p-4 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 placeholder-gray-500" />
                <button type="submit" className="cta-button cta-glow mt-6 w-full" disabled={isPending}>{isPending ? 'Processing...' : 'Next: Generate Script'}</button>
            </form>
        </div>
    );
};

const ScriptStep = ({ script, onBack, onNext }) => (
    <div className="glass-box">
        <h2 className="text-4xl font-bold mb-4 font-display">Step 2: Review Your Script</h2>
        <div className="text-left bg-gray-800 p-4 rounded-lg whitespace-pre-wrap font-mono text-sm overflow-y-auto max-h-96">{script}</div>
        <div className="flex justify-between mt-6">
            <button onClick={onBack} className="secondary-cta-button">Back to Idea</button>
            <button onClick={onNext} className="cta-button cta-glow">Next: Scheduling</button>
        </div>
    </div>
);

const SchedulingStep = ({ onBack, onNext, wizardData, setWizardData }) => {
    const { startDate, videosPerDay, duration } = wizardData;
    const totalPrice = useMemo(() => {
        if (!videosPerDay || !duration) return 0;
        const totalVideos = videosPerDay * duration * 7;
        const discount = DURATION_DISCOUNT[duration];
        return totalVideos * BASE_PRICE_PER_VIDEO * discount;
    }, [videosPerDay, duration]);

    return (
        <div className="glass-box">
             <h2 className="text-4xl font-bold mb-4 font-display">Step 3: Schedule Your Content</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-2xl font-bold mb-4 text-left">Select a Start Date</h3>
                    <Calendar onChange={(date) => setWizardData({...wizardData, startDate: date})} value={startDate} minDate={new Date()} />
                </div>
                <div className="flex flex-col justify-between">
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
                        <p className="text-sm text-gray-400">for {videosPerDay * duration * 7} videos</p>
                    </div>
                </div>
            </div>
            <div className="flex justify-between mt-8">
                <button onClick={onBack} className="secondary-cta-button">Back to Script</button>
                <button onClick={onNext} className="cta-button cta-glow">Next: Review & Confirm</button>
            </div>
        </div>
    );
};

const ConfirmationStep = ({ onBack, onConfirm, wizardData }) => {
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
                <button onClick={onConfirm} className="cta-button cta-glow w-1/2">Confirm & Start Generation</button>
            </div>
        </div>
    );
}

export default function WizardPage() {
  const [step, setStep] = useState(1);
  const [wizardData, setWizardData] = useState({ videosPerDay: 1, duration: 1, startDate: new Date() });
  const [isPending, startTransition] = useTransition();

  const handleNext = (data) => {
    setWizardData({ ...wizardData, ...data });
    if (step === 1) {
        startTransition(async () => {
            const script = await generateScript(data.videoIdea);
            setWizardData(prev => ({...prev, script}));
            setStep(2);
        });
    } else {
        setStep(s => s + 1);
    }
  };

  const handleConfirm = () => {
      console.log("Final wizard data:", wizardData);
      // Here you would trigger the final video generation process
      alert("Video generation process started! You will be notified upon completion.");
  }

  const handleBack = () => setStep(s => s - 1);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center font-sans">
        <header className="glass-header absolute top-0 left-0 w-full flex items-center justify-between p-6">
            <div className="flex items-center"><Logo /><Link href="/" className="text-2xl font-bold ml-3 font-display">OpsVantage AI-YouTube Studio</Link></div>
            <nav><Link href="/dashboard" className="text-lg font-medium hover:text-gray-400 transition-colors">Dashboard</Link></nav>
        </header>
        <main className="text-center w-full max-w-4xl px-4">
            {isPending && step === 1 && (
                 <div className="glass-box"><h2 className="text-4xl font-bold mb-4 font-display">Generating Script...</h2><p className="text-lg">The AI is working its magic.</p></div>
            )}
            {!isPending && step === 1 && <IdeaStep onNext={handleNext} wizardData={wizardData} setWizardData={setWizardData} />}
            {step === 2 && <ScriptStep script={wizardData.script} onBack={handleBack} onNext={handleNext} />}
            {step === 3 && <SchedulingStep onBack={handleBack} onNext={handleNext} wizardData={wizardData} setWizardData={setWizardData} />}
            {step === 4 && <ConfirmationStep onBack={handleBack} onConfirm={handleConfirm} wizardData={wizardData} />}
        </main>
        <footer className="absolute bottom-0 w-full text-center p-6 text-sm text-gray-500">&copy; 2024 OpsVantage AI-YouTube Studio. All rights reserved.</footer>
    </div>
  );
}
