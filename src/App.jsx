import React from 'react'
import Navbar from './components/Navbar.jsx'
import Section from './components/Section.jsx'
import { useScrollSpy } from './hooks/useScrollSpy.js'
import { work, education, publications } from './data/content.js'

const SECTION_IDS = ['home','work','education','research']

export default function App() {
  const activeId = useScrollSpy(SECTION_IDS, 96)

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar activeId={activeId} />
      {/* Hero */}
      <Section id="home" className="min-h-[90vh]">
        <div className="max-w-3xl mx-auto px-6 pt-24 sm:pt-28 pb-16 sm:pb-24">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight">
            Hi, I&apos;m Rickey
          </h1>
          <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-black/80">
            Minimal, modern portfolio. Scroll to see <span className="font-semibold">Work</span>, <span className="font-semibold">Education</span>, and <span className="font-semibold">Research</span>.
          </p>
        </div>
      </Section>

      {/* Work Experience */}
      <Section id="work" title="Work Experience">
        <div className="max-w-3xl mx-auto px-6">
          <ul className="divide-y" style={{borderColor: 'rgba(0,0,0,0.12)'}}>
            {work.map((item, idx) => (
              <li key={idx} className="py-6 flex gap-4">
                {/* Logo placeholder */}
                <div className="flex-shrink-0 w-12 h-12 border flex items-center justify-center" style={{borderColor:'#000'}}>
                  <span className="sr-only">{item.company} logo</span>
                  <div className="w-6 h-6 bg-black" style={{opacity: 0.05}}></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-lg font-bold">{item.role} · {item.company}</h3>
                    <span className="text-sm text-black/60">{item.period}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-black/80">{item.summary}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Education */}
      <Section id="education" title="Education">
        <div className="max-w-3xl mx-auto px-6">
          <ul className="divide-y" style={{borderColor: 'rgba(0,0,0,0.12)'}}>
            {education.map((e, idx) => (
              <li key={idx} className="py-6 flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 border flex items-center justify-center" style={{borderColor:'#000'}}>
                  <span className="sr-only">{e.school} logo</span>
                  <div className="w-6 h-6 bg-black" style={{opacity: 0.05}}></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-lg font-bold">{e.degree} · {e.school}</h3>
                    <span className="text-sm text-black/60">{e.period}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-black/80">{e.details}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Research / Publications */}
      <Section id="research" title="Research & Publications">
        <div className="max-w-3xl mx-auto px-6">
          <ol className="list-decimal ml-6 space-y-4">
            {publications.map((p, idx) => (
              <li key={idx} className="leading-relaxed">
                <span className="font-semibold">{p.title}</span>{' '}
                <span className="text-black/60">({p.venue}, {p.year})</span>
                {p.link && (
                  <>
                    {' · '}
                    <a className="underline decoration-2 underline-offset-4" href={p.link} target="_blank" rel="noreferrer" aria-label={`Open ${p.title}`}>
                      Link
                    </a>
                  </>
                )}
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <footer className="mt-24 mb-16 px-6">
        <div className="max-w-3xl mx-auto text-sm text-black/60">
          © {new Date().getFullYear()} Rickey. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
