import { Activity, ShieldCheck } from 'lucide-react'

export default function Header() {
  return (
    <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-11 h-11 rounded-xl glass-strong grid place-items-center border border-accent/40 shadow-glow">
            <Activity className="w-6 h-6 text-accent" />
          </div>
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent animate-ping" />
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Produkt<span className="text-accent">zähler</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 font-mono">
            Vision-gestützte Bauteilprüfung · Proof-of-Concept
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
        <ShieldCheck className="w-4 h-4 text-accent" />
        <span>Client-only · Keys bleiben lokal</span>
      </div>
    </header>
  )
}
