"use client";
import React, { useEffect, useState } from 'react';

type Short = {
  id: string;
  hook: string;
  title: string | null;
  script: string | null;
  status: string;
  youtubeUrl?: string | null;
};

async function callApi(path: string, method = 'GET', body?: any) {
  const res = await fetch(path, { method, headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export default function ShortsManager({ workspaceId }: { workspaceId: string }) {
  const [shorts, setShorts] = useState<Short[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    callApi(`/api/shorts?workspaceId=${workspaceId}`)
      .then((data) => { if (mounted) setShorts(data); })
      .catch(console.error)
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [workspaceId]);

  async function handleGenerate(id: string) {
    await callApi(`/api/shorts/${id}/generate-script`, 'POST');
    const updated = await callApi(`/api/shorts?workspaceId=${workspaceId}`);
    setShorts(updated);
  }

  async function handleMarkReady(id: string) {
    await callApi(`/api/shorts/${id}/mark-ready`, 'POST', {});
    const updated = await callApi(`/api/shorts?workspaceId=${workspaceId}`);
    setShorts(updated);
  }

  async function handleUpload(id: string) {
    await callApi(`/api/shorts/${id}/upload`, 'POST', {});
    const updated = await callApi(`/api/shorts?workspaceId=${workspaceId}`);
    setShorts(updated);
  }

  if (loading) return <div className="p-8">Loading…</div>;
  if (!shorts.length) return <div className="p-8">No shorts found.</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold">Shorts</h2>
      <div className="mt-4 space-y-4">
        {shorts.map((s) => (
          <div key={s.id} className="p-4 border rounded">
            <h3 className="text-lg font-semibold">{s.hook}</h3>
            <div className="mt-2">Status: {s.status}</div>
            <pre className="mt-2 whitespace-pre-wrap">{s.script || 'No script'}</pre>
            <div className="mt-2 flex gap-2">
              <button className="btn" onClick={() => handleGenerate(s.id)}>Generate Script</button>
              <button className="btn" onClick={() => handleMarkReady(s.id)}>Mark Ready</button>
              <button className="btn" onClick={() => handleUpload(s.id)}>Upload</button>
              {s.youtubeUrl && <a className="text-blue-600" href={s.youtubeUrl} target="_blank" rel="noreferrer">View on YouTube</a>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
