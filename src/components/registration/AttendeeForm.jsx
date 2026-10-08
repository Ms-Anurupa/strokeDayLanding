import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PiTicketDuotone } from 'react-icons/pi'
import Field from './Field'
import { fieldAria } from '../../lib/fieldAria'
import { SubmitButton, SubmitError, MobileInput } from './FormParts'
import { attendeeSchema } from '../../lib/schemas'
import { submitRegistration } from '../../lib/api'
import { ATTENDEE_NOTE, EVENT } from '../../data/event'

export default function AttendeeForm({ onSuccess }) {
  const [submitError, setSubmitError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(attendeeSchema),
    mode: 'onTouched',
    defaultValues: { name: '', mobile: '', email: '', consent: false },
  })

  const onSubmit = async (values) => {
    setSubmitError('')
    try {
      await submitRegistration({ type: 'attendee', ...values })
      onSuccess({ type: 'attendee', name: values.name })
    } catch (err) {
      setSubmitError(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="flex gap-3 rounded-2xl bg-orange/8 p-4 ring-1 ring-orange/25">
        <PiTicketDuotone className="mt-0.5 size-6 shrink-0 text-orange" aria-hidden="true" />
        <p className="text-[0.95rem] font-semibold text-navy">{ATTENDEE_NOTE}</p>
      </div>

      <Field id="a-name" label="Full name" error={errors.name?.message}>
        <input
          type="text"
          autoComplete="name"
          placeholder="Your full name"
          className="field-input"
          {...fieldAria('a-name', errors.name)}
          {...register('name')}
        />
      </Field>

      <Field id="a-mobile" label="Mobile number" error={errors.mobile?.message}>
        <MobileInput {...fieldAria('a-mobile', errors.mobile)} {...register('mobile')} />
      </Field>

      <Field id="a-email" label="Email address" error={errors.email?.message}>
        <input
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          className="field-input"
          {...fieldAria('a-email', errors.email)}
          {...register('email')}
        />
      </Field>

      <div>
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-mist p-4">
          <input
            type="checkbox"
            className="mt-0.5 size-5 shrink-0 cursor-pointer accent-orange"
            aria-invalid={errors.consent ? 'true' : 'false'}
            aria-describedby={errors.consent ? 'a-consent-error' : undefined}
            {...register('consent')}
          />
          <span className="text-[0.95rem] font-semibold">
            I understand that entry is strictly by invitation only, and that this registration is a request for an
            invitation.
          </span>
        </label>
        {errors.consent && (
          <p id="a-consent-error" className="field-error" role="alert">
            {errors.consent.message}
          </p>
        )}
      </div>

      <SubmitError message={submitError} />
      <SubmitButton submitting={isSubmitting}>Request my invitation</SubmitButton>
      <p className="text-center text-sm text-slate">Event date: {EVENT.eventDateLabel}</p>
    </form>
  )
}
