# Gurgaon's Got Talent — registration landing page

World Stroke Day 2026 initiative by Marengo Asia Hospitals, Gurugram. Event on 27 October 2026.
QR-led registration with two clearly separated paths: **I want to participate** and **I want to attend**.

## Stack
React 19 · Vite · Tailwind CSS v4 · react-icons (Phosphor) · react-hook-form + zod · framer-motion ·
self-hosted Bricolage Grotesque + Figtree (Fontsource).

## Run
```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # output in dist/
npm run preview
```

## QR codes
The page reads `?type=` to open the right form straight away:

| QR for | URL |
|---|---|
| Single QR (user chooses) | `https://<domain>/<path>/` |
| Participants | `https://<domain>/<path>/?type=participate` |
| Attendees | `https://<domain>/<path>/?type=attend` |

UTM params (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `ref`) are captured and sent with each
registration, e.g. `?type=participate&utm_source=qr&utm_medium=poster`.

## Connecting the backend
Copy `.env.example` to `.env` and set `VITE_REGISTRATION_API_URL`. Each submission is a JSON `POST`:

```jsonc
// participant
{ "type": "participant", "name": "", "age": 24, "mobile": "9876543210", "email": "",
  "category": "dancing", "categoryLabel": "Dancing", "videoLink": "https://…", "consent": true,
  "tracking": { "utm_source": "qr" }, "submittedAt": "ISO date" }
// attendee
{ "type": "attendee", "name": "", "mobile": "9876543210", "email": "", "consent": true,
  "tracking": {}, "submittedAt": "ISO date" }
```
Return a 2xx on success. On error, return `{ "message": "…" }` and it is shown to the user.
Without the env variable the form runs in demo mode and logs the payload to the console.

The backend should also enforce: age ≥ 18 and the participant deadline (10 Oct 2026, 23:59 IST).

## Editing content
All copy, dates, categories, steps, the disclaimer and FAQs live in `src/data/event.js`.
Brand colours and fonts are in the `@theme` block in `src/index.css`.

## Deploying under a sub-path
`vite.config.js` uses `base: './'`, so `dist/` works from any folder (e.g. `/ggn/talent/`) without changes.
