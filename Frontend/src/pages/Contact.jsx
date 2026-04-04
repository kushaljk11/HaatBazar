
import {
    FaClock,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaRegEnvelope,
    FaSeedling,
    FaTractor,
} from "react-icons/fa";
import Topbar from "../components/landing/Topbar";
import Footer from "../components/landing/Footer";

export default function Contact() {
    return (
        <>
            <Topbar />

            <main className="bg-[#eef3ef]">
                <section className="relative overflow-hidden px-6 pb-16 pt-14 sm:px-10 lg:px-14">
                    <div className="pointer-events-none absolute -left-20 top-6 h-56 w-56 rounded-full bg-emerald-200/70 blur-2xl" />
                    <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-emerald-300/40 blur-3xl" />

                    <div className="relative mx-auto max-w-7xl">
                        <div className="mb-10 rounded-3xl bg-gradient-to-r from-emerald-900 to-emerald-800 px-8 py-12 text-white shadow-[0_18px_40px_rgba(6,35,24,0.35)] sm:px-12">
                            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-200">
                                Contact HaatBazar
                            </p>
                            <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">
                                Let&apos;s Grow Your Farm Business Together
                            </h1>
                            <p className="mt-4 max-w-3xl text-lg text-emerald-100/90">
                                Have a question about onboarding, pricing, or delivery support?
                                Our team is here to help farmers and cooperatives across Nepal.
                            </p>
                        </div>

                        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                            <section className="rounded-3xl bg-white p-6 shadow-[0_16px_35px_rgba(16,48,34,0.12)] ring-1 ring-emerald-900/5 sm:p-8">
                                <h2 className="text-2xl font-semibold text-emerald-900">
                                    Send Us a Message
                                </h2>
                                <p className="mt-2 text-sm text-stone-600">
                                    Share your details and our farmer support team will reach out
                                    within 24 hours.
                                </p>

                                <form className="mt-7 grid gap-5 sm:grid-cols-2">
                                    <label className="flex flex-col gap-2">
                                        <span className="text-sm font-medium text-emerald-900">
                                            Full Name
                                        </span>
                                        <input
                                            type="text"
                                            placeholder="e.g. Ram Bahadur"
                                            className="h-12 rounded-xl border border-emerald-200 bg-emerald-50/40 px-4 text-sm text-emerald-900 outline-none transition focus:border-emerald-500 focus:bg-white"
                                        />
                                    </label>

                                    <label className="flex flex-col gap-2">
                                        <span className="text-sm font-medium text-emerald-900">
                                            Phone Number
                                        </span>
                                        <input
                                            type="tel"
                                            placeholder="+977 98XXXXXXXX"
                                            className="h-12 rounded-xl border border-emerald-200 bg-emerald-50/40 px-4 text-sm text-emerald-900 outline-none transition focus:border-emerald-500 focus:bg-white"
                                        />
                                    </label>

                                    <label className="flex flex-col gap-2 sm:col-span-2">
                                        <span className="text-sm font-medium text-emerald-900">
                                            Email Address
                                        </span>
                                        <input
                                            type="email"
                                            placeholder="name@example.com"
                                            className="h-12 rounded-xl border border-emerald-200 bg-emerald-50/40 px-4 text-sm text-emerald-900 outline-none transition focus:border-emerald-500 focus:bg-white"
                                        />
                                    </label>

                                    <label className="flex flex-col gap-2">
                                        <span className="text-sm font-medium text-emerald-900">
                                            District
                                        </span>
                                        <input
                                            type="text"
                                            placeholder="e.g. Chitwan"
                                            className="h-12 rounded-xl border border-emerald-200 bg-emerald-50/40 px-4 text-sm text-emerald-900 outline-none transition focus:border-emerald-500 focus:bg-white"
                                        />
                                    </label>

                                    <label className="flex flex-col gap-2">
                                        <span className="text-sm font-medium text-emerald-900">
                                            Interest
                                        </span>
                                        <select className="h-12 rounded-xl border border-emerald-200 bg-emerald-50/40 px-4 text-sm text-emerald-900 outline-none transition focus:border-emerald-500 focus:bg-white">
                                            <option>Farmer Onboarding</option>
                                            <option>Buyer Inquiry</option>
                                            <option>Logistics Support</option>
                                            <option>Partnership</option>
                                        </select>
                                    </label>

                                    <label className="flex flex-col gap-2 sm:col-span-2">
                                        <span className="text-sm font-medium text-emerald-900">
                                            Your Message
                                        </span>
                                        <textarea
                                            rows="5"
                                            placeholder="Tell us about your farm, produce type, and what support you need..."
                                            className="rounded-xl border border-emerald-200 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-900 outline-none transition focus:border-emerald-500 focus:bg-white"
                                        />
                                    </label>

                                    <button
                                        type="submit"
                                        className="sm:col-span-2 h-12 rounded-xl bg-emerald-800 px-6 text-sm font-semibold text-white transition hover:bg-emerald-700"
                                    >
                                        Submit Inquiry
                                    </button>
                                </form>
                            </section>

                            <aside className="space-y-6">
                                <section className="rounded-3xl bg-white p-6 shadow-[0_16px_35px_rgba(16,48,34,0.12)] ring-1 ring-emerald-900/5">
                                    <h3 className="text-xl font-semibold text-emerald-900">
                                        Contact Information
                                    </h3>
                                    <ul className="mt-5 space-y-4 text-sm text-stone-700">
                                        <li className="flex items-start gap-3">
                                            <span className="mt-0.5 text-emerald-700">
                                                <FaMapMarkerAlt />
                                            </span>
                                            <span>Kathmandu Valley Service Hub, Nepal</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="mt-0.5 text-emerald-700">
                                                <FaPhoneAlt />
                                            </span>
                                            <span>+977 9812345678</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="mt-0.5 text-emerald-700">
                                                <FaRegEnvelope />
                                            </span>
                                            <span>farmersupport@haatbazar.com</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="mt-0.5 text-emerald-700">
                                                <FaClock />
                                            </span>
                                            <span>Sunday - Friday, 8:00 AM - 6:00 PM</span>
                                        </li>
                                    </ul>
                                </section>

                                <section className="rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 p-6 text-white shadow-[0_16px_35px_rgba(6,35,24,0.3)]">
                                    <h3 className="text-xl font-semibold">
                                        Farmer Help Desk Priorities
                                    </h3>
                                    <div className="mt-5 space-y-4 text-sm text-emerald-100">
                                        <p className="flex items-start gap-3">
                                            <FaSeedling className="mt-0.5 text-emerald-200" />
                                            Crop listing guidance for seasonal produce
                                        </p>
                                        <p className="flex items-start gap-3">
                                            <FaTractor className="mt-0.5 text-emerald-200" />
                                            Logistics coordination and pickup planning
                                        </p>
                                        <p className="flex items-start gap-3">
                                            <FaPhoneAlt className="mt-0.5 text-emerald-200" />
                                            Faster phone support for urgent delivery issues
                                        </p>
                                    </div>
                                </section>
                            </aside>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}