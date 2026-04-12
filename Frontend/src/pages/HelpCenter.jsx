import { Link } from "react-router-dom";

const faqs = [
  {
    q: "How do I buy crops on HaatBazar?",
    a: "Create an account, browse listings in Marketplace, open a product, then place order or booking.",
  },
  {
    q: "How can farmers add listings?",
    a: "Farmers can use Add New Crop to publish listings with image, location, price, and stock details.",
  },
  {
    q: "How do I check my orders and payments?",
    a: "Open your dashboard and use Orders, Bookings, and Payment pages for complete tracking.",
  },
  {
    q: "Who approves marketplace posts?",
    a: "Admin team reviews and approves listings to maintain quality and trust in the marketplace.",
  },
];

export default function HelpCenter() {
  return (
    <section className="min-h-screen bg-[#f5f8f7] px-4 py-12 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-3xl font-semibold text-emerald-900 sm:text-4xl">Help Center</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            Find quick answers for buyers, farmers, and admins. If you still need help, reach out via Contact page.
          </p>

          <div className="mt-8 space-y-3">
            {faqs.map((item) => (
              <article key={item.q} className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5">
                <h2 className="text-base font-semibold text-slate-900">{item.q}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.a}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Contact Support
            </Link>
            <Link
              to="/marketplace"
              className="rounded-full border border-emerald-300 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
            >
              Browse Marketplace
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
