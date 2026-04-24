import { Trash2, Hash } from 'lucide-react'
import ImageUploader from './ImageUploader'
import CountRangeSlider from './CountRangeSlider'

export default function ReferencePosition({ index, position, onChange, onRemove, canRemove }) {
  return (
    <div className="glass rounded-xl p-4 flex flex-col gap-3 border-l-2 border-accent/40 hover:border-accent transition">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid place-items-center w-7 h-7 rounded-md bg-accent/15 text-accent font-mono font-bold text-sm">
            {index + 1}
          </span>
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
            <Hash className="w-3 h-3" /> Position
          </span>
        </div>
        {canRemove && (
          <button
            onClick={onRemove}
            className="w-7 h-7 grid place-items-center rounded-md text-slate-500 hover:text-nok hover:bg-nok/10 transition"
            aria-label="Position entfernen"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <input
        type="text"
        value={position.name}
        onChange={(e) => onChange({ ...position, name: e.target.value })}
        placeholder="z. B. Schraube M8"
        className="bg-bg-base/60 border border-slate-700 focus:border-accent focus:shadow-glow outline-none rounded-lg px-3 py-2 text-sm transition"
      />

      <ImageUploader
        dataUrl={position.imageDataUrl}
        onImage={({ base64, mediaType, dataUrl }) =>
          onChange({
            ...position,
            imageBase64: base64,
            imageMediaType: mediaType,
            imageDataUrl: dataUrl,
          })
        }
        onClear={() =>
          onChange({
            ...position,
            imageBase64: null,
            imageMediaType: null,
            imageDataUrl: null,
          })
        }
        compact
      />

      <CountRangeSlider position={position} onChange={onChange} />
    </div>
  )
}
