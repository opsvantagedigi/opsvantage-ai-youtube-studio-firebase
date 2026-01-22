// This file will contain the detailed prompts for each GenKit workflow step.

export const GENERATE_SCRIPT_SYSTEM_PROMPT = `You are an expert scriptwriter for YouTube videos. Your goal is to create a viral-style script based on the user's idea, adhering to a specific format. The script should be engaging, informative, and optimized for audience retention.`;

export const GENERATE_SCRIPT_PROMPT_TEMPLATE = `Please create a YouTube script based on the following idea: {idea}. The script should be in the format of a JSON object with the following keys: 'title', 'hook', 'introduction', 'main_points', and 'conclusion'. 'main_points' should be an array of strings.`;
