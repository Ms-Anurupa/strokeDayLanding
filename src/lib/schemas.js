import { z } from 'zod'
import { EVENT } from '../data/event'
import { checkVideoFile } from './video'

const name = z
  .string()
  .trim()
  .min(2, 'Enter your full name.')
  .max(80, 'Name must be 80 characters or fewer.')
  .regex(/^[\p{L} .'-]+$/u, 'Use letters only in your name.')

const phone = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s-]/g, '').replace(/^(\+91|0)/, ''))
  .refine((v) => /^[6-9]\d{9}$/.test(v), 'Enter a valid 10-digit Indian mobile number.')

const email = z.string().trim().toLowerCase().email('Enter a valid email address, like name@example.com.')

export const participantSchema = z.object({
  name,
  age: z.coerce
    .number({ error: 'Enter your age in years.' })
    .int('Enter your age in whole years.')
    .min(EVENT.minAge, `Participants must be ${EVENT.minAge} years or older.`)
    .max(100, 'Enter a valid age.'),
  phone,
  email,
  category: z.enum(['singing', 'dancing', 'stand-up-comedy'], {
    error: 'Choose the category you will perform in.',
  }),
  video: z
    .object({
      mode: z.enum(['upload', 'record', 'link']),
      file: z.any().nullable(),
      url: z.string().trim(),
    })
    .superRefine((v, ctx) => {
      if (v.mode === 'link') {
        if (!v.url) ctx.addIssue({ code: 'custom', message: 'Paste a link to your performance video.' })
        else if (!/^https?:\/\/\S+\.\S+/i.test(v.url))
          ctx.addIssue({ code: 'custom', message: 'Paste the full link, starting with https://' })
        return
      }
      if (!(v.file instanceof Blob)) {
        ctx.addIssue({
          code: 'custom',
          message:
            v.mode === 'record'
              ? 'Record your video and tap “Use this video”, or choose another option.'
              : 'Choose a video to upload, or choose another option.',
        })
        return
      }
      const problem = checkVideoFile(v.file)
      if (problem) ctx.addIssue({ code: 'custom', message: problem })
    }),
  consent: z.literal(true, {
    error: 'Tick the box to accept the disclaimer before submitting.',
  }),
})

export const attendeeSchema = z.object({
  name,
  phone,
  email,
  consent: z.literal(true, {
    error: 'Tick the box to confirm you understand entry is by invitation only.',
  }),
})