export default function Topbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-white">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-2.5 lg:px-7">
        <a
          href="/"
          className="text-[29px] font-bold leading-none tracking-tight text-emerald-800"
        >
          HaatBazar
        </a>

        <nav
          className="hidden items-center gap-6 md:flex"
          aria-label="Main navigation text-lg"
        >
          <a
            href="/"
            className="border-b-2 border-emerald-700 pb-1 text-[13px] font-semibold text-emerald-800 transition"
          >
            Home
          </a>
          <a
            href="/about"
            className="text-[13px] font-medium text-stone-500 transition hover:text-emerald-700"
          >
            About
          </a>
          <a
            href="/marketplace"
            className="text-[13px] font-medium text-stone-500 transition hover:text-emerald-700"
          >
            Marketplace
          </a>
          <a
            href="/contact"
            className="text-[13px] font-medium text-stone-500 transition hover:text-emerald-700"
          >
            Contact
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="px-1 text-[15px] font-medium text-stone-500 transition hover:text-emerald-700"
          >
            Login
          </a>
          <a
            href="/register"
            className="rounded-full bg-emerald-900 px-6 py-2 text-[15px] font-semibold text-white transition hover:bg-emerald-800"
          >
            Register
          </a>
        </div>
      </div>
    </header>
  );
}
