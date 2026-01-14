export default function JobDetailsPage({ params }: any) {
  return (
    <div>
      <h2 className="font-orbitron text-3xl mb-4">Job #{params.id}</h2>
      <p className="text-white/80">Job details will appear here.</p>
    </div>
  )
}
