import { useState } from 'react'
import { ChevronDown, ChevronUp, BookOpen, AlertTriangle } from 'lucide-react'

export default function Instructions() {
  const [open, setOpen] = useState(false)
  return (
    <section className="glass rounded-xl mb-6 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition"
      >
        <span className="flex items-center gap-2 text-sm font-semibold">
          <BookOpen className="w-4 h-4 text-accent" />
          Anleitung {open ? 'verbergen' : 'anzeigen'}
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </button>
      {open && (
        <div className="px-4 pb-5 pt-1 text-sm text-slate-300 leading-relaxed space-y-3">
          <ol className="list-decimal list-inside space-y-2">
            <li>
              <strong className="text-white">Einrichten:</strong> Eigenen API-Key unter{' '}
              <a
                className="text-accent hover:underline"
                href="https://console.anthropic.com/settings/keys"
                target="_blank"
                rel="noopener noreferrer"
              >
                console.anthropic.com/settings/keys
              </a>{' '}
              erstellen und oben eintragen.
            </li>
            <li>
              <strong className="text-white">Referenzen definieren:</strong> Für jedes zu prüfende
              Bauteil Name eingeben, Referenzfoto hochladen und erlaubte Stückzahl einstellen
              (genau / Bereich / nicht vorhanden).
            </li>
            <li>
              <strong className="text-white">+ Button:</strong> Mehr als 3 Referenzen? Mit „+
              Weitere Position hinzufügen" ergänzen.
            </li>
            <li>
              <strong className="text-white">Prüfen:</strong> Foto des Arbeitsfelds hochladen →
              „Prüfung starten" → Ergebnis als Ampel.
            </li>
          </ol>
          <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
            <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-100/90">
              <strong>Hinweis:</strong> Bilder werden zur Analyse an Anthropic gesendet. Diese App
              ist ein Proof-of-Concept und <em>nicht</em> für den regulatorisch validierten
              Einsatz in der Medizintechnik vorgesehen.
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
