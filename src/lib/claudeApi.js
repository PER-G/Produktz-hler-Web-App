const DEFAULT_MODEL = 'claude-opus-4-7'

export async function analyzeImages({ apiKey, model, referencePositions, analysisImage }) {
  if (!apiKey) throw new Error('Kein API-Key vorhanden.')
  if (!analysisImage?.base64) throw new Error('Kein Analysefoto hochgeladen.')
  if (!referencePositions?.length) throw new Error('Mindestens eine Referenzposition wird benötigt.')

  const nameList = referencePositions
    .map((p, i) => `${i + 1}. ${p.name?.trim() || `Objekt ${i + 1}`}`)
    .join('\n')

  const content = []

  referencePositions.forEach((pos, idx) => {
    const label = pos.name?.trim() || `Objekt ${idx + 1}`
    content.push({
      type: 'text',
      text: `Referenzobjekt ${idx + 1}: "${label}". Folgendes Bild zeigt das Referenzobjekt.`,
    })
    content.push({
      type: 'image',
      source: {
        type: 'base64',
        media_type: pos.imageMediaType || 'image/jpeg',
        data: pos.imageBase64,
      },
    })
  })

  content.push({
    type: 'text',
    text: 'Folgendes Bild ist das zu prüfende Arbeitsfeld. Zähle, wie oft jedes der oben gezeigten Referenzobjekte darauf vorkommt.',
  })
  content.push({
    type: 'image',
    source: {
      type: 'base64',
      media_type: analysisImage.mediaType || 'image/jpeg',
      data: analysisImage.base64,
    },
  })

  const systemPrompt = `Du bist ein Qualitätskontroll-Assistent für visuelle Bauteilprüfung.

Du hast ${referencePositions.length} Referenzobjekte gesehen:
${nameList}

Analysiere das zu prüfende Arbeitsfeld und:
1. Zähle für jedes Referenzobjekt exakt, wie oft es vorkommt.
2. Zähle zusätzlich alle deutlich sichtbaren Objekte, die KEINEM der Referenzobjekte entsprechen ("sonstige Objekte"). Gib eine kurze Beschreibung dieser Fremdteile.
3. Hintergrundflächen, Tisch, Unterlage, Schatten, Reflexionen und die Hand/Handschuhe zählen NICHT als Objekte.

Antworte AUSSCHLIESSLICH mit gültigem JSON im Format:
{
  "ergebnisse": [
    {"name": "<Name>", "anzahl": <int>, "begruendung": "<kurz>"}
  ],
  "sonstige_objekte": {
    "anzahl": <int>,
    "beschreibung": "<kurze Aufzählung oder leerer String>"
  }
}

Keine Markdown-Codeblöcke, nur das reine JSON. Die Reihenfolge und Namen in "ergebnisse" müssen exakt mit der oben genannten Liste übereinstimmen.`

  const body = {
    model: model || DEFAULT_MODEL,
    max_tokens: 1500,
    system: systemPrompt,
    messages: [{ role: 'user', content }],
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    let msg = `API-Fehler ${res.status}`
    try {
      const err = await res.json()
      if (err?.error?.message) msg += `: ${err.error.message}`
    } catch {}
    throw new Error(msg)
  }

  const data = await res.json()
  const textBlock = (data.content || []).find((b) => b.type === 'text')
  const rawText = textBlock?.text || ''
  const cleaned = rawText.replace(/```json\s*|```/g, '').trim()

  let parsed
  try {
    parsed = JSON.parse(cleaned)
  } catch (e) {
    throw new Error('Antwort konnte nicht als JSON gelesen werden: ' + cleaned.slice(0, 200))
  }

  if (!parsed?.ergebnisse || !Array.isArray(parsed.ergebnisse)) {
    throw new Error('Antwortformat ungültig — "ergebnisse" fehlt.')
  }
  const sonstige = parsed.sonstige_objekte && typeof parsed.sonstige_objekte === 'object'
    ? {
        anzahl: Number(parsed.sonstige_objekte.anzahl) || 0,
        beschreibung: String(parsed.sonstige_objekte.beschreibung || ''),
      }
    : { anzahl: 0, beschreibung: '' }
  return { ergebnisse: parsed.ergebnisse, sonstige }
}

export const MODELS = [
  { id: 'claude-opus-4-7', label: 'Claude Opus 4.7 (präzise, teurer)' },
  { id: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6 (schneller, günstiger)' },
]
