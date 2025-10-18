// src/components/Icons.jsx
import React from 'react'

function ImgIcon({ src, alt = '', className = '' }) {
  return (
    <img
      src={src}                 // e.g. "/icons/linkedin.svg"
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      draggable="false"
    />
  )
}

// Default to your uploaded icons in /public/icons
export function LinkedInIcon({ className = '' }) {
  return <ImgIcon src="/icons/linkedin.png" alt="LinkedIn" className={className} />
}

export function GitHubIcon({ className = '' }) {
  return <ImgIcon src="/icons/github.png" alt="GitHub" className={className} />
}

export function MailIcon({ className = '' }) {
  return <ImgIcon src="/icons/mail.png" alt="Email" className={className} />
}
