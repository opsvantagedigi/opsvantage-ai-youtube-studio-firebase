import type { VideoJob, ScriptSegment, VideoJobCreate } from './models.js';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { logUsageEvent } from './utils/logUsageEvent.js';

function ensureOutputDir(jobId: string) {
  const out = path.join(process.cwd(), '..', '..', 'scripts', 'output', jobId);
  fs.mkdirSync(out, { recursive: true });
  return out;
}

export async function runPromptToVideo(jobId: string, input: VideoJobCreate): Promise<VideoJob> {
  logUsageEvent({ event: 'runPromptToVideo-start', details: { jobId, input } });
  const createdAt = new Date().toISOString();
  const job: VideoJob = {
    id: jobId,
    status: 'processing',
    prompt: input,
    createdAt,
  };

  const out = ensureOutputDir(jobId);

  // 1) Script generation (mocked)
  const script: ScriptSegment[] = [
    { id: uuidv4(), start: 0, end: 5, text: `Hook: ${input.prompt}` },
    { id: uuidv4(), start: 5, end: 40, text: `Body: Expand on ${input.prompt}` },
    {
      id: uuidv4(),
      start: 40,
      end: 55,
      text: `Summary and CTA: ${input.callToAction || 'Subscribe'}`,
    },
  ];
  fs.writeFileSync(path.join(out, 'script.json'), JSON.stringify(script, null, 2));

  // 2) Voiceover generation (mocked): create placeholder audio segment file paths
  const audioSegments = script.map((s, i) => {
    const p = path.join(out, `audio-${i + 1}.txt`);
    fs.writeFileSync(p, `AUDIO MOCK for segment: ${s.text}`);
    return p;
  });

  // 3) Visual composer (mocked): produce referenced asset ids
  const visuals = script.map((s, i) => `visual_${i + 1}`);
  fs.writeFileSync(path.join(out, 'visuals.json'), JSON.stringify(visuals, null, 2));

  // 4) Rendering (mocked): create a small placeholder mp4 descriptor
  const renderPath = path.join(out, 'rendered.mp4');
  fs.writeFileSync(renderPath, `MOCK_VIDEO for job ${jobId}`);

  // Finalize job
  job.script = script;
  job.audioSegments = audioSegments;
  job.visuals = visuals;
  job.renderPath = renderPath;
  job.status = 'rendered';

  // write job metadata
  fs.writeFileSync(path.join(out, 'job.json'), JSON.stringify(job, null, 2));
  logUsageEvent({ event: 'runPromptToVideo-end', details: { jobId, status: job.status } });


  return job;
}
