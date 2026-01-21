"use client";

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../app/firebase';
import { useRouter } from 'next/navigation';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/ai-youtube-studio'); // Redirect to AI studio home page if not logged in
      } else {
        setUser(currentUser);
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <p>Loading...</p>; // Or a spinner component
  }

  if (!user) {
    return null; // Don't render children if user is not authenticated
  }

  return <>{children}</>;
};

export default ProtectedRoute;
