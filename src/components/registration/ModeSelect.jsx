import { PiMicrophoneStageDuotone, PiTicketDuotone, PiCheckCircleFill, PiLockSimpleDuotone } from 'react-icons/pi'
import { EVENT } from '../../data/event'

const OPTIONS = [
  {
    value: 'participate',
    title: 'I want to participate',
    text: 'Register to perform and send your audition video',
    icon: PiMicrophoneStageDuotone,
  },
  {
    value: 'attend',
    title: 'I want to attend',
    text: 'Request a free invitation to watch the finale',
    icon: PiTicketDuotone,
  },
]

export default function ModeSelect({ value, onChange, participateOpen }) {
  return (
    <fieldset>
      <legend className="font-display text-2xl font-extrabold text-navy">What would you like to do?</legend>
      <p className="mt-1 text-slate">Choose one. Performers and guests register separately.</p>

      <div role="radiogroup" className="mt-5 grid gap-3 sm:grid-cols-2">
        {OPTIONS.map((opt) => {
          const selected = value === opt.value
          const closed = opt.value === 'participate' && !participateOpen
          const Icon = closed ? PiLockSimpleDuotone : opt.icon
          return (
            <label
              key={opt.value}
              className={`relative flex cursor-pointer gap-4 rounded-2xl p-4 ring-2 transition-[background-color,box-shadow] has-[:focus-visible]:ring-orange sm:p-5 ${
                selected ? 'bg-navy text-white ring-navy' : 'bg-white ring-line hover:ring-iris/50'
              } ${closed ? 'cursor-not-allowed opacity-60' : ''}`}
            >
              <input
                type="radio"
                name="registration-type"
                value={opt.value}
                checked={selected}
                disabled={closed}
                onChange={() => onChange(opt.value)}
                className="sr-only"
              />
              <span
                className={`grid size-12 shrink-0 place-items-center rounded-xl ${
                  selected ? 'bg-orange text-white' : 'bg-mist text-navy'
                }`}
              >
                <Icon className="size-7" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-lg leading-tight font-bold">{opt.title}</span>
                <span className={`mt-1 block text-sm ${selected ? 'text-white/75' : 'text-slate'}`}>
                  {closed ? `Registrations closed on ${EVENT.registrationCloseLabel}` : opt.text}
                </span>
              </span>
              {selected && <PiCheckCircleFill className="absolute top-3 right-3 size-5 text-orange" aria-hidden="true" />}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
