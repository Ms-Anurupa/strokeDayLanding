import { EVENT } from '../data/event'
import { useCountdown } from './useCountdown'

/** Participant registrations close at EVENT.registrationClose (end of 10 Oct 2026, IST). */
export function useRegistrationOpen() {
  const countdown = useCountdown(EVENT.registrationClose)
  return { ...countdown, open: !countdown.done }
}
