import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { AnimatePresence, motion } from 'framer-motion'
import { zodResolver } from '@hookform/resolvers/zod'
import { PiCaretDownBold, PiInfoDuotone, PiCloudArrowUpDuotone } from 'react-icons/pi'
import Field from './Field'
import { fieldAria } from '../../lib/fieldAria'
import { SubmitButton, SubmitError, MobileInput } from './FormParts'
import VideoInput from './VideoInput'
import { EMPTY_VIDEO } from '../../lib/video'
import { participantSchema } from '../../lib/schemas'
import { submitRegistration } from '../../lib/api'
import { CATEGORIES, DISCLAIMER, EVENT } from '../../data/event'

export default function ParticipantForm({ onSuccess }) {
  const [submitError, setSubmitError] = useState('')
  const [uploadProgress, setUploadProgress] = useState(null)
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(participantSchema),
    mode: 'onTouched',
    defaultValues: { name: '', age: '', mobile: '', email: '', category: '', video: EMPTY_VIDEO, consent: false },
  })

  const onSubmit = async (values) => {
    setSubmitError('')
    const { video, ...fields } = values
    const isLink = video.mode === 'link'
    const category = CATEGORIES.find((c) => c.id === values.category)
    try {
      if (!isLink) setUploadProgress(0)
      await submitRegistration(
        {
          type: 'participant',
          ...fields,
          categoryLabel: category?.name,
          videoSource: video.mode,
          ...(isLink ? { videoLink: video.url } : {}),
        },
        { file: isLink ? null : video.file, onProgress: setUploadProgress },
      )
      onSuccess({ type: 'participant', name: values.name, category: category?.name })
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setUploadProgress(null)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <Field id="p-name" label="Full name" error={errors.name?.message}>
        <input
          type="text"
          autoComplete="name"
          placeholder="As you’d like it announced"
          className="field-input"
          {...fieldAria('p-name', errors.name)}
          {...register('name')}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-[0.6fr_1.4fr]">
        <Field id="p-age" label="Age" error={errors.age?.message} hint={`${EVENT.minAge}+ only`}>
          <input
            type="number"
            inputMode="numeric"
            min={EVENT.minAge}
            max={100}
            placeholder="Years"
            className="field-input"
            {...fieldAria('p-age', errors.age, true)}
            {...register('age')}
          />
        </Field>
        <Field id="p-mobile" label="Mobile number" error={errors.mobile?.message}>
          <MobileInput {...fieldAria('p-mobile', errors.mobile)} {...register('mobile')} />
        </Field>
      </div>

      <Field id="p-email" label="Email address" error={errors.email?.message}>
        <input
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          className="field-input"
          {...fieldAria('p-email', errors.email)}
          {...register('email')}
        />
      </Field>

      <Field id="p-category" label="Category" error={errors.category?.message} hint="Solo performances only">
        <div className="relative">
          <select
            className="field-input appearance-none pr-12"
            {...fieldAria('p-category', errors.category, true)}
            {...register('category')}
          >
            <option value="" disabled>
              Choose a category
            </option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} (solo)
              </option>
            ))}
          </select>
          <PiCaretDownBold
            className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-slate"
            aria-hidden="true"
          />
        </div>
      </Field>

      <Controller
        name="video"
        control={control}
        render={({ field }) => (
          <VideoInput
            id="p-video"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={errors.video?.message}
          />
        )}
      />

      <div className="rounded-2xl bg-mist p-4 sm:p-5">
        <p className="flex items-center gap-2 font-display text-lg font-bold">
          <PiInfoDuotone className="size-5 text-iris" aria-hidden="true" />
          Disclaimer
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate">{DISCLAIMER}</p>
        <label className="mt-4 flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            className="mt-0.5 size-5 shrink-0 cursor-pointer accent-orange"
            aria-invalid={errors.consent ? 'true' : 'false'}
            aria-describedby={errors.consent ? 'p-consent-error' : undefined}
            {...register('consent')}
          />
          <span className="text-[0.95rem] font-semibold">
            I am {EVENT.minAge} or older, I have read the disclaimer above and I agree to it.
          </span>
        </label>
        {errors.consent && (
          <p id="p-consent-error" className="field-error" role="alert">
            {errors.consent.message}
          </p>
        )}
      </div>

      <SubmitError message={submitError} />
      <SubmitButton submitting={isSubmitting}>Submit my registration</SubmitButton>
      <AnimatePresence>
        {uploadProgress !== null && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl bg-[linear-gradient(140deg,#20245E,#10133D)] p-4 text-white shadow-[0_20px_40px_-24px_rgba(16,19,61,0.8)]">
              <p className="flex items-center justify-between text-sm font-semibold">
                <span className="flex items-center gap-2">
                  <motion.span
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                    className="inline-flex"
                  >
                    <PiCloudArrowUpDuotone className="size-5 text-orange" aria-hidden="true" />
                  </motion.span>
                  {uploadProgress < 100 ? 'Uploading your video' : 'Finishing up'}
                </span>
                <span className="font-display text-lg tabular-nums">{uploadProgress}%</span>
              </p>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="relative h-full overflow-hidden rounded-full bg-[linear-gradient(90deg,#E76417,#F59E5B)]"
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ ease: 'easeOut', duration: 0.3 }}
                >
                  <motion.span
                    className="absolute inset-y-0 w-1/2 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)]"
                    animate={{ x: ['-100%', '250%'] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                  />
                </motion.div>
              </div>
              <p className="mt-2 text-xs text-white/60">Keep this page open until the upload finishes.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="text-center text-sm text-slate">
        Registrations and auditions close on {EVENT.registrationCloseLabel}.
      </p>
    </form>
  )
}