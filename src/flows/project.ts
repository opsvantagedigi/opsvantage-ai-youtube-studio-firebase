import { defineFlow } from '@genkit-ai/flow';
import * as z from 'zod';
import { ProjectSchema } from '../models/project';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

export const createProjectFlow = defineFlow(
  {
    name: 'createProject',
    inputSchema: ProjectSchema.omit({ userId: true, createdAt: true, updatedAt: true, connectedYouTubeChannelId: true }),
    outputSchema: z.string(), // Returns the ID of the newly created project
    authPolicy: (auth: any, input: any) => {},
  },
  async (projectDetails) => {
    const newProject = {
      ...projectDetails,
      userId: 'some_user_id', // Replace with actual user ID from authentication
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      connectedYouTubeChannelId: null,
    };

    const projectRef = await db.collection('projects').add(newProject);
    return projectRef.id;
  }
);
