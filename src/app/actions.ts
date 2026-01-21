'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";
import { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs, orderBy } from "firebase/firestore";
import { app } from "./firebase";
import fs from 'fs';

const db = getFirestore(app);

function getApiKey(): string | undefined {
  const secretPath = '/secrets/GEMINI_API_KEY';
  
  if (fs.existsSync(secretPath)) {
    try {
      const key = fs.readFileSync(secretPath, 'utf8').trim();
      console.log("Successfully read GEMINI_API_KEY from secret file.");
      return key;
    } catch (error) {
      console.error("Error reading GEMINI_API_KEY from secret file:", error);
      return undefined;
    }
  }

  const apiKeyFromEnv = process.env.GEMINI_API_KEY;
  if (apiKeyFromEnv) {
    console.log("Using GEMINI_API_KEY from environment variable for local development.");
    return apiKeyFromEnv;
  }
  
  console.error("FATAL: GEMINI_API_KEY is not available as a secret or environment variable.");
  return undefined;
}

const apiKey = getApiKey();
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function generateScript(videoIdea: string, niche: string) {
  console.log(`Generating script for: "${videoIdea}" in niche: "${niche}"`);

  if (!genAI) {
    console.error("Script generation failed: GoogleGenerativeAI not initialized because API key is missing.");
    return "Error: Could not generate script. The API key is not configured on the server.";
  }

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
    You are a professional YouTube scriptwriter known for creating viral content.
    Your task is to write a complete, engaging script for a new video.

    **Video Topic:** "${videoIdea}"
    **Target Niche:** "${niche}"

    **Instructions:**
    1.  **Title:** Create a catchy, SEO-friendly title that grabs attention. Start the output with "Title: [Your Title]".
    2.  **Introduction (Hook):** Start with a strong hook to capture viewer interest in the first 15 seconds.
    3.  **Main Body:** Structure the content logically. Use storytelling, explain concepts clearly, and maintain an engaging, conversational tone suitable for the niche.
    4.  **Call to Action (CTA):** Include a subtle CTA to like, subscribe, or comment.
    5.  **Outro:** End with a memorable outro that encourages viewers to watch another video.
    6.  **Formatting:** The entire output must be a single block of text. Use markdown for formatting (e.g., **bold** for scene directions or emphasis).

    Generate the script now.
    `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    console.log("Successfully generated script from Gemini API.");
    return text;
  } catch (error: any) {
    console.error("Error generating script from Gemini API:", error);
    return `Error: Could not generate script. Gemini API call failed. [See server logs for details]`;
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
