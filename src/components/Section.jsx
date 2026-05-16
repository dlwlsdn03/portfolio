// src/components/Section.jsx
import React from 'react'

export default function Section({ id, className = '', children }) {
  return (
    <section id={id} className={['snap-start min-h-full', className].join(' ')}>
      {children}
    </section>
  )
}
