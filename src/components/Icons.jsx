// src/components/Icons.jsx
import React from 'react'

function ThemedImg({ light, dark, alt = '', className = '' }) {
  return (
    <>
      {/* Light mode icon */}
      <img
        src={light}
        alt={alt}
        className={`${className} dark:hidden`}
        loading="lazy"
        decoding="async"
        draggable="false"
      />
      {/* Dark mode icon (falls back to light if dark not provided) */}
      <img
        src={dark || light}
        alt=""
        aria-hidden="true"
        className={`${className} hidden dark:inline`}
        loading="lazy"
        decoding="async"
        draggable="false"
      />
    </>
  )
}

export function LinkedInIcon({ className = '' }) {
  return (
    <ThemedImg
      light="/icons/linkedin.png"
      dark="/icons/linkedin-dark.png"
      alt="LinkedIn"
      className={className}
    />
  )
}

export function GitHubIcon({ className = '' }) {
  return (
    <ThemedImg
      light="/icons/github.png"
      dark="/icons/github-dark.png"
      alt="GitHub"
      className={className}
    />
  )
}

export function MailIcon({ className = '' }) {
  return (
    <ThemedImg
      light="/icons/mail.png"
      dark="/icons/mail-dark.png"
      alt="Email"
      className={className}
    />
  )
}
