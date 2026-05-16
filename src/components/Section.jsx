// src/components/Section.jsx
import React from 'react'

export default function Section({ id, className = '', withDivider = true, children }) {
  return (
    <section
      id={id}
      className={[
        'snap-start min-h-full section-boundary',
        withDivider ? 'section-boundary--visible' : '',
        className
      ].join(' ')}
    >
      {children}
    </section>
  )
}
