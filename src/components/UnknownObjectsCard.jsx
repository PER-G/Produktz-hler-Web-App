import { AlertCircle, HelpCircle } from 'lucide-react'

export default function UnknownObjectsCard({ count, description }) {
  const hasUnknown = count > 0
  return (
    <div
      className={`glass rounded-xl p-4 border transition ${
        hasUnknown ? 'border-amber-400/60 shadow-[0_0_24px_rgba(251,191,36,0.35)]' : 'border-slate-700/60'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-14 h-14 rounded-md grid place-items-center shrink-0 ${
            hasUnknown ? 'bg-amber-400/15' : 'bg-slate-800'
          }`}
        >
          <HelpCircle
            className={`w-7 h-7 ${hasUnknown ? 'text-amber-400' : 'text-slate-500'}`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold">Sonstige Objekte</div>
          <div className="text-[11px] font-mono text-slate-400">
            Nicht in den Referenzen enthalten
          </div>
        </div>
        {hasUnknown && <AlertCircle className="w-6 h-6 text-amber-400 shrink-0" />}
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
            Erkannt
          </div>
          <div
            className={`text-4xl font-mono font-bold leading-none ${
              hasUnknown ? 'text-amber-400' : 'text-slate-500'
            }`}
          >
            {count}
          </div>
        </div>
        <div className="text-right text-[11px] font-mono text-slate-400 max-w-[60%]">
          {hasUnknown ? 'Zusätzliche Teile auf dem Prüffoto' : 'Keine Fremdteile'}
        </div>
      </div>

      {hasUnknown && description && (
        <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-amber-200/80 italic">
          {description}
        </div>
      )}
    </div>
  )
}
