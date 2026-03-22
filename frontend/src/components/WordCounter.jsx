import React from 'react'

export default function WordCounter({ text, label = '' }) {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const chars = text.length

  return (
    <div className="flex items-center gap-3 text-xs font-mono-custom"
      style={{ color: 'var(--text-muted)' }}>
      {label && <span style={{ color: 'var(--text-muted)' }}>{label}</span>}
      <span>
        <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{words}</span> words
      </span>
      <span>
        <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{chars}</span> chars
      </span>
    </div>
  )
}
