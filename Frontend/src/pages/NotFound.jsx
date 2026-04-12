import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="grid min-h-screen place-items-center bg-[#f4f8f6] px-4">
      <div className="w-full max-w-xl rounded-3xl border border-emerald-100 bg-white p-8 text-center shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">404</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">Page Not Found</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
          The page you are looking for does not exist or may have been moved.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Go Home
          </Link>
          <Link
            to="/marketplace"
            className="rounded-full border border-emerald-300 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
          >
            Browse Marketplace
          </Link>
        </div>
      </div>
    </section>
  );
}
