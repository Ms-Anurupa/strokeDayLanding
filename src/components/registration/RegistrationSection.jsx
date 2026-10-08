import { useState } from 'react'
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
    <div className="relative overflow-hidden rounded-3xl bg-ink p-7 text-white sm:p-9 lg:sticky lg:top-24">

      {mode === 'attend' ? (
        <>
          <h3 className="text-3xl font-extrabold">Coming to watch?</h3>
          <ul className="mt-6 space-y-5">
            <li className="flex gap-3">
              <PiCalendarCheckDuotone className="size-6 shrink-0 text-orange" aria-hidden="true" />
              <span className="text-white/85">The finale is on {EVENT.eventDateLabel}.</span>
            </li>
            <li className="flex gap-3">
              <PiHandPointingDuotone className="size-6 shrink-0 text-orange" aria-hidden="true" />
              <span className="text-white/85">
                Entry is <strong className="text-white">free</strong> but{' '}
                <strong className="text-white">strictly by invitation only</strong>. You need to register in advance
                to receive an invitation.
              </span>
            </li>
          </ul>
        </>
      ) : (
        <>
          <h3 className="text-3xl font-extrabold">{mode === 'participate' ? 'What happens next' : 'What happens after you register'}</h3>
          <ol className="mt-6 space-y-4">
            {JOURNEY.map((step, i) => (
              <li key={step.title} className="flex items-center gap-3">
                <span
                  className={`grid size-8 shrink-0 place-items-center rounded-full font-display text-sm font-bold ${
                    i === 0 ? 'bg-orange text-white' : 'bg-white/10 text-white'
                  }`}
                >
                  {i + 1}
                </span>
                <span className={i === 0 ? 'font-semibold' : 'text-white/80'}>{step.title}</span>
              </li>
            ))}
          </ol>
          <p className="mt-7 flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold">
            <PiClockCountdownDuotone className="size-5 shrink-0 text-orange" aria-hidden="true" />
            {participateOpen
              ? `Registrations and auditions close on ${EVENT.registrationCloseLabel}.`
              : `Participant registrations closed on ${EVENT.registrationCloseLabel}.`}
          </p>
        </>
      )}
    </div>
  )
}

export default function RegistrationSection({ mode, onModeChange }) {
  const [result, setResult] = useState(null)
  const reg = useRegistrationOpen()

  // A closed participant path falls back to the attend form.
  const activeMode = mode === 'participate' && !reg.open ? null : mode

  // Switching path (e.g. from the hero buttons) clears a previous success message.
  const [lastMode, setLastMode] = useState(mode)
  if (mode !== lastMode) {
    setLastMode(mode)
    setResult(null)
  }

  const handleSuccess = (data) => {
    setResult(data)
    document.getElementById('register')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section id="register" className="bg-white py-12 sm:py-12">
      <div className="container-page">
        <h2 className="section-title">Register now</h2>
        <p className="section-lead">Takes about two minutes. Keep your performance video link ready if you’re performing.</p>

        <div className="mt-12 grid items-start gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-8">
          <div className="order-2 lg:order-1">
            <ContextPanel mode={activeMode} participateOpen={reg.open} />
          </div>

          <div className="order-1 rounded-3xl bg-white p-5 shadow-[0_30px_60px_-30px_rgba(20,24,82,0.35)] ring-1 ring-line sm:p-8 lg:order-2">
            {result ? (
              <SuccessPanel
                result={result}
                onReset={() => {
                  setResult(null)
                  onModeChange(null)
                }}
              />
            ) : (
              <>
                <ModeSelect value={activeMode} onChange={onModeChange} participateOpen={reg.open} />

                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeMode ?? 'none'}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="mt-8 border-t border-line pt-8"
                  >
                    {activeMode === 'participate' && <ParticipantForm onSuccess={handleSuccess} />}
                    {activeMode === 'attend' && <AttendeeForm onSuccess={handleSuccess} />}
                    {!activeMode && (
                      <p className="rounded-2xl border-2 border-dashed border-line px-5 py-8 text-center text-slate">
                        Choose <strong className="text-navy">I want to participate</strong> or{' '}
                        <strong className="text-navy">I want to attend</strong> above to open the right form.
                      </p>
                    )}
                  </motion.div>
                </AnimatePresence>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
