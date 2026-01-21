'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set in the environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function generateScript(videoIdea: string, niche: string) {
  console.log(`Generating script for: ${videoIdea} in niche: ${niche}`);

  const model = genAI.getGenerativeModel({ model: "gemini-pro"});

  const prompt = `
    You are a professional YouTube scriptwriter. Your task is to generate a complete and engaging video script based on the following details.

    **Video Niche:** ${niche}
    **Video Idea:** "${videoIdea}"

    **Instructions:**
    1.  **Title:** Create a catchy, SEO-friendly title for the video.
    2.  **Tone:** The tone should be engaging, informative, and tailored to the specified niche.
    3.  **Structure:** The script should be structured with clear sections (e.g., Introduction, Main Content, Conclusion).
    4.  **Content:** Flesh out the script with a detailed narrative, including suggested visuals, on-screen text, and narrator voiceover for each section.
    5.  **Formatting:** Use Markdown for formatting. Use headings for the title and sections. Use bullet points for visual suggestions.

    **Example Output Format:**

    # [Your Catchy Title Here]

    **Tone:** [Engaging, Informative, etc.]

    ## Introduction

    *   **Visuals:** [Description of opening shots, graphics, etc.]
    *   **Narrator:** "..."

    ## Main Content: Part 1

    *   **Visuals:** [Description of visuals for this section]
    *   **Narrator:** "..."

    ---

    Begin script generation below.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    console.log("Successfully generated script.");
    return text;
  } catch (error) {
    console.error("Error generating script from Gemini API:", error);
    return "Error: Could not generate script. Please check the API key and try again.";
  }
}
