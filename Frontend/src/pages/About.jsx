import { FaArrowUp, FaHandshake, FaLeaf, FaShieldAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
// import heroImage from "../assets/hero.jpg";
import Topbar from "../components/landing/Topbar";
import Footer from "../components/landing/Footer";
import FarmerSuccess from "../components/landing/FarmerSuccess";

export default function About() {
    return (
        <>
        <Topbar />
        <section className="relative overflow-hidden bg-[#fff7f7] px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
            <div className="pointer-events-none absolute right-[8%] top-0 h-[520px] w-[520px] rounded-full bg-[#d9ddd8] opacity-80 blur-[1px]" />

            <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
                <div className="max-w-xl">
                    <h1 className="text-4xl font-medium leading-tight text-[#0f3a2e] sm:text-5xl">
                        Revolutionizing
                        <br />
                        Agriculture in
                        <br />
                        <span className="text-[#6a9732]">Nepal.</span>
                    </h1>

                    <p className="mt-7 max-w-lg text-lg leading-relaxed text-[#4f5551]">
                        At Hamro Krishi Bazaar, we&apos;re building the digital bridge between
                        hardworking farmers and your dinner table. By eliminating
                        inefficiencies, we ensure fresher produce for you and better pay for
                        them.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4">
                        <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-3 text-[#1f3328] shadow-sm ring-1 ring-black/5">
                            <span className="flex size-9 items-center justify-center rounded-full bg-[#eaf5df] text-[#5c8a25]">
                                <FaLeaf className="text-base" />
                            </span>
                            <div>
                                <p className="text-sm font-semibold leading-none">100% Organic</p>
                                <p className="mt-1 text-xs text-[#6b726d]">Sourced locally</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-3 text-[#1f3328] shadow-sm ring-1 ring-black/5">
                            <span className="flex size-9 items-center justify-center rounded-full bg-[#eaf5df] text-[#5c8a25]">
                                <FaHandshake className="text-base" />
                            </span>
                            <div>
                                <p className="text-sm font-semibold leading-none">Direct Trade</p>
                                <p className="mt-1 text-xs text-[#6b726d]">Fair pricing</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative mx-auto w-full max-w-[680px]">
                    <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_16px_40px_rgba(0,0,0,0.12)] ring-1 ring-black/5">
                        <img
                            src="https://imgs.search.brave.com/_D6VV8etlZ1w1Fy196VTMaU7nkz6Xe8VvHixN6WY6ng/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTY1/NDk5Mjc4MC9waG90/by9rdWlrZWwtdGh1/bWthLW5lcGFsLWZh/cm1lci1naXRhLWt1/aWtlbC13ZWVkcy1h/LXR1cm1lcmljLWNy/b3AtcGxhbnRlZC10/by1yZXBsYWNlLXRo/ZS1mYW1pbHlzLmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz1X/S0lVTDBibDktbkU5/ek1IZ09mYWFZTnVK/Y0V3T00yRm9jd1JO/S0xXVUFBPQ"
                            alt="Nepali farmer holding fresh tomatoes"
                            className="h-[430px] w-full object-cover sm:h-[520px]"
                        />
                    </div>

                    <div className="absolute -bottom-5 left-6 max-w-[310px] rounded-3xl bg-white/85 p-5 shadow-[0_14px_35px_rgba(0,0,0,0.18)] ring-1 ring-black/10 backdrop-blur-md">
                        <p className="text-4xl font-semibold leading-none text-[#0f3a2e]">45%</p>
                        <p className="mt-2 text-sm leading-relaxed text-[#47504a]">
                            Average increase in farmer household income since joining our
                            marketplace.
                        </p>
                    </div>
                </div>
            </div>
        </section>


        {/* Commitment to growth */}
        <section className="mx-auto mt-16 mb-16 max-w-7xl px-6 sm:px-10 lg:px-18">
            <h1 className="text-center text-3xl font-medium leading-tight text-[#0f3a2e] sm:text-4xl">
                Our Commitment to Growth
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-center text-lg leading-relaxed text-[#4f5551]">
                We are more than just a marketplace; we are a movement to empower Nepalese farmers and transform the agricultural landscape.
            </p>
            <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_0.34fr]">
                <article className="rounded-2xl bg-[#f7f8f7] p-5 shadow-[0_8px_18px_rgba(0,0,0,0.08)] ring-1 ring-black/5">
                    <div className="flex items-center gap-2 text-[#6a9732]">
                        <FaLeaf className="text-sm" />
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-[#17382d]">Eliminating the Middleman</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#5a615d]">
                        Traditional supply chains in Nepal involve 4-6 intermediaries. Upto 60% to zero.
                        By connecting farmers directly to buyers, we ensure that the value stays where
                        it&apos;s earned - in the hands of the producer.
                    </p>
                    <div className="mt-5 overflow-hidden rounded-2xl">
                        <img
                            src="https://imgs.search.brave.com/gGkJwgOdSqRsr4NhV01uTrZl770M1umLIi4tIUsk54w/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMjI0/NTY3NjQ2Mi9waG90/by9yaWNlLXdvcmtl/cnMtZmVlZC10aGVp/ci1mcmVzaGx5LWhh/cnZlc3RlZC1yaWNl/LWludG8tYS10aHJl/c2hpbmctbWFjaGlu/ZS5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9UTJqTk9KeFk4/aDFZU0ZBX0VuNFRI/X0p2S3BtRnUyVFdm/bmJIM25JZFZhbz0"
                            alt="Delivery van helping direct farm transport"
                            className="h-[170px] w-full object-cover"
                        />
                    </div>
                </article>

                <article className="flex h-full flex-col justify-center rounded-2xl bg-[#003f2e] p-6 text-white shadow-[0_8px_18px_rgba(0,0,0,0.12)]">
                    <span className="flex size-9 items-center justify-center rounded-full bg-[#0b5944] text-[#d7f4a5]">
                        <FaShieldAlt className="text-sm" />
                    </span>
                    <h3 className="mt-4 text-xl font-semibold">Guaranteed Quality</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/80">
                        Every product is tracked from seed to shelf using our proprietary Precision
                        Grading system, ensuring high standards for every kitchen.
                    </p>
                </article>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[0.34fr_1fr]">
                <article className="rounded-2xl bg-[#f7f8f7] p-6 shadow-[0_8px_18px_rgba(0,0,0,0.08)] ring-1 ring-black/5">
                    <span className="flex size-9 items-center justify-center rounded-full bg-[#eaf5df] text-[#6a9732]">
                        <FaArrowUp className="text-sm" />
                    </span>
                    <h3 className="mt-4 text-lg font-semibold text-[#17382d]">Sustainable Income</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#5a615d]">
                        We provide farmers with real-time market data, allowing them to plan crops that are in
                        high demand and command better prices.
                    </p>
                </article>

                <article className="relative overflow-hidden rounded-2xl shadow-[0_8px_18px_rgba(0,0,0,0.12)]">
                    <img
                        src="https://imgs.search.brave.com/1tvY5rKxI7nN3H6IAYph_tPff6YxfgoW25L778defCU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMjE2/MjAzOTAzNC9waG90/by9uZXBhbGktZmFy/bWVycy1hcmUtd29y/a2luZy1pbi1hLXBh/ZGR5LWZpZWxkLWlu/LWNoaGFtcGktb24t/dGhlLW91dHNraXJ0/cy1vZi1sYWxpdHB1/ci1kaXN0cmljdC5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/Q1ZtbmlieTF4XzVt/X2swT2VoN2JpeG5L/aWlScHh6RWtpaGpa/Xy15al81ST0"
                        alt="Community of farmers participating in a local training program"
                        className="h-[340px] w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#003f2e]/80 via-[#003f2e]/30 to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5 text-white">
                        <h3 className="text-xl font-semibold">Community Empowerment</h3>
                        <p className="mt-2 max-w-xl text-sm text-white/90">
                            Beyond sales, we invest in local sourcing infrastructure and digital literacy,
                            training for rural communities.
                        </p>
                    </div>
                </article>
            </div>
        </section>

        {/* Farmer success */}
        <div className="bg-[#fff7f7] ">
        <FarmerSuccess />
        </div>

        


        {/* Support growers CTA */}
        <section className="mx-auto mt-10 mb-16 max-w-7xl px-6 sm:px-10 lg:px-14">
            <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-r from-[#124733] via-[#15503a] to-[#114833] px-6 py-14 text-center shadow-[0_18px_42px_rgba(7,35,26,0.35)] sm:px-10 lg:px-16">
                <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-[#2f664f]/25" />

                <h2 className="text-4xl font-semibold tracking-tight text-white">
                    Ready to support local growers?
                </h2>
                <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[#c6d8cf]">
                    Join thousands of consumers who choose quality, transparency,
                    and impact with every purchase.
                </p>

                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link
                        to="/marketplace"
                        className="rounded-full bg-[#648f08] px-10 py-3 text-base font-semibold text-white transition hover:bg-[#79a91a]"
                    >
                        Shop Marketplace
                    </Link>
                    <Link
                        to="/register"
                        className="rounded-full border border-white/30 px-10 py-3 text-base font-semibold text-white/95 transition hover:border-white/50 hover:bg-white/5"
                    >
                        Partner With Us
                    </Link>
                </div>
            </div>
        </section>

        {/* Footer */}
        <Footer />
    </>
    );
}