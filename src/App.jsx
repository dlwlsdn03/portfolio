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

function formatYear(date) {
  return date ? date.split('-')[0] : ''
}

function formatYearRange(startDate, endDate) {
  const startYear = formatYear(startDate)
  const endYear = formatYear(endDate)

  if (!endYear) return `${startYear}-`
  if (startYear === endYear) return startYear

  return `${startYear}-${endYear.slice(-2)}`
}

function compareYearMonthDesc(a, b) {
  if (a === b) return 0
  if (!a) return -1
  if (!b) return 1
  return b.localeCompare(a)
}

function DateRange({ startDate, endDate }) {
  return (
    <span className="inline-flex items-center shrink-0 whitespace-nowrap w-[7ch] text-left tabular-nums text-[8px] md:text-[10px] lg:text-xs text-[var(--muted-60)]">
      {formatYearRange(startDate, endDate)}
    </span>
  )
}

function formatEducationCompletion(endDate) {
  if (!endDate) return 'Expected'

  const [year, month] = endDate.split('-').map(Number)
  const monthEnd = new Date(year, month, 0)
  const today = new Date()
  const label = monthEnd < today ? 'Graduated' : 'Expected'

  return `${label} ${year}`
}

function EducationCompletion({ endDate }) {
  return (
    <span className="shrink-0 tabular-nums text-[8px] md:text-[10px] lg:text-xs text-[var(--muted-60)]">
      {formatEducationCompletion(endDate)}
    </span>
  )
}

const THEME_STORAGE_KEY = 'theme'
const THEME_USER_STORAGE_KEY = 'theme-user-selected'
const DEFAULT_THEME_MODE = 'system'
const THEME_MODES = ['light', 'dark', 'system']

/* ---------- Theme toggle (persists in localStorage) ---------- */
function useTheme() {
  const [mode, setMode] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_THEME_MODE

    const hasSelectedTheme = localStorage.getItem(THEME_USER_STORAGE_KEY) === 'true'
    const savedMode = hasSelectedTheme ? localStorage.getItem(THEME_STORAGE_KEY) : null
    return THEME_MODES.includes(savedMode) ? savedMode : DEFAULT_THEME_MODE
  })

  useEffect(() => {
    const root = document.documentElement

    const apply = (isDark) => {
      if (isDark) root.classList.add('dark')
      else root.classList.remove('dark')
    }

    localStorage.setItem(THEME_STORAGE_KEY, mode)

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
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
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

  useEffect(() => {
    if (!open) return

    const handler = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  const options = [
    { value: 'dark',   label: 'Dark'   },
    { value: 'light',  label: 'Light'  },
    { value: 'system', label: 'System' },
  ]

  const icon = resolvedDark ? '/icons/sun.png' : '/icons/moon.png'

  return (
    <div ref={ref} className="fixed top-4 right-4 z-50">
      <div
        className={`theme-morph liquid-glass ${open ? 'theme-morph--open' : 'theme-morph--closed'}`}
      >
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          aria-label="Toggle color theme"
          aria-haspopup="menu"
          aria-expanded={open}
          className="theme-morph-trigger"
        >
          <span className="theme-morph-icon-wrap">
            <img src={icon} alt="" className="theme-morph-icon select-none" />
          </span>
        </button>

        <ul
          role="menu"
          aria-label="Theme options"
          aria-hidden={!open}
          className="theme-morph-menu"
        >
          {options.map((opt, index) => (
            <li key={opt.value} role="none">
              <button
                type="button"
                role="menuitemradio"
                aria-checked={mode === opt.value}
                tabIndex={open ? 0 : -1}
                onClick={() => {
                  localStorage.setItem(THEME_USER_STORAGE_KEY, 'true')
                  setMode(opt.value)
                  setOpen(false)
                }}
                className={`theme-morph-option liquid-glass-option
                            ${mode === opt.value ? 'theme-morph-option--active' : ''}`}
                style={{ '--option-index': index }}
              >
                <span>{opt.label}</span>
                <svg className="theme-morph-check" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'education', label: 'Education' },
  { id: 'research', label: 'Research' },
  { id: 'academic', label: 'Academic' },
  { id: 'professional', label: 'Professional' },
  { id: 'connect', label: 'Connect' },
]

const SECTION_IDS = SECTIONS.map(section => section.id)
const SCROLL_NAV_IDLE_TIMEOUT = 2800

function LiquidGlassNav({ containerRef }) {
  const [isVisible, setIsVisible] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const timerRef = useRef(null)
  const ref = useRef(null)
  const currentIdxRef = useRef(0)
  const animatingRef = useRef(false)

  const showThenFade = () => {
    setIsVisible(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setIsVisible(false)
      setOpen(false)
    }, SCROLL_NAV_IDLE_TIMEOUT)
  }

  const animateTo = (targetIdx) => {
    if (animatingRef.current) return
    const from = currentIdxRef.current
    if (from === targetIdx) return

    animatingRef.current = true
    const step = targetIdx > from ? 1 : -1
    let i = from

    const hop = () => {
      i += step
      currentIdxRef.current = i
      setActiveIdx(i)

      setTimeout(() => {
        if (i !== targetIdx) {
          setTimeout(hop, 55)
        } else {
          animatingRef.current = false
        }
      }, 55)
    }

    hop()
  }

  const closeAfterNavigation = () => {
    setOpen(false)
    showThenFade()
  }

  const navigateToSection = (section, idx) => {
    const target = document.getElementById(section.id)
    if (!target) return

    currentIdxRef.current = idx
    setActiveIdx(idx)
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    closeAfterNavigation()
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const sections = SECTION_IDS.map(id => document.getElementById(id)).filter(Boolean)
    const handleScroll = () => {
      const targetIdx = Math.max(
        0,
        Math.min(SECTION_IDS.length - 1, Math.round(container.scrollTop / container.clientHeight))
      )
      animateTo(targetIdx)
      if (!open) showThenFade()
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const idx = SECTION_IDS.indexOf(entry.target.id)
            if (idx !== -1) {
              animateTo(idx)
              if (!open) showThenFade()
            }
          }
        })
      },
      { root: container, threshold: 0.5 }
    )

    container.addEventListener('scroll', handleScroll, { passive: true })
    sections.forEach(s => observer.observe(s))
    return () => {
      container.removeEventListener('scroll', handleScroll)
      observer.disconnect()
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [containerRef, open])

  useEffect(() => {
    if (!open) return

    const collapseOnScrollIntent = () => {
      setOpen(false)
      showThenFade()
    }
    const options = { passive: true, capture: true }

    document.addEventListener('wheel', collapseOnScrollIntent, options)
    document.addEventListener('touchmove', collapseOnScrollIntent, options)
    return () => {
      document.removeEventListener('wheel', collapseOnScrollIntent, options)
      document.removeEventListener('touchmove', collapseOnScrollIntent, options)
    }
  }, [open])

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
        if (isVisible) showThenFade()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isVisible])

  useEffect(() => {
    if (!open) return

    setIsVisible(true)
    if (timerRef.current) clearTimeout(timerRef.current)

    const handler = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        showThenFade()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  const handleToggle = () => {
    if (!isVisible) return
    setOpen(v => !v)
  }

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
        ref={ref}
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40
                    transition-opacity duration-500 ease-in-out
                    ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div
          className={`scroll-morph liquid-glass ${open ? 'scroll-morph--open' : 'scroll-morph--closed'}`}
        >
          <button
            type="button"
            aria-label="Open page navigator"
            aria-haspopup="menu"
            aria-expanded={open}
            className="scroll-morph-trigger"
            onClick={handleToggle}
          >
            <span className="scroll-morph-dots" aria-hidden="true">
              {SECTIONS.map((section, idx) => (
                <span
                  key={section.id}
                  className={`scroll-morph-dot ${activeIdx === idx ? 'scroll-morph-dot--active' : ''}`}
                />
              ))}
            </span>
          </button>

          <ul
            role="menu"
            aria-label="Page sections"
            aria-hidden={!open}
            className="scroll-morph-menu"
          >
            {SECTIONS.map((section, idx) => (
              <li key={section.id} role="none">
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={activeIdx === idx}
                  tabIndex={open ? 0 : -1}
                  onClick={() => navigateToSection(section, idx)}
                  className={`scroll-morph-option liquid-glass-option
                              ${activeIdx === idx ? 'scroll-morph-option--active' : ''}`}
                  style={{ '--option-index': idx }}
                >
                  <span>{section.label}</span>
                </button>
              </li>
            ))}
          </ul>
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
                 contact-liquid-glass rounded-full text-[color:var(--fg)]
                 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                 hover:-translate-y-1.5 hover:scale-105
                 active:scale-90 active:ring-0 focus:outline-none"
    >
      <span className="relative z-10 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] 
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
    <li className="py-3 md:py-4 lg:py-4">
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
                <span className="min-w-0 pr-3">{role.role}</span>

                <span className="flex items-center gap-2 shrink-0">
                  <DateRange startDate={role.startDate} endDate={role.endDate} />

                  <svg
                    className={`w-3 h-3 lg:w-4 lg:h-4 text-[var(--muted)] transition-transform duration-200 ease-out
                               ${open ? 'rotate-180' : 'rotate-0'}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>

              <div
                id={descId}
                className={`overflow-hidden transition-[max-height,margin] duration-250 ease-out
                            ${open ? 'max-h-96 mt-2' : 'max-h-0'}`}
              >
                <div
                  className={`text-[10px] md:text-[11px] lg:text-sm leading-relaxed whitespace-pre-line
                              transition-[opacity,transform] duration-200 ease-out
                              ${open ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}
                >
                  <p>{role.summary}</p>
                </div>
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
    <li className="py-3 md:py-4 lg:py-4">
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
          <span className="min-w-0 pr-3">{e.degree}</span>

          <span className="flex items-center gap-2 shrink-0">
            <EducationCompletion endDate={e.endDate} />

            <svg
              className={`w-3 h-3 lg:w-4 lg:h-4 text-[var(--muted)] transition-transform duration-200 ease-out
                         ${open ? 'rotate-180' : 'rotate-0'}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>

        <div
          id={descId}
          className={`overflow-hidden transition-[max-height,margin] duration-250 ease-out
                      ${open ? 'max-h-[800px] mt-2' : 'max-h-0'}`}
        >
          <div
            className={`text-[10px] md:text-[11px] lg:text-sm leading-relaxed
                        transition-[opacity,transform] duration-200 ease-out
                        ${open ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}
          >
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
    return compareYearMonthDesc(a.endDate, b.endDate) || compareYearMonthDesc(a.startDate, b.startDate)
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

  return (
    <>
      <div className="portfolio-viewport bg-[var(--bg)] text-[color:var(--fg)]">
        <div className="portfolio-scale-surface">
          <ThemeToggle />
          <LiquidGlassNav containerRef={scrollContainerRef} />

          <div 
            ref={scrollContainerRef}
            className="h-full overflow-y-auto 
                       bg-[var(--bg)] text-[color:var(--fg)] relative
                       [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
        
            {/* Landing */}
            <Section id="home" withDivider={false} className="flex items-center justify-center">
              <h1 className="text-center font-bold tracking-tight text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl">
                Hi, I&apos;m Rickey
              </h1>
            </Section>

            {/* Education */}
            <Section id="education" className="flex items-center">
              <div className="max-w-3xl lg:max-w-4xl mx-auto px-6 lg:px-8 w-full">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 lg:mb-5">Education</h2>
                <ul className="divide-y divide-[var(--border)]">
                  {education.map((e, idx) => (
                    <EduItem key={idx} e={e} idx={idx} />
                  ))}
                </ul>
              </div>
            </Section>

            {/* Research */}
            <Section id="research" className="flex items-center">
              <div className="max-w-3xl lg:max-w-4xl mx-auto px-6 lg:px-8 w-full">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 lg:mb-5">Research</h2>

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

            {/* Academic */}
            <Section id="academic" className="flex items-center">
              <div className="max-w-3xl lg:max-w-4xl mx-auto px-6 lg:px-8 w-full">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 md:mb-7 lg:mb-5">Academic</h2>

                <ExperienceSubsection workArray={researchWork} />
              </div>
            </Section>

            {/* Professional */}
            <Section id="professional" className="flex items-center">
              <div className="max-w-3xl lg:max-w-4xl mx-auto px-6 lg:px-8 w-full">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 md:mb-7 lg:mb-5">Professional</h2>

                <ExperienceSubsection workArray={professionalWork} />
              </div>
            </Section>

            {/* Connect */}
            <Section id="connect" className="flex items-center justify-center">
              <div className="text-center px-6">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-5 md:mb-6 lg:mb-8">You can also find me here!</h2>
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
        </div>
      </div>
    </>
  )
}
