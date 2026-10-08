import { useEffect, useState } from 'react'

/** Sticky register bar on phones; hidden over the hero and the form itself. */
export default function MobileCta() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('top')
    const form = document.getElementById('register')
    if (!hero || !form) return
    const state = { hero: true, form: false }
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) state.hero = entry.isIntersecting
        if (entry.target === form) state.form = entry.isIntersecting
      }
      setVisible(!state.hero && !state.form)
    })
    observer.observe(hero)
    observer.observe(form)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur transition-transform duration-300 md:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      aria-hidden={!visible}
    >
      <a href="#register" tabIndex={visible ? 0 : -1} className="btn btn-orange w-full">
        Register to perform or attend
      </a>
    </div>
  )
}
