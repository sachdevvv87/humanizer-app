import React, { useState, useEffect, useCallback } from 'react'
import Navbar from './components/Navbar.jsx'
import ToneSelector from './components/ToneSelector.jsx'
import WordCounter from './components/WordCounter.jsx'

// ── Replace with your HuggingFace Spaces URL after deployment ──────────────
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// ── Icons ──────────────────────────────────────────────────────────────────
const CopyIcon = ({ done }) => done ? (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
) : (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
)

const SparkleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.88 5.76a1 1 0 0 0 .95.69h6.06l-4.9 3.57a1 1 0 0 0-.36 1.12L17.5 20l-4.9-3.57a1 1 0 0 0-1.18 0L6.5 20l1.87-5.86a1 1 0 0 0-.36-1.12L3.11 9.45h6.06a1 1 0 0 0 .95-.69L12 3z"/>
  </svg>
)

const ClearIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

// ── Spinner ────────────────────────────────────────────────────────────────
const Spinner = () => (
  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
  </svg>
)

// ── Main App ───────────────────────────────────────────────────────────────
export default function App() {
  const [darkMode, setDarkMode] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )
  const [inputText, setInputText]   = useState('')
  const [outputText, setOutputText] = useState('')
  const [tone, setTone]             = useState('default')
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')
  const [copied, setCopied]         = useState(false)
  const [stats, setStats]           = useState(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const handleHumanize = useCallback(async () => {
    if (!inputText.trim() || inputText.trim().length < 10) {
      setError('Please enter at least 10 characters.')
      return
    }
    setError('')
    setLoading(true)
    setOutputText('')
    setStats(null)

    try {
      const res = await fetch(`${API_BASE}/humanize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, tone }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || `Server error ${res.status}`)
      }

      const data = await res.json()
      setOutputText(data.result)
      setStats({
        original: data.original_word_count,
        result: data.result_word_count,
        ms: data.processing_time_ms,
        tone: data.tone,
      })
    } catch (e) {
      setError(e.message || 'Something went wrong. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }, [inputText, tone])

  const handleCopy = () => {
    if (!outputText) return
    navigator.clipboard.writeText(outputText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClear = () => {
    setInputText('')
    setOutputText('')
    setError('')
    setStats(null)
  }

  const MAX_CHARS = 5000
  const charPercent = Math.min((inputText.length / MAX_CHARS) * 100, 100)
  const charColor = charPercent > 90 ? 'var(--error)' : charPercent > 70 ? '#f59e0b' : 'var(--accent)'

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Hero */}
      <div className="text-center py-12 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4"
          style={{ background: 'var(--accent-dim)', color: 'var(--accent-hover)', border: '1px solid var(--accent)', fontFamily: 'JetBrains Mono, monospace' }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse-slow" style={{ background: 'var(--accent)' }}/>
          Powered by Mistral 7B Instruct
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3 leading-tight"
          style={{ color: 'var(--text-primary)' }}>
          Make AI Text Sound <span style={{ color: 'var(--accent)' }}>Human</span>
        </h1>
        <p className="text-base md:text-lg max-w-xl mx-auto"
          style={{ color: 'var(--text-secondary)' }}>
          Paste AI-generated content and get natural, human-sounding text instantly — free & open source.
        </p>
      </div>

      {/* Main editor */}
      <div className="max-w-6xl mx-auto px-4 pb-16">

        {/* Tone selector */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Tone:</span>
          <ToneSelector tone={tone} setTone={setTone} />
        </div>

        {/* Editor grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Input panel */}
          <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
            <div className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
              <span className="text-sm font-display font-semibold" style={{ color: 'var(--text-primary)' }}>
                AI-Generated Text
              </span>
              <div className="flex items-center gap-3">
                <WordCounter text={inputText} />
                {inputText && (
                  <button onClick={handleClear} className="p-1 rounded-md transition-colors"
                    style={{ color: 'var(--text-muted)' }} title="Clear all">
                    <ClearIcon />
                  </button>
                )}
              </div>
            </div>

            <div className="relative">
              <textarea
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Paste your AI-generated text here...&#10;&#10;Example: 'It is crucial to delve into the multifaceted aspects of this topic. Furthermore, it is worth noting that...'"
                maxLength={MAX_CHARS}
                className="w-full resize-none p-4 text-sm leading-relaxed outline-none"
                style={{
                  background: 'var(--surface)',
                  color: 'var(--text-primary)',
                  fontFamily: 'DM Sans, sans-serif',
                  minHeight: '320px',
                  caretColor: 'var(--accent)',
                }}
              />
              {/* Char progress bar */}
              <div className="absolute bottom-0 left-0 right-0 px-4 py-2 flex items-center justify-between"
                style={{ borderTop: '1px solid var(--border)', background: 'var(--surface-2)' }}>
                <div className="flex-1 h-1 rounded-full mr-3" style={{ background: 'var(--border)' }}>
                  <div className="h-1 rounded-full transition-all duration-300"
                    style={{ width: `${charPercent}%`, background: charColor }} />
                </div>
                <span className="text-xs font-mono-custom" style={{ color: charPercent > 90 ? charColor : 'var(--text-muted)' }}>
                  {inputText.length}/{MAX_CHARS}
                </span>
              </div>
            </div>
          </div>

          {/* Output panel */}
          <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
            <div className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
              <span className="text-sm font-display font-semibold" style={{ color: 'var(--text-primary)' }}>
                Humanized Output
              </span>
              <div className="flex items-center gap-3">
                {outputText && <WordCounter text={outputText} />}
                <button
                  onClick={handleCopy}
                  disabled={!outputText}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                  style={{
                    background: copied ? 'var(--accent)' : 'var(--surface)',
                    color: copied ? '#fff' : 'var(--text-secondary)',
                    border: `1px solid ${copied ? 'var(--accent)' : 'var(--border)'}`,
                    opacity: outputText ? 1 : 0.4,
                    cursor: outputText ? 'pointer' : 'not-allowed',
                  }}
                >
                  <CopyIcon done={copied} />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="relative" style={{ minHeight: '320px' }}>
              {loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                  style={{ background: 'var(--surface)' }}>
                  <div style={{ color: 'var(--accent)' }}><Spinner /></div>
                  <p className="text-sm animate-pulse" style={{ color: 'var(--text-muted)' }}>
                    Humanizing your text…
                  </p>
                </div>
              ) : outputText ? (
                <div className="p-4 text-sm leading-relaxed animate-fade-in"
                  style={{ color: 'var(--text-primary)', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'pre-wrap' }}>
                  {outputText}
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-8 text-center">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-1"
                    style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}>
                    <SparkleIcon />
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Your humanized text will appear here
                  </p>
                </div>
              )}
            </div>

            {/* Stats bar */}
            {stats && (
              <div className="px-4 py-2 flex items-center gap-4 text-xs font-mono-custom animate-slide-up"
                style={{ borderTop: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text-muted)' }}>
                <span>⚡ {stats.ms}ms</span>
                <span style={{ color: 'var(--border)' }}>|</span>
                <span>{stats.original} → {stats.result} words</span>
                <span style={{ color: 'var(--border)' }}>|</span>
                <span style={{ color: 'var(--accent)', textTransform: 'capitalize' }}>{stats.tone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 px-4 py-3 rounded-xl text-sm animate-fade-in"
            style={{ background: '#fee2e2', color: 'var(--error)', border: '1px solid #fecaca' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Humanize button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleHumanize}
            disabled={loading || !inputText.trim()}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-display font-bold transition-all duration-200 active:scale-95"
            style={{
              background: loading || !inputText.trim() ? 'var(--surface-2)' : 'var(--accent)',
              color: loading || !inputText.trim() ? 'var(--text-muted)' : '#fff',
              border: 'none',
              cursor: loading || !inputText.trim() ? 'not-allowed' : 'pointer',
              boxShadow: loading || !inputText.trim() ? 'none' : '0 4px 24px rgba(34,197,94,0.35)',
              letterSpacing: '0.01em',
              transform: loading || !inputText.trim() ? 'none' : undefined,
            }}
          >
            {loading ? <><Spinner /> Humanizing…</> : <><SparkleIcon /> Humanize Text</>}
          </button>
        </div>

        {/* Feature pills */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {['100% Free & Open Source', 'Mistral 7B Powered', 'No Login Required', '4 Writing Tones'].map(f => (
            <span key={f} className="px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
              ✓ {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
