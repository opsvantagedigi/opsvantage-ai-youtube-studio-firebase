export const dynamic = 'force-dynamic'

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h2 className="font-orbitron mb-4 text-3xl">Job #{params.id}</h2>
      <p className="text-white/80">Job details will appear here.</p>
    </div>
  )
}
