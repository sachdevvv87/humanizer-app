import React from 'react'

const tones = [
  { value: 'default', label: 'Auto', desc: 'Balanced natural writing' },
  { value: 'casual',  label: 'Casual', desc: 'Friendly & conversational' },
  { value: 'formal',  label: 'Formal', desc: 'Professional & polished' },
  { value: 'academic', label: 'Academic', desc: 'Scholarly & precise' },
]

export default function ToneSelector({ tone, setTone }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tones.map(t => (
        <button
          key={t.value}
          onClick={() => setTone(t.value)}
          title={t.desc}
          className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
          style={{
            background: tone === t.value ? 'var(--accent)' : 'var(--surface-2)',
            color: tone === t.value ? '#fff' : 'var(--text-secondary)',
            border: `1px solid ${tone === t.value ? 'var(--accent)' : 'var(--border)'}`,
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
