import { AnimatePresence, motion } from 'framer-motion'
import {
  PiNotePencilDuotone,
  PiFilmSlateDuotone,
  PiListChecksDuotone,
  PiMicrophoneStageDuotone,
  PiTrophyDuotone,
  PiCalendarBlankDuotone,
  PiTicketDuotone,
  PiMagnifyingGlassDuotone,
  PiEnvelopeSimpleOpenDuotone,
  PiConfettiDuotone,
} from 'react-icons/pi'
import { JOURNEY, EVENT } from '../../data/event'

const ease = [0.22, 1, 0.36, 1]

/* Participant steps reuse JOURNEY from event.js, same order as the big Journey section */
const PARTICIPANT_ICONS = [
  PiNotePencilDuotone,
  PiFilmSlateDuotone,
  PiListChecksDuotone,
  PiMicrophoneStageDuotone,
  PiTrophyDuotone,
]

const PARTICIPANT_DATES = {
  0: `Closes ${EVENT.registrationCloseLabel}`,
  3: EVENT.eventDateLabel,
  4: 'At the finale',
}


const ATTENDEE_STEPS = [
  {
    title: 'Request your invitation',
    text: 'Your experience begins with a simple request. Share your contact details to apply for your complimentary invitation.',
    icon: PiTicketDuotone,
    eyebrow: 'STEP 01 · GET STARTED',
    accent: 'indigo',
    details: [
      'Enter your name, phone number and email address.',
      'Review your contact details before submitting.',
      'Submit your request for the organising team to review.',
    ],
    tip: 'Guest entry is free, subject to invitation and availability.',
  },
  {
    title: 'We review your request',
    text: 'Our organising team reviews guest requests and available seating before confirming invitations.',
    icon: PiMagnifyingGlassDuotone,
    eyebrow: 'STEP 02 · UNDER REVIEW',
    accent: 'blue',
    details: [
      'The team reviews requests based on available seating.',
      'Keep your registered contact details accessible.',
      'Look out for official updates from the organisers.',
    ],
    tip: 'Submitting a request does not guarantee an invitation.',
  },
  {
    title: 'Receive your invitation',
    text: 'Once confirmed, your invitation and event instructions will be shared through your registered contact details.',
    icon: PiEnvelopeSimpleOpenDuotone,
    eyebrow: 'STEP 03 · CONFIRMATION',
    accent: 'orange',
    details: [
      'Check your registered email and phone for confirmation.',
      'Read the arrival and venue instructions carefully.',
      'Keep your invitation handy for entry.',
    ],
    tip: 'Follow the details provided in your official invitation.',
  },
  {
    title: 'Experience the grand finale',
    text: 'Take your place among the guests and enjoy an unforgettable celebration of performances, achievements and awards.',
    icon: PiConfettiDuotone,
    eyebrow: 'STEP 04 · THE BIG DAY',
    accent: 'gold',
    date: EVENT.eventDateLabel,
    details: [
      'Arrive according to the instructions on your invitation.',
      'Follow the venue entry and seating arrangements.',
      'Enjoy the performances and celebrate the participants.',
    ],
    tip: 'Use your invitation for the confirmed date and arrival time.',
  },
]


const JOURNEYS = {
  participate: {
    heading: 'Your journey as a performer',
    subtitle: 'Every participant goes through the same steps.',
    steps: JOURNEY.map((step, i) => ({
      ...step,
      icon: PARTICIPANT_ICONS[i] ?? PiListChecksDuotone,
      date: PARTICIPANT_DATES[i],
    })),
  },
  attend: {
    heading: 'Your journey as a guest',
    subtitle: 'Entry is by invitation only. Here is how it works.',
    steps: ATTENDEE_STEPS,
  },
}

export default function ModeJourney({ mode }) {
  const journey = JOURNEYS[mode]
  if (!journey) return null

  return (
    <section
      aria-labelledby="mode-journey-title"
      className="relative mt-6 overflow-hidden rounded-3xl bg-mist p-5 ring-1 ring-line sm:p-6"
    >
      {/* Soft accent glow */}
      <div
        className="pointer-events-none absolute -top-16 -right-16 size-44 rounded-full bg-orange/10 blur-2xl"
        aria-hidden="true"
      />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease }}
          className="relative"
        >
          <h3 id="mode-journey-title" className="font-display text-xl font-extrabold text-navy">
            {journey.heading}
          </h3>
          <p className="mt-1 text-sm text-slate">{journey.subtitle}</p>

          <ol className="relative mt-6 space-y-6">
            {/* Vertical connector, centred on the 2.75rem nodes */}
            <span
              className="absolute top-5 bottom-5 left-[1.3125rem] w-0.5 rounded-full bg-[linear-gradient(180deg,#353A91,#E76417)] opacity-40"
              aria-hidden="true"
            />

            {journey.steps.map((step, i) => {
              const Icon = step.icon
              const last = i === journey.steps.length - 1

              return (
                <motion.li
                  key={step.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, ease, delay: 0.08 + i * 0.07 }}
                  className="relative flex gap-4"
                >
                  {/* Node */}
                  <span className="relative z-10 shrink-0">
                    <span
                      className={`grid size-11 place-items-center rounded-full ring-4 ring-mist ${
                        last
                          ? 'bg-[linear-gradient(140deg,#F07A2E,#E76417_50%,#C8540F)] text-white shadow-[0_10px_24px_-10px_rgba(231,100,23,0.9)]'
                          : 'bg-[linear-gradient(140deg,#2A2F7A,#20245E)] text-white shadow-[0_10px_20px_-12px_rgba(16,19,61,0.8)]'
                      }`}
                    >
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span
                      className={`absolute -top-1 -right-1 grid size-5 place-items-center rounded-full font-display text-[0.7rem] font-extrabold shadow ${
                        last ? 'bg-white text-orange' : 'bg-orange text-white'
                      }`}
                    >
                      {i + 1}
                    </span>
                  </span>

                  {/* Copy */}
                  <div className="min-w-0 pt-0.5">
                    <p className="font-display text-base leading-tight font-bold text-navy">{step.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate">{step.text}</p>
                    {step.date && (
                      <p
                        className={`mt-2 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs leading-tight font-semibold ${
                          last ? 'bg-orange text-white' : 'bg-white text-navy ring-1 ring-line'
                        }`}
                      >
                        <PiCalendarBlankDuotone className="size-3.5" aria-hidden="true" />
                        {step.date}
                      </p>
                    )}
                  </div>
                </motion.li>
              )
            })}
          </ol>
        </motion.div>
      </AnimatePresence>
    </section>
  )
}