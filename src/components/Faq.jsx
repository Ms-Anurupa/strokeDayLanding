
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
  background-image: radial-gradient(
    rgba(53, 58, 145, 0.12) 1px,
    transparent 1px
  );
  background-size: 22px 22px;
}

.faq-card {
  transition:
    box-shadow 300ms ease,
    border-color 300ms ease,
    transform 300ms ease;
}

@media (prefers-reduced-motion: reduce) {
  .faq-card {
    transition: none;
  }
}
`

const QUICK_FACTS = [
  {
    icon: PiCalendarStarDuotone,
    label: 'Finale',
    value: EVENT.eventDateLabel,
  },
  {
    icon: PiClockCountdownDuotone,
    label: 'Registrations close',
    value: EVENT.registrationCloseLabel,
  },
  {
    icon: PiTicketDuotone,
    label: 'Entry',
    value: 'Free, by invitation only',
  },
]

function FaqItem({ item, index, open, onToggle }) {
  const baseId = useId()
  const buttonId = `${baseId}-q`
  const panelId = `${baseId}-a`

  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 18 },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.45,
            ease,
            delay: index * 0.045,
          },
        },
      }}
      className={`faq-card relative overflow-hidden rounded-2xl border bg-white ${
        open
          ? 'border-[#353A91]/30 shadow-[0_20px_45px_-28px_rgba(16,19,61,0.55)]'
          : 'border-[#353A91]/10 shadow-[0_8px_24px_-18px_rgba(16,19,61,0.35)] hover:-translate-y-0.5 hover:border-[#353A91]/25 hover:shadow-[0_16px_32px_-22px_rgba(16,19,61,0.4)]'
      }`}
    >
      <motion.span
        className="absolute inset-y-0 left-0 w-1 origin-top bg-gradient-to-b from-[#E76417] to-[#353A91]"
        initial={false}
        animate={{ scaleY: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease }}
        aria-hidden="true"
      />

      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="group flex w-full items-center gap-4 px-4 py-5 text-left sm:px-6"
        >
          <span
            className={`grid size-10 shrink-0 place-items-center rounded-xl transition-colors duration-300 ${
              open
                ? 'bg-[#353A91] text-white'
                : 'bg-[#F0F1FA] text-[#353A91] group-hover:bg-[#353A91]/10'
            }`}
          >
            <PiQuestionDuotone
              className="size-5"
              aria-hidden="true"
            />
          </span>

          <span className="flex-1 font-display text-base font-bold leading-snug text-[#10133D] sm:text-lg">
            {item.q}
          </span>

          <motion.span
            animate={{ rotate: open ? 45 : 0 }}
            transition={{
              type: 'spring',
              stiffness: 380,
              damping: 24,
            }}
            className={`grid size-9 shrink-0 place-items-center rounded-full transition-colors duration-300 ${
              open
                ? 'bg-[#E76417] text-white'
                : 'bg-[#F0F1FA] text-[#10133D]'
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
            transition={{ duration: 0.3, ease }}
            className="overflow-hidden"
          >
            <motion.div
              initial={{ y: -5 }}
              animate={{ y: 0 }}
              exit={{ y: -5 }}
              transition={{ duration: 0.25, ease }}
              className="pb-6 pl-[4.25rem] pr-5 sm:pl-[5rem] sm:pr-6"
            >
              <p className="text-sm leading-7 text-slate sm:text-base">
                {item.a}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  )
}

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0)

  const toggle = (index) => {
    setOpenIndex((current) => (current === index ? -1 : index))
  }

  return (
    <section
      id="faq"
      className="faq-dots relative isolate overflow-hidden bg-[#F5F5FA] py-16 sm:py-20 lg:py-24"
    >
      <style>{FAQ_STYLES}</style>

      {/* Background glows */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-32 left-1/4 size-[28rem] rounded-full bg-[#353A91]/10 blur-3xl" />
        <div className="absolute right-0 top-1/2 size-[24rem] rounded-full bg-[#E76417]/10 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-8 lg:px-12 2xl:px-20">

        {/* Full-width FAQ header */}
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.65, ease }}
          className="faq-grain relative isolate mb-10 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#353A91] via-[#252967] to-[#10133D] p-6 text-white shadow-[0_30px_70px_-35px_rgba(16,19,61,0.8)] sm:mb-12 sm:rounded-[2rem] sm:p-10 lg:p-12"
        >
          {/* Decorative glow */}
          <div
            className="pointer-events-none absolute -right-20 -top-28 -z-10 size-80 rounded-full bg-[#E76417]/20 blur-3xl"
            aria-hidden="true"
          />

          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.8fr)] lg:gap-12">

            {/* Heading and description */}
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#FFB17E] sm:text-sm">
                <PiQuestionDuotone className="size-4" aria-hidden="true" />
                Frequently asked questions
              </span>

              <h2 className="mt-6 font-display text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                Questions,
                <span className="text-[#F28C4E]"> answered.</span>
              </h2>

              <p className="mt-5 max-w-xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
                Everything performers and guests usually ask before
                registering. Find the details you need and get ready
                to be part of the celebration.
              </p>

              <a
                href="#register"
                className="group mt-7 inline-flex items-center gap-4 rounded-full bg-[#E76417] py-2 pl-6 pr-2 font-bold text-white shadow-[0_12px_30px_-12px_rgba(231,100,23,0.8)] transition-colors duration-300 hover:bg-[#C8540F] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Register now
                <span className="grid size-10 place-items-center rounded-full bg-white text-[#E76417] transition-transform duration-300 group-hover:translate-x-1">
                  <PiArrowRightBold className="size-4" aria-hidden="true" />
                </span>
              </a>
            </div>

            {/* Event information */}
            <dl className="grid gap-3 border-t border-white/15 pt-6 sm:grid-cols-3 lg:grid-cols-1 lg:border-l lg:border-t-0 lg:py-2 lg:pl-8">
              {QUICK_FACTS.map((fact) => {
                const Icon = fact.icon

                return (
                  <div
                    key={fact.label}
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 transition-colors duration-300 hover:bg-white/[0.1]"
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/10">
                      <Icon
                        className="size-5 text-[#F28C4E]"
                        aria-hidden="true"
                      />
                    </span>

                    <div className="min-w-0">
                      <dt className="text-xs font-medium text-white/55 sm:text-sm">
                        {fact.label}
                      </dt>
                      <dd className="mt-1 text-sm font-bold leading-6 text-white sm:text-base">
                        {fact.value}
                      </dd>
                    </div>
                  </div>
                )
              })}
            </dl>
          </div>
        </motion.header>

        {/* FAQ section heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease }}
          className="mb-7 flex flex-col gap-2 sm:mb-9 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E76417] sm:text-sm">
              Need more information?
            </p>
            <h3 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-[#10133D] sm:text-3xl">
              Explore the FAQs
            </h3>
          </div>

          <p className="max-w-md text-sm leading-6 text-slate sm:text-base">
            Select a question to reveal its answer.
          </p>
        </motion.div>

        {/* Questions below the header */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.08 }}
          className="grid items-start gap-4 lg:grid-cols-2 lg:gap-5"
        >
          {FAQS.map((item, index) => (
            <FaqItem
              key={item.q}
              item={item}
              index={index}
              open={openIndex === index}
              onToggle={() => toggle(index)}
            />
          ))}
        </motion.div>

      </div>
    </section>
  )
}
