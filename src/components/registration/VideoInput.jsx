import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  PiUploadSimpleDuotone,
  PiVideoCameraDuotone,
  PiLinkSimpleBold,
  PiXBold,
  PiRecordFill,
  PiStopFill,
  PiArrowCounterClockwiseBold,
  PiCheckBold,
  PiFilmStripDuotone,
  PiCameraRotateDuotone,
  PiDeviceMobileCameraDuotone,
  PiWarningCircleFill,
  PiCloudArrowUpDuotone,
  PiGoogleDriveLogoDuotone,
  PiYoutubeLogoDuotone,
  PiDropboxLogoDuotone,
  PiCloudDuotone,
  PiSealCheckFill,
} from 'react-icons/pi'
import { MAX_VIDEO_MB, MAX_VIDEO_BYTES, EMPTY_VIDEO, formatBytes, checkVideoFile as checkFile } from '../../lib/video'

const MAX_RECORD_SECONDS = 180 
const RECORD_BITRATE = 2_500_000
const COUNTDOWN_FROM = 3

const MODES = [
  { value: 'upload', label: 'Upload video', icon: PiUploadSimpleDuotone },
  { value: 'record', label: 'Record now', icon: PiVideoCameraDuotone },
  { value: 'link', label: 'Paste link', icon: PiLinkSimpleBold },
]

const spring = { type: 'spring', stiffness: 420, damping: 32 }
const panelMotion = {
  initial: { opacity: 0, y: 14, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -8, filter: 'blur(4px)', transition: { duration: 0.18 } },
}

/* Effects Tailwind cannot express: rotating gradient border, floating icon, ripple rings, shimmer. */
const VIDEO_STYLES = `
@property --vi-angle { syntax: '<angle>'; inherits: false; initial-value: 0deg; }
@keyframes vi-spin { to { --vi-angle: 360deg; } }
@keyframes vi-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
@keyframes vi-ripple { 0% { transform: scale(0.8); opacity: 0.55; } 100% { transform: scale(1.9); opacity: 0; } }
@keyframes vi-rec { 0%, 100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.55); } 50% { box-shadow: 0 0 0 6px rgba(220, 38, 38, 0); } }
.vi-border {
  position: relative;
  isolation: isolate;
}
.vi-border::before {
  content: "";
  position: absolute;
  inset: -2px;
  z-index: -1;
  border-radius: inherit;
  background: conic-gradient(from var(--vi-angle), #E76417, #353A91, #7A720E, #E76417);
  opacity: 0;
  transition: opacity 0.3s ease;
  animation: vi-spin 4s linear infinite;
}
.vi-border:hover::before,
.vi-border[data-active="true"]::before,
.vi-border:has(:focus-visible)::before { opacity: 1; }
.vi-float { animation: vi-float 3.2s ease-in-out infinite; }
.vi-ripple { animation: vi-ripple 2.4s ease-out infinite; }
.vi-rec { animation: vi-rec 1.4s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) {
  .vi-border::before, .vi-float, .vi-ripple, .vi-rec { animation: none; }
}
`

function formatTime(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

function pickRecorderMimeType() {
  if (typeof window === 'undefined' || !window.MediaRecorder) return ''
  const candidates = ['video/mp4;codecs=avc1,mp4a', 'video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm']
  return candidates.find((t) => window.MediaRecorder.isTypeSupported?.(t)) ?? ''
}

/** Recognises the service a pasted link points to. */
function detectProvider(url) {
  const value = url.trim()
  if (!/^https?:\/\/\S+\.\S+/i.test(value)) return null
  if (/(drive|docs)\.google\.com/i.test(value)) return { name: 'Google Drive', icon: PiGoogleDriveLogoDuotone }
  if (/(youtube\.com|youtu\.be)/i.test(value)) return { name: 'YouTube', icon: PiYoutubeLogoDuotone }
  if (/dropbox\.com/i.test(value)) return { name: 'Dropbox', icon: PiDropboxLogoDuotone }
  if (/(onedrive\.live\.com|1drv\.ms|sharepoint\.com)/i.test(value)) return { name: 'OneDrive', icon: PiCloudDuotone }
  if (/vimeo\.com/i.test(value)) return { name: 'Vimeo', icon: PiFilmStripDuotone }
  return { name: 'Video link', icon: PiLinkSimpleBold }
}

/** Ref callback that points a <video> at a File, and frees the object URL when it changes (React 19 ref cleanup). */
function useVideoSrc(file) {
  return useCallback(
    (el) => {
      if (!el || !file) return undefined
      const url = URL.createObjectURL(file)
      el.src = url
      return () => {
        el.removeAttribute('src')
        URL.revokeObjectURL(url)
      }
    },
    [file],
  )
}

/** Error line with a short shake each time the message changes. */
function ErrorLine({ id, message }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.p
          key={message}
          id={id}
          role="alert"
          className="field-error"
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, x: [0, -6, 6, -4, 4, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <PiWarningCircleFill className="size-4 shrink-0" aria-hidden="true" />
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  )
}

/* ------------------------------------------------------------------ */
/* Selected video preview                                              */
/* ------------------------------------------------------------------ */

function SelectedVideo({ file, source, onRemove }) {
  const videoRef = useVideoSrc(file)
  const [duration, setDuration] = useState(null)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className="relative overflow-hidden rounded-2xl bg-white shadow-[0_24px_50px_-28px_rgba(16,19,61,0.45)] ring-1 ring-line"
    >
      <div className="relative bg-ink">
        <video
          ref={videoRef}
          controls
          playsInline
          preload="metadata"
          onLoadedMetadata={(e) => Number.isFinite(e.currentTarget.duration) && setDuration(e.currentTarget.duration)}
          className="aspect-video w-full bg-ink object-contain"
        />
        <motion.span
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="pointer-events-none absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-navy shadow-sm backdrop-blur"
        >
          <PiSealCheckFill className="size-4 text-olive" aria-hidden="true" />
          Ready to submit
        </motion.span>
      </div>

      <div className="flex items-center gap-3 p-4">
        <span className="relative grid size-11 shrink-0 place-items-center rounded-xl bg-olive/12 text-olive">
          <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
            <motion.path
              d="M5 12.5l4.2 4.2L19 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
            />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-navy">{file.name}</p>
          <p className="text-sm text-slate">
            {source === 'record' ? 'Recorded video' : 'Uploaded video'} · {formatBytes(file.size)}
            {duration ? ` · ${formatTime(duration)}` : ''}
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-mist" title={`${formatBytes(file.size)} of ${MAX_VIDEO_MB} MB`}>
            <motion.div
              className="h-full rounded-full bg-[linear-gradient(90deg,#7A720E,#353A91)]"
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(2, Math.min(100, (file.size / MAX_VIDEO_BYTES) * 100))}%` }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
        <motion.button
          type="button"
          onClick={onRemove}
          whileTap={{ scale: 0.95 }}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-mist px-3.5 py-2 text-sm font-semibold text-navy ring-1 ring-line transition-colors hover:bg-danger/10 hover:text-danger hover:ring-danger/30"
        >
          <PiXBold className="size-3.5" aria-hidden="true" />
          Remove
        </motion.button>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* Upload from device / Google Drive                                   */
/* ------------------------------------------------------------------ */

function UploadPanel({ id, onFile, describedBy }) {
  const [dragging, setDragging] = useState(false)
  const [localError, setLocalError] = useState('')

  const accept = (file) => {
    const problem = checkFile(file)
    setLocalError(problem)
    if (!problem) onFile(file)
  }

  return (
    <div>
      <motion.label
        htmlFor={id}
        data-active={dragging}
        animate={{ scale: dragging ? 1.015 : 1 }}
        transition={spring}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          const file = e.dataTransfer.files?.[0]
          if (file) accept(file)
        }}
        className="vi-border group block cursor-pointer rounded-2xl"
      >
        <span
          className={`relative flex flex-col items-center overflow-hidden rounded-2xl border-2 border-dashed px-5 py-9 text-center transition-colors ${
            dragging ? 'border-transparent bg-white' : 'border-line bg-[linear-gradient(180deg,#FFFFFF,#F5F5FA)] group-hover:border-transparent'
          }`}
        >
          {/* soft glow */}
          <span
            className="pointer-events-none absolute -top-16 left-1/2 size-56 -translate-x-1/2 rounded-full bg-iris/10 blur-3xl transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          />

          <span className="relative grid size-20 place-items-center">
            <span className="vi-ripple absolute inset-0 rounded-full bg-iris/20" aria-hidden="true" />
            <span className="vi-ripple absolute inset-0 rounded-full bg-orange/15 [animation-delay:1.2s]" aria-hidden="true" />
            <span className="vi-float relative grid size-16 place-items-center rounded-2xl bg-[linear-gradient(140deg,#353A91,#20245E)] text-white shadow-[0_14px_30px_-12px_rgba(53,58,145,0.8)]">
              <PiCloudArrowUpDuotone className="size-9" aria-hidden="true" />
            </span>
          </span>

          <span className="relative mt-5 font-display text-xl font-bold text-navy">
            {dragging ? 'Drop your video here' : 'Choose a video to upload'}
          </span>
          <span className="relative mt-1.5 max-w-sm text-sm text-slate">
            Drag it here, or browse your phone, computer or Google Drive.
          </span>

          <span className="relative mt-4 flex flex-wrap justify-center gap-1.5">
            {['MP4', 'MOV', 'WebM', `Up to ${MAX_VIDEO_MB} MB`].map((chip) => (
              <span key={chip} className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate ring-1 ring-line">
                {chip}
              </span>
            ))}
          </span>

          <span className="btn btn-orange relative mt-6 px-6 py-2.5 text-sm">
            <PiUploadSimpleDuotone className="size-5" aria-hidden="true" />
            Browse files
          </span>
        </span>

        <input
          id={id}
          type="file"
          accept="video/*"
          className="sr-only"
          aria-describedby={describedBy}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) accept(file)
            e.target.value = ''
          }}
        />
      </motion.label>
      <ErrorLine message={localError} />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Record in the browser                                               */
/* ------------------------------------------------------------------ */

function RecordPanel({ onFile }) {
  const liveRef = useRef(null)
  const streamRef = useRef(null)
  const recorderRef = useRef(null)
  const chunksRef = useRef([])
  const bytesRef = useRef(0)
  const timerRef = useRef(null)
  const countdownRef = useRef(null)

  const [status, setStatus] = useState('idle') // idle | starting | ready | countdown | recording | recorded | error
  const [facing, setFacing] = useState('user')
  const [seconds, setSeconds] = useState(0)
  const [count, setCount] = useState(COUNTDOWN_FROM)
  const [recorded, setRecorded] = useState(null)
  const [message, setMessage] = useState('')
  const recordedRef = useVideoSrc(recorded)

  const supported =
    typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia && typeof window.MediaRecorder !== 'undefined'

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
  }

  const clearTimers = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (countdownRef.current) clearInterval(countdownRef.current)
    timerRef.current = null
    countdownRef.current = null
  }

  useEffect(
    () => () => {
      clearTimers()
      if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
      stopStream()
    },
    [],
  )

  const startCamera = async (nextFacing = facing) => {
    setMessage('')
    setStatus('starting')
    stopStream()
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: nextFacing, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      })
      streamRef.current = stream
      if (liveRef.current) {
        liveRef.current.srcObject = stream
        await liveRef.current.play().catch(() => {})
      }
      setStatus('ready')
    } catch (err) {
      stopStream()
      setStatus('error')
      setMessage(
        err?.name === 'NotAllowedError'
          ? 'Camera access was blocked. Allow camera and microphone for this site in your browser settings, then try again.'
          : 'We could not open your camera. Use the camera app option below, or upload a video instead.',
      )
    }
  }

  const flipCamera = () => {
    const next = facing === 'user' ? 'environment' : 'user'
    setFacing(next)
    startCamera(next)
  }

  const beginRecording = () => {
    const stream = streamRef.current
    if (!stream) return
    const mimeType = pickRecorderMimeType()
    let recorder
    try {
      recorder = new MediaRecorder(stream, {
        ...(mimeType ? { mimeType } : {}),
        videoBitsPerSecond: RECORD_BITRATE,
      })
    } catch {
      setStatus('error')
      setMessage('Recording is not supported in this browser. Use the camera app option below instead.')
      return
    }

    chunksRef.current = []
    bytesRef.current = 0
    recorder.ondataavailable = (e) => {
      if (e.data?.size) {
        chunksRef.current.push(e.data)
        bytesRef.current += e.data.size
        if (bytesRef.current >= MAX_VIDEO_BYTES * 0.97 && recorder.state === 'recording') recorder.stop()
      }
    }
    recorder.onstop = () => {
      clearTimers()
      const type = recorder.mimeType || mimeType || 'video/webm'
      const ext = type.includes('mp4') ? 'mp4' : 'webm'
      const blob = new Blob(chunksRef.current, { type })
      const file = new File([blob], `performance-recording.${ext}`, { type })
      stopStream()
      setRecorded(file)
      setStatus('recorded')
    }

    recorderRef.current = recorder
    recorder.start(1000)
    setSeconds(0)
    setStatus('recording')
    const startedAt = Date.now()
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startedAt) / 1000
      setSeconds(elapsed)
      if (elapsed >= MAX_RECORD_SECONDS && recorder.state === 'recording') recorder.stop()
    }, 250)
  }

  /** 3-2-1 countdown, then record. */
  const startRecording = () => {
    setCount(COUNTDOWN_FROM)
    setStatus('countdown')
    let n = COUNTDOWN_FROM
    countdownRef.current = setInterval(() => {
      n -= 1
      if (n <= 0) {
        clearInterval(countdownRef.current)
        countdownRef.current = null
        beginRecording()
      } else {
        setCount(n)
      }
    }, 1000)
  }

  const stopRecording = () => {
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
  }

  const recordAgain = () => {
    setRecorded(null)
    setSeconds(0)
    startCamera()
  }

  const attachRecording = () => {
    const problem = checkFile(recorded)
    if (problem) {
      setMessage(problem)
      return
    }
    onFile(recorded)
  }

  const showLive = ['starting', 'ready', 'countdown', 'recording'].includes(status)
  const progress = Math.min(100, (seconds / MAX_RECORD_SECONDS) * 100)

  return (
    <div className="space-y-4">
      {supported && (
        <div
          className={`overflow-hidden rounded-2xl bg-ink shadow-[0_24px_50px_-28px_rgba(16,19,61,0.6)] ring-2 transition-colors duration-300 ${
            status === 'recording' ? 'vi-rec ring-red-500' : 'ring-transparent'
          }`}
        >
          <div className="relative aspect-video">
            {/* Live camera */}
            <video
              ref={liveRef}
              muted
              playsInline
              autoPlay
              className={`absolute inset-0 size-full object-cover ${facing === 'user' ? '-scale-x-100' : ''} ${
                showLive ? '' : 'hidden'
              }`}
            />

            {/* Recorded preview */}
            {status === 'recorded' && recorded && (
              <video ref={recordedRef} controls playsInline className="absolute inset-0 size-full bg-ink object-contain" />
            )}

            {/* Idle and error states */}
            <AnimatePresence>
              {(status === 'idle' || status === 'error') && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden px-6 text-center text-white"
                >
                  <span
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_30%,rgba(53,58,145,0.85),transparent_70%)]"
                    aria-hidden="true"
                  />
                  <span className="relative grid size-20 place-items-center">
                    <span className="vi-ripple absolute inset-0 rounded-full bg-orange/30" aria-hidden="true" />
                    <span className="vi-ripple absolute inset-0 rounded-full bg-white/15 [animation-delay:1.2s]" aria-hidden="true" />
                    <span className="relative grid size-16 place-items-center rounded-full bg-orange text-white shadow-[0_12px_30px_-8px_rgba(231,100,23,0.9)]">
                      <PiVideoCameraDuotone className="size-8" aria-hidden="true" />
                    </span>
                  </span>
                  <p className="relative mt-4 font-display text-xl font-bold">Record your performance here</p>
                  <p className="relative mt-1 max-w-sm text-sm text-white/70">
                    Up to {MAX_RECORD_SECONDS / 60} minutes. Your browser will ask for camera and microphone access.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {status === 'starting' && (
              <div className="absolute inset-0 grid place-items-center">
                <span className="flex items-center gap-2 rounded-full bg-black/50 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                  <span className="size-2 animate-ping rounded-full bg-orange" aria-hidden="true" />
                  Opening camera…
                </span>
              </div>
            )}

            {/* 3-2-1 countdown */}
            <AnimatePresence>
              {status === 'countdown' && (
                <motion.div
                  key={count}
                  initial={{ opacity: 0, scale: 1.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 grid place-items-center bg-black/35"
                  aria-live="assertive"
                >
                  <span className="font-display text-8xl font-extrabold text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                    {count}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {status === 'recording' && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-3 left-3 flex items-center gap-2 rounded-full bg-black/55 px-3 py-1.5 text-sm font-bold text-white tabular-nums backdrop-blur"
                >
                  <span className="relative flex size-2.5" aria-hidden="true">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-500 opacity-75" />
                    <span className="relative inline-flex size-2.5 rounded-full bg-red-500" />
                  </span>
                  REC {formatTime(seconds)} / {formatTime(MAX_RECORD_SECONDS)}
                </motion.div>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-white/15">
                  <div
                    className="h-full bg-[linear-gradient(90deg,#E76417,#DC2626)] transition-[width] duration-300 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </>
            )}

            {status === 'ready' && (
              <motion.button
                type="button"
                onClick={flipCamera}
                whileTap={{ rotate: 180, scale: 0.9 }}
                className="absolute top-3 right-3 grid size-10 place-items-center rounded-full bg-black/55 text-white backdrop-blur transition-colors hover:bg-black/70"
                aria-label="Switch between front and back camera"
              >
                <PiCameraRotateDuotone className="size-5" aria-hidden="true" />
              </motion.button>
            )}
          </div>

          {/* Controls */}
          <div className="flex min-h-[4.25rem] flex-wrap items-center justify-center gap-2 bg-white p-3">
            <AnimatePresence mode="wait" initial={false}>
              {(status === 'idle' || status === 'error') && (
                <motion.button
                  key="on"
                  {...panelMotion}
                  type="button"
                  onClick={() => startCamera()}
                  className="btn btn-navy px-5 py-2.5 text-sm"
                >
                  <PiVideoCameraDuotone className="size-5" aria-hidden="true" />
                  Turn on camera
                </motion.button>
              )}
              {status === 'ready' && (
                <motion.button
                  key="start"
                  {...panelMotion}
                  type="button"
                  onClick={startRecording}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  className="btn btn-orange px-5 py-2.5 text-sm"
                >
                  <PiRecordFill className="size-4" aria-hidden="true" />
                  Start recording
                </motion.button>
              )}
              {status === 'countdown' && (
                <motion.p key="count" {...panelMotion} className="text-sm font-semibold text-slate">
                  Get ready…
                </motion.p>
              )}
              {status === 'recording' && (
                <motion.button
                  key="stop"
                  {...panelMotion}
                  type="button"
                  onClick={stopRecording}
                  whileTap={{ scale: 0.96 }}
                  className="btn bg-danger px-5 py-2.5 text-sm text-white hover:bg-danger/90"
                >
                  <PiStopFill className="size-4" aria-hidden="true" />
                  Stop recording
                </motion.button>
              )}
              {status === 'recorded' && (
                <motion.div key="done" {...panelMotion} className="flex flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    onClick={recordAgain}
                    className="btn bg-mist px-5 py-2.5 text-sm text-navy ring-1 ring-line hover:bg-white"
                  >
                    <PiArrowCounterClockwiseBold className="size-4" aria-hidden="true" />
                    Record again
                  </button>
                  <motion.button
                    type="button"
                    onClick={attachRecording}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    className="btn btn-orange px-5 py-2.5 text-sm"
                  >
                    <PiCheckBold className="size-4" aria-hidden="true" />
                    Use this video
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {recorded && status === 'recorded' && (
        <p className="text-sm text-slate">
          Recording size: {formatBytes(recorded.size)}. Tap <strong className="text-navy">Use this video</strong> to attach it.
        </p>
      )}

      <ErrorLine message={message} />

      {/* Native camera app (most reliable on phones) */}
      <label className="group flex cursor-pointer items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-line transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-18px_rgba(16,19,61,0.4)] has-[:focus-visible]:ring-orange">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-iris/10 text-iris transition-colors group-hover:bg-iris group-hover:text-white">
          <PiDeviceMobileCameraDuotone className="size-6" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-navy">
            {supported ? 'Or record with your phone’s camera app' : 'Record with your camera app'}
          </span>
          <span className="block text-sm text-slate">The video is attached automatically when you finish.</span>
        </span>
        <input
          type="file"
          accept="video/*"
          capture="user"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0]
            e.target.value = ''
            if (!file) return
            const problem = checkFile(file)
            setMessage(problem)
            if (!problem) onFile(file)
          }}
        />
      </label>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Paste a link                                                        */
/* ------------------------------------------------------------------ */

function LinkPanel({ id, url, error, errorId, onChange }) {
  const provider = detectProvider(url)
  const ProviderIcon = provider?.icon

  return (
    <div>
      <div className="vi-border rounded-2xl" data-active={Boolean(provider)}>
        <div className="relative rounded-2xl bg-white">
          <PiFilmStripDuotone
            className={`pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 transition-colors ${
              provider ? 'text-iris' : 'text-slate'
            }`}
            aria-hidden="true"
          />
          <input
            id={id}
            type="url"
            inputMode="url"
            placeholder="https://drive.google.com/…"
            value={url}
            onChange={(e) => onChange(e.target.value)}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? errorId : `${id}-hint`}
            className="field-input pr-12 pl-12"
          />
          <AnimatePresence>
            {provider && (
              <motion.span
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                transition={spring}
                className="absolute top-1/2 right-3 grid size-7 -translate-y-1/2 place-items-center rounded-full bg-olive text-white"
                aria-hidden="true"
              >
                <PiCheckBold className="size-4" />
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {provider ? (
          <motion.p
            key={provider.name}
            {...panelMotion}
            className="mt-2.5 inline-flex items-center gap-2 rounded-full bg-olive/10 px-3 py-1.5 text-sm font-semibold text-olive"
          >
            <ProviderIcon className="size-4" aria-hidden="true" />
            {provider.name === 'Video link' ? 'Link looks good' : `${provider.name} link detected`}
          </motion.p>
        ) : (
          !error && (
            <motion.p key="hint" {...panelMotion} id={`${id}-hint`} className="field-hint">
              Paste a Google Drive, YouTube or similar link. Make sure anyone with the link can view it.
            </motion.p>
          )
        )}
      </AnimatePresence>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Field                                                               */
/* ------------------------------------------------------------------ */

/**
 * Performance video field. Value shape: { mode: 'upload' | 'record' | 'link', file: File | null, url: string }
 * Use with react-hook-form's <Controller>.
 */
export default function VideoInput({ id, value = EMPTY_VIDEO, onChange, onBlur, error }) {
  const errorId = `${id}-error`
  const pillId = useId()
  const setMode = (mode) => onChange({ ...EMPTY_VIDEO, mode })

  return (
    <div onBlur={onBlur}>
      <style>{VIDEO_STYLES}</style>

      <p id={`${id}-label`} className="field-label">
        Performance video
      </p>

      <AnimatePresence mode="wait" initial={false}>
        {value.file ? (
          <SelectedVideo key="selected" file={value.file} source={value.mode} onRemove={() => setMode(value.mode)} />
        ) : (
          <motion.div key="picker" {...panelMotion}>
            {/* Mode switch with sliding highlight */}
            <div
              role="radiogroup"
              aria-labelledby={`${id}-label`}
              className="mb-4 grid grid-cols-3 gap-1 rounded-2xl bg-mist p-1 ring-1 ring-line"
            >
              {MODES.map((m) => {
                const Icon = m.icon
                const active = value.mode === m.value
                return (
                  <button
                    key={m.value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setMode(m.value)}
                    className={`relative flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2.5 text-xs font-semibold transition-colors sm:flex-row sm:gap-2 sm:text-sm ${
                      active ? 'text-navy' : 'text-slate hover:text-navy'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId={pillId}
                        transition={spring}
                        className="absolute inset-0 rounded-xl bg-white shadow-[0_6px_16px_-8px_rgba(16,19,61,0.35)] ring-1 ring-line"
                        aria-hidden="true"
                      />
                    )}
                    <Icon
                      className={`relative size-5 transition-[color,transform] duration-300 ${active ? 'scale-110 text-orange' : ''}`}
                      aria-hidden="true"
                    />
                    <span className="relative">{m.label}</span>
                  </button>
                )
              })}
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={value.mode} {...panelMotion}>
                {value.mode === 'upload' && (
                  <UploadPanel
                    id={id}
                    describedBy={error ? errorId : undefined}
                    onFile={(file) => onChange({ mode: 'upload', file, url: '' })}
                  />
                )}
                {value.mode === 'record' && <RecordPanel onFile={(file) => onChange({ mode: 'record', file, url: '' })} />}
                {value.mode === 'link' && (
                  <LinkPanel
                    id={id}
                    url={value.url}
                    error={error}
                    errorId={errorId}
                    onChange={(url) => onChange({ mode: 'link', file: null, url })}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <ErrorLine id={errorId} message={error} />
    </div>
  )
}