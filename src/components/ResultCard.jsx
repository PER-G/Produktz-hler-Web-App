import { CheckCircle2, XCircle } from 'lucide-react'
import { formatTarget } from '../lib/validation'

export default function ResultCard({ position, count, evaluation, reasoning }) {
  const ok = evaluation?.ok
  return (
    <div
      className={`glass rounded-xl p-4 border transition ${
        ok
          ? 'border-ok/50 shadow-glow-ok'
          : 'border-nok/50 shadow-glow-nok'
      }`}
    >
      <div className="flex items-start gap-3">
        {position.imageDataUrl ? (
          <img
            src={position.imageDataUrl}
            alt={position.name}
            className="w-14 h-14 rounded-md object-cover border border-slate-700 shrink-0"
          />
        ) : (
          <div className="w-14 h-14 rounded-md bg-slate-800 shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate">
            {position.name || 'Unbenannt'}
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            Soll: {formatTarget(position)}
          </div>
        </div>
        {ok ? (
          <CheckCircle2 className="w-6 h-6 text-ok shrink-0" />
        ) : (
          <XCircle className="w-6 h-6 text-nok shrink-0" />
        )}
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
            Ist
          </div>
          <div
            className={`text-4xl font-mono font-bold leading-none ${
              ok ? 'text-ok' : 'text-nok'
            }`}
          >
            {count ?? '—'}
          </div>
        </div>
        <div className="text-right text-[11px] font-mono text-slate-400 max-w-[60%]">
          {evaluation?.detail}
        </div>
      </div>

      {reasoning && (
        <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-500 italic">
          {reasoning}
        </div>
      )}
    </div>
  )
}
