import { useEffect, useState } from 'react'
import { Lock, LogIn } from 'lucide-react'

const STORAGE_KEY = 'produktzaehler_auth_v1'
const EXPECTED_USER = 'PER2'
const EXPECTED_PASS = 'PER2026'

function encode(u, p) {
  return btoa(`${u}::${p}`)
}

export default function PasswordGate({ children }) {
  const [authed, setAuthed] = useState(false)
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && stored === encode(EXPECTED_USER, EXPECTED_PASS)) {
      setAuthed(true)
    }
  }, [])

  function submit(e) {
    e.preventDefault()
    if (user.trim() === EXPECTED_USER && pass === EXPECTED_PASS) {
      localStorage.setItem(STORAGE_KEY, encode(EXPECTED_USER, EXPECTED_PASS))
      setAuthed(true)
      setErr('')
    } else {
      setErr('Benutzer oder Passwort falsch.')
    }
  }

  if (authed) return children

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <form
        onSubmit={submit}
        className="glass-strong rounded-2xl p-6 md:p-8 w-full max-w-sm border border-accent/30 shadow-glow"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-accent/15 grid place-items-center border border-accent/40">
            <Lock className="w-5 h-5 text-accent" />
          </div>
          <div>
            <div className="text-lg font-bold">Zugang erforderlich</div>
            <div className="text-xs font-mono text-slate-400">
              Produktzähler · PoC
            </div>
          </div>
        </div>

        <label className="block text-xs font-mono text-slate-400 mb-1">
          Benutzer
        </label>
        <input
          type="text"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          autoFocus
          autoComplete="username"
          className="w-full bg-bg-base/60 border border-slate-700 focus:border-accent focus:shadow-glow outline-none rounded-lg px-3 py-2 font-mono text-sm mb-4 transition"
        />

        <label className="block text-xs font-mono text-slate-400 mb-1">
          Passwort
        </label>
        <input
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          autoComplete="current-password"
          className="w-full bg-bg-base/60 border border-slate-700 focus:border-accent focus:shadow-glow outline-none rounded-lg px-3 py-2 font-mono text-sm mb-4 transition"
        />

        {err && (
          <div className="text-xs text-nok font-mono mb-3">{err}</div>
        )}

        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-2 bg-accent text-bg-base hover:bg-accent-soft font-semibold py-2.5 rounded-lg transition shadow-glow"
        >
          <LogIn className="w-4 h-4" />
          Anmelden
        </button>

        <p className="mt-4 text-[11px] text-slate-500 font-mono leading-relaxed">
          Hinweis: Diese Login-Maske ist ein einfacher Zugriffsschutz für die
          Demo, kein vollwertiges Authentifizierungssystem.
        </p>
      </form>
    </div>
  )
}
