import { useEffect, useMemo, useState } from 'react'
import { Play, Loader2, AlertCircle } from 'lucide-react'

import Header from './components/Header'
import StatusBar from './components/StatusBar'
import Instructions from './components/Instructions'
import ApiKeyInput from './components/ApiKeyInput'
import ReferenceList from './components/ReferenceList'
import AnalysisUploader from './components/AnalysisUploader'
import ResultCard from './components/ResultCard'
import ResultBanner from './components/ResultBanner'
import UnknownObjectsCard from './components/UnknownObjectsCard'
import PasswordGate from './components/PasswordGate'

import { analyzeImages, MODELS } from './lib/claudeApi'
import { evaluatePosition, isPositionReadyForAnalysis } from './lib/validation'

const API_KEY_STORAGE = 'produktzaehler_api_key_v1'
const REMEMBER_STORAGE = 'produktzaehler_remember_v1'

let nextId = 0
function makePosition() {
  nextId += 1
  return {
    id: `p_${Date.now()}_${nextId}`,
    name: '',
    imageBase64: null,
    imageMediaType: null,
    imageDataUrl: null,
    mode: 'exact',
    exactValue: 1,
    minValue: 1,
    maxValue: 3,
    sliderMax: 20,
  }
}

function initialPositions() {
  return [makePosition(), makePosition(), makePosition()]
}

export default function App() {
  const [apiKey, setApiKey] = useState('')
  const [remember, setRemember] = useState(false)
  const [model, setModel] = useState(MODELS[0].id)

  const [positions, setPositions] = useState(initialPositions)
  const [analysisImage, setAnalysisImage] = useState(null)

  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState(null) // array aligned to positions
  const [unknown, setUnknown] = useState(null) // { anzahl, beschreibung }

  // Restore persisted key
  useEffect(() => {
    const rem = localStorage.getItem(REMEMBER_STORAGE) === '1'
    if (rem) {
      setRemember(true)
      const stored = localStorage.getItem(API_KEY_STORAGE) || ''
      setApiKey(stored)
    }
  }, [])

  // Persist key on change if remember is on
  useEffect(() => {
    if (remember) {
      localStorage.setItem(REMEMBER_STORAGE, '1')
      localStorage.setItem(API_KEY_STORAGE, apiKey)
    } else {
      localStorage.removeItem(REMEMBER_STORAGE)
      localStorage.removeItem(API_KEY_STORAGE)
    }
  }, [remember, apiKey])

  function updatePosition(index, updated) {
    setPositions((prev) => prev.map((p, i) => (i === index ? updated : p)))
  }
  function addPosition() {
    setPositions((prev) => [...prev, makePosition()])
  }
  function removePosition(index) {
    setPositions((prev) => prev.filter((_, i) => i !== index))
  }

  const readyPositions = positions.filter(isPositionReadyForAnalysis)
  const allPositionsReady = readyPositions.length === positions.length
  const canRun =
    Boolean(apiKey.trim()) &&
    allPositionsReady &&
    Boolean(analysisImage?.base64) &&
    !analyzing

  const blockingReason = useMemo(() => {
    if (!apiKey.trim()) return 'API-Key fehlt.'
    if (!allPositionsReady)
      return 'Jede Position braucht einen Namen und ein Referenzfoto.'
    if (!analysisImage?.base64) return 'Prüffoto fehlt.'
    return ''
  }, [apiKey, allPositionsReady, analysisImage])

  async function runAnalysis() {
    setError('')
    setResults(null)
    setUnknown(null)
    setAnalyzing(true)
    try {
      const { ergebnisse, sonstige } = await analyzeImages({
        apiKey: apiKey.trim(),
        model,
        referencePositions: positions,
        analysisImage,
      })

      const alignedResults = positions.map((pos, idx) => {
        const match =
          ergebnisse.find(
            (r) =>
              r?.name &&
              pos.name &&
              r.name.trim().toLowerCase() === pos.name.trim().toLowerCase(),
          ) || ergebnisse[idx]
        const count =
          match && typeof match.anzahl === 'number'
            ? match.anzahl
            : Number(match?.anzahl)
        const safeCount = Number.isFinite(count) ? count : null
        const evaluation = evaluatePosition(pos, safeCount)
        return {
          count: safeCount,
          evaluation,
          reasoning: match?.begruendung || '',
        }
      })

      setResults(alignedResults)
      setUnknown(sonstige || { anzahl: 0, beschreibung: '' })
    } catch (e) {
      setError(e?.message || 'Unbekannter Fehler bei der Analyse.')
    } finally {
      setAnalyzing(false)
    }
  }

  const allRefsOk = results?.every((r) => r.evaluation?.ok) ?? false
  const unknownCount = unknown?.anzahl ?? 0
  const hasUnknown = unknownCount > 0
  const overallStatus = !results
    ? null
    : !allRefsOk
    ? 'fail'
    : hasUnknown
    ? 'warn'
    : 'ok'
  const failedNames =
    results
      ?.map((r, i) => (r.evaluation?.ok ? null : positions[i].name || `Position ${i + 1}`))
      .filter(Boolean) || []

  return (
    <PasswordGate>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <Header />
        <StatusBar
          hasApiKey={Boolean(apiKey.trim())}
          activePositions={positions.length}
          model={model}
          analyzing={analyzing}
        />
        <Instructions />

        <ApiKeyInput
          apiKey={apiKey}
          onApiKeyChange={setApiKey}
          remember={remember}
          onRememberChange={setRemember}
          model={model}
          onModelChange={setModel}
        />

        <ReferenceList
          positions={positions}
          onChange={updatePosition}
          onAdd={addPosition}
          onRemove={removePosition}
        />

        <AnalysisUploader
          image={analysisImage}
          onImage={setAnalysisImage}
          onClear={() => setAnalysisImage(null)}
          analyzing={analyzing}
        />

        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
          <button
            onClick={runAnalysis}
            disabled={!canRun}
            className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold transition ${
              canRun
                ? 'bg-accent text-bg-base hover:bg-accent-soft shadow-glow'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {analyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Prüfung läuft…
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Prüfung starten
              </>
            )}
          </button>
          {!canRun && !analyzing && blockingReason && (
            <div className="text-xs font-mono text-amber-300 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {blockingReason}
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-nok/50 bg-nok/10 px-4 py-3 text-sm text-red-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 text-nok shrink-0" />
            <div>
              <div className="font-semibold">Fehler bei der Analyse</div>
              <div className="font-mono text-xs mt-0.5">{error}</div>
            </div>
          </div>
        )}

        {results && (
          <>
            <ResultBanner
              status={overallStatus}
              failedNames={failedNames}
              unknownCount={unknownCount}
              unknownDescription={unknown?.beschreibung || ''}
            />
            <section>
              <h2 className="text-sm font-semibold text-slate-200 font-mono uppercase tracking-wider mb-3">
                Einzelergebnisse
              </h2>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {positions.map((pos, i) => (
                  <ResultCard
                    key={pos.id}
                    position={pos}
                    count={results[i]?.count}
                    evaluation={results[i]?.evaluation}
                    reasoning={results[i]?.reasoning}
                  />
                ))}
                <UnknownObjectsCard
                  count={unknownCount}
                  description={unknown?.beschreibung || ''}
                />
              </div>
            </section>
          </>
        )}

        <footer className="mt-10 pt-6 border-t border-slate-800 text-xs text-slate-500 font-mono flex flex-col md:flex-row gap-2 md:justify-between">
          <span>Produktzähler · Proof-of-Concept · nicht für validierten Medtech-Einsatz</span>
          <span>Bilder gehen an die Anthropic-API · Key verbleibt im Browser</span>
        </footer>
      </div>
    </PasswordGate>
  )
}
