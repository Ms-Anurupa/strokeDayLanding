import { EVENT } from '../data/event'

export default function Footer() {
  return (
    <footer className="border-t border-line bg-mist pt-14 pb-28 md:pb-14">
      <div className="container-page">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <img src="./marengo-logo.png" alt="Marengo Asia Hospitals" className="h-14 w-auto" width="200" height="126" loading="lazy" />
            <p className="max-w-xs border-l border-line pl-5 text-sm text-slate">
              {EVENT.name} is a {EVENT.initiative} initiative by {EVENT.organiser}.
            </p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-[0.95rem] font-semibold">
            <a href="#categories" className="hover:text-orange">Categories</a>
            <a href="#how-it-works" className="hover:text-orange">How it works</a>
            <a href="#register" className="hover:text-orange">Register</a>
            <a href="#faq" className="hover:text-orange">FAQ</a>
            <a href={EVENT.website} target="_blank" rel="noopener noreferrer" className="hover:text-orange">
              marengoasiahospitals.com
            </a>
          </nav>
        </div>
        <p className="mt-10 border-t border-line pt-6 text-sm text-slate">
          © 2026 Marengo Asia Hospitals. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
