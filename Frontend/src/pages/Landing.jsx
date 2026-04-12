import heroImage from "../assets/hero.jpg";
import { Link } from "react-router-dom";
import {
  FaHandshake,
  FaLeaf,
  FaQuoteLeft,
  FaSeedling,
  FaTools,
} from "react-icons/fa";
import Topbar from "../components/landing/Topbar";
import FarmerSuccessSection from "../components/landing/FarmerSuccess";
import DeliveryCoverage from "../components/landing/DeliveryCoverage";
import Footer from "../components/landing/Footer";

function GrassCluster({ className = "", mirrored = false }) {
  return (
    <div
      className={`pointer-events-none absolute ${className}`}
      aria-hidden="true"
      style={{ transform: mirrored ? "scaleX(-1)" : "none" }}
    >
      <div className="absolute bottom-0 left-0 h-5 w-24 rounded-full bg-emerald-300/70 blur-sm" />
      <span className="absolute bottom-0 left-1 h-9 w-3 origin-bottom -rotate-[14deg] rounded-t-full bg-emerald-400" />
      <span className="absolute bottom-0 left-6 h-14 w-4 origin-bottom -rotate-[5deg] rounded-t-full bg-emerald-500" />
      <span className="absolute bottom-0 left-11 h-16 w-4 origin-bottom rotate-[4deg] rounded-t-full bg-emerald-700" />
      <span className="absolute bottom-0 left-16 h-12 w-3 origin-bottom rotate-[10deg] rounded-t-full bg-teal-500" />
      <span className="absolute bottom-0 left-20 h-10 w-3 origin-bottom rotate-[18deg] rounded-t-full bg-emerald-500" />
    </div>
  );
}

export default function Landing() {
  const trustStats = [
    { label: "Local Farms", value: "300+" },
    { label: "Daily Deliveries", value: "1.2K" },
    { label: "Avg. Fulfillment", value: "98%" },
  ];

  const featured = [
    {
      id: 1,
      name: "Papaya",
      description: "Crisp and vibrant veggies from local farms.",
      image:
        "https://imgs.search.brave.com/cMmdKbR1eS3F3wrF5bWvLuhbLOWVRpMbsdjrZv_S3Ek/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMjMv/NTMzLzQxOS9zbWFs/bC9nZW5lcmF0aXZl/LWFpLW1hY3JvLWZy/ZXNoLWhhbGYtb2Yt/cGFwYXlhLWZydWl0/LWJhY2tncm91bmQt/dHJvcGljYWwtZXhv/dGljLWNsb3NldXAt/d2l0aC1kcm9wcy1w/aG90by5qcGc",
      price: "NPR 50/kg",
      location: "Kathmandu",
      tag: "Vegetables",
    },
    {
      id: 2,
      name: "Apple",
      description: "Sweet and ripe fruits harvested at peak freshness.",
      image:
        "https://imgs.search.brave.com/I2lZb5u8JYkvJsR4IdEo4Q4L4HUFvoLBBPBmHajibzE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAxNS8x/Mi8wNy8xNy81MC9h/cHBsZS0xMDgxMTA1/XzY0MC5qcGc",
      price: "NPR 80/kg",
      location: "Pokhara",
      tag: "Fruits",
    },
    {
      id: 3,
      name: "Organic Grains",
      description: "Nutritious grains grown without synthetic chemicals.",
      image:
        "https://imgs.search.brave.com/HFCB09kRpE7nlh7oO2RgJG7UoYzK64npjjKPtwlCtAg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTYz/NzI5NjQ4L3Bob3Rv/L29yZ2FuaWMtd2hv/bGUtZ3JhaW5zLmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz1s/VU5Zd0xUb1g1bUI1/MGgzMUJkTnBPQmJ0/UzI1eGMzQ3d2cTR0/cWg4Wlo4PQ",
      price: "NPR 40/kg",
      location: "Chitwan",
      tag: "Grains",
    },
    {
      id: 4,
      name: "Fresh Herbs",
      description: "Aromatic herbs to elevate your dishes in KTM.",
      image:
        "https://imgs.search.brave.com/-GUritb_PA_eBQwnjzrlCB7HF11tlbsntzGfv_deo3k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNjkv/NTkyLzAyOC9zbWFs/bC9mcmVzaC1naW5n/ZXItYW5kLWFzc29y/dGVkLWhlcmJzLWJ1/bmRsZS1hcm9tYXRp/Yy1pbmdyZWRpZW50/cy1mb3ItY3VsaW5h/cnktY3JlYXRpb25z/LWFuZC1oZWFsdGh5/LWVhdGluZy1waG90/by5qcGc",
      price: "NPR 30/kg",
      location: "Kathmandu",
      tag: "Herbs",
    },
  ];
  return (
    <>
      <Topbar />
      <main>
        <section className="relative overflow-hidden bg-[#f3f4f1]">
          <div className="mx-auto flex min-h-[82vh] w-full max-w-[1400px] flex-col items-center gap-10 px-6 py-14 lg:flex-row lg:gap-14 lg:px-10 lg:py-16">
            <div className="w-full lg:w-[34%]">
              <h1 className="text-5xl font-semibold leading-[1.03] tracking-tight text-slate-900 sm:text-5xl">
                Smart <span className="text-emerald-800">Agriculture</span>,
                <span className="block mt-2 font-normal">For the Future.</span>
              </h1>

              <p className="mt-7 max-w-[420px] text-[15px] leading-7 text-slate-700">
                Monitor crop supply, verify farmer listings, and buy with
                confidence through a transparent marketplace built for modern
                food distribution in Nepal.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  to="/register"
                  className="rounded-full bg-emerald-800 text-white px-6 py-2.5 text-sm font-semibold transition hover:bg-emerald-700"
                >
                  Register Now
                </Link>
                <Link
                  to="/marketplace"
                  className="rounded-full border border-slate-400 bg-transparent px-6 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-white"
                >
                  View Marketplace
                </Link>
              </div>

              <div className="mt-9 grid max-w-sm grid-cols-3 gap-5">
                {trustStats.map((item) => (
                  <div key={item.label}>
                    <p className="text-2xl font-semibold text-slate-900">
                      {item.value}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative w-full lg:w-[66%]">
              <div className="relative rounded-2xl border border-slate-300 bg-white p-3 shadow-2xl">
                <img
                  src={heroImage}
                  alt="Marketplace network overview"
                  className="h-[280px] w-full rounded-xl object-cover sm:h-[360px] lg:h-[460px]"
                />

                <div className="absolute left-6 top-6 w-[230px] rounded-xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-800">
                    Live Network
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    Fresh produce demand up by 18% in Kathmandu and 11% in
                    Pokhara.
                  </p>
                </div>
              </div>

              <div className="absolute -bottom-5 left-6 hidden h-16 w-16 rounded-full bg-emerald-300/60 blur-xl md:block" />
              <div className="absolute -bottom-8 right-10 hidden h-20 w-20 rounded-full bg-teal-300/50 blur-xl md:block" />
              <GrassCluster className="-bottom-2 left-0 hidden h-16 w-24 md:block" />
              <GrassCluster className="-bottom-2 right-2 hidden h-16 w-24 md:block" mirrored />
            </div>
          </div>
        </section>
      </main>
      {/* featured collections section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold tracking-tight text-stone-800">
          Featured Collections
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Handpicked fresh produce from trusted local farmers.
        </p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
            >
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-48 w-full object-cover"
                />
                <span className="absolute right-3 top-3 rounded-full bg-emerald-700 px-2.5 py-1 text-xs font-semibold text-white shadow-md">
                  {item.tag}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-stone-800">
                  {item.name}
                </h3>
                <p className="mt-1 text-sm text-stone-500">
                  {item.description}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-emerald-700">
                    {item.price}
                  </span>
                  <span className="text-sm text-stone-500">
                    {item.location}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* why choose us section */}
      <section className="w-full bg-emerald-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold tracking-tight text-stone-800">
            Why Choose Hamro Krishi Bazaar?
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-stone-600">
            A smarter way to buy fresh produce directly from trusted local
            farmers.
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-sm">
              <FaSeedling className="text-4xl text-emerald-700" />
              <h3 className="text-lg font-semibold text-stone-800">
                Fresh from Local Farms
              </h3>
              <p className="text-sm text-stone-500">
                Directly sourced produce with consistent freshness.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-sm">
              <FaTools className="text-4xl text-emerald-700" />
              <h3 className="text-lg font-semibold text-stone-800">
                Precision Tools
              </h3>
              <p className="text-sm text-stone-500">
                Fast filters and search to find what you need.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-sm">
              <FaHandshake className="text-4xl text-emerald-700" />
              <h3 className="text-lg font-semibold text-stone-800">
                Direct Market Access
              </h3>
              <p className="text-sm text-stone-500">
                Connect with farmers and buy at fair rates.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-sm">
              <FaLeaf className="text-4xl text-emerald-700" />
              <h3 className="text-lg font-semibold text-stone-800">
                Sustainable Choices
              </h3>
              <p className="text-sm text-stone-500">
                Support eco-friendly farming and local communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* contact us section */}
      <FarmerSuccessSection />

      {/* delivery coverage section */}
      <DeliveryCoverage />

      {/* testimonials section */}
      <section className="bg-stone-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-stone-800 sm:text-4xl">
              Testimonials & Reviews
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-stone-600 sm:text-base">
              Real feedback from buyers and farmers using Hamro Krishi Bazaar.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <article className="rounded-2xl border border-emerald-100 bg-white p-7 shadow-sm">
              <FaQuoteLeft className="text-2xl text-emerald-700" />
              <p className="mt-4 text-lg leading-relaxed text-stone-700">
                "Fresh vegetables at affordable prices."
              </p>
              <p className="mt-5 text-sm font-medium text-emerald-800">
                - Customer from Kathmandu
              </p>
            </article>

            <article className="rounded-2xl border border-emerald-100 bg-white p-7 shadow-sm">
              <FaQuoteLeft className="text-2xl text-emerald-700" />
              <p className="mt-4 text-lg leading-relaxed text-stone-700">
                "Now I can sell directly without middlemen."
              </p>
              <p className="mt-5 text-sm font-medium text-emerald-800">
                - Farmer from Chitwan
              </p>
            </article>

            <article className="rounded-2xl border border-emerald-100 bg-white p-7 shadow-sm">
              <FaQuoteLeft className="text-2xl text-emerald-700" />
              <p className="mt-4 text-lg leading-relaxed text-stone-700">
                "Great platform for connecting buyers and sellers."
              </p>
              <p className="mt-5 text-sm font-medium text-emerald-800">
                - Customer from Pokhara
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* final call to action section */}
      <section className="bg-emerald-700 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white px-6 py-12 text-center shadow-2xl sm:px-10">
          <h2 className="text-3xl font-semibold leading-tight text-emerald-800 sm:text-4xl">
            Join Nepal&apos;s Digital Agriculture Marketplace Today
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-emerald-900/80">
            Download our app for the best experience and exclusive offers!
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              type="button"
              className="w-full rounded-full bg-emerald-800 px-7 py-3 text-base font-semibold text-white transition hover:bg-green-700 sm:w-auto"
            >
              Start Shopping
            </button>
            <button
              type="button"
              className="w-full rounded-full border border-emerald-800 bg-transparent px-7 py-3 text-base font-semibold text-emerald-800 transition hover:bg-emerald-800 hover:text-white sm:w-auto"
            >
              Become a Seller
            </button>
          </div>
          {/* <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#"
              className="inline-block"
              aria-label="Download on Google Play"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Get it on Google Play"
                className="h-12 w-auto"
                loading="lazy"
              />
            </a>
            <a
              href="#"
              className="inline-block"
              aria-label="Download on App Store"
            >
              <img
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="Download on the App Store"
                className="h-12 w-auto"
                loading="lazy"
              />
            </a>
          </div> */}
        </div>
      </section>
      <Footer />
    </>
  );
}
