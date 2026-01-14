import "@/styles/globals.css"
import { Sidebar } from "./components/sidebar"
import { Header } from "./components/header"

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Header />
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}
