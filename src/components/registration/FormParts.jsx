import { PiSpinnerGapBold, PiWarningCircleFill } from 'react-icons/pi'

export function SubmitButton({ submitting, children }) {
  return (
    <button type="submit" disabled={submitting} className="btn cursor-pointer btn-orange w-full py-4 text-lg">
      {submitting ? (
        <>
          <PiSpinnerGapBold className="size-5 animate-spin" aria-hidden="true" />
          Submitting…
        </>
      ) : (
        children
      )}
    </button>
  )
}

export function SubmitError({ message }) {
  if (!message) return null
  return (
    <div role="alert" className="flex gap-3 rounded-2xl bg-danger/8 px-4 py-3 text-sm font-medium text-danger ring-1 ring-danger/25">
      <PiWarningCircleFill className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      {message}
    </div>
  )
}

/** "+91" adornment wrapper for the mobile number input. */
export function MobileInput(props) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center border-r border-line pr-3 pl-4 font-semibold text-slate">
        +91
      </span>
      <input
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        placeholder="98765 43210"
        maxLength={16}
        className="field-input pl-[4.6rem]"
        {...props}
      />
    </div>
  )
}
