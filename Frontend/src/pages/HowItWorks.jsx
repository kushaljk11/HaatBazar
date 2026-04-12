import { Link } from "react-router-dom";
import { FaCheckCircle, FaLeaf, FaShoppingBasket, FaTruck } from "react-icons/fa";

const steps = [
  {
    icon: <FaLeaf className="text-2xl text-emerald-700" />,
    title: "Farmers List Fresh Crops",
    description:
      "Farmers publish verified listings with location, quantity, and fair pricing details.",
  },
  {
    icon: <FaShoppingBasket className="text-2xl text-emerald-700" />,
    title: "Buyers Discover & Order",
    description:
      "Buyers explore marketplace listings, compare quality, and place bookings or direct orders.",
  },
  {
    icon: <FaTruck className="text-2xl text-emerald-700" />,
    title: "Delivery & Pickup",
    description:
      "Orders are coordinated for timely pickup or delivery based on buyer and farmer preferences.",
  },
  {
    icon: <FaCheckCircle className="text-2xl text-emerald-700" />,
    title: "Secure Management",
    description:
      "Admin moderation and transparent order/payment tracking keeps the marketplace trusted.",
  },
];

export default function HowItWorks() {
  return (
    <section className="min-h-screen bg-emerald-50/40 px-4 py-12 sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-6xl">
        <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-3xl font-semibold text-emerald-900 sm:text-4xl">How HaatBazar Works</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            HaatBazar connects Nepali farmers and buyers through a transparent digital marketplace.
            From crop listing to final delivery, every step is simple and trackable.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {steps.map((step) => (
              <article
                key={step.title}
                className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5"
              >
                <div className="inline-flex items-center gap-3">
                  {step.icon}
                  <h2 className="text-lg font-semibold text-slate-900">{step.title}</h2>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{step.description}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/marketplace"
              className="rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Explore Marketplace
            </Link>
            <Link
              to="/register"
              className="rounded-full border border-emerald-300 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
            >
              Join HaatBazar
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
