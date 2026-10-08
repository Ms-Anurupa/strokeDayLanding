import { EVENT } from '../data/event'

export const MAX_VIDEO_MB = EVENT.maxVideoSizeMb
export const MAX_VIDEO_BYTES = MAX_VIDEO_MB * 1024 * 1024

/** Initial value for the performance video field. */
export const EMPTY_VIDEO = { mode: 'upload', file: null, url: '' }

export function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** Returns an error message, or '' when the file is an acceptable video. */
export function checkVideoFile(file) {
  if (!file) return 'Choose a video file.'
  if (file.type && !file.type.startsWith('video/')) return 'That file is not a video. Choose an MP4, MOV or WebM file.'
  if (file.size > MAX_VIDEO_BYTES) {
    return `This video is ${formatBytes(file.size)}. The limit is ${MAX_VIDEO_MB} MB, so trim it or export it at a lower quality.`
  }
  return ''
}