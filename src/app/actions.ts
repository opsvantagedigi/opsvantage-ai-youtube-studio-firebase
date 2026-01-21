'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";
import { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs, orderBy } from "firebase/firestore";
import { app } from "./firebase";

const db = getFirestore(app);
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set. Using a mock response for script generation.");
}
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function generateScript(videoIdea: string, niche: string) {
  // ... (existing generateScript function remains the same)
  console.log(`Generating script for: ${videoIdea} in niche: ${niche}`);

  if (!genAI) {
    return `# Mock Title: How to Make a Great Video...`;
  }

  const model = genAI.getGenerativeModel({ model: "gemini-pro"});
  const prompt = `You are a professional YouTube scriptwriter...`; // Prompt is unchanged

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    console.log("Successfully generated script.");
    return text;
  } catch (error) {
    console.error("Error generating script from Gemini API:", error);
    return "Error: Could not generate script.";
  }
}

export async function saveProject(projectData: any, userId: string) {
  if (!userId) {
    throw new Error("User is not authenticated.");
  }

  try {
    const docRef = await addDoc(collection(db, "projects"), {
      ...projectData,
      userId: userId,
      createdAt: serverTimestamp(),
    });
    console.log("Project saved with ID: ", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving project to Firestore: ", error);
    return { success: false, error: "Failed to save project." };
  }
}

export async function getProjects(userId: string) {
    if (!userId) {
        throw new Error("User is not authenticated.");
    }

    try {
        const q = query(
            collection(db, "projects"), 
            where("userId", "==", userId),
            orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const projects = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return { success: true, projects: projects };
    } catch (error) {
        console.error("Error fetching projects from Firestore: ", error);
        return { success: false, error: "Failed to fetch projects." };
    }
}
