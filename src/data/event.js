import {
  PiMicrophoneStageDuotone,
  PiSneakerMoveDuotone,
  PiMaskHappyDuotone,
} from 'react-icons/pi'


export const EVENT = {
  name: "Gurgaon's Got Talent",
  organiser: 'Marengo Asia Hospitals, Gurugram',
  initiative: 'World Stroke Day 2026',
  eventDateLabel: '27 October 2026',
  eventDate: new Date('2026-10-27T00:00:00+05:30'),
  registrationCloseLabel: '10 October 2026',
  // Registrations close at the end of 10 October 2026, India time.
  registrationClose: new Date('2026-10-10T23:59:59+05:30'),
  minAge: 18,
  maxVideoSizeMb: 100,
  website: 'https://www.marengoasiahospitals.com',
}

export const CATEGORIES = [
  {
    id: 'singing',
    name: 'Singing',
    line: 'Your voice, your song.',
    icon: PiMicrophoneStageDuotone,
    accent: 'orange',
  },
  {
    id: 'dancing',
    name: 'Dancing',
    line: 'Any style, one performer.',
    icon: PiSneakerMoveDuotone,
    accent: 'olive',
  },
  {
    id: 'stand-up-comedy',
    name: 'Stand-up Comedy',
    line: 'Your set, your material.',
    icon: PiMaskHappyDuotone,
    accent: 'iris',
  },
]

export const JOURNEY = [
  {
    title: 'Digital registration',
    text: `Fill in the form and share a link to your performance video by ${EVENT.registrationCloseLabel}.`,
  },
  {
    title: 'Audition and screening',
    text: 'The jury reviews every video entry received.',
  },
  {
    title: 'Shortlisting',
    text: 'Shortlisted performers are contacted for the final round.',
  },
  {
    title: 'Final performance',
    text: `Shortlisted performers take the stage live on ${EVENT.eventDateLabel}.`,
  },
  {
    title: 'Awards',
    text: 'Winners in each category are chosen by the judges and awarded at the event.',
  },
]

export const DISCLAIMER =
  "Participation in Gurgaon's Got Talent does not guarantee selection for the final round. Shortlisting and selection of participants and winners will be at the sole discretion of the appointed judges. The judges' decision shall be final and binding."

export const ATTENDEE_NOTE =
  'Entry is FREE but strictly by invitation only. Prior invitation/registration is required for entry.'

export const BE_FAST = [
  { letter: 'B', word: 'Balance', text: 'Sudden loss of balance or coordination' },
  { letter: 'E', word: 'Eyes', text: 'Sudden blurred, double or lost vision' },
  { letter: 'F', word: 'Face', text: 'One side of the face droops' },
  { letter: 'A', word: 'Arms', text: 'Weakness or numbness in one arm' },
  { letter: 'S', word: 'Speech', text: 'Slurred or confused speech' },
  { letter: 'T', word: 'Time', text: 'Call for emergency help right away' },
]

export const FAQS = [
  {
    q: 'Who can take part?',
    a: `Anyone aged ${EVENT.minAge} or above can register to perform.`,
  },
  {
    q: 'Can I perform as a duo or a group?',
    a: 'No. All three categories (Singing, Dancing and Stand-up Comedy) are for solo performances only.',
  },
  {
    q: 'How do I submit my performance video?',
    a: `Upload your video (${EVENT.maxVideoSizeMb} MB maximum) to Google Drive, YouTube (unlisted is fine) or a similar service, make sure the link can be opened by anyone, and paste the link in the registration form.`,
  },
  {
    q: 'When do registrations close?',
    a: `Registrations and auditions close on ${EVENT.registrationCloseLabel}.`,
  },
  {
    q: 'Does registering guarantee a spot in the final?',
    a: DISCLAIMER,
  },
  {
    q: 'I only want to watch. Do I need to register?',
    a: `Yes. ${ATTENDEE_NOTE} Choose “I want to attend” in the form to request your invitation.`,
  },
]
