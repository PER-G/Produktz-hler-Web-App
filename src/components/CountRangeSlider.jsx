import { useEffect, useMemo } from 'react'
import { Ban, Target, MoveHorizontal } from 'lucide-react'

const DEFAULT_MAX = 20

export default function CountRangeSlider({ position, onChange }) {
  const max = position.sliderMax ?? DEFAULT_MAX

  const mode = position.mode

  useEffect(() => {
    if (mode === 'range' && Number(position.minValue) > Number(position.maxValue)) {
      onChange({ ...position, minValue: position.maxValue })
    }
  }, [mode, position.minValue, position.maxValue]) // eslint-disable-line react-hooks/exhaustive-deps

  const display = useMemo(() => {
    if (mode === 'exact') return `genau ${position.exactValue} Stück`
    if (mode === 'range')
      return `${position.minValue} – ${position.maxValue} Stück`
    if (mode === 'none') return '0 Stück (darf nicht vorhanden sein)'
    return ''
  }, [mode, position.exactValue, position.minValue, position.maxValue])

  function setMode(newMode) {
    onChange({ ...position, mode: newMode })
  }

  function extendRange() {
    onChange({ ...position, sliderMax: max + 20 })
  }

  const pct = (v) => (Math.min(Math.max(Number(v), 0), max) / max) * 100

  return (
    <div className="bg-bg-base/40 rounded-lg p-3 border border-slate-800">
      <div className="flex flex-wrap gap-1.5 mb-3">
        <ModeButton
          active={mode === 'exact'}
          onClick={() => setMode('exact')}
          icon={<Target className="w-3.5 h-3.5" />}
          label="Genau"
        />
        <ModeButton
          active={mode === 'range'}
          onClick={() => setMode('range')}
          icon={<MoveHorizontal className="w-3.5 h-3.5" />}
          label="Bereich"
        />
        <ModeButton
          active={mode === 'none'}
          onClick={() => setMode('none')}
          icon={<Ban className="w-3.5 h-3.5" />}
          label="Nicht vorhanden"
        />
      </div>

      <div className="text-center mb-3">
        <div className="text-xl md:text-2xl font-mono font-bold text-accent">
          {display}
        </div>
      </div>

      {mode === 'exact' && (
        <div className="px-2">
          <input
            type="range"
            min={0}
            max={max}
            value={position.exactValue}
            onChange={(e) =>
              onChange({ ...position, exactValue: Number(e.target.value) })
            }
            className="w-full accent-accent"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
            <span>0</span>
            <span>{max}</span>
          </div>
        </div>
      )}

      {mode === 'range' && (
        <div className="px-2">
          <div className="relative h-5">
            <div className="range-track absolute left-0 right-0 top-1/2 -translate-y-1/2" />
            <div
              className="range-fill absolute top-1/2 -translate-y-1/2 h-1.5"
              style={{
                left: `${pct(position.minValue)}%`,
                width: `${pct(position.maxValue) - pct(position.minValue)}%`,
              }}
            />
            <input
              type="range"
              min={0}
              max={max}
              value={position.minValue}
              onChange={(e) => {
                const v = Math.min(Number(e.target.value), position.maxValue)
                onChange({ ...position, minValue: v })
              }}
              className="dual"
            />
            <input
              type="range"
              min={0}
              max={max}
              value={position.maxValue}
              onChange={(e) => {
                const v = Math.max(Number(e.target.value), position.minValue)
                onChange({ ...position, maxValue: v })
              }}
              className="dual"
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-2">
            <span>0</span>
            <span>{max}</span>
          </div>
        </div>
      )}

      {mode === 'none' && (
        <p className="text-xs text-slate-400 italic text-center">
          Prüfung erwartet, dass dieses Objekt <strong>nicht</strong> auf dem Arbeitsfeld
          vorkommt.
        </p>
      )}

      {(mode === 'exact' || mode === 'range') && (
        <button
          onClick={extendRange}
          className="mt-3 text-[10px] font-mono text-slate-400 hover:text-accent transition"
        >
          Bereich erweitern (+20)
        </button>
      )}
    </div>
  )
}

function ModeButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono border transition ${
        active
          ? 'bg-accent/20 border-accent text-accent shadow-glow'
          : 'bg-transparent border-slate-700 text-slate-400 hover:border-accent/50 hover:text-slate-200'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}
