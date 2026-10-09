import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PiHandPointingDuotone, PiCalendarCheckDuotone, PiClockCountdownDuotone } from 'react-icons/pi'
import ModeSelect from './ModeSelect'
import ParticipantForm from './ParticipantForm'
import AttendeeForm from './AttendeeForm'
import SuccessPanel from './SuccessPanel'
import { EVENT, JOURNEY } from '../../data/event'
import { useRegistrationOpen } from '../../hooks/useRegistrationOpen'

function ContextPanel({ mode, participateOpen }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#10133D] via-[#171A49] to-[#25285A] p-2 text-white shadow-xl shadow-[#10133D]/15 sm:p-9 lg:h-full">

      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          maskImage: 'linear-gradient(to bottom, black, transparent 85%)',
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-12 size-56 rounded-full bg-orange/20 blur-[80px] transition-transform duration-700 group-hover:scale-125"
      />

      {/* Header */}
      <div className="relative">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/65">
          <span className="size-2 rounded-full bg-orange" />
          {mode === 'attend' ? 'Guest experience' : 'Your next steps'}
        </div>

        <h3 className="max-w-md text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          {mode === 'attend' ? (
            <>
              Coming to <span className="text-orange">watch?</span>
            </>
          ) : mode === 'participate' ? (
            <>
              What happens <span className="text-orange">next?</span>
            </>
          ) : (
            <>
              What happens after you <span className="text-orange">register?</span>
            </>
          )}
        </h3>

        <div className="mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-orange to-orange/20" />
      </div>

      {mode === 'attend' ? (
        <>
          {/* Event details */}
          <ul className="relative mt-2 space-y-2">
            <li className="flex items-start gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.045] p-4 transition-all duration-300 hover:border-white/15 hover:bg-white/[0.08] sm:p-5">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-orange/15 ring-1 ring-orange/20">
                <PiCalendarCheckDuotone
                  className="size-6 text-orange"
                  aria-hidden="true"
                />
              </span>

              <div className="min-w-0 pt-0.5">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/45">
                  Save the date
                </p>
                <p className="mt-1.5 text-base font-bold leading-6 text-white sm:text-lg">
                  The finale is on {EVENT.eventDateLabel}.
                </p>
              </div>
            </li>

            <li className="relative flex items-start gap-4 overflow-hidden rounded-2xl border border-orange/25 bg-gradient-to-br from-orange/15 to-orange/[0.04] p-4 transition-all duration-300 hover:border-orange/40 sm:p-5">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-orange text-white shadow-lg shadow-orange/20">
                <PiHandPointingDuotone
                  className="size-6"
                  aria-hidden="true"
                />
              </span>

              <div className="min-w-0 pt-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-base font-bold text-white">
                    Free entry
                  </p>
                  <span className="rounded-full border border-orange/30 bg-orange/10 px-2 py-1 text-[9px] font-extrabold uppercase tracking-wider text-orange">
                    Invitation only
                  </span>
                </div>

                <p className="mt-2 text-sm leading-6 text-white/70">
                  Entry is <strong className="text-white">free</strong> but{' '}
                  <strong className="text-white">
                    strictly by invitation only
                  </strong>
                  . You need to register in advance to receive an invitation.
                </p>
              </div>
            </li>
          </ul>
        </>
      ) : (
        <>
          {/* Journey steps */}
          <ol className="relative mt-2 space-y-2">
            <div
              aria-hidden="true"
              className="absolute bottom-5 left-[19px] top-5 w-px bg-gradient-to-b from-orange/70 via-white/15 to-transparent"
            />

            {JOURNEY.map((step, i) => (
              <li
                key={step.title}
                className={`group/step relative flex items-center gap-4 rounded-2xl border px-4 py-1 transition-all duration-300 ${i === 0
                    ? 'border-orange/25 bg-orange/[0.09] shadow-lg shadow-black/5'
                    : 'border-white/[0.06] bg-white/[0.035] hover:border-white/15 hover:bg-white/[0.07]'
                  }`}
              >
                <span
                  className={`relative z-10 grid size-10 shrink-0 place-items-center rounded-xl text-sm font-extrabold transition-all duration-300 ${i === 0
                      ? 'bg-orange text-white shadow-md shadow-orange/25'
                      : 'border border-white/10 bg-[#25284F] text-white/70 group-hover/step:border-orange/30 group-hover/step:text-orange'
                    }`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                <span
                  className={`text-sm leading-6 sm:text-base ${i === 0
                      ? 'font-bold text-white'
                      : 'font-medium text-white/70'
                    }`}
                >
                  {step.title}
                </span>

                <span
                  aria-hidden="true"
                  className={`ml-auto text-lg transition-transform duration-300 group-hover/step:translate-x-1 ${i === 0 ? 'text-orange' : 'text-white/25'
                    }`}
                >
                  →
                </span>
              </li>
            ))}
          </ol>

          {/* Registration status */}
          <p className="relative mt-2 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold leading-6 text-white/85 lg:mt-auto lg:pt-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-orange/15">
              <PiClockCountdownDuotone
                className="size-5 text-orange"
                aria-hidden="true"
              />
            </span>

            <span className="pt-1">
              {participateOpen
                ? `Registrations and auditions close on ${EVENT.registrationCloseLabel}.`
                : `Participant registrations closed on ${EVENT.registrationCloseLabel}.`}
            </span>
          </p>
        </>
      )}

      {/* Bottom accent */}
      <div
        aria-hidden="true"
        className="relative mt-2 h-px bg-gradient-to-r from-orange/60 via-white/10 to-transparent"
      />
    </div>

  )
}

export default function RegistrationSection({ mode, onModeChange }) {
  const [result, setResult] = useState(null)
  const reg = useRegistrationOpen()
  const bodyRef = useRef(null)

  // A closed participant path falls back to the attend form.
  const activeMode = mode === 'participate' && !reg.open ? null : mode

  // Switching path (e.g. from the hero buttons) clears a previous success message.
  const [lastMode, setLastMode] = useState(mode)
  if (mode !== lastMode) {
    setLastMode(mode)
    setResult(null)
  }

  // Fixed-height scrolling card only once a form (or success panel) is showing.
  const expanded = Boolean(activeMode || result)

  // Reset the inner scroll whenever the form or success state changes.
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 })
  }, [activeMode, result])

  const handleSuccess = (data) => {
    setResult(data)
    document.getElementById('register')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section
      id="register"
      className="relative isolate scroll-mt-12 overflow-hidden bg-[#F7F8FC] py-12 sm:py-12 lg:py-12"
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(#10133D 1px, transparent 1px), linear-gradient(90deg, #10133D 1px, transparent 1px)',
            backgroundSize: '38px 38px',
            maskImage:
              'linear-gradient(to bottom, black, transparent 80%)',
          }}
        />

        <div className="absolute -left-40 top-10 size-[420px] rounded-full bg-indigo-200/35 blur-[100px]" />
        <div className="absolute -right-40 bottom-0 size-[440px] rounded-full bg-orange/10 blur-[110px]" />
      </div>

      <div className="container-page relative">
        {/* Section heading */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-4 py-2 shadow-sm shadow-indigo-950/[0.03]">
            <span className="size-2 rounded-full bg-orange" />
            <span className="text-[20px] font-extrabold uppercase tracking-[0.22em] text-indigo-950 sm:text-xs">
              Your next chapter starts here
            </span>
          </div>

          <h2 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-[#10133D] sm:text-5xl lg:text-7xl">
            Take the{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-orange">next step.</span>
              <span
                aria-hidden="true"
                className="absolute bottom-1 left-0 -z-0 h-3 w-full rounded-sm bg-orange/10 sm:bottom-2 sm:h-4"
              />
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-3xl leading-7 text-slate-600 sm:text-base sm:leading-8">
            Join us for an unforgettable celebration. Choose your experience,
            complete the form, and get ready to be part of something meaningful.
          </p>

          {/* Quick benefits */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 sm:text-sm">
              <span className="grid size-6 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  className="size-4"
                  aria-hidden="true"
                >
                  <path
                    d="m5 10 3.2 3.2L15 6.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              Simple registration
            </div>

            <span className="hidden size-1 rounded-full bg-slate-300 sm:block" />

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 sm:text-sm">
              <span className="grid size-6 place-items-center rounded-full bg-orange/10 text-orange">
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  className="size-4"
                  aria-hidden="true"
                >
                  <circle
                    cx="10"
                    cy="10"
                    r="6.5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                  <path
                    d="M10 6.5V10l2.5 1.5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              About 2 minutes
            </div>
          </div>
        </div>

        {/* Registration layout */}
        <div className="mx-auto mt-12 grid max-w-7xl items-stretch gap-6 lg:mt-16 lg:grid-cols-[0.82fr_1.18fr] lg:gap-8">
          {/* Information panel */}
          <div className="order-2 min-w-0 lg:order-1">
            <ContextPanel
              mode={activeMode}
              participateOpen={reg.open}
            />
          </div>

          {/* Form card */}
          <div
            className={`order-1 flex min-w-0 flex-col overflow-hidden rounded-[1.75rem] border border-white bg-white shadow-[0_25px_80px_-30px_rgba(16,19,61,0.2)] ring-1 ring-[#10133D]/[0.04] transition-shadow duration-300 hover:shadow-[0_30px_90px_-30px_rgba(16,19,61,0.25)] lg:order-2 ${expanded
                ? 'lg:h-[min(780px,calc(100dvh-8rem))]'
                : ''
              }`}
          >
            {/* Form header */}
            {!result && (
              <div className="relative shrink-0 overflow-hidden border-b border-slate-100 bg-gradient-to-br from-white via-white to-indigo-50/50 px-5 sm:px-8">
                <div
                  aria-hidden="true"
                  className="absolute right-0 top-0 h-28 w-28 rounded-full bg-orange/[0.055] blur-2xl"
                />

                <div className="relative mb-2 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[40px] font-extrabold uppercase tracking-[0.2em] text-orange sm:text-3xl">
                      Registration form
                    </p>
                    <h3 className="mt-1.5 text-xl font-extrabold tracking-tight text-[#10133D] sm:text-2xl">
                      Let’s get you started
                    </h3>
                  </div>

                  <div className="grid size-11 shrink-0 place-items-center rounded-2xl border border-indigo-100 bg-white text-[#353A91] shadow-sm sm:size-12">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="size-6"
                      aria-hidden="true"
                    >
                      <path
                        d="M12 3.5 19 7v5c0 4.3-3 7.2-7 8.5-4-1.3-7-4.2-7-8.5V7l7-3.5Z"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinejoin="round"
                      />
                      <path
                        d="m9 12 2 2 4-4"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                <ModeSelect
                  value={activeMode}
                  onChange={onModeChange}
                  participateOpen={reg.open}
                />
              </div>
            )}

            {/* Form body */}
            <div
              ref={bodyRef}
              className="min-h-0 flex-1 p-5 [scrollbar-gutter:stable] sm:p-8 lg:overflow-y-auto lg:overscroll-contain"
            >
              {result ? (
                <SuccessPanel
                  result={result}
                  onReset={() => {
                    setResult(null)
                    onModeChange(null)
                  }}
                />
              ) : (
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeMode ?? 'none'}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                  >
                    {activeMode === 'participate' && (
                      <ParticipantForm onSuccess={handleSuccess} />
                    )}

                    {activeMode === 'attend' && (
                      <AttendeeForm onSuccess={handleSuccess} />
                    )}

                    {!activeMode && (
                      <div className="flex min-h-[250px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-indigo-100 bg-gradient-to-b from-indigo-50/50 to-white px-5 py-10 text-center">
                        <div className="grid size-16 place-items-center rounded-2xl border border-indigo-100 bg-white text-[#353A91] shadow-sm">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="size-8"
                            aria-hidden="true"
                          >
                            <path
                              d="M12 5v14M5 12h14"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>

                        <h4 className="mt-5 text-lg font-extrabold text-[#10133D]">
                          Choose your experience
                        </h4>

                        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                          Select an option above to open the right registration
                          form and get started.
                        </p>

                        <div className="mt-5 flex flex-wrap justify-center gap-2">
                          <span className="rounded-full border border-indigo-100 bg-white px-3 py-1.5 text-xs font-semibold text-[#353A91]">
                            Participate
                          </span>
                          <span className="rounded-full border border-orange/20 bg-orange/5 px-3 py-1.5 text-xs font-semibold text-orange">
                            Attend
                          </span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

            {/* Bottom accent */}
            <div
              aria-hidden="true"
              className="h-1 shrink-0 bg-gradient-to-r from-[#10133D] via-[#353A91] to-orange"
            />
          </div>
        </div>
      </div>
    </section>

  )
}