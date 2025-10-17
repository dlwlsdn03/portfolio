// src/App.jsx
import React from 'react'
import Section from './components/Section.jsx'
import { work, education, publications } from './data/content.js'
import { LinkedInIcon, GitHubIcon, MailIcon } from './components/Icons.jsx'

function IconButton({ href, label, children }) {
  return (
    <a
      href={href}
      aria-label={label}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noreferrer' : undefined}
      className="inline-flex items-center justify-center w-16 h-16 border border-black rounded-full hover:bg-black hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-black"
    >
      {children}
    </a>
  )
}

function LogoBox({ src, alt }) {
  // If a logo source exists, show it
  if (src) {
    return (
      <img
        src={src}                        // e.g. "/logos/fph.png"
        alt={alt}                        // e.g. "Company logo"
        className="w-12 h-12 object-contain"
        loading="lazy"
      />
    )
  }

  // Otherwise show a simple placeholder
  return (
    <div className="w-12 h-12 border border-black flex items-center justify-center">
      <div className="w-6 h-6 bg-black opacity-5" />
      <span className="sr-only">{alt}</span>
    </div>
  )
}

function WorkItem({ item, idx }) {
  const [open, setOpen] = React.useState(false)
  const descId = `work-desc-${idx}`

  return (
    <li
      className="py-6 grid gap-4 items-center              /* <— center all cells vertically */
                 grid-cols-[48px_1fr] md:grid-cols-[48px_1fr_auto]"
    >
      {/* Logo (fixed box, won’t stretch) */}
      <div className="w-12 h-12 flex items-center justify-center shrink-0">
        <img
          src={`/logos/${item.logo}`}
          alt={`${item.company} logo`}
          className="max-w-full max-h-full object-contain"
          loading="lazy"
        />
      </div>

      {/* Text block (role top, company below) */}
      <div className="min-w-0 leading-tight self-center">   {/* <— ensure the text cell is centered too */}
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          aria-controls={descId}
          className="text-left p-0 bg-transparent
                     text-xl md:text-2xl font-bold
                     focus:outline-none focus:ring-1 focus:ring-black
                     hover:"
        >
          {item.role}
        </button>
        <p className="text-sm text-black/80 mt-1">{item.company}</p>

        <div
          id={descId}
          className={`overflow-hidden transition-[max-height] duration-300 ease-out
                     ${open ? 'max-h-96 mt-3' : 'max-h-0'}`}
        >
          <p className="text-sm leading-relaxed text-black/80">
            {item.summary}
          </p>
        </div>
      </div>

      {/* Period column (center it as well) */}
      <span className="hidden md:block text-sm text-black/60 whitespace-nowrap self-center">
        {item.period}
      </span>
    </li>
  )
}

function EduItem({ e, idx }) {
  const [open, setOpen] = React.useState(false)
  const descId = `edu-desc-${idx}`

  return (
    <li
      className="py-6 grid gap-4 items-center
                 grid-cols-[48px_1fr] md:grid-cols-[48px_1fr_auto]"
    >
      <div className="w-12 h-12 flex items-center justify-center shrink-0">
        <img
          src={`/logos/${e.logo}`}
          alt={`${e.school} logo`}
          className="max-w-full max-h-full object-contain"
          loading="lazy"
        />
      </div>

      <div className="min-w-0 leading-tight self-center">
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          aria-controls={descId}
          className="text-left p-0 bg-transparent
                     text-xl md:text-2xl font-bold
                     focus:outline-none focus:ring-1 focus:ring-black
                     hover:"
        >
          {e.school}
        </button>
        <p className="text-sm text-black/80 mt-1">{e.degree}</p>

        <div
          id={descId}
          className={`overflow-hidden transition-[max-height] duration-300 ease-out
                     ${open ? 'max-h-96 mt-3' : 'max-h-0'}`}
        >
          <p className="text-sm leading-relaxed text-black/80">
            {e.details}
          </p>
        </div>
      </div>

      <span className="hidden md:block text-sm text-black/60 whitespace-nowrap self-center">
        {e.period}
      </span>
    </li>
  )
}

export default function App() {
  return (
    // The scroll container: one “screen” tall, vertical scroll, snap to each section
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory bg-white text-black">
      {/* 1) Landing */}
      <Section id="home" className="snap-start min-h-screen flex items-center justify-center">
        <h1 className="text-center font-bold tracking-tight text-5xl sm:text-7xl md:text-8xl">
          Hi, I&apos;m Rickey
        </h1>
      </Section>

      {/* 2) Experience */}
      <Section id="experience" className="snap-start min-h-screen flex items-center">
        <div className="max-w-3xl mx-auto px-6 w-full">
          <h2 className="text-4xl sm:text-5xl font-bold mb-10">Experience</h2>
          <ul className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.12)' }}>
            <ul className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.12)' }}>
            {work.map((item, idx) => (
            <WorkItem key={idx} item={item} idx={idx} />
            ))}
            </ul>
          </ul>
        </div>
      </Section>

      {/* 3) Education */}
      <Section id="education" className="snap-start min-h-screen flex items-center">
        <div className="max-w-3xl mx-auto px-6 w-full">
          <h2 className="text-4xl sm:text-5xl font-bold mb-10">Education</h2>
          <ul className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.12)' }}>
            <ul className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.12)' }}>
            {education.map((e, idx) => (
            <EduItem key={idx} e={e} idx={idx} />
            ))}
            </ul>
          </ul>
        </div>
      </Section>

      {/* Research / Publications */}
        <Section id="research" className="snap-start min-h-screen flex items-center">
          <div className="max-w-3xl mx-auto px-6 w-full">
            <h2 className="text-3xl font-bold mb-8">Research</h2>

            <ol className="list-decimal ml-6 space-y-6">
              {publications.map((p, idx) => {
                // Build the second-line meta text safely
                const parts = []
                const venue = (p.venue ?? '').trim()   // e.g., "Working Paper", or empty/undefined
                if (venue) parts.push(venue)
                if (p.year) parts.push(p.year)
                const meta = parts.length ? `(${parts.join(', ')})` : ''

                return (
                  <li key={idx}>
                    {/* 1) Title (first line) */}
                    <div className="font-semibold leading-snug">{p.title}</div>

                    {/* 2) Meta line (always second line) */}
                    <div className="text-black/60 mt-1 leading-snug">
                      {meta && <span>{meta}</span>}
                      {p.link && (
                        <>
                          {meta ? ' · ' : ''}
                          <a
                            className="underline decoration-2 underline-offset-4"
                            href={p.link}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Link
                          </a>
                        </>
                      )}
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        </Section>



      {/* 5) Connect */}
      <Section id="connect" className="snap-start min-h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <h2 className="text-4xl sm:text-5xl font-bold mb-10">Connect With Me</h2>
          <div className="flex items-center justify-center gap-4">
            {/* Replace # with your real profile URLs and email */}
            <IconButton href="https://www.linkedin.com/in/rickey03/" label="LinkedIn">
              <LinkedInIcon className="w-7 h-7" />
            </IconButton>
            <IconButton href="https://github.com/dlwlsdn03" label="GitHub">
              <GitHubIcon className="w-7 h-7" />
            </IconButton>
            <IconButton href="mailto:me@rickey.co.nz" label="Email">
              <MailIcon className="w-7 h-7" />
            </IconButton>
          </div>
        </div>
      </Section>
    </div>
  )
}
