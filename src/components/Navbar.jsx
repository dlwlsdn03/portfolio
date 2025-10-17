import React, { useState } from 'react'
import { LinkedInIcon, GitHubIcon, MailIcon } from './Icons.jsx'

const links = [
  { href: '#home', label: 'Home', id: 'home' },
  { href: '#work', label: 'Work', id: 'work' },
  { href: '#education', label: 'Education', id: 'education' },
  { href: '#research', label: 'Research', id: 'research' },
]

function NavLink({ href, label, active }) {
  return (
    <a
      href={href}
      aria-current={active ? 'page' : undefined}
      className={[
        'px-2 py-1 text-sm md:text-base',
        'hover:underline underline-offset-8 decoration-2',
        active ? 'underline' : ''
      ].join(' ')}
    >
      {label}
    </a>
  )
}

function IconButton({ href, label, children }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="inline-flex items-center justify-center w-9 h-9 border border-black rounded-full hover:bg-black hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-black"
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  )
}

export default function Navbar({ activeId }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b" style={{borderColor:'rgba(0,0,0,0.08)'}}>
      <nav className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#home" className="font-bold tracking-tight text-base md:text-lg">Rickey</a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4">
          {links.map((l) => (
            <NavLink key={l.id} href={l.href} label={l.label} active={activeId === l.id} />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <IconButton href="#" label="LinkedIn">
            <LinkedInIcon className="w-4 h-4" />
          </IconButton>
          <IconButton href="#" label="GitHub">
            <GitHubIcon className="w-4 h-4" />
          </IconButton>
          <IconButton href="mailto:you@example.com" label="Email">
            <MailIcon className="w-4 h-4" />
          </IconButton>
          {/* Mobile menu toggle */}
          <button
            className="md:hidden ml-1 inline-flex items-center justify-center w-9 h-9 border border-black rounded-full focus:outline-none focus:ring-1 focus:ring-black"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label="Toggle navigation"
          >
            <span className="sr-only">Menu</span>
            <div className="w-4 h-4 relative">
              <span className="absolute inset-x-0 top-0 h-[2px] bg-black"></span>
              <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-black"></span>
              <span className="absolute inset-x-0 bottom-0 h-[2px] bg-black"></span>
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t" style={{borderColor:'rgba(0,0,0,0.08)'}}>
          <div className="max-w-3xl mx-auto px-6 py-3 flex flex-wrap gap-x-4 gap-y-2">
            {links.map((l) => (
              <a key={l.id} href={l.href} className="py-1" onClick={() => setOpen(false)}>
                <span className={`hover:underline underline-offset-8 decoration-2 ${activeId === l.id ? 'underline' : ''}`}>{l.label}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
