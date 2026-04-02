import {
  FaArrowUp,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaRegEnvelope,
  FaTwitter,
} from "react-icons/fa";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-white border-t border-emerald-600 font-emerald text-emerald-900">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:px-10 lg:grid-cols-4 lg:gap-10">
        <div>
          <div className="inline-flex items-center text-2xl font-semibold">
            HaatBazar
          </div>
          <p className="mt-6 max-w-xs text-base leading-relaxed text-emerald-800/90">
            Connecting Nepali farmers and buyers for fresher produce, fair pricing, and stronger communities.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a
              href="#"
              aria-label="Facebook"
              className="grid h-11 w-11 place-items-center rounded-full bg-emerald-200 text-emerald-900 transition hover:bg-emerald-300"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="grid h-11 w-11 place-items-center rounded-full bg-emerald-200 text-emerald-900 transition hover:bg-emerald-300"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="grid h-11 w-11 place-items-center rounded-full bg-emerald-200 text-emerald-900 transition hover:bg-emerald-300"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="grid h-11 w-11 place-items-center rounded-full bg-emerald-200 text-emerald-900 transition hover:bg-emerald-300"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-3xl font-semibold">Quick Links</h3>
          <nav className="mt-5 flex flex-col gap-3 text-base text-emerald-800/90">
            <a href="#" className="transition hover:text-emerald-900">
              About Us
            </a>
            <a href="#" className="transition hover:text-emerald-900">
              Community
            </a>
            <a href="#" className="transition hover:text-emerald-900">
              Events
            </a>
            <a href="#" className="transition hover:text-emerald-900">
              Discussion Forum
            </a>
            <a href="#" className="transition hover:text-emerald-900">
              Business Directory
            </a>
            <a href="#" className="transition hover:text-emerald-900">
              Job Portal
            </a>
          </nav>
        </div>

        <div>
          <h3 className="text-3xl font-semibold">Services</h3>
          <ul className="mt-5 space-y-3 text-base text-emerald-800/90">
            <li>Education</li>
            <li>Healthcare</li>
            <li>Volunteer</li>
            <li>Mentorship</li>
            <li>Career Counseling</li>
            <li>Other</li>
          </ul>
        </div>

        <div>
          <h3 className="text-3xl font-semibold">Contact Us</h3>
          <div className="mt-5 space-y-4 text-base text-emerald-800/90">
            <p className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-emerald-500" /> Kathmandu, Nepal
            </p>
            <p className="flex items-center gap-3">
              <FaPhoneAlt className="text-emerald-500" /> +977 123-456-7890
            </p>
            <p className="flex items-center gap-3">
              <FaRegEnvelope className="text-emerald-500" /> info@haatbazar.com
            </p>
          </div>

          <div className="mt-7">
            <h4 className="text-2xl font-semibold">Newsletter</h4>
            <form className="mt-3 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Your email"
                className="h-12 w-full rounded-md border border-emerald-400 bg-white px-4 text-sm text-emerald-900 placeholder:text-emerald-500 outline-none"
              />
              <button
                type="submit"
                className="h-12 rounded-md bg-emerald-600 px-6 text-sm font-semibold text-white transition hover:bg-emerald-500"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-emerald-600">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-7 text-sm text-emerald-800/80 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <p>&copy; {new Date().getFullYear()} HaatBazar. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
            <a href="#" className="transition hover:text-emerald-900">
              Privacy Policy
            </a>
            <a href="#" className="transition hover:text-emerald-900">
              Terms & Conditions
            </a>
            <a href="#" className="transition hover:text-emerald-900">
              Cookie Policy
            </a>
            {/* <button
              type="button"
              onClick={scrollToTop}
              className="ml-auto grid h-11 w-11 place-items-center rounded-full bg-emerald-600 text-white transition hover:bg-emerald-500"
              aria-label="Back to top"
            >
              <FaArrowUp />
            </button> */}
          </div>
        </div>
      </div>
    </footer>
  );
}