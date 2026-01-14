import Link from "next/link"

export default function AuthErrorPage({ searchParams }: { searchParams?: { [k: string]: string | string[] } }) {
  const error = Array.isArray(searchParams?.error) ? searchParams?.error[0] : searchParams?.error

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
      <div className="max-w-md p-8 rounded-xl bg-slate-900/80 border border-white/10">
        <h1 className="text-lg font-semibold">Authentication Error</h1>
        <p className="text-sm text-slate-300 mt-2">{error ?? "Unknown"}</p>
        <div className="mt-6 flex gap-3">
          <Link href="/login" className="text-sm px-3 py-2 rounded bg-slate-800">Back to Sign In</Link>
        </div>
      </div>
    </div>
  )
}
