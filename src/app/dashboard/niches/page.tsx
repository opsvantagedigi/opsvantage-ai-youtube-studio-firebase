"use client";
import { useEffect, useState } from 'react';

export default function NichesPage() {
  const [niches, setNiches] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  useEffect(() => { fetch('/api/workspaces').then(r=>r.json()).then(ws=> {
    if (ws && ws.length) {
      const workspaceId = ws[0].id;
      fetch(`/api/workspaces/${workspaceId}/niches`).then(r=>r.json()).then(setNiches);
    }
  }) }, []);

  async function create() {
    const ws = await fetch('/api/workspaces').then(r=>r.json()).then(a=>a[0]);
    const res = await fetch(`/api/workspaces/${ws.id}/niches`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, description: desc }) });
    const n = await res.json();
    setNiches(s=>[...s, n]);
    setName(''); setDesc('');
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold">Niche Management</h2>
      <div className="mt-4">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Niche name" className="border p-2 mr-2" />
        <input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description" className="border p-2 mr-2" />
        <button onClick={create} className="bg-blue-600 text-white px-3 py-2 rounded">Create</button>
      </div>
      <div className="mt-6">
        <ul className="list-disc ml-6">
          {niches.map(n=> <li key={n.id}>{n.name} — {n.description}</li>)}
        </ul>
      </div>
    </div>
  );
}
