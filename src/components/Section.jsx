import React from 'react'

export default function Section({ id, title, className = '', children }) {
  return (
    <section id={id} className={['scroll-mt-24', 'py-16 sm:py-24', className].join(' ')}>
      {title && (
        <div className="max-w-3xl mx-auto px-6 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h2>
        </div>
      )}
      {children}
    </section>
  )
}
