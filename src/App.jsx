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
        className="w-12 h-12 object-contain border border-black"
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
            {work.map((item, idx) => (
              <li key={idx} className="py-6 flex gap-4">
                <LogoBox src={`/logos/${item.logo}`} alt={`${item.company} logo`} />
                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-xl font-bold">{item.role} · {item.company}</h3>
                    <span className="text-sm text-black/60">{item.period}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-black/80">{item.summary}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* 3) Education */}
      <Section id="education" className="snap-start min-h-screen flex items-center">
        <div className="max-w-3xl mx-auto px-6 w-full">
          <h2 className="text-4xl sm:text-5xl font-bold mb-10">Education</h2>
          <ul className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.12)' }}>
            {education.map((e, idx) => (
              <li key={idx} className="py-6 flex gap-4">
                <LogoBox sr={`${e.school} logo`} />
                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-xl font-bold">{e.degree} · {e.school}</h3>
                    <span className="text-sm text-black/60">{e.period}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-black/80">{e.details}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* 4) Research */}
      <Section id="research" className="snap-start min-h-screen flex items-center">
        <div className="max-w-3xl mx-auto px-6 w-full">
          <h2 className="text-4xl sm:text-5xl font-bold mb-10">Research &amp; Publications</h2>
          <ol className="list-decimal ml-6 space-y-4">
            {publications.map((p, idx) => (
              <li key={idx} className="leading-relaxed">
                <span className="font-semibold">{p.title}</span>{' '}
                <span className="text-black/60">({p.venue}, {p.year})</span>
                {p.link && (
                  <>
                    {' · '}
                    <a className="underline decoration-2 underline-offset-4" href={p.link} target="_blank" rel="noreferrer">
                      Link
                    </a>
                  </>
                )}
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* 5) Connect */}
      <Section id="connect" className="snap-start min-h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <h2 className="text-4xl sm:text-5xl font-bold mb-10">Connect</h2>
          <div className="flex items-center justify-center gap-4">
            {/* Replace # with your real profile URLs and email */}
            <IconButton href="#" label="LinkedIn">
              <LinkedInIcon className="w-7 h-7" />
            </IconButton>
            <IconButton href="#" label="GitHub">
              <GitHubIcon className="w-7 h-7" />
            </IconButton>
            <IconButton href="mailto:you@example.com" label="Email">
              <MailIcon className="w-7 h-7" />
            </IconButton>
          </div>
        </div>
      </Section>
    </div>
  )
}
