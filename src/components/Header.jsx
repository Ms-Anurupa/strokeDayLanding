import { useEffect, useState } from 'react'

const LINKS = [
  { href: '#categories', label: 'Categories' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#faq', label: 'FAQ' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 bg-white/95 backdrop-blur transition-shadow ${
        scrolled ? 'shadow-[0_1px_0_var(--color-line),0_8px_24px_-12px_rgba(20,24,82,0.18)]' : ''
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4 sm:h-18">
        <a href="#top" className="shrink-0" aria-label="Marengo Asia Hospitals, back to top">
          <img src="./marengo-logo.png" alt="Marengo Asia Hospitals" className="h-11 w-auto sm:h-13" width="200" height="126" />
        </a>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[0.95rem] font-semibold text-slate transition-colors hover:text-navy"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a href="#register" className="btn btn-orange px-5 py-2.5 text-[0.95rem]">
          Register
        </a>
      </div>
    </header>
  )
}
