import { motion } from 'framer-motion'
import { PiSealCheckDuotone, PiArrowCounterClockwiseBold } from 'react-icons/pi'
import { EVENT } from '../../data/event'

export default function SuccessPanel({ result, onReset }) {
  const participant = result.type === 'participant'
  const firstName = result.name.split(' ')[0]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="py-6 text-center"
      role="status"
      aria-live="polite"
    >
      <span className="mx-auto grid size-20 place-items-center rounded-full bg-olive/12 text-olive">
        <PiSealCheckDuotone className="size-12" aria-hidden="true" />
      </span>
      <h3 className="mt-6 text-3xl font-extrabold sm:text-4xl">
        {participant ? `You’re registered, ${firstName}` : `Invitation requested, ${firstName}`}
      </h3>

      {participant ? (
        <div className="mx-auto mt-4 max-w-md space-y-3 text-slate">
          <p>
            Your entry for <strong className="text-navy">{result.category}</strong> is with the jury for audition and
            screening.
          </p>
          <p>
            Shortlisted performers will be contacted for the final on {EVENT.eventDateLabel}. Selection is at the sole
            discretion of the judges.
          </p>
        </div>
      ) : (
        <div className="mx-auto mt-4 max-w-md space-y-3 text-slate">
          <p>We’ve received your request to attend Gurgaon’s Got Talent on {EVENT.eventDateLabel}.</p>
          <p>Entry is free but strictly by invitation only, so please bring your invitation with you on the day.</p>
        </div>
      )}

      <button type="button" onClick={onReset} className="btn cursor-pointer btn-navy mt-8">
        <PiArrowCounterClockwiseBold className="size-4" aria-hidden="true" />
        Register someone else
      </button>
    </motion.div>
  )
}
