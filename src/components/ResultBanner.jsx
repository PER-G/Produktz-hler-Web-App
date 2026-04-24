import { CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react'

export default function ResultBanner({ status, failedNames, unknownCount, unknownDescription }) {
  // status: 'ok' | 'warn' | 'fail'
  const cfg = {
    ok: {
      Icon: CheckCircle2,
      color: 'text-ok',
      border: 'border-ok',
      bg: 'bg-ok/10',
      title: 'PRÜFUNG BESTANDEN',
    },
    warn: {
      Icon: AlertCircle,
      color: 'text-amber-400',
      border: 'border-amber-400',
      bg: 'bg-amber-400/10',
      title: 'PRÜFUNG MIT HINWEIS',
    },
    fail: {
      Icon: AlertTriangle,
      color: 'text-nok',
      border: 'border-nok',
      bg: 'bg-nok/10',
      title: 'PRÜFUNG FEHLGESCHLAGEN',
    },
  }[status]

  const { Icon } = cfg

  let subtitle = ''
  if (status === 'ok') {
    subtitle =
      'Alle Referenzpositionen liegen im zulässigen Bereich und es wurden keine Fremdteile erkannt.'
  } else if (status === 'warn') {
    subtitle = `Alle Referenzen OK, jedoch ${unknownCount} Fremdteil${
      unknownCount === 1 ? '' : 'e'
    } erkannt${unknownDescription ? `: ${unknownDescription}` : '.'}`
  } else {
    const parts = [`Abweichungen bei: ${failedNames.join(', ')}`]
    if (unknownCount > 0) {
      parts.push(
        `zusätzlich ${unknownCount} Fremdteil${unknownCount === 1 ? '' : 'e'} erkannt`,
      )
    }
    subtitle = parts.join(' · ')
  }

  return (
    <div
      className={`rounded-xl p-5 mb-6 flex items-center gap-4 border-2 animate-pulseGlow ${cfg.border} ${cfg.bg}`}
    >
      <Icon className={`w-10 h-10 shrink-0 ${cfg.color}`} />
      <div>
        <div className={`text-xl md:text-2xl font-bold font-mono ${cfg.color}`}>
          {cfg.title}
        </div>
        <div className="text-sm text-slate-300 mt-0.5">{subtitle}</div>
      </div>
    </div>
  )
}
