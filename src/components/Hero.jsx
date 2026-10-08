import { motion } from 'framer-motion'
import {
  PiMicrophoneStageDuotone,
  PiTicketDuotone,
  PiArrowRightBold,
  PiLockSimpleDuotone,
  PiCalendarStarDuotone,
  PiMapPinDuotone,
  PiUserCircleDuotone,
  PiSparkleFill,
} from 'react-icons/pi'
import { EVENT, CATEGORIES } from '../data/event'
import { useRegistrationOpen } from '../hooks/useRegistrationOpen'

const HERO_STYLES = `
.ggt-stage {
  background:
    radial-gradient(55% 60% at 78% 30%, rgba(53, 58, 145, 0.75) 0%, transparent 70%),
    radial-gradient(45% 45% at 0% 100%, rgba(231, 100, 23, 0.22) 0%, transparent 70%),
    linear-gradient(180deg, #10133D 0%, #0C0F33 100%);
}
.ggt-floor {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
  background-size: 56px 56px;
  -webkit-mask-image: radial-gradient(70% 90% at 50% 100%, #000 0%, transparent 75%);
  mask-image: radial-gradient(70% 90% at 50% 100%, #000 0%, transparent 75%);
}
.ggt-grain { position: relative; isolation: isolate; }
.ggt-grain::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  opacity: 0.09;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
.ggt-ticket {
  --punch: 14px;
  --punch-y: 56%;
  -webkit-mask:
    radial-gradient(circle var(--punch) at 0 var(--punch-y), transparent 98%, #000) left / 51% 100% no-repeat,
    radial-gradient(circle var(--punch) at 100% var(--punch-y), transparent 98%, #000) right / 51% 100% no-repeat;
  mask:
    radial-gradient(circle var(--punch) at 0 var(--punch-y), transparent 98%, #000) left / 51% 100% no-repeat,
    radial-gradient(circle var(--punch) at 100% var(--punch-y), transparent 98%, #000) right / 51% 100% no-repeat;
}
.ggt-edge { position: relative; }
.ggt-edge::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(140deg, rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0.05) 45%, rgba(231, 100, 23, 0.5));
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude;
  pointer-events: none;
}
@keyframes ggt-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes ggt-beam { 0%, 100% { transform: rotate(-7deg); } 50% { transform: rotate(7deg); } }
.ggt-marquee { animation: ggt-marquee 38s linear infinite; }
.ggt-beam { transform-origin: 50% 0%; animation: ggt-beam 10s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) {
  .ggt-marquee, .ggt-beam { animation: none; }
}
`

const ease = [0.22, 1, 0.36, 1]
const rise = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
}

/** Brand cross mark with a dark left arm, for use on white chips. */
function CrossMark({ className = '' }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <rect x="80" y="8" width="40" height="80" rx="10" fill="#E76417" />
      <rect x="112" y="80" width="80" height="40" rx="10" fill="#7A720E" />
      <rect x="80" y="112" width="40" height="80" rx="10" fill="#353A91" />
      <rect x="8" y="80" width="80" height="40" rx="10" fill="#20245E" />
    </svg>
  )
}

function CountdownTiles({ days, hours, minutes, seconds }) {
  const parts = [
    { value: days, label: 'Days' },
    { value: hours, label: 'Hrs' },
    { value: minutes, label: 'Mins' },
    { value: seconds, label: 'Secs' },
  ]
  return (
    <div className="grid grid-cols-4 gap-1.5" aria-hidden="true">
      {parts.map((p) => (
        <div key={p.label} className="rounded-lg bg-white/[0.06] px-1 py-1.5 text-center ring-1 ring-white/10">
          <span className="block font-display text-xl leading-none font-bold tabular-nums sm:text-2xl">
            {String(p.value).padStart(2, '0')}
          </span>
          <span className="mt-1 block text-[0.65rem] font-semibold tracking-wide text-white/55">{p.label}</span>
        </div>
      ))}
    </div>
  )
}

function CountdownBlock({ reg }) {
  return reg.open ? (
    <>
      <p className="mb-2 flex items-center justify-between text-xs font-semibold sm:text-sm">
        <span>Registrations close in</span>
        <span className="text-white/60">{EVENT.registrationCloseLabel}</span>
      </p>
      <CountdownTiles {...reg} />
      <p className="sr-only">
        Registrations close in {reg.days} days {reg.hours} hours {reg.minutes} minutes
      </p>
    </>
  ) : (
    <p className="flex items-center gap-2 text-sm font-semibold text-white/85">
      <PiLockSimpleDuotone className="size-5 text-[#E76417]" aria-hidden="true" />
      Participant registrations closed on {EVENT.registrationCloseLabel}
    </p>
  )
}

/** Full event pass (desktop). */
function EventPass({ reg }) {
  return (
    <div className="relative">
      <span className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-[#353A91]/50 blur-3xl" aria-hidden="true" />
      <div className="ggt-ticket ggt-edge rounded-3xl bg-[linear-gradient(160deg,rgba(53,58,145,0.55),rgba(32,36,94,0.65))] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] backdrop-blur-md [--punch:12px]">
        <div className="p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-lg bg-white">
                <CrossMark className="size-5" />
              </span>
              <span className="font-display text-base font-bold">Grand finale</span>
            </span>
            <span className="rounded-full bg-[#E76417]/15 px-2.5 py-0.5 text-xs font-bold text-[#F08A4B] ring-1 ring-[#E76417]/40">
              Free entry
            </span>
          </div>

          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex items-center gap-2.5">
              <PiCalendarStarDuotone className="size-5 shrink-0 text-[#E76417]" aria-hidden="true" />
              <dt className="sr-only">Date</dt>
              <dd className="font-display text-base font-bold">{EVENT.eventDateLabel}</dd>
            </div>
            <div className="flex items-center gap-2.5">
              <PiMapPinDuotone className="size-5 shrink-0 text-[#E76417]" aria-hidden="true" />
              <dt className="sr-only">Organised by</dt>
              <dd className="text-white/85">{EVENT.organiser}</dd>
            </div>
            <div className="flex items-center gap-2.5">
              <PiUserCircleDuotone className="size-5 shrink-0 text-[#E76417]" aria-hidden="true" />
              <dt className="sr-only">Who can perform</dt>
              <dd className="text-white/85">Solo acts, {EVENT.minAge} years and above</dd>
            </div>
          </dl>
        </div>

        {/* perforation */}
        <div className="mx-5 border-t-2 border-dashed border-white/20" aria-hidden="true" />

        <div className="p-5">
          <CountdownBlock reg={reg} />
        </div>
      </div>
    </div>
  )
}

/** Countdown-only strip (phones and tablets). */
function CountdownStrip({ reg }) {
  return (
    <div className="ggt-edge rounded-2xl bg-[linear-gradient(160deg,rgba(53,58,145,0.55),rgba(32,36,94,0.65))] p-4 backdrop-blur-md">
      <CountdownBlock reg={reg} />
    </div>
  )
}

function CategoryMarquee() {
  const items = [...CATEGORIES, ...CATEGORIES, ...CATEGORIES]
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-white/[0.03] py-2.5" aria-hidden="true">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#0C0F33] to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#0C0F33] to-transparent sm:w-24" />
      <div className="ggt-marquee flex w-max">
        {[0, 1].map((set) => (
          <div key={set} className="flex shrink-0 items-center">
            {items.map((cat, i) => {
              const Icon = cat.icon
              return (
                <span key={`${set}-${i}`} className="flex items-center gap-3 px-5 sm:px-8">
                  <Icon className="size-5 text-[#E76417] sm:size-6" />
                  <span className="font-display text-lg font-extrabold whitespace-nowrap text-white/90 [font-variation-settings:'wdth'_80] sm:text-2xl">
                    {cat.name}
                  </span>
                  <PiSparkleFill className="ml-5 size-3 text-white/30 sm:ml-8" />
                </span>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Hero({ onChoose }) {
  const reg = useRegistrationOpen()

  return (
    <section id="top" className="ggt-stage ggt-grain relative overflow-hidden text-white">
      <style>{HERO_STYLES}</style>

      {/* Stage lights and floor */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="ggt-beam absolute -top-16 left-[8%] h-[115%] w-[30rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.13),transparent_70%)] [clip-path:polygon(47%_0,53%_0,100%_100%,0_100%)]" />
        <div className="ggt-beam absolute -top-16 right-[6%] hidden h-[115%] w-[34rem] bg-[linear-gradient(180deg,rgba(231,100,23,0.16),transparent_70%)] [animation-delay:-5s] [clip-path:polygon(47%_0,53%_0,100%_100%,0_100%)] md:block" />
        <div className="ggt-floor absolute inset-x-0 bottom-0 h-2/3" />
      </div>

      <div className="container-page pt-6 pb-6 sm:pt-6 sm:pb-6 lg:pt-8">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          className="grid items-center gap-6 lg:grid-cols-[1.4fr_0.6fr] lg:gap-10"
        >
          <div>
            <motion.p
              variants={rise}
              className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] py-1 pr-3.5 pl-1 text-xs font-semibold ring-1 ring-white/15 backdrop-blur sm:text-sm"
            >
              <span className="grid size-6 place-items-center rounded-full bg-white">
                <CrossMark className="size-4" />
              </span>
              A {EVENT.initiative} initiative
            </motion.p>

            <motion.h1
              variants={rise}
              className="mt-4 text-[clamp(2.2rem,9vw,5.25rem)] leading-[0.98] font-extrabold tracking-[-0.02em] [font-variation-settings:'wdth'_90]"
            >
              Gurgaon’s{' '}
              <span className="bg-[linear-gradient(180deg,#FFFFFF_35%,rgba(255,255,255,0.6))] bg-clip-text text-transparent">
                Got Talent
              </span>
            </motion.h1>

            <motion.p variants={rise} className="mt-4 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
              A city-wide talent competition for Gurgaon’s singers, dancers and stand-up comedians, organised by{' '}
              {EVENT.organiser}.
            </motion.p>

            {/* Key facts (phones and tablets; the event pass covers them on desktop) */}
            <motion.dl
              variants={rise}
              className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 pt-4 text-sm lg:hidden"
            >
              <div>
                <dt className="text-xs text-white/55">Finale</dt>
                <dd className="font-display font-bold">{EVENT.eventDateLabel}</dd>
              </div>
              <div>
                <dt className="text-xs text-white/55">Registrations close</dt>
                <dd className="font-display font-bold">{EVENT.registrationCloseLabel}</dd>
              </div>
              <div>
                <dt className="text-xs text-white/55">Who can perform</dt>
                <dd className="font-display font-bold">Solo acts, {EVENT.minAge}+</dd>
              </div>
            </motion.dl>
          </div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30, rotate: 2 },
              show: { opacity: 1, y: 0, rotate: 0, transition: { duration: 0.8, ease } },
            }}
            className="hidden lg:block"
          >
            <EventPass reg={reg} />
          </motion.div>
        </motion.div>

        {/* The two paths: the main job of this page */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease }}
          className="mt-6 grid gap-3 md:grid-cols-2 lg:mt-8 lg:gap-4"
        >
          <button
            type="button"
            onClick={() => onChoose('participate')}
            disabled={!reg.open}
            className="group relative flex items-center gap-4 overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#F07A2E_0%,#E76417_45%,#C8540F_100%)] p-4 text-left shadow-[0_20px_40px_-20px_rgba(231,100,23,0.75)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_26px_50px_-20px_rgba(231,100,23,0.9)] disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-none disabled:bg-white/10 disabled:shadow-none sm:p-5"
          >
            <PiMicrophoneStageDuotone
              className="pointer-events-none absolute -right-4 -bottom-8 size-32 rotate-[-12deg] text-white/[0.08] transition-transform duration-500 group-hover:rotate-0"
              aria-hidden="true"
            />
            <span className="relative grid size-12 shrink-0 place-items-center rounded-xl bg-white/20 ring-1 ring-white/30">
              {reg.open ? <PiMicrophoneStageDuotone className="size-7" /> : <PiLockSimpleDuotone className="size-7" />}
            </span>
            <span className="relative min-w-0 flex-1">
              <span className="block font-display text-xl leading-tight font-extrabold sm:text-2xl">
                I want to participate
              </span>
              <span className="mt-0.5 block text-sm text-white/90">
                Singing, Dancing or Stand-up Comedy. Solo acts, {EVENT.minAge}+.{' '}
                {reg.open
                  ? `Registrations and auditions close on ${EVENT.registrationCloseLabel}.`
                  : `Registrations closed on ${EVENT.registrationCloseLabel}.`}
              </span>
            </span>
            <span className="relative cursor-pointer grid size-10 shrink-0 place-items-center rounded-full bg-white text-[#E76417] shadow-lg transition-transform duration-300 group-hover:translate-x-1 group-disabled:hidden">
              <PiArrowRightBold className="size-4" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => onChoose('attend')}
            className="ggt-edge group relative flex items-center gap-4 overflow-hidden rounded-2xl bg-white/[0.06] p-4 text-left backdrop-blur-md transition-[transform,background-color] duration-300 hover:-translate-y-1 hover:bg-white/[0.1] sm:p-5"
          >
            <PiTicketDuotone
              className="pointer-events-none absolute -right-4 -bottom-8 size-32 rotate-[-12deg] text-white/[0.05] transition-transform duration-500 group-hover:rotate-0"
              aria-hidden="true"
            />
            <span className="relative grid size-12 shrink-0 place-items-center rounded-xl bg-white/10 ring-1 ring-white/15">
              <PiTicketDuotone className="size-7" />
            </span>
            <span className="relative min-w-0 flex-1">
              <span className="block font-display text-xl leading-tight font-extrabold sm:text-2xl">I want to attend</span>
              <span className="mt-0.5 block text-sm text-white/75">
                Watch the finale on {EVENT.eventDateLabel}. Entry is free, but strictly by invitation only. Register
                in advance to request your invitation.
              </span>
            </span>
            <span className="relative cursor-pointer grid size-10 shrink-0 place-items-center rounded-full bg-white text-[#353A91] shadow-lg transition-transform duration-300 group-hover:translate-x-1">
              <PiArrowRightBold className="size-4" />
            </span>
          </button>
        </motion.div>

        {/* Countdown on phones and tablets */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease }}
          className="mt-3 lg:hidden"
        >
          <CountdownStrip reg={reg} />
        </motion.div>
      </div>

      <CategoryMarquee />
    </section>
  )
}