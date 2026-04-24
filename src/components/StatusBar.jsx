import { CheckCircle2, XCircle, Layers, Cpu } from 'lucide-react'

export default function StatusBar({ hasApiKey, activePositions, model, analyzing }) {
  return (
    <div className="glass rounded-xl px-4 py-2.5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-mono mb-6">
      <div className="flex items-center gap-2">
        {hasApiKey ? (
          <CheckCircle2 className="w-4 h-4 text-ok" />
        ) : (
          <XCircle className="w-4 h-4 text-nok" />
        )}
        <span className="text-slate-300">
          API {hasApiKey ? 'verbunden' : 'nicht verbunden'}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Layers className="w-4 h-4 text-accent" />
        <span className="text-slate-300">
          {activePositions} Referenzposition{activePositions === 1 ? '' : 'en'}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Cpu className="w-4 h-4 text-accent" />
        <span className="text-slate-300 truncate">{model}</span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full ${
            analyzing ? 'bg-accent animate-ping' : 'bg-slate-600'
          }`}
        />
        <span className="text-slate-400">
          {analyzing ? 'Prüfung läuft…' : 'Bereit'}
        </span>
      </div>
    </div>
  )
}
