import { PiMicrophoneStageDuotone, PiTicketDuotone, PiCheckBold } from 'react-icons/pi'
import { EVENT, ATTENDEE_NOTE } from '../data/event'

const PARTICIPANT_POINTS = [
  `You must be ${EVENT.minAge} years or older.`,
  'Solo performances only, in Singing, Dancing or Stand-up Comedy.',
  `Upload or record a video of your performance (${EVENT.maxVideoSizeMb} MB maximum), or share a link to it.`,
  `Registrations and auditions close on ${EVENT.registrationCloseLabel}.`,
]

const ATTENDEE_POINTS = [
  'Entry is free.',
  'Entry is strictly by invitation only.',
  'Register in advance to request your invitation. You cannot enter without one.',
]

function Panel({ icon: Icon, title, points, tone, footnote }) {
  const dark = tone === 'dark'
  return (
    <div className={`rounded-3xl p-7 sm:p-9 ${dark ? 'bg-ink text-white' : 'bg-white ring-1 ring-line'}`}>
      <div className="flex items-center gap-4">
        <span className={`grid size-12 place-items-center rounded-2xl ${dark ? 'bg-orange text-white' : 'bg-navy text-white'}`}>
          <Icon className="size-7" aria-hidden="true" />
        </span>
        <h3 className="text-2xl font-extrabold sm:text-3xl">{title}</h3>
      </div>
      <ul className="mt-7 space-y-4">
        {points.map((p) => (
          <li key={p} className="flex gap-3">
            <PiCheckBold className={`mt-1 size-5 shrink-0 ${dark ? 'text-orange' : 'text-olive'}`} aria-hidden="true" />
            <span className={dark ? 'text-white/85' : 'text-slate'}>{p}</span>
          </li>
        ))}
      </ul>
      {footnote && (
        <p className={`mt-7 rounded-2xl px-4 py-3 text-sm font-semibold ${dark ? 'bg-white/10' : 'bg-mist text-navy'}`}>
          {footnote}
        </p>
      )}
    </div>
  )
}

export default function KeyInfo() {
  return (
    <section className="py-12 sm:py-12">
      <div className="container-page">
        <h2 className="section-title">Before you register</h2>
        <p className="section-lead">Performing and attending have separate registrations. Here’s what each needs.</p>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <Panel
            icon={PiMicrophoneStageDuotone}
            title="If you want to perform"
            points={PARTICIPANT_POINTS}
            tone="dark"
            footnote="Selection is decided by the appointed judges. Registering does not guarantee a place in the final."
          />
          <Panel
            icon={PiTicketDuotone}
            title="If you want to watch"
            points={ATTENDEE_POINTS}
            tone="light"
            footnote={ATTENDEE_NOTE}
          />
        </div>
      </div>
    </section>
  )
}