// src/App.jsx
import React, { useRef, useState, useEffect } from 'react'
import Section from './components/Section.jsx'
import { professionalWork, researchWork, education, publications } from './data/content.js'
import { LinkedInIcon, GitHubIcon, MailIcon } from './components/Icons.jsx'

function formatPeriod(startDate, endDate) {
  const fmt = (d) => {
    const [year, month] = d.split('-')
    return new Date(year, month - 1).toLocaleDateString('en-NZ', { month: 'short', year: 'numeric' })
  }
  return `${fmt(startDate)} – ${endDate ? fmt(endDate) : 'Present'}`
}

/* ---------- Theme toggle (persists in localStorage) ---------- */
function useTheme() {
  const [mode, setMode] = useState(() => {
    if (typeof window === 'undefined') return 'system'
    return localStorage.getItem('theme') ?? 'system'
  })

  useEffect(() => {
    const root = document.documentElement

    const apply = (isDark) => {
      if (isDark) root.classList.add('dark')
      else root.classList.remove('dark')
    }

    localStorage.setItem('theme', mode)

    if (mode === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      apply(mq.matches)
      const handler = (e) => apply(e.matches)
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    } else {
      apply(mode === 'dark')
    }
  }, [mode])

  return [mode, setMode]
}

function ThemeToggle() {
  const [mode, setMode] = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Track the actual resolved theme (needed for system mode icon)
  const [resolvedDark, setResolvedDark] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )

  useEffect(() => {
    if (mode === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      setResolvedDark(mq.matches)
      const handler = (e) => setResolvedDark(e.matches)
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    } else {
      setResolvedDark(mode === 'dark')
    }
  }, [mode])

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const options = [
    { value: 'light',  label: 'Light'  },
    { value: 'dark',   label: 'Dark'   },
    { value: 'system', label: 'System' },
  ]

  const icon = resolvedDark ? '/icons/sun.png' : '/icons/moon.png'

  return (
    <div ref={ref} className="fixed top-4 right-4 z-50">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-label="Toggle color theme"
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5
                   w-8 h-8 lg:w-10 lg:h-10
                   transition-[background,color,filter] duration-200
                   focus:outline-none"
        style={{ borderColor: 'var(--fg)' }}
      >
        <img src={icon} alt="" className="w-4 h-4 lg:w-5 lg:h-5 select-none" />
        <svg
          className={`w-3 h-3 text-[color:var(--fg)] transition-transform duration-300
                      ease-[cubic-bezier(0.34,1.56,0.64,1)]
                      ${open ? 'rotate-180' : 'rotate-0'}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      <ul
        role="listbox"
        aria-label="Theme options"
        className={`absolute right-0 mt-1.5 w-24 rounded-xl border overflow-hidden
                    bg-[var(--bg)] shadow-lg
                    transition-all duration-200 ease-out origin-top-right
                    ${open
                      ? 'opacity-100 scale-100 pointer-events-auto'
                      : 'opacity-0 scale-95 pointer-events-none'
                    }`}
        style={{ borderColor: 'var(--border)' }}
      >
        {options.map((opt) => (
          <li
            key={opt.value}
            role="option"
            aria-selected={mode === opt.value}
            onClick={() => { setMode(opt.value); setOpen(false) }}
            className={`flex items-center justify-between px-3 py-2 cursor-pointer
                        text-[10px] md:text-xs
                        transition-colors duration-150 hover:bg-[var(--border)]
                        ${mode === opt.value
                          ? 'text-[color:var(--fg)]'
                          : 'text-[color:var(--muted)]'
                        }`}
          >
            <span>{opt.label}</span>
            {mode === opt.value && (
              <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

const SECTION_IDS = ['home', 'experience', 'education', 'research', 'connect']

function LiquidGlassNav({ containerRef }) {
  const [isVisible, setIsVisible] = useState(false)
  const timerRef = useRef(null)
  const currentIdxRef = useRef(0)
  const animatingRef = useRef(false)
  const dotsRef = useRef([])

  const animateTo = (targetIdx) => {
    if (animatingRef.current) return
    const from = currentIdxRef.current
    if (from === targetIdx) return

    animatingRef.current = true
    const step = targetIdx > from ? 1 : -1
    let i = from

    const hop = () => {
      const prev = i
      i += step
      currentIdxRef.current = i

      if (dotsRef.current[i]) {
        dotsRef.current[i].style.width = '14px'
        dotsRef.current[i].style.height = '14px'
      }

      setTimeout(() => {
        if (dotsRef.current[prev]) {
          dotsRef.current[prev].style.width = '8px'
          dotsRef.current[prev].style.height = '8px'
        }
        if (i !== targetIdx) {
          setTimeout(hop, 55)
        } else {
          animatingRef.current = false
        }
      }, 55)
    }

    hop()
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const sections = SECTION_IDS.map(id => document.getElementById(id)).filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const idx = SECTION_IDS.indexOf(entry.target.id)
            if (idx !== -1) {
              animateTo(idx)
              setIsVisible(true)
              if (timerRef.current) clearTimeout(timerRef.current)
              timerRef.current = setTimeout(() => setIsVisible(false), 2000)
            }
          }
        })
      },
      { root: container, threshold: 0.5 }
    )

    sections.forEach(s => observer.observe(s))
    return () => {
      observer.disconnect()
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [containerRef])

  return (
    <>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="goo-nav" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 14 -5"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40
                    transition-opacity duration-500 ease-in-out
                    ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 16px',
            borderRadius: '100px',
            background: 'rgba(255,255,255,0.18)',
            border: '0.5px solid rgba(255,255,255,0.35)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 4px 24px rgba(0,0,0,0.12)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', filter: 'url(#goo-nav)' }}>
            {SECTION_IDS.map((_, idx) => (
              <div
                key={idx}
                ref={el => dotsRef.current[idx] = el}
                style={{
                  borderRadius: '50%',
                  flexShrink: 0,
                  background: 'rgba(255,255,255,0.95)',
                  transition: 'width 0.35s cubic-bezier(0.34,1.56,0.64,1), height 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                  width: idx === 0 ? '14px' : '8px',
                  height: idx === 0 ? '14px' : '8px',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

function IconButton({ href, label, children }) {
  return (
    <a
      href={href}
      aria-label={label}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noreferrer' : undefined}
      className="group inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16
                 border rounded-full text-[color:var(--fg)] bg-transparent
                 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                 hover:-translate-y-1.5 
                 hover:shadow-[0_10px_20px_-10px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_10px_20px_-10px_rgba(255,255,255,0.2)]
                 hover:ring-4 hover:ring-black/5 dark:hover:ring-white/10
                 active:scale-90 active:ring-0 focus:outline-none"
      style={{ borderColor: 'var(--border)' }}
    >
      <span className="transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] 
                       group-hover:scale-110">
        {children}
      </span>
    </a>
  )
}

function groupWorkByCompany(workArray) {
  const groups = {}
  for (const w of workArray) {
    if (!groups[w.company]) {
      groups[w.company] = {
        company: w.company,
        logo: w.logo,
        logoDark: w.logoDark,
        link: w.link,
        roles: []
      }
    }
    groups[w.company].roles.push(w)
  }
  return Object.values(groups)
}

function CompanyGroup({ group }) {
  const HeaderWrapper = group.link ? 'a' : 'div'
  const wrapperProps = group.link ? {
    href: group.link,
    target: '_blank',
    rel: 'noreferrer',
    className: "flex items-center gap-1.5 md:gap-2 lg:gap-3 mb-0 hover:opacity-70 transition-opacity cursor-pointer w-fit"
  } : {
    className: "flex items-center gap-1.5 md:gap-2 lg:gap-3 mb-0"
  }

  return (
    <li className="py-3 md:py-4 lg:py-6">
      <HeaderWrapper {...wrapperProps}>
        <div className="w-6 h-6 md:w-8 md:h-8 lg:w-11 lg:h-11 flex items-center justify-center shrink-0">
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
        <h3 className="text-xs md:text-sm lg:text-base font-bold">{group.company}</h3>
      </HeaderWrapper>

      <ul className="ml-8 md:ml-10 lg:ml-14 space-y-2 md:space-y-3 lg:space-y-4 mt-0.5">
        {group.roles.map((role, idx) => {
          const [open, setOpen] = useState(false)
          const descId = `company-${group.company}-role-${idx}`

          return (
            <li key={idx} className="leading-tight">
              <button
                type="button"
                onClick={() => setOpen(v => !v)}
                aria-controls={descId}
                aria-expanded={open}
                className="flex items-center justify-between w-full text-left bg-transparent p-0 text-[10px] md:text-xs lg:text-sm
                           focus:outline-none focus:ring-transparent
                           hover:opacity-70 transition-opacity"
              >
                <span>{role.role}</span>
                
                <svg 
                  className={`w-3 h-3 lg:w-4 lg:h-4 text-[var(--muted)] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                             ${open ? 'rotate-180' : 'rotate-0'}`} 
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <p className="text-[8px] md:text-[10px] lg:text-xs text-[var(--muted-60)] mt-0.5">
                {formatPeriod(role.startDate, role.endDate)}
              </p>

              <div
                id={descId}
                className={`overflow-hidden transition-[max-height] duration-300 ease-out
                            ${open ? 'max-h-96 mt-2' : 'max-h-0'}`}
              >
                <p className="text-[10px] md:text-[11px] lg:text-sm leading-relaxed whitespace-pre-line">
                  {role.summary}
                </p>
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

  const HeaderWrapper = e.link ? 'a' : 'div'
  const wrapperProps = e.link ? {
    href: e.link,
    target: '_blank',
    rel: 'noreferrer',
    className: "flex items-center gap-1.5 md:gap-2 lg:gap-3 mb-0 hover:opacity-70 transition-opacity cursor-pointer w-fit"
  } : {
    className: "flex items-center gap-1.5 md:gap-2 lg:gap-3 mb-0"
  }

  return (
    <li className="py-3 md:py-4 lg:py-6">
      <HeaderWrapper {...wrapperProps}>
        <div className="w-6 h-6 md:w-8 md:h-8 lg:w-11 lg:h-11 flex items-center justify-center shrink-0">
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

        <h3 className="text-xs md:text-sm lg:text-base font-bold">
          {e.school}
        </h3>
      </HeaderWrapper>

      <div className="ml-8 md:ml-10 lg:ml-14 mt-0.5">
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          aria-controls={descId}
          className="flex items-center justify-between w-full text-left p-0 bg-transparent text-[10px] md:text-xs lg:text-sm
                     focus:outline-none focus:ring-transparent
                     hover:opacity-70 transition-opacity"
        >
          <span>{e.degree}</span>

          <svg 
            className={`w-3 h-3 lg:w-4 lg:h-4 text-[var(--muted)] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                       ${open ? 'rotate-180' : 'rotate-0'}`} 
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <p className="text-[8px] md:text-[10px] lg:text-xs text-[var(--muted-60)] mt-0.5">
          {formatPeriod(e.startDate, e.endDate)}
        </p>

        <div
          id={descId}
          className={`overflow-hidden transition-[max-height] duration-300 ease-out
                      ${open ? 'max-h-[800px] mt-2' : 'max-h-0'}`}
        >
          <div className="text-[10px] md:text-[11px] lg:text-sm leading-relaxed">
            {e.honours && <p className="mb-4">{e.honours}</p>}

            {e.thesisTitle && (
              <p className="">
                <span className="">{e.thesisLabel}</span>{' '}
                <a 
                  href={e.thesisLink}
                  target="_blank"
                  rel="noreferrer"
                  className="italic hover:opacity-70 transition-opacity"
                >
                  {e.thesisTitle}
                </a>
              </p>
            )}

            <p className="whitespace-pre-line">
              {e.details}
            </p>
          </div>
        </div>
      </div>
    </li>
  )
}

function ExperienceSubsection({ workArray }) {
  if (!workArray || workArray.length === 0) return null

  const sorted = [...workArray].sort((a, b) => {
    const aEnd = a.endDate ?? '9999-99'
    const bEnd = b.endDate ?? '9999-99'
    return bEnd.localeCompare(aEnd) || b.startDate.localeCompare(a.startDate)
  })

  return (
    <div className="mb-7 md:mb-8 lg:mb-12">
      <ul className="divide-y divide-[var(--border)]">
        {groupWorkByCompany(sorted).map((group, idx) => (
          <CompanyGroup key={idx} group={group} />
        ))}
      </ul>
    </div>
  )
}

export default function App() {
  const scrollContainerRef = useRef(null)

  const researchAreas = [
    "Financial Econometrics",
    "Econometric Theory",
    "Empirical Asset Pricing",
    "Statistical Theory"
  ]

  return (
    <>
      <ThemeToggle />
      <LiquidGlassNav containerRef={scrollContainerRef} />

      <div 
        ref={scrollContainerRef}
        className="h-dvh overflow-y-auto 
                   bg-[var(--bg)] text-[color:var(--fg)] relative
                   [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
      
        {/* Landing */}
        <Section id="home" className="min-h-screen flex items-center justify-center">
          <h1 className="text-center font-bold tracking-tight text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl">
            Hi, I&apos;m Rickey
          </h1>
        </Section>

        {/* Experience */}
        <Section id="experience" className="min-h-screen flex items-center">
          <div className="max-w-3xl lg:max-w-4xl mx-auto px-6 lg:px-8 w-full">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 md:mb-7 lg:mb-10">Experience</h2>
            
            <ExperienceSubsection workArray={[...researchWork, ...professionalWork]} />
          </div>
        </Section>

        {/* Education */}
        <Section id="education" className="min-h-screen flex items-center">
          <div className="max-w-3xl lg:max-w-4xl mx-auto px-6 lg:px-8 w-full">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 lg:mb-8">Education</h2>
            <ul className="divide-y divide-[var(--border)]">
              {education.map((e, idx) => (
                <EduItem key={idx} e={e} idx={idx} />
              ))}
            </ul>
          </div>
        </Section>

        {/* Research / Publications */}
        <Section id="research" className="min-h-screen flex items-center">
          <div className="max-w-3xl lg:max-w-4xl mx-auto px-6 lg:px-8 w-full">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 lg:mb-8">Research</h2>

            <div className="mb-6 md:mb-7 lg:mb-10">
              <div className="flex flex-wrap gap-1.5 md:gap-2 lg:gap-3">
                {researchAreas.map((area, idx) => (
                  <span 
                    key={idx} 
                    className="px-2.5 py-1 md:px-3 md:py-1.5 lg:px-4 lg:py-2
                               border border-[var(--border)] rounded-full 
                               text-[10px] md:text-[11px] lg:text-sm
                               hover:bg-[var(--border)] transition-colors cursor-default"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            <ol className="list-decimal ml-5 lg:ml-6 space-y-4 md:space-y-5 lg:space-y-7">
              {publications.map((p, idx) => (
                <li key={idx}>
                  <div className="leading-snug text-[10px] md:text-xs lg:text-sm">
                    {p.link
                      ? <a href={p.link} target="_blank" rel="noreferrer" className="hover:opacity-70 transition-opacity">
                          &ldquo;{p.paperTitle}&rdquo;
                        </a>
                      : <>&ldquo;{p.paperTitle}&rdquo;</>
                    }
                    {p.coauthor && (
                      <span className="font-normal"> (with {p.coauthor})</span>
                    )}
                  </div>
                  {(p.status || p.journal) && (
                    <div className="italic text-[10px] md:text-xs lg:text-sm mt-0.5">
                      {p.status && p.journal
                        ? <>{p.status} <span className="underline">{p.journal}</span></>
                        : p.status || p.journal
                      }
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </Section>

        {/* Connect */}
        <Section id="connect" className="min-h-screen flex items-center justify-center">
          <div className="text-center px-6">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-5 md:mb-6 lg:mb-8">Connect With Me</h2>
            <div className="flex items-center justify-center gap-4 lg:gap-6">
              <IconButton href="https://www.linkedin.com/in/rickey03/" label="LinkedIn">
                <LinkedInIcon className="w-4 h-4 md:w-5 md:h-5 lg:w-7 lg:h-7" />
              </IconButton>
              <IconButton href="https://github.com/dlwlsdn03" label="GitHub">
                <GitHubIcon className="w-4 h-4 md:w-5 md:h-5 lg:w-7 lg:h-7" />
              </IconButton>
              <IconButton href="mailto:me@rickey.co.nz" label="Email">
                <MailIcon className="w-4 h-4 md:w-5 md:h-5 lg:w-7 lg:h-7" />
              </IconButton>
            </div>
          </div>
        </Section>
      </div>
    </>
  )
}
