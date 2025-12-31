// src/App.jsx
import React, { useRef, useState, useEffect } from 'react'
import Section from './components/Section.jsx'
import { work, education, publications } from './data/content.js'
import { LinkedInIcon, GitHubIcon, MailIcon } from './components/Icons.jsx'

/* ---------- Theme toggle (persists in localStorage) ---------- */
function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light'
    const saved = localStorage.getItem('theme')
    return saved ? saved : 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggle = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))
  return [theme, toggle]
}

function ThemeToggle() {
  const [theme, toggle] = useTheme()
  const icon = theme === 'dark' ? '/icons/sun.png' : '/icons/moon.png'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle color theme"
      className="fixed top-4 right-4 z-50 inline-flex items-center justify-center
                 w-10 h-10 transition-[background,color,filter] duration-200
                 focus:outline-none"
      style={{ borderColor: 'var(--fg)' }}
    >
      <img src={icon} alt="" className="w-5 h-5 select-none" />
    </button>
  )
}

function ScrollIndicator({ containerRef }) {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el
      if (scrollHeight <= clientHeight) {
        setProgress(0)
        return
      }
      
      const p = (scrollTop / (scrollHeight - clientHeight)) * 100
      setProgress(p)
    }
    
    // Use passive listener for better mobile performance
    el.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => el.removeEventListener('scroll', handleScroll, { passive: true })
  }, [containerRef])

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 p-[3px] rounded-full
                    backdrop-blur-xl bg-white/20 dark:bg-white/10
                    shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),0_8px_16px_rgba(0,0,0,0.1)]
                    border border-white/30"
    >
      <div className="w-32 h-1.5 rounded-full overflow-hidden bg-white/30 dark:bg-white/10
                      shadow-[inset_0_0.5px_0_rgba(0,0,0,0.2)]"
      >
        <div 
          className="h-full bg-[var(--fg)] opacity-80 transition-[width] duration-100 ease-out will-change-[width]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

/* ---------- Small UI helpers ---------- */
function IconButton({ href, label, children }) {
  return (
    <a
      href={href}
      aria-label={label}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noreferrer' : undefined}
      className="inline-flex items-center justify-center w-14 h-14 border rounded-full
                 transition-[filter] duration-200 focus:outline-none"
      style={{ borderColor: 'var(--fg)' }}
    >
      {children}
    </a>
  )
}

// ---- Group work items by company ----
function groupWorkByCompany(workArray) {
  const groups = {}
  for (const w of workArray) {
    if (!groups[w.company]) {
      groups[w.company] = {
        company: w.company,
        logo: w.logo,
        logoDark: w.logoDark,
        roles: []
      }
    }
    groups[w.company].roles.push(w)
  }
  return Object.values(groups)
}

function CompanyGroup({ group }) {
  return (
    <li className="py-6">
      {/* Top row: logo + company name */}
      <div className="flex items-center gap-4 mb-0">
        <div className="w-10 h-10 flex items-center justify-center shrink-0">
          <img
            src={`/logos/${group.logo}`}
            alt={`${group.company} logo`}
            className="max-w-full max-h-full object-contain dark:hidden"
          />
          <img
            src={`/logos/${group.logoDark ?? group.logo}`}
            alt=""
            aria-hidden="true"
            className="max-w-full max-h-full object-contain hidden dark:block"
          />
        </div>

        <h3 className="text-xl md:text-xl font-bold">{group.company}</h3>
      </div>

      {/* Role list */}
      <ul className="ml-14 space-y-4">
        {group.roles.map((role, idx) => {
          const [open, setOpen] = useState(false)
          const descId = `company-${group.company}-role-${idx}`

          return (
            <li key={idx} className="leading-tight">
              {/* Role button */}
              <button
                type="button"
                onClick={() => setOpen(v => !v)}
                aria-controls={descId}
                aria-expanded={open}
                className="text-left bg-transparent p-0 text-base
                           focus:outline-none focus:ring-transparent font-medium
                           hover:opacity-70 transition-opacity"
              >
                {role.role}
              </button>

              {/* Period */}
              <p className="text-xs text-[var(--muted-60)] mt-0.5">{role.period}</p>

              {/* Description dropdown */}
              <div
                id={descId}
                className={`overflow-hidden transition-[max-height] duration-300 ease-out
                           ${open ? "max-h-96 mt-2" : "max-h-0"}`}
              >
                {role.summary && (
                  <p className="text-xs leading-relaxed whitespace-pre-line text-[var(--muted)]">
                    {role.summary}
                  </p>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </li>
  )
}

function EduItem({ e, idx }) {
  const [open, setOpen] = useState(false)
  const descId = `edu-desc-${idx}`

  return (
    <li className="py-5">
      {/* Top row: logo + school name (static, bold) */}
      <div className="flex items-center gap-4 mb-0">
        <div className="w-10 h-10 flex items-center justify-center shrink-0">
          <img
            src={`/logos/${e.logo}`}
            alt={`${e.school} logo`}
            className="max-w-full max-h-full object-contain dark:hidden"
            loading="lazy"
          />
          <img
            src={`/logos/${e.logoDark ?? e.logo}`}
            alt="" aria-hidden="true"
            className="max-w-full max-h-full object-contain hidden dark:block"
            loading="lazy"
          />
        </div>

        {/* School Name is now just text, BOLD */}
        <h3 className="text-xl md:text-xl font-bold">
          {e.school}
        </h3>
      </div>

      {/* Details below: Degree becomes the Button */}
      <div className="ml-14">
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          aria-controls={descId}
          // Degree title: text-base, not bold, clickable styling
          className="text-left p-0 bg-transparent text-base font-medium
                     focus:outline-none focus:ring-transparent
                     hover:opacity-70 transition-opacity"
        >
          {e.degree}
        </button>
        
        <p className="text-xs text-[var(--muted-60)] mt-0.5">{e.period}</p>

        <div
          id={descId}
          className={`overflow-hidden transition-[max-height] duration-300 ease-out
                      ${open ? 'max-h-96 mt-2' : 'max-h-0'}`}
        >
          <p className="text-xs leading-relaxed whitespace-pre-line">
            {e.details}
          </p>
        </div>
      </div>
    </li>
  )
}

export default function App() {
  // We need a ref to the container that actually scrolls
  const scrollContainerRef = useRef(null)

  return (
    <>
      <ThemeToggle />
      <ScrollIndicator containerRef={scrollContainerRef} />

      {/* Attach ref here because overflow-y-auto is on this div */}
      <div 
        ref={scrollContainerRef}
        className="h-dvh overflow-y-auto md:overflow-y-scroll md:snap-y md:snap-mandatory
                   bg-[var(--bg)] text-[color:var(--fg)] relative"
      >
      
        {/* 1) Landing */}
        <Section id="home" className="snap-none md:snap-start min-h-screen flex items-center justify-center">
          <h1 className="text-center font-bold tracking-tight text-4xl sm:text-6xl md:text-7xl">
            Hi, I&apos;m Rickey
          </h1>
        </Section>

        {/* 2) Experience */}
        <Section id="experience" className="snap-none md:snap-start min-h-screen flex items-center">
          <div className="max-w-3xl mx-auto px-6 w-full">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8">Experience</h2>
            <ul className="divide-y divide-[var(--border)]">
              {groupWorkByCompany(work).map((group, idx) => (
                <CompanyGroup key={idx} group={group} />
              ))}
            </ul>
          </div>
        </Section>

        {/* 3) Education */}
        <Section id="education" className="snap-none md:snap-start min-h-screen flex items-center">
          <div className="max-w-3xl mx-auto px-6 w-full">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8">Education</h2>
            <ul className="divide-y divide-[var(--border)]">
              {education.map((e, idx) => (
                <EduItem key={idx} e={e} idx={idx} />
              ))}
            </ul>
          </div>
        </Section>

        {/* 4) Research / Publications */}
        <Section id="research" className="snap-none md:snap-start min-h-screen flex items-center">
          <div className="max-w-3xl mx-auto px-6 w-full">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8">Research</h2>

            <ol className="list-decimal ml-6 space-y-4">
              {publications.map((p, idx) => {
                const parts = []
                const venue = (p.venue ?? '').trim()
                if (venue) parts.push(venue)
                if (p.year) parts.push(p.year)
                const meta = parts.length ? `(${parts.join(', ')})` : ''
                return (
                  <li key={idx}>
                    <div className="font-semibold leading-snug text-sm">{p.title}</div>
                    <div className="mt-1 leading-snug text-[var(--muted-60)] text-xs">
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
        <Section id="connect" className="snap-none md:snap-start min-h-screen flex items-center justify-center">
          <div className="text-center px-6">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8">Connect With Me</h2>
            <div className="flex items-center justify-center gap-4">
              <IconButton href="https://www.linkedin.com/in/rickey03/" label="LinkedIn">
                <LinkedInIcon className="w-6 h-6" />
              </IconButton>
              <IconButton href="https://github.com/dlwlsdn03" label="GitHub">
                <GitHubIcon className="w-6 h-6" />
              </IconButton>
              <IconButton href="mailto:me@rickey.co.nz" label="Email">
                <MailIcon className="w-6 h-6" />
              </IconButton>
            </div>
          </div>
        </Section>
      </div>
    </>
  )
}