import { Plus } from 'lucide-react'
import ReferencePosition from './ReferencePosition'

export default function ReferenceList({ positions, onChange, onAdd, onRemove, minPositions = 3 }) {
  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-200 font-mono uppercase tracking-wider">
          Referenzpositionen
        </h2>
        <span className="text-xs font-mono text-slate-500">
          {positions.length} aktiv · min. {minPositions}
        </span>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {positions.map((pos, i) => (
          <ReferencePosition
            key={pos.id}
            index={i}
            position={pos}
            onChange={(updated) => onChange(i, updated)}
            onRemove={() => onRemove(i)}
            canRemove={positions.length > minPositions}
          />
        ))}
      </div>

      <button
        onClick={onAdd}
        className="mt-4 w-full md:w-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-accent/50 text-accent hover:bg-accent/10 hover:shadow-glow transition font-mono text-sm"
      >
        <Plus className="w-4 h-4" />
        Weitere Position hinzufügen
      </button>
    </section>
  )
}
