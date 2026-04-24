import { useRef, useState } from 'react'
import { Upload, X, Camera } from 'lucide-react'

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      const base64 = String(result).split(',')[1] || ''
      resolve({ base64, mediaType: file.type || 'image/jpeg', dataUrl: String(result) })
    }
    reader.onerror = () => reject(new Error('Bild konnte nicht gelesen werden.'))
    reader.readAsDataURL(file)
  })
}

export default function ImageUploader({ dataUrl, onImage, onClear, compact = false, label = 'Referenzfoto' }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  async function handleFile(file) {
    if (!file) return
    if (!file.type?.startsWith('image/')) return
    const res = await fileToBase64(file)
    onImage({ base64: res.base64, mediaType: res.mediaType, dataUrl: res.dataUrl })
  }

  const sizeClasses = compact ? 'h-32' : 'h-48'

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        const file = e.dataTransfer.files?.[0]
        handleFile(file)
      }}
      className={`relative ${sizeClasses} rounded-lg border-2 border-dashed transition cursor-pointer overflow-hidden ${
        dragging
          ? 'border-accent bg-accent/10 shadow-glow'
          : 'border-slate-700 hover:border-accent/60 hover:bg-white/5'
      }`}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {dataUrl ? (
        <>
          <img
            src={dataUrl}
            alt={label}
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onClear?.()
            }}
            className="absolute top-1.5 right-1.5 w-7 h-7 grid place-items-center rounded-md bg-black/70 hover:bg-nok/80 transition"
            aria-label="Bild entfernen"
          >
            <X className="w-4 h-4" />
          </button>
        </>
      ) : (
        <div className="h-full flex flex-col items-center justify-center gap-1 text-slate-400 text-sm">
          {compact ? <Camera className="w-6 h-6" /> : <Upload className="w-7 h-7" />}
          <span className="font-mono text-xs">
            {label} ablegen oder klicken
          </span>
        </div>
      )}
    </div>
  )
}
