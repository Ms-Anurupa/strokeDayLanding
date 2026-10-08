const API_URL = import.meta.env.VITE_REGISTRATION_API_URL

/** UTM and QR tracking params from the landing URL, e.g. ?utm_source=qr&utm_medium=poster */
function getTrackingParams() {
  const params = new URLSearchParams(window.location.search)
  const tracking = {}
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'ref']) {
    const value = params.get(key)
    if (value) tracking[key] = value
  }
  return tracking
}

const NETWORK_ERROR = 'Your registration was not sent. Check your internet connection and try again.'
const SERVER_ERROR = 'Your registration was not sent. Please try again in a moment.'

/** Multipart upload with progress, used when a video file is attached. */
function sendWithFile(payload, file, onProgress) {
  return new Promise((resolve, reject) => {
    const form = new FormData()
    form.append('data', JSON.stringify(payload))
    form.append('video', file, file.name)

    const xhr = new XMLHttpRequest()
    xhr.open('POST', API_URL)
    xhr.responseType = 'json'

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100))
    }
    xhr.onload = () => {
      const body = xhr.response ?? {}
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress?.(100)
        resolve(body)
      } else {
        reject(new Error(body.message || SERVER_ERROR))
      }
    }
    xhr.onerror = () => reject(new Error(NETWORK_ERROR))
    xhr.ontimeout = () => reject(new Error(NETWORK_ERROR))
    xhr.send(form)
  })
}


export async function submitRegistration(data, { file = null, onProgress } = {}) {
  const payload = {
    ...data,
    tracking: getTrackingParams(),
    submittedAt: new Date().toISOString(),
  }

  if (!API_URL) {
    if (file) {
      for (let p = 0; p <= 100; p += 10) {
        onProgress?.(p)
        await new Promise((resolve) => setTimeout(resolve, 120))
      }
    } else {
      await new Promise((resolve) => setTimeout(resolve, 900))
    }
    console.info('[demo mode] Registration payload:', payload, file ? `+ video "${file.name}" (${file.size} bytes)` : '')
    return { ok: true, demo: true }
  }

  if (file) return sendWithFile(payload, file, onProgress)

  let response
  try {
    response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new Error(NETWORK_ERROR)
  }

  const body = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(body.message || SERVER_ERROR)
  }
  return body
}