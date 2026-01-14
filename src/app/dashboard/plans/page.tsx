"use client";
import { useEffect, useState } from 'react';

export default function PlansPage(){
  const [niches, setNiches] = useState<any[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<'weekly'|'monthly'|'custom'>('weekly');
  const [days, setDays] = useState<number>(7);

  useEffect(()=>{
    fetch('/api/workspaces').then(r=>r.json()).then(ws=>{
      if(ws && ws.length){
        const workspaceId = ws[0].id;
        fetch(`/api/workspaces/${workspaceId}/niches`).then(r=>r.json()).then(setNiches);
      }
    })
  },[]);

  async function createPlan(){
    const ws = await fetch('/api/workspaces').then(r=>r.json()).then(a=>a[0]);
    if(!selected) return alert('Choose niche');
    const body:any = { timeframe };
    if(timeframe==='custom') body.days = days;
    const res = await fetch(`/api/workspaces/${ws.id}/niches/${selected}/plans`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const plan = await res.json();
    alert('Plan created with '+plan.shortVideos.length+' items');
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold">Content Plans</h2>
      <div className="mt-4">
        <select className="border p-2" value={selected||''} onChange={e=>setSelected(e.target.value)}>
          <option value="">Select niche</option>
          {niches.map(n=> <option key={n.id} value={n.id}>{n.name}</option>)}
        </select>
        <select className="border p-2 ml-2" value={timeframe} onChange={e=>setTimeframe(e.target.value as any)}>
          <option value="weekly">Weekly (7)</option>
          <option value="monthly">Monthly (30)</option>
          <option value="custom">Custom</option>
        </select>
        {timeframe==='custom' && <input type="number" className="border p-2 ml-2" value={days} onChange={e=>setDays(Number(e.target.value))} />}
        <button className="ml-2 bg-green-600 text-white px-3 py-2 rounded" onClick={createPlan}>Generate Plan</button>
      </div>
    </div>
  );
}
