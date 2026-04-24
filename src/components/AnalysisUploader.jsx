import { useRef, useState } from 'react'
import { Upload, X, Scan } from 'lucide-react'
import { fileToBase64 } from './ImageUploader'
import ScanOverlay from './ScanOverlay'

export default function AnalysisUploader({ image, onImage, onClear, analyzing }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  async function handleFile(file) {
    if (!file) return
    if (!file.type?.startsWith('image/')) return
    const res = await fileToBase64(file)
    onImage({ base64: res.base64, mediaType: res.mediaType, dataUrl: res.dataUrl })
  }

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-200 font-mono uppercase tracking-wider flex items-center gap-2">
          <Scan className="w-4 h-4 text-accent" /> Prüffoto · Arbeitsfeld
        </h2>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          handleFile(e.dataTransfer.files?.[0])
        }}
        onClick={() => !image?.dataUrl && inputRef.current?.click()}
        className={`relative rounded-xl border-2 border-dashed transition overflow-hidden ${
          image?.dataUrl ? 'cursor-default' : 'cursor-pointer'
        } ${
          dragging
            ? 'border-accent bg-accent/10 shadow-glow'
            : image?.dataUrl
            ? 'border-accent/40'
            : 'border-slate-700 hover:border-accent/60 hover:bg-white/5'
        }`}
        style={{ minHeight: image?.dataUrl ? 'auto' : '240px' }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        {image?.dataUrl ? (
          <>
            <img
              src={image.dataUrl}
              alt="Arbeitsfeld"
              className="w-full max-h-[520px] object-contain bg-black/40"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onClear?.()
              }}
              disabled={analyzing}
              className="absolute top-2 right-2 w-9 h-9 grid place-items-center rounded-md bg-black/70 hover:bg-nok/80 transition disabled:opacity-40"
              aria-label="Prüffoto entfernen"
            >
              <X className="w-5 h-5" />
            </button>
            <ScanOverlay active={analyzing} />
          </>
        ) : (
          <div className="min-h-[240px] flex flex-col items-center justify-center gap-2 text-slate-400 py-10">
            <Upload className="w-10 h-10" />
            <div className="font-mono text-sm">Prüffoto ablegen oder klicken</div>
            <div className="font-mono text-xs text-slate-500">
              Foto des Arbeitsfelds mit allen Objekten
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
