export function evaluatePosition(position, count) {
  if (count === null || count === undefined || Number.isNaN(count)) {
    return { ok: false, detail: 'Keine Zählung erhalten' }
  }
  if (position.mode === 'exact') {
    const ok = count === Number(position.exactValue)
    return {
      ok,
      detail: ok
        ? `Genau ${position.exactValue} erwartet — OK`
        : `Soll genau ${position.exactValue}, Ist ${count}`,
    }
  }
  if (position.mode === 'range') {
    const min = Number(position.minValue)
    const max = Number(position.maxValue)
    const ok = count >= min && count <= max
    return {
      ok,
      detail: ok
        ? `Innerhalb ${min}–${max} — OK`
        : `Soll ${min}–${max}, Ist ${count}`,
    }
  }
  if (position.mode === 'none') {
    const ok = count === 0
    return {
      ok,
      detail: ok
        ? 'Nicht vorhanden — OK'
        : `Darf nicht vorhanden sein, Ist ${count}`,
    }
  }
  return { ok: false, detail: 'Unbekannter Modus' }
}

export function formatTarget(position) {
  if (position.mode === 'exact') return `genau ${position.exactValue}`
  if (position.mode === 'range') return `${position.minValue}–${position.maxValue}`
  if (position.mode === 'none') return '0 (nicht vorhanden)'
  return '—'
}

export function isPositionReadyForAnalysis(position) {
  return Boolean(position.name?.trim()) && Boolean(position.imageBase64)
}
