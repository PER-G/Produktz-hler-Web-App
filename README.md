# Produktzähler — Proof-of-Concept

Web-Anwendung zur vision-gestützten Bauteilprüfung mit der **Claude API** (Anthropic).
Der Nutzer lädt pro Prüfposition ein Referenzfoto hoch, stellt die zulässige Stückzahl
ein und lädt anschließend ein Foto des Arbeitsfelds hoch. Die App schickt alle Bilder an
Claude Vision und vergleicht **Soll vs. Ist** als Ampel.

> **Kontext:** Diese App ist ein Proof-of-Concept für ein späteres Qualitätskontroll-System
> in der Medizintechnik. Sie ist **nicht** für den regulatorisch validierten Einsatz
> freigegeben und ersetzt keine geprüfte QM-Infrastruktur.

---

## Zugang

Die gehostete Version ist passwortgeschützt:

- **Benutzer:** `PER2`
- **Passwort:** `PER2026`

Hinweis: Der Login ist ein einfacher clientseitiger Zugriffsschutz für Demos — kein
vollwertiges Auth-System. Für echte Produktivnutzung bitte eine Auth-Lösung wie
Vercel Password Protection oder einen echten Identity-Provider ergänzen.

## Features

- Flexible Anzahl **Referenzpositionen** (Standard 3, per Button beliebig mehr)
- Pro Position: Name, Referenzfoto, Stückzahl-Konfiguration
  - Modus **Genau** (z. B. genau 3)
  - Modus **Bereich** (Dual-Range-Slider, z. B. 2–5)
  - Modus **Nicht vorhanden** (Soll = 0)
- **Ampel-Gesamtergebnis** mit drei Zuständen:
  - **Grün** – alle Referenzen im Soll, keine Fremdteile
  - **Orange** – alle Referenzen im Soll, aber zusätzliche unbekannte Objekte erkannt
  - **Rot** – mindestens eine Referenzposition weicht ab
- Pro Position Ist-Anzahl, Soll-Bereich und kurze Begründung von Claude
- Eigene Karte für **sonstige erkannte Objekte** inkl. Beschreibung
- Hightech-Dark-Mode mit Glow, Scan-Linien-Animation während der Analyse

## Tech-Stack

- React 19 + Vite 6
- TailwindCSS 3
- lucide-react Icons
- Anthropic Claude API (Modelle `claude-opus-4-7`, `claude-sonnet-4-6`)
- Keine Backend-Server — alles läuft clientseitig

## Lokal starten

```bash
npm install
npm run dev
```

App läuft unter `http://localhost:5173`.

## Production-Build

```bash
npm run build
npm run preview
```

Der Build wird nach `dist/` geschrieben.

## Anthropic API-Key

Der Nutzer trägt seinen eigenen API-Key im Eingabefeld ein. Key bleibt im Browser-State
oder optional in `localStorage` (Checkbox „Key im Browser speichern"). Keys werden an
**keinen** Server außer der Anthropic-API geschickt.

API-Key erstellen: <https://console.anthropic.com/settings/keys>

Der Browser-Request setzt das Flag `anthropic-dangerous-direct-browser-access: true`,
was Anthropic explizit für Browser-Clients zulässt. Für eine validierte Medtech-Variante
sollte der Key serverseitig gehalten werden.

## Deployment

### GitHub Pages

Dank `base: './'` in der Vite-Config funktioniert das statische Asset-Routing auch
unter `/<repo>/`-Pfaden. Build hochladen oder GitHub-Actions-Workflow ergänzen.

### Vercel

Die `vercel.json` ist bereits enthalten. Zwei Wege:

**A. Web-UI (einfachste Variante)**
1. Auf <https://vercel.com/new> einloggen
2. Repository `PER-G/Produktz-hler-Web-App` importieren
3. Framework-Preset: **Vite** (wird automatisch erkannt)
4. Build Command: `npm run build`, Output Directory: `dist`
5. Deploy klicken — fertig

**B. Vercel CLI**
```bash
npm install -g vercel
vercel login
vercel --prod
```

## Projektstruktur

```
src/
├── main.jsx
├── App.jsx
├── components/
│   ├── Header.jsx
│   ├── StatusBar.jsx
│   ├── Instructions.jsx
│   ├── ApiKeyInput.jsx
│   ├── PasswordGate.jsx
│   ├── ReferencePosition.jsx
│   ├── ReferenceList.jsx
│   ├── CountRangeSlider.jsx
│   ├── ImageUploader.jsx
│   ├── AnalysisUploader.jsx
│   ├── ScanOverlay.jsx
│   ├── ResultCard.jsx
│   ├── ResultBanner.jsx
│   └── UnknownObjectsCard.jsx
├── lib/
│   ├── claudeApi.js        (API-Wrapper + Vision-Prompt)
│   └── validation.js       (Ampel-Logik Soll/Ist)
└── styles/index.css
```

## Sicherheitshinweise

- API-Key wird nie an einen Drittserver geschickt, nur direkt an `api.anthropic.com`
- Password-Gate ist clientseitig — **keine** Schutzwirkung gegen technisch versierte
  Nutzer mit Dev-Tools. Für echten Schutz serverseitige Auth einsetzen
  (z. B. Vercel Password Protection im Dashboard aktivieren).
- Die Bilder werden zur Analyse an Anthropic übertragen. Keine sensiblen
  Patientendaten oder identifizierbaren Informationen in die App laden.

## Kostenhinweis

Jeder Analyse-Lauf mit mehreren Referenzbildern + Analysefoto kostet wenige Cent
über die API (abhängig vom gewählten Modell). Für Demos vernachlässigbar.
