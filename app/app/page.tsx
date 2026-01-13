"use client"
import Link from 'next/link'

export default function AppInnerPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">App Home</h1>
        <p className="mt-2 text-slate-400">This route is the internal app area. Go to the public site: <Link href="/">Home</Link></p>
      </div>
    </div>
  )
}
"use client"

import { useState } from "react"
import { motion, easeOut } from "framer-motion"
import {
  Copy,
  Menu,
  Sparkles,
  RotateCcw,
  Zap,
  Settings,
  Play,
  Youtube,
  MessageSquare,
  ChevronRight,
} from "lucide-react"
import { Card } from "../../src/components/ui/card"
import { Button } from "../../src/components/ui/button"
import { Textarea } from "../../src/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../src/components/ui/tooltip"
import { Sheet, SheetContent, SheetTrigger } from "../../src/components/ui/sheet"

"use client"
import Link from 'next/link'

export default function AppInnerPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">App Home</h1>
        <p className="mt-2 text-slate-400">This route is the internal app area. Go to the public site: <Link href="/">Home</Link></p>
      </div>
    </div>
  )
}
    Settings,
