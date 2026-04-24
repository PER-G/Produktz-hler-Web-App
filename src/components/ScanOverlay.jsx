import { Scan } from 'lucide-react'

export default function ScanOverlay({ active }) {
  if (!active) return null
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
      <div className="absolute inset-0 bg-bg-base/30 backdrop-blur-[1px]" />
      <div className="absolute left-0 right-0 scanline animate-scanline" />
      <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-md bg-bg-base/80 border border-accent/40 text-xs font-mono text-accent">
        <Scan className="w-3.5 h-3.5 animate-pulse" />
        SCAN · Claude analysiert…
      </div>
    </div>
  )
}
