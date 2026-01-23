
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAA093RHfxhEhSQNe6zCeC2EK-5K3E3nHI",
    authDomain: "marz-ai-studio-ops.firebaseapp.com",
    projectId: "marz-ai-studio-ops",
    storageBucket: "marz-ai-studio-ops.firebasestorage.app",
    messagingSenderId: "134638450662",
    appId: "1:134638450662:web:381c7adc0c052e4a56c827"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
