import { motion } from 'framer-motion'
import { PiHeartbeatDuotone, PiPhoneCallDuotone, PiClockCountdownDuotone } from 'react-icons/pi'
import { BE_FAST } from '../data/event'

const ease = [0.22, 1, 0.36, 1]

/* ECG trace across the panel: flat, a heartbeat, flat, a heartbeat, flat. */
const ECG_PATH =
  'M0 60 H260 L280 60 L292 30 L304 92 L318 8 L334 104 L348 60 H700 L720 60 L732 30 L744 92 L758 8 L774 104 L788 60 H1200'

/* Effects Tailwind cannot express, scoped with an "sa-" prefix. */
const STROKE_STYLES = `
@keyframes sa-pulse-run { from { stroke-dashoffset: 1400; } to { stroke-dashoffset: 0; } }
@keyframes sa-ring { 0% { transform: scale(1); opacity: 0.55; } 100% { transform: scale(1.35); opacity: 0; } }
.sa-pulse { stroke-dasharray: 180 1220; animation: sa-pulse-run 3.2s linear infinite; }
.sa-ring { animation: sa-ring 1.8s ease-out infinite; }
.sa-grain::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  opacity: 0.08;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
@media (prefers-reduced-motion: reduce) {
  .sa-pulse, .sa-ring { animation: none; }
}
`

function LetterTile({ item, index }) {
  const isTime = item.letter === 'T'

  return (
    <motion.li
      variants={{
        hidden: { opacity: 0, y: 30, rotateX: -35 },
        show: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.65, ease, delay: 0.25 + index * 0.1 } },
      }}
      className="group relative [perspective:800px]"
    >
      {isTime && <span className="sa-ring absolute inset-0 rounded-2xl ring-2 ring-[#E76417]" aria-hidden="true" />}
      <div
        className={`relative flex h-full flex-col rounded-2xl p-5 ring-1 backdrop-blur transition-[transform,background-color,box-shadow] duration-300 group-hover:-translate-y-1.5 ${
          isTime
            ? 'bg-[linear-gradient(150deg,#F07A2E,#E76417_55%,#C8540F)] shadow-[0_24px_44px_-18px_rgba(231,100,23,0.9)] ring-[#F59E5B]'
            : 'bg-white/[0.06] ring-white/10 group-hover:bg-white/[0.1] group-hover:shadow-[0_22px_40px_-24px_rgba(0,0,0,0.9)]'
        }`}
      >
        <span
          className={`block font-display text-[3.75rem] leading-[0.85] font-extrabold [font-variation-settings:'wdth'_75] transition-transform duration-300 group-hover:scale-110 sm:text-7xl ${
            isTime ? 'text-white' : 'text-[#E76417]'
          }`}
          style={{ transformOrigin: 'left bottom' }}
          aria-hidden="true"
        >
          {item.letter}
        </span>
        <span className="mt-4 block font-display text-lg font-bold text-white">{item.word}</span>
        <span className={`mt-1 block text-sm leading-snug ${isTime ? 'text-white/90' : 'text-white/65'}`}>
          {item.text}
        </span>
      </div>
    </motion.li>
  )
}

export default function StrokeAwareness() {
  return (
    <section className="py-12 sm:py-12">
      <style>{STROKE_STYLES}</style>

      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease }}
          className="sa-grain relative isolate overflow-hidden rounded-[2rem] bg-[linear-gradient(155deg,#20245E_0%,#10133D_62%)] px-5 py-10 text-white shadow-[0_40px_80px_-40px_rgba(16,19,61,0.8)] sm:px-10 sm:py-14 lg:px-14"
        >
          {/* Lighting */}
          <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
            <div className="absolute -top-40 -right-32 size-[30rem] rounded-full bg-[#353A91]/70 blur-3xl" />
            <div className="absolute -bottom-48 -left-24 size-[26rem] rounded-full bg-[#E76417]/20 blur-3xl" />
          </div>

          <div className="relative grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-14">
            {/* Copy */}
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] py-1.5 pr-4 pl-1.5 text-sm font-semibold ring-1 ring-white/15">
                <span className="grid size-7 place-items-center rounded-full bg-[#E76417]">
                  <PiHeartbeatDuotone className="size-4" aria-hidden="true" />
                </span>
                World Stroke Day, 29 October
              </p>
              {/* ECG trace */}
              <svg viewBox="0 0 1200 112" preserveAspectRatio="none" className="mt-6 h-12 w-full max-w-md sm:h-14" aria-hidden="true">
                <motion.path
                  d={ECG_PATH}
                  fill="none"
                  stroke="rgba(255,255,255,0.18)"
                  strokeWidth="3"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 2.2, ease: 'easeInOut' }}
                />
                <path
                  d={ECG_PATH}
                  fill="none"
                  stroke="#E76417"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="sa-pulse"
                  style={{ filter: 'drop-shadow(0 0 5px rgba(231,100,23,0.9))' }}
                />
              </svg>

              <h2 className="section-title mt-4 text-white">Why a talent show for World Stroke Day?</h2>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">
                World Stroke Day is observed every year on 29 October. Gurgaon’s Got Talent brings the city together
                around it, with one message we want every guest to take home: spot a stroke early and act fast.
              </p>
              <p className="mt-4 max-w-xl text-lg text-white/75">
                Remember the signs with <strong className="text-white">BE FAST</strong>. When you notice them, every
                minute counts.
              </p>
            </div>

            {/* BE FAST */}
            <div>
              <motion.ul
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.25 }}
                aria-label="BE FAST: the signs of a stroke"
                className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4"
              >
                {BE_FAST.map((item, i) => (
                  <LetterTile key={item.word} item={item} index={i} />
                ))}
              </motion.ul>

              {/* Act fast strip */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease, delay: 0.9 }}
                className="mt-4 flex flex-col gap-3 rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10 sm:flex-row sm:items-center sm:gap-5 sm:p-5"
              >
                <span className="flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#E76417]/15 text-[#F28C4E] ring-1 ring-[#E76417]/30">
                    <PiPhoneCallDuotone className="size-6" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold text-white">Noticed a sign? Call for emergency help right away.</span>
                </span>
                <span className="flex items-center gap-3 sm:ml-auto">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10 text-white/85 ring-1 ring-white/15">
                    <PiClockCountdownDuotone className="size-6" aria-hidden="true" />
                  </span>
                  <span className="text-sm text-white/75">Note the time the symptoms started.</span>
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}