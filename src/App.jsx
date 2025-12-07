// src/App.jsx
import React from 'react'
import Section from './components/Section.jsx'
import { work, education, publications } from './data/content.js'
import { LinkedInIcon, GitHubIcon, MailIcon } from './components/Icons.jsx'

/* ---------- Theme toggle (persists in localStorage) ---------- */
function useTheme() {
  const [theme, setTheme] = React.useState(() => {
    if (typeof window === 'undefined') return 'light'
    const saved = localStorage.getItem('theme')
    // if there's a saved value, use it; otherwise always default to light
    return saved ? saved : 'light'
  })

  React.useEffect(() => {
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

/* ---------- Small UI helpers ---------- */
function IconButton({ href, label, children }) {
  return (
    <a
      href={href}
      aria-label={label}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noreferrer' : undefined}
      className="inline-flex items-center justify-center w-16 h-16 border rounded-full
                 transition-[filter] duration-200 focus:outline-none"
      style={{ borderColor: 'var(--fg)' }}
    >
      {children}
    </a>
  )
}

function LogoBox({ src, alt }) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className="w-12 h-12 object-contain"
        loading="lazy"
      />
    )
  }
  return (
    <div className="w-12 h-12 border flex items-center justify-center" style={{ borderColor: 'var(--fg)' }}>
      <div className="w-6 h-6 bg-black opacity-5" />
      <span className="sr-only">{alt}</span>
    </div>
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
    <li className="py-8">
      {/* Top row: logo + company name */}
      <div className="flex items-center gap-4 mb-0">
        <div className="w-12 h-12 flex items-center justify-center shrink-0">
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

        <h3 className="text-2xl md:text-2xl font-bold">{group.company}</h3>
      </div>

      {/* Role list */}
      <ul className="ml-16 space-y-6">
        {group.roles.map((role, idx) => {
          const [open, setOpen] = React.useState(false)
          const descId = `company-${group.company}-role-${idx}`

          return (
            <li key={idx} className="leading-tight">
              {/* Role button (click to expand) */}
              <button
                type="button"
                onClick={() => setOpen(v => !v)}
                aria-controls={descId}
                aria-expanded={open}
                className="text-left bg-transparent p-0 font-bold text-lg md:text-lg
                           focus:outline-none focus:ring-transparent"
              >
                {role.role}
              </button>

              {/* Period */}
              <p className="text-sm text-[var(--muted-60)] mt-0.5">{role.period}</p>

              {/* Description dropdown */}
              <div
                id={descId}
                className={`overflow-hidden transition-[max-height] duration-300 ease-out
                           ${open ? "max-h-96 mt-2" : "max-h-0"}`}
              >
                {role.summary && (
                  <p className="text-sm leading-relaxed whitespace-pre-line text-[var(--muted)]">
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

function WorkItem({ item, idx }) {
  const [open, setOpen] = React.useState(false)
  const descId = `work-desc-${idx}`

  return (
    <li
      className="py-6 grid gap-4 items-start grid-cols-[48px_1fr] md:grid-cols-[48px_1fr_auto]"
    >
      {/* 48×48 logo box */}
      <div className="w-12 h-12 flex items-center justify-center shrink-0 mt-1">
        {/* Light mode logo */}
        <img
          src={`/logos/${item.logo}`}
          alt={`${item.company} logo`}
          className="max-w-full max-h-full object-contain dark:hidden"
          loading="lazy"
        />
        {/* Dark mode logo */}
        <img
          src={`/logos/${item.logoDark ?? item.logo}`}
          alt="" aria-hidden="true"
          className="max-w-full max-h-full object-contain hidden dark:block"
          loading="lazy"
        />
      </div>

      <div className="min-w-0 leading-tight">
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          aria-controls={descId}
          className="text-left p-0 bg-transparent text-xl md:text-2xl font-bold
                     focus:outline-none focus:ring-1 focus:ring-transparent
                     hover:"
        >
          {item.role}
        </button>

        <p className="text-sm mt-0.5 text-[var(--muted)]">{item.company}</p>

        <div
          id={descId}
          className={`overflow-hidden transition-[max-height] duration-300 ease-out
                      ${open ? 'max-h-96 mt-3' : 'max-h-0'}`}
        >
          <p className="text-sm leading-relaxed text-[var(--muted)] whitespace-pre-line">
            {item.summary}
          </p>
        </div>
      </div>

      <span className="hidden md:block text-sm whitespace-nowrap self-start mt-1 text-[var(--muted-60)]">
        {item.period}
      </span>
    </li>
  )
}


function EduItem({ e, idx }) {
  const [open, setOpen] = React.useState(false)
  const descId = `edu-desc-${idx}`

  return (
    <li className="py-6">
      {/* Top row: logo + school name */}
      <div className="flex items-center gap-4 mb-0">
        <div className="w-12 h-12 flex items-center justify-center shrink-0">
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

        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          aria-controls={descId}
          className="text-left p-0 bg-transparent text-xl md:text-2xl font-bold
                     focus:outline-none focus:ring-1 focus:ring-transparent
                     hover:"
        >
          {e.school}
        </button>
      </div>

      {/* Details below */}
      <div className="ml-16">
        <p className="font-bold text-lg">{e.degree}</p>
        <p className="text-sm text-[var(--muted-60)] mt-0.5">{e.period}</p>

        <div
          id={descId}
          className={`overflow-hidden transition-[max-height] duration-300 ease-out
                      ${open ? 'max-h-96 mt-3' : 'max-h-0'}`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-line">
            {e.details}
          </p>
        </div>
      </div>
    </li>
  )
}

export default function App() {
  return (
    <>
      <ThemeToggle />

      {/* Snap container uses theme variables instead of fixed black/white */}
      <div className="h-dvh overflow-y-scroll snap-y snap-mandatory
                      bg-[var(--bg)] text-[color:var(--fg)]">
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
            <ul className="divide-y divide-[var(--border)]">
              {groupWorkByCompany(work).map((group, idx) => (
                <CompanyGroup key={idx} group={group} />
              ))}
            </ul>

          </div>
        </Section>

        {/* 3) Education */}
        <Section id="education" className="snap-start min-h-screen flex items-center">
          <div className="max-w-3xl mx-auto px-6 w-full">
            <h2 className="text-4xl sm:text-5xl font-bold mb-10">Education</h2>
            <ul className="divide-y divide-[var(--border)]">
              {education.map((e, idx) => (
                <EduItem key={idx} e={e} idx={idx} />
              ))}
            </ul>
          </div>
        </Section>

        {/* 4) Research / Publications */}
        <Section id="research" className="snap-start min-h-screen flex items-center">
          <div className="max-w-3xl mx-auto px-6 w-full">
            <h2 className="text-4xl sm:text-5xl font-bold mb-10">Research</h2>

            <ol className="list-decimal ml-6 space-y-6">
              {publications.map((p, idx) => {
                const parts = []
                const venue = (p.venue ?? '').trim()
                if (venue) parts.push(venue)
                if (p.year) parts.push(p.year)
                const meta = parts.length ? `(${parts.join(', ')})` : ''
                return (
                  <li key={idx}>
                    <div className="font-semibold leading-snug">{p.title}</div>
                    <div className="mt-1 leading-snug text-[var(--muted-60)]">
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
    </>
  )
}
