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
  const progressBarRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let rafId

    const updateProgress = () => {
      const { scrollTop, scrollHeight, clientHeight } = el
      let p = 0
      if (scrollHeight > clientHeight) {
        p = (scrollTop / (scrollHeight - clientHeight)) * 100
      }
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${p}%`
      }
    }

    const onScroll = () => {
      // 1. Show the indicator immediately when scrolling starts
      setIsVisible(true)

      // 2. Update the progress bar position
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(updateProgress)

      // 3. Clear the existing timer and start a new one to hide it after 2 seconds of idle
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        setIsVisible(false)
      }, 2000) 
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    updateProgress()

    return () => {
      el.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [containerRef])

  return (
    <div 
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 p-[3px] rounded-full
                  backdrop-blur-xl bg-white/20 dark:bg-white/10
                  shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),0_8px_16px_rgba(0,0,0,0.1)]
                  border border-white/30 transition-opacity duration-500 ease-in-out
                  ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <div className="w-32 h-1.5 rounded-full overflow-hidden bg-white/30 dark:bg-white/10
                      shadow-[inset_0_0.5px_0_rgba(0,0,0,0.2)]"
      >
        <div 
          ref={progressBarRef}
          className="h-full bg-[var(--fg)] opacity-80 transition-none ease-out will-change-[width]"
          style={{ width: '0%' }}
        />
      </div>
    </div>
  )
}

function IconButton({ href, label, children }) {
  return (
    <a
      href={href}
      aria-label={label}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noreferrer' : undefined}
      className="group inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 
                 border rounded-full text-[color:var(--fg)] bg-transparent
                 
                 /* 1. The Physics */
                 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]

                 /* 2. Parent Hover (Lift + MONOCHROME Glow + Ring) */
                 hover:-translate-y-1.5 
                 hover:shadow-[0_10px_20px_-10px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_10px_20px_-10px_rgba(255,255,255,0.2)]
                 hover:ring-4 hover:ring-black/5 dark:hover:ring-white/10
                 
                 /* 3. Click Effect */
                 active:scale-90 active:ring-0 focus:outline-none"
      style={{ borderColor: 'var(--fg)' }}
    >
      {/* 4. Child Hover (Scale icon up slightly) */}
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
    className: "flex items-center gap-3 md:gap-4 mb-0 hover:opacity-70 transition-opacity cursor-pointer w-fit"
  } : {
    className: "flex items-center gap-3 md:gap-4 mb-0"
  }

  return (
    <li className="py-4 md:py-6">
      <HeaderWrapper {...wrapperProps}>
        <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center shrink-0">
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
        <h3 className="text-sm md:text-base font-bold">{group.company}</h3>
      </HeaderWrapper>

      <ul className="ml-11 md:ml-14 space-y-3 md:space-y-4 mt-0.5">
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
                // UPDATED: Added flex, items-center, justify-between, and w-full for the chevron alignment
                className="flex items-center justify-between w-full text-left bg-transparent p-0 text-xs md:text-[13px]
                           focus:outline-none focus:ring-transparent font-medium
                           hover:opacity-70 transition-opacity"
              >
                <span>{role.role}</span>
                
                {/* --- SLEEK ADDITION: Rotating Chevron --- */}
                <svg 
                  className={`w-3.5 h-3.5 text-[var(--muted)] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                             ${open ? 'rotate-180' : 'rotate-0'}`} 
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <p className="text-[9px] md:text-[11px] text-[var(--muted-60)] mt-0.5">
                {role.period}
              </p>

              <div
                id={descId}
                className={`overflow-hidden transition-[max-height] duration-300 ease-out
                           ${open ? "max-h-96 mt-2" : "max-h-0"}`}
              >
                {role.summary && (
                  <p className="text-[11px] md:text-xs leading-relaxed whitespace-pre-line text-[var(--muted)]">
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

  const HeaderWrapper = e.link ? 'a' : 'div'
  const wrapperProps = e.link ? {
    href: e.link,
    target: '_blank',
    rel: 'noreferrer',
    className: "flex items-center gap-3 md:gap-4 mb-0 hover:opacity-70 transition-opacity cursor-pointer w-fit"
  } : {
    className: "flex items-center gap-3 md:gap-4 mb-0"
  }

  return (
    <li className="py-4 md:py-5">
      <HeaderWrapper {...wrapperProps}>
        <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center shrink-0">
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

        <h3 className="text-sm md:text-base font-bold">
          {e.school}
        </h3>
      </HeaderWrapper>

      <div className="ml-11 md:ml-14 mt-0.5">
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          aria-controls={descId}
          // UPDATED: Added flex, items-center, justify-between, and w-full for the chevron alignment
          className="flex items-center justify-between w-full text-left p-0 bg-transparent text-xs md:text-[13px] font-medium
                     focus:outline-none focus:ring-transparent
                     hover:opacity-70 transition-opacity"
        >
          <span>{e.degree}</span>

          {/* --- SLEEK ADDITION: Rotating Chevron --- */}
          <svg 
            className={`w-3.5 h-3.5 text-[var(--muted)] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                       ${open ? 'rotate-180' : 'rotate-0'}`} 
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <p className="text-[9px] md:text-[11px] text-[var(--muted-60)] mt-0.5">
          {e.period}
        </p>

        <div
          id={descId}
          className={`overflow-hidden transition-[max-height] duration-300 ease-out
                      ${open ? 'max-h-[800px] mt-2' : 'max-h-0'}`}
        >
          <div className="text-[11px] md:text-xs leading-relaxed">
            {/* 1. Honours Grade (if applicable) */}
            {e.honours && <p className="mb-4 font-medium">{e.honours}</p>}

            {/* 2. Clickable Dissertation/Thesis Title */}
            {e.thesisTitle && (
              <p className="">
                <span className="">{e.thesisLabel}</span>{' '}
                <a 
                  href={e.thesisLink}
                  target="_blank"
                  rel="noreferrer"
                  className="italic hover:opacity-70 transition-opacity font-medium"
                >
                  {e.thesisTitle}
                </a>
              </p>
            )}

            {/* 3. The rest of the details (Supervisors, Awards, etc.) */}
            <p className="whitespace-pre-line">
              {e.details}
            </p>
          </div>
        </div>
      </div>
    </li>
  )
}

export default function App() {
  const scrollContainerRef = useRef(null)

  // Research areas data
  const researchAreas = [
    "Financial Econometrics",
    "Empirical Asset Pricing",
    "Mathematical Finance", 
    "Statistical Theory"
  ]

  return (
    <>
      <ThemeToggle />
      <ScrollIndicator containerRef={scrollContainerRef} />

      <div 
        ref={scrollContainerRef}
        className="h-dvh overflow-y-auto 
                   bg-[var(--bg)] text-[color:var(--fg)] relative
                   [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
      
        {/* Landing */}
        <Section id="home" className="min-h-screen flex items-center justify-center">
          <h1 className="text-center font-bold tracking-tight text-4xl sm:text-6xl md:text-7xl">
            Hi, I&apos;m Rickey
          </h1>
        </Section>

        {/* Experience */}
        <Section id="experience" className="min-h-screen flex items-center">
          <div className="max-w-3xl mx-auto px-6 w-full">
            <h2 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8">Experience</h2>
            <ul className="divide-y divide-[var(--border)]">
              {groupWorkByCompany(work).map((group, idx) => (
                <CompanyGroup key={idx} group={group} />
              ))}
            </ul>
          </div>
        </Section>

        {/* Education */}
        <Section id="education" className="min-h-screen flex items-center">
          <div className="max-w-3xl mx-auto px-6 w-full">
            <h2 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8">Education</h2>
            <ul className="divide-y divide-[var(--border)]">
              {education.map((e, idx) => (
                <EduItem key={idx} e={e} idx={idx} />
              ))}
            </ul>
          </div>
        </Section>

        {/* Research / Publications */}
        <Section id="research" className="min-h-screen flex items-center">
          <div className="max-w-3xl mx-auto px-6 w-full">
            <h2 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8">Research</h2>

            {/* --- Research Areas Section --- */}
            <div className="mb-8 md:mb-10">
              <h3 className="text-sm md:text-base font-medium mb-3 md:mb-4 text-[var(--muted)]">
                
              </h3>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {researchAreas.map((area, idx) => (
                  <span 
                    key={idx} 
                    className="px-3 py-1.5 md:px-4 md:py-2 
                               border border-[var(--border)] rounded-full 
                               text-[11px] md:text-xs font-medium 
                               hover:bg-[var(--border)] transition-colors cursor-default"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            <ol className="list-decimal ml-6 space-y-3 md:space-y-4">
              {publications.map((p, idx) => {
                return (
                  <li key={idx}>
                    <div className="leading-snug text-xs md:text-[13px]">
                      {p.authors} ({p.year}). <span className="italic">{p.paperTitle}</span>. {p.status}
                    </div>
                    
                    {/* The Link to the paper (if it exists) */}
                    {p.link && (
                      <div className="mt-1 leading-snug text-[var(--muted-60)] text-[9px] md:text-[11px]">
                        <a
                          className="underline decoration-2 underline-offset-4"
                          href={p.link}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View Paper
                        </a>
                      </div>
                    )}
                  </li>
                )
              })}
            </ol>
          </div>
        </Section>

        {/* Connect */}
        <Section id="connect" className="min-h-screen flex items-center justify-center">
          <div className="text-center px-6">
            <h2 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8">Connect With Me</h2>
            <div className="flex items-center justify-center gap-4">
              <IconButton href="https://www.linkedin.com/in/rickey03/" label="LinkedIn">
                <LinkedInIcon className="w-5 h-5 md:w-6 md:h-6" />
              </IconButton>
              <IconButton href="https://github.com/dlwlsdn03" label="GitHub">
                <GitHubIcon className="w-5 h-5 md:w-6 md:h-6" />
              </IconButton>
              <IconButton href="mailto:me@rickey.co.nz" label="Email">
                <MailIcon className="w-5 h-5 md:w-6 md:h-6" />
              </IconButton>
            </div>
          </div>
        </Section>
      </div>
    </>
  )
}