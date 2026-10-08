import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  PiPlusBold,
  PiQuestionDuotone,
  PiCalendarStarDuotone,
  PiClockCountdownDuotone,
  PiTicketDuotone,
  PiArrowRightBold,
} from 'react-icons/pi'
import { FAQS, EVENT } from '../data/event'

const ease = [0.22, 1, 0.36, 1]

/* Effects Tailwind cannot express, scoped with a "faq-" prefix. */
const FAQ_STYLES = `
.faq-grain::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  opacity: 0.08;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
.faq-dots {
  background-image: radial-gradient(rgba(53, 58, 145, 0.12) 1px, transparent 1px);
  background-size: 22px 22px;
}
`

const QUICK_FACTS = [
  { icon: PiCalendarStarDuotone, label: 'Finale', value: EVENT.eventDateLabel },
  { icon: PiClockCountdownDuotone, label: 'Registrations close', value: EVENT.registrationCloseLabel },
  { icon: PiTicketDuotone, label: 'Entry', value: 'Free, by invitation only' },
]

function FaqItem({ item, index, open, onToggle }) {
  const baseId = useId()
  const buttonId = `${baseId}-q`
  const panelId = `${baseId}-a`

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease, delay: index * 0.07 } },
      }}
      className={`relative overflow-hidden rounded-2xl bg-white transition-[box-shadow,transform] duration-300 ${open
          ? 'shadow-[0_28px_56px_-30px_rgba(16,19,61,0.5)] ring-1 ring-[#353A91]/25'
          : 'shadow-[0_10px_24px_-20px_rgba(16,19,61,0.4)] ring-1 ring-line hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-24px_rgba(16,19,61,0.45)]'
        }`}
    >
      {/* accent bar */}
      <motion.span
        className="absolute inset-y-0 left-0 w-1 origin-top bg-[linear-gradient(180deg,#E76417,#353A91)]"
        initial={false}
        animate={{ scaleY: open ? 1 : 0 }}
        transition={{ duration: 0.35, ease }}
        aria-hidden="true"
      />

      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="group flex w-full items-center gap-4 px-5 py-5 text-left sm:px-6"
        >
          <span
            className={`grid size-10 shrink-0 place-items-center rounded-xl transition-colors duration-300 ${open ? 'bg-[#353A91] text-white' : 'bg-mist text-[#353A91] group-hover:bg-[#353A91]/10'
              }`}
          >
            <PiQuestionDuotone className="size-5" aria-hidden="true" />
          </span>
          <span className="flex-1 font-display text-lg leading-snug font-bold text-navy sm:text-xl">{item.q}</span>
          <motion.span
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 24 }}
            className={`grid size-9 shrink-0 place-items-center rounded-full transition-colors duration-300 ${open ? 'bg-[#E76417] text-white shadow-[0_8px_18px_-8px_rgba(231,100,23,0.9)]' : 'bg-mist text-navy'
              }`}
          >
            <PiPlusBold className="size-4" aria-hidden="true" />
          </motion.span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease }}
            className="overflow-hidden"
          >
            <motion.p
              initial={{ y: -6 }}
              animate={{ y: 0 }}
              exit={{ y: -6 }}
              transition={{ duration: 0.35, ease }}
              className="px-5 pb-6 pl-[4.75rem] leading-relaxed text-slate sm:px-6 sm:pl-[5rem]"
            >
              {item.a}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0)
  const half = Math.ceil(FAQS.length / 2)
  const columns = [FAQS.slice(0, half), FAQS.slice(half)]

  const toggle = (i) => setOpenIndex((current) => (current === i ? -1 : i))

  return (
    <section id="faq" className="faq-dots relative isolate overflow-hidden bg-[#F5F5FA] py-12 sm:py-12">
      <style>{FAQ_STYLES}</style>

      {/* soft glows */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute -top-32 left-1/3 size-[28rem] rounded-full bg-[#353A91]/10 blur-3xl" />
        <div className="absolute -right-24 bottom-0 size-[24rem] rounded-full bg-[#E76417]/10 blur-3xl" />
      </div>

      {/* Full-width layout */}
      <div className="w-full px-4 sm:px-8 lg:px-12 2xl:px-20">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] xl:gap-10">
          {/* Intro panel */}
          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, ease }}
            className="faq-grain relative isolate self-start overflow-hidden rounded-[1.75rem] bg-[linear-gradient(155deg,#353A91_0%,#20245E_50%,#10133D_100%)] p-7 text-white shadow-[0_34px_70px_-36px_rgba(16,19,61,0.8)] sm:p-9 lg:sticky lg:top-24"
          >
            <div
              className="pointer-events-none absolute -top-20 -right-20 -z-10 size-64 rounded-full bg-[#E76417]/25 blur-3xl"
              aria-hidden="true"
            />
            <span className="grid size-14 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/20">
              <PiQuestionDuotone className="size-8 text-[#F28C4E]" aria-hidden="true" />
            </span>
            <h2 className="section-title mt-6 text-white">Questions, answered</h2>
            <p className="mt-4 text-lg text-white/75">Everything performers and guests usually ask before registering.</p>

            <dl className="mt-8 space-y-3 border-t border-white/15 pt-6">
              {QUICK_FACTS.map((fact) => {
                const Icon = fact.icon
                return (
                  <div key={fact.label} className="flex items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/[0.08] ring-1 ring-white/10">
                      <Icon className="size-5 text-[#F28C4E]" aria-hidden="true" />
                    </span>
                    <div>
                      <dt className="text-xs text-white/55">{fact.label}</dt>
                      <dd className="font-semibold">{fact.value}</dd>
                    </div>
                  </div>
                )
              })}
            </dl>

            <a
              href="#register"
              className="group mt-8 inline-flex w-full items-center justify-between gap-3 rounded-full bg-[#E76417] py-2 pr-2 pl-6 font-bold text-white shadow-[0_14px_30px_-12px_rgba(231,100,23,0.9)] transition-colors hover:bg-[#C8540F]"
            >
              Register now
              <span className="grid size-10 place-items-center rounded-full bg-white text-[#E76417] transition-transform duration-300 group-hover:translate-x-1">
                <PiArrowRightBold className="size-4" aria-hidden="true" />
              </span>
            </a>
          </motion.aside>

          {/* Questions: two columns on wide screens */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="grid content-start gap-3 xl:grid-cols-2 xl:gap-4"
          >
            {columns.map((col, c) => (
              <div key={c} className="grid content-start gap-3 xl:gap-4">
                {col.map((item, j) => {
                  const i = c * half + j
                  return (
                    <FaqItem key={item.q} item={item} index={i} open={openIndex === i} onToggle={() => toggle(i)} />
                  )
                })}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}