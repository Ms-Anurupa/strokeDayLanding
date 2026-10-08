import { motion } from 'framer-motion'
import {
  PiNotePencilDuotone,
  PiFilmSlateDuotone,
  PiListChecksDuotone,
  PiMicrophoneStageDuotone,
  PiTrophyDuotone,
  PiCalendarBlankDuotone,
} from 'react-icons/pi'
import { JOURNEY, EVENT } from '../data/event'

/* One icon per step, in the same order as JOURNEY in event.js */
const STEP_ICONS = [PiNotePencilDuotone, PiFilmSlateDuotone, PiListChecksDuotone, PiMicrophoneStageDuotone, PiTrophyDuotone]

/* Known dates, by step position */
const STEP_DATES = {
  0: `Closes ${EVENT.registrationCloseLabel}`,
  3: EVENT.eventDateLabel,
  4: 'At the finale',
}

const ease = [0.22, 1, 0.36, 1]
const STEP_DELAY = 0.28 // seconds between steps lighting up

/* Effects Tailwind cannot express, scoped with a "jr-" prefix. */
const JOURNEY_STYLES = `
@keyframes jr-pulse { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(1.9); opacity: 0; } }
@keyframes jr-shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }
.jr-pulse { animation: jr-pulse 2.2s ease-out infinite; }
.jr-line {
  background: linear-gradient(90deg, #353A91, #E76417 50%, #353A91);
  background-size: 200% 100%;
  animation: jr-shimmer 6s linear infinite;
}
.jr-line-v {
  background: linear-gradient(180deg, #353A91, #E76417 50%, #353A91);
  background-size: 100% 200%;
}
.jr-grain::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  opacity: 0.08;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
@media (prefers-reduced-motion: reduce) {
  .jr-pulse, .jr-line { animation: none; }
}
`

function Step({ step, index, total }) {
  const Icon = STEP_ICONS[index] ?? PiListChecksDuotone
  const last = index === total - 1
  const date = STEP_DATES[index]

  return (
    <motion.li
      variants={{
        hidden: { opacity: 0, y: 28 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease, delay: index * STEP_DELAY } },
      }}
      className="group relative flex gap-5 lg:flex-col lg:items-center lg:text-center"
    >
      {/* Node */}
      <motion.span
        variants={{
          hidden: { scale: 0.4, opacity: 0 },
          show: {
            scale: 1,
            opacity: 1,
            transition: { type: 'spring', stiffness: 320, damping: 18, delay: 0.15 + index * STEP_DELAY },
          },
        }}
        className="relative z-10 grid size-[4.5rem] shrink-0 place-items-center"
      >
        {last && <span className="jr-pulse absolute inset-0 rounded-full bg-[#E76417]/40" aria-hidden="true" />}
        <span
          className={`relative grid size-[4.5rem] place-items-center rounded-full ring-1 transition-transform duration-300 group-hover:scale-105 ${last
              ? 'bg-[linear-gradient(140deg,#F07A2E,#E76417_50%,#C8540F)] text-white shadow-[0_0_0_8px_rgba(231,100,23,0.15),0_18px_40px_-12px_rgba(231,100,23,0.9)] ring-[#F59E5B]'
              : 'bg-[linear-gradient(140deg,#2A2F7A,#20245E)] text-white shadow-[0_0_0_8px_#10133D,0_14px_30px_-14px_rgba(0,0,0,0.8)] ring-white/15'
            }`}
        >
          <Icon className="size-8" aria-hidden="true" />
        </span>
        <span
          className={`absolute -top-1 -right-1 grid size-7 place-items-center rounded-full font-display text-sm font-extrabold shadow-md ${last ? 'bg-white text-[#E76417]' : 'bg-[#E76417] text-white'
            }`}
        >
          {index + 1}
        </span>
      </motion.span>

      {/* Card */}
      <div
        className={`flex-1 rounded-2xl p-5 ring-1 backdrop-blur transition-[transform,background-color,box-shadow] duration-300 group-hover:-translate-y-1 lg:mt-7 lg:w-full lg:p-6 ${last
            ? 'bg-[#E76417]/10 ring-[#E76417]/35 group-hover:bg-[#E76417]/15'
            : 'bg-white/[0.04] ring-white/10 group-hover:bg-white/[0.08] group-hover:shadow-[0_20px_40px_-24px_rgba(0,0,0,0.8)]'
          }`}
      >
        <h3 className="text-xl font-bold text-white sm:text-[1.35rem]">{step.title}</h3>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-white/65">{step.text}</p>
        {date && (
          <p
            className={`mt-4 inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs leading-tight font-semibold ${last ? 'bg-[#E76417] text-white' : 'bg-white/10 text-white/85 ring-1 ring-white/15'
              }`}
          >
            <PiCalendarBlankDuotone className="size-3.5" aria-hidden="true" />
            {date}
          </p>
        )}
      </div>
    </motion.li>
  )
}

export default function Journey() {
  const total = JOURNEY.length
  const drawDuration = 0.4 + total * STEP_DELAY

  return (
    <section
      id="how-it-works"
      className="jr-grain relative isolate overflow-hidden bg-[#10133D] py-12 text-white sm:py-12"
    >
      <style>{JOURNEY_STYLES}</style>

      {/* Background lighting */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_0%,rgba(53,58,145,0.75),transparent_70%)]" />
        <div className="absolute -right-32 -bottom-40 size-[28rem] rounded-full bg-[#E76417]/15 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(70%_80%_at_50%_40%,#000,transparent_80%)]" />
      </div>

      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="section-title text-white">From registration to the awards</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">
            Every participant goes through the same five steps.
          </p>
        </motion.div>

        <motion.ol
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="relative mt-12 grid gap-5 lg:mt-16 lg:grid-cols-5 lg:gap-5"
        >
          {/* Connector, desktop: track + line that draws across */}
          <span
            className="absolute top-9 right-[10%] left-[10%] hidden h-0.5 rounded-full bg-white/10 lg:block"
            aria-hidden="true"
          />
          <motion.span
            variants={{
              hidden: { scaleX: 0 },
              show: { scaleX: 1, transition: { duration: drawDuration, ease: 'easeInOut' } },
            }}
            className="jr-line absolute top-9 right-[10%] left-[10%] hidden h-0.5 origin-left rounded-full lg:block"
            aria-hidden="true"
          />

          {/* Connector, mobile and tablet: vertical */}
          <span className="absolute top-9 bottom-9 left-9 w-0.5 rounded-full bg-white/10 lg:hidden" aria-hidden="true" />
          <motion.span
            variants={{
              hidden: { scaleY: 0 },
              show: { scaleY: 1, transition: { duration: drawDuration, ease: 'easeInOut' } },
            }}
            className="jr-line-v absolute top-9 bottom-9 left-9 w-0.5 origin-top rounded-full lg:hidden"
            aria-hidden="true"
          />

          {JOURNEY.map((step, i) => (
            <Step key={step.title} step={step} index={i} total={total} />
          ))}
        </motion.ol>
      </div>
    </section>
  )
}