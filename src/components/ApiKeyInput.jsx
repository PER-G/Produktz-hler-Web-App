import { useState } from 'react'
import { Key, Eye, EyeOff, Cpu } from 'lucide-react'
import { MODELS } from '../lib/claudeApi'

export default function ApiKeyInput({
  apiKey,
  onApiKeyChange,
  remember,
  onRememberChange,
  model,
  onModelChange,
}) {
  const [show, setShow] = useState(false)
  return (
    <section className="glass rounded-xl p-4 mb-6 grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-end">
      <div>
        <label className="text-xs font-mono text-slate-400 mb-1 flex items-center gap-1.5">
          <Key className="w-3.5 h-3.5" /> Anthropic API-Key
        </label>
        <div className="relative">
          <input
            type={show ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            placeholder="sk-ant-api03-..."
            className="w-full bg-bg-base/60 border border-slate-700 focus:border-accent focus:shadow-glow outline-none rounded-lg px-3 py-2 pr-10 font-mono text-sm transition"
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-accent"
            aria-label={show ? 'Key verbergen' : 'Key anzeigen'}
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <label className="mt-2 flex items-center gap-2 text-xs text-slate-400 select-none cursor-pointer">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => onRememberChange(e.target.checked)}
            className="accent-accent"
          />
          Key im Browser speichern (localStorage)
        </label>
      </div>

      <div className="hidden md:block w-px h-12 bg-slate-700/50 mx-2" />

      <div>
        <label className="text-xs font-mono text-slate-400 mb-1 flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5" /> Modell
        </label>
        <select
          value={model}
          onChange={(e) => onModelChange(e.target.value)}
          className="w-full bg-bg-base/60 border border-slate-700 focus:border-accent focus:shadow-glow outline-none rounded-lg px-3 py-2 font-mono text-sm transition"
        >
          {MODELS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>
      </div>
    </section>
  )
}
