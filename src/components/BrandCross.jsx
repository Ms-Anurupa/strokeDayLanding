/** The four-arm cross from the Marengo Asia Hospitals mark, drawn as an SVG. */
export default function BrandCross({ className = '' }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <rect x="80" y="8" width="40" height="80" rx="10" fill="#EF6B23" />
      <rect x="112" y="80" width="80" height="40" rx="10" fill="#8E9C2C" />
      <rect x="80" y="112" width="40" height="80" rx="10" fill="#5A5FD0" />
      <rect x="8" y="80" width="80" height="40" rx="10" fill="#FFFFFF" />
    </svg>
  )
}
