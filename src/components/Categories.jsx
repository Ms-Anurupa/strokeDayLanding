import { motion } from 'framer-motion'
import { PiUserFocusDuotone, PiArrowRightBold } from 'react-icons/pi'
import { CATEGORIES } from '../data/event'

/*
 * Background photos (free under the Unsplash License, hotlinked from Unsplash's CDN).
 * Keys match the category ids in event.js.
 */
const PHOTOS = {
  singing: {
    src: 'https://images.unsplash.com/photo-1767376133991-a3306ad0817f',
    position: 'center 30%',
    credit: 'Amonwat Dumkrut',
    page: 'https://unsplash.com/photos/woman-singing-passionately-into-a-microphone-on-stage-Q2mu2to7jWo',
  },
  dancing: {
    src: 'https://images.unsplash.com/photo-1533993010187-6a08e5a05ec9',
    position: 'center 35%',
    credit: 'Jonathan Chng',
    page: 'https://unsplash.com/photos/woman-splitting-legs-on-stage-0S4drpmfx9M',
  },
  'stand-up-comedy': {
    src: 'https://images.unsplash.com/photo-1641903806973-17eaf2d2634f',
    position: 'center 40%',
    credit: 'Simon H',
    page: 'https://unsplash.com/photos/a-microphone-on-a-stand-in-front-of-a-brick-wall-B53qfHDHa_Y',
  },
}

/* Accent keys come from event.js ('orange' | 'olive' | 'iris'). */
const ACCENTS = {
  orange: { base: '#E76417', tint: '231, 100, 23' },
  olive: { base: '#A39A1C', tint: '122, 114, 14' },
  iris: { base: '#6C71D6', tint: '53, 58, 145' },
}

const unsplash = (src, width) => `${src}?auto=format&fit=crop&w=${width}&q=72`

const ease = [0.22, 1, 0.36, 1]

const listMotion = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14 } },
}

const cardMotion = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
}

const photoMotion = {
  hidden: { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.18 },
  show: { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, transition: { duration: 1.1, ease } },
}

function CategoryCard({ cat }) {
  const Icon = cat.icon
  const a = ACCENTS[cat.accent] ?? ACCENTS.iris
  const photo = PHOTOS[cat.id]

  return (
    <motion.li variants={cardMotion}>
      <article className="group relative isolate flex h-[27rem] flex-col justify-end overflow-hidden rounded-[1.75rem] bg-[#10133D] shadow-[0_30px_60px_-34px_rgba(16,19,61,0.7)] ring-1 ring-black/5 transition-[transform,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-[0_44px_80px_-36px_rgba(16,19,61,0.85)] focus-within:-translate-y-1.5 sm:h-[30rem]">
        {/* Background photo */}
        {photo && (
          <motion.div variants={photoMotion} className="absolute inset-0 -z-20 overflow-hidden">
            <img
              src={unsplash(photo.src, 900)}
              srcSet={`${unsplash(photo.src, 600)} 600w, ${unsplash(photo.src, 900)} 900w, ${unsplash(photo.src, 1300)} 1300w`}
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 42rem, 100vw"
              alt=""
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.currentTarget.style.visibility = 'hidden'
              }}
              style={{ objectPosition: photo.position }}
              className="size-full object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-110"
            />
          </motion.div>
        )}

        {/* Navy fade for legibility, with a touch of the category colour */}
        <div
          className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(16,19,61,0.25)_0%,rgba(16,19,61,0.35)_35%,rgba(16,19,61,0.92)_78%,#10133D_100%)]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 -z-10 opacity-60 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: `radial-gradient(90% 55% at 50% 100%, rgba(${a.tint}, 0.45), transparent 70%)` }}
          aria-hidden="true"
        />

        {/* Top row */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 sm:p-6">
          <span className="grid size-12 place-items-center rounded-2xl bg-white/12 text-white ring-1 ring-white/25 backdrop-blur-md transition-colors duration-300 group-hover:bg-white group-hover:text-[#10133D]">
            <Icon className="size-7" aria-hidden="true" />
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/20 backdrop-blur-md">
            <PiUserFocusDuotone className="size-4" aria-hidden="true" />
            Solo
          </span>
        </div>

        {/* Content */}
        <div className="relative p-6 text-white sm:p-7">
          <span
            className="mb-4 block h-1 w-12 rounded-full transition-[width] duration-500 group-hover:w-20"
            style={{ background: a.base }}
            aria-hidden="true"
          />
          <h3 className="text-[2rem] leading-none font-extrabold sm:text-[2.35rem]">{cat.name}</h3>
          <p className="mt-2.5 text-lg text-white/75">{cat.line}</p>

          <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/15 pt-5">
            <span className="text-sm font-semibold text-white/80">Solo performances only</span>
            <a
              href="#register"
              className="inline-flex items-center gap-2 rounded-full bg-white py-1.5 pr-1.5 pl-4 text-sm font-bold text-[#10133D] transition-colors duration-300 hover:bg-[#E76417] hover:text-white"
              aria-label={`Register to perform in ${cat.name}`}
            >
              Register
              <span className="grid size-7 place-items-center rounded-full bg-[#10133D] text-white transition-transform duration-300 group-hover:translate-x-0.5">
                <PiArrowRightBold className="size-3.5" aria-hidden="true" />
              </span>
            </a>
          </div>
        </div>
      </article>
    </motion.li>
  )
}

export default function Categories() {
  const credits = CATEGORIES.map((c) => PHOTOS[c.id]).filter(Boolean)

  return (
    <section id="categories" className="py-12 sm:py-12">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease }}
          className="grid gap-4 lg:grid-cols-2 lg:items-end"
        >
          <h2 className="section-title">Three categories, all solo</h2>
          <p className="max-w-xl text-lg text-slate lg:justify-self-end">
            Pick the one that shows you at your best. Every category is for solo performances only.
          </p>
        </motion.div>

        <motion.ul
          variants={listMotion}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-10 grid gap-5 md:mx-auto md:max-w-2xl lg:max-w-none lg:grid-cols-3 lg:gap-6"
        >
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.id} cat={cat} />
          ))}
        </motion.ul>

        {credits.length > 0 && (
          <p className="mt-5 text-xs text-slate/70">
            Photos:{' '}
            {credits.map((c, i) => (
              <span key={c.page}>
                <a href={c.page} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">
                  {c.credit}
                </a>
                {i < credits.length - 1 ? ', ' : ''}
              </span>
            ))}{' '}
            on Unsplash
          </p>
        )}
      </div>
    </section>
  )
}