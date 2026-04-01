import { useState } from 'react';
import registerImg from '../../assets/register.jpg';

export default function Register() {
  const [accountType, setAccountType] = useState('farmer');

  return (
    <main className="min-h-screen bg-stone-100 md:grid md:h-screen md:grid-cols-2 md:overflow-hidden">
      <section className="relative hidden h-screen md:block">
        <img
          src={registerImg}
          alt="Register"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 p-8 text-white lg:p-12">
          <h1 className="text-4xl font-semibold leading-tight">Join the digital</h1>
          <h1 className="text-4xl font-semibold leading-tight">Harvest.</h1>
          <p className="mt-3 max-w-lg text-base text-white/90">
            Connect directly with local producers or scale your agriculture
            business through Nepal&apos;s most precise trade network.
          </p>
        </div>
      </section>

      <section className="h-full px-4 py-4 sm:px-6 md:h-screen md:overflow-hidden md:px-10 md:py-3 lg:px-14">
        <div className="mx-auto flex h-full w-full max-w-[520px] items-center">
          <div className="w-full rounded-3xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="text-2xl font-semibold tracking-tight text-stone-800">
            Create Account
          </h2>
          <p className="mt-0.5 text-xs text-stone-500 sm:text-sm">
            Start your journey at Hamro Krishi Bazaar.
          </p>

          <div className="mt-3 grid grid-cols-2 rounded-2xl bg-stone-200 p-1 text-xs text-stone-700 sm:text-sm">
            <button
              type="button"
              onClick={() => setAccountType('farmer')}
              className={`rounded-xl px-3 py-1.5 font-semibold transition ${
                accountType === 'farmer'
                  ? 'bg-white text-emerald-900 shadow-sm'
                  : 'text-stone-700'
              }`}
            >
              Register as Farmer
            </button>
            <button
              type="button"
              onClick={() => setAccountType('buyer')}
              className={`rounded-xl px-3 py-1.5 font-semibold transition ${
                accountType === 'buyer'
                  ? 'bg-white text-emerald-900 shadow-sm'
                  : 'text-stone-700'
              }`}
            >
              Register as Buyer
            </button>
          </div>

          <form className="mt-3 space-y-2.5">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-600">
                Full Name
              </label>
              <div className="mt-1 rounded-2xl bg-stone-100 px-3.5 py-2">
                <input
                  type="text"
                  placeholder="e.g. Ram Bahadur"
                  className="w-full bg-transparent text-sm text-stone-700 outline-none placeholder:text-stone-400"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-600">
                Phone Number
              </label>
              <div className="mt-1 rounded-2xl bg-stone-100 px-3.5 py-2">
                <input
                  type="tel"
                  placeholder="98XXXXXXXX"
                  className="w-full bg-transparent text-sm text-stone-700 outline-none placeholder:text-stone-400"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-600">
                District Location
              </label>
              <div className="mt-1 rounded-2xl bg-stone-100 px-3.5 py-2">
                <select className="w-full appearance-none bg-transparent text-sm text-stone-700 outline-none">
                  <option>Select District</option>
                  <option>Kathmandu</option>
                  <option>Lalitpur</option>
                  <option>Bhaktapur</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-600">
                Create Password
              </label>
              <div className="mt-1 rounded-2xl bg-stone-100 px-3.5 py-2">
                <input
                  type="password"
                  placeholder="........"
                  className="w-full bg-transparent text-sm text-stone-700 outline-none placeholder:text-stone-400"
                />
              </div>
            </div>

            {accountType === 'farmer' ? (
              <div className="border-t border-stone-200 pt-2.5">
                <p className="text-sm font-semibold text-stone-700">Farm Details</p>
                <div className="mt-1.5 grid gap-2 sm:grid-cols-2">
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-600">
                      Farm Size (Optional)
                    </label>
                    <div className="mt-1 rounded-2xl bg-stone-100 px-3.5 py-2">
                      <input
                        type="text"
                        placeholder="e.g. 5 Ropani"
                        className="w-full bg-transparent text-sm text-stone-700 outline-none placeholder:text-stone-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-600">
                      Primary Crop
                    </label>
                    <div className="mt-1 rounded-2xl bg-stone-100 px-3.5 py-2">
                      <select className="w-full appearance-none bg-transparent text-sm text-stone-700 outline-none">
                        <option>Grains</option>
                        <option>Vegetables</option>
                        <option>Fruits</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-t border-stone-200 pt-2.5">
                <p className="text-sm font-semibold text-stone-700">Buyer Details</p>
                <div className="mt-1.5 grid gap-2 sm:grid-cols-2">
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-600">
                      Buying For
                    </label>
                    <div className="mt-1 rounded-2xl bg-stone-100 px-3.5 py-2">
                      <select className="w-full appearance-none bg-transparent text-sm text-stone-700 outline-none">
                        <option>Household</option>
                        <option>Retail Shop</option>
                        <option>Restaurant</option>
                        <option>Wholesaler</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-600">
                      Interested In
                    </label>
                    <div className="mt-1 rounded-2xl bg-stone-100 px-3.5 py-2">
                      <select className="w-full appearance-none bg-transparent text-sm text-stone-700 outline-none">
                        <option>Vegetables</option>
                        <option>Fruits</option>
                        <option>Grains</option>
                        <option>Dairy</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <p className="text-center text-[11px] text-stone-500">
              By clicking Register, you agree to our Terms of Service and Privacy
              Policy.
            </p>

            <button
              type="submit"
              className="w-full rounded-full bg-emerald-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Complete {accountType === 'farmer' ? 'Farmer' : 'Buyer'} Registration
            </button>

            <div className="pt-0.5 text-center">
              <p className="text-[11px] uppercase tracking-[0.2em] text-stone-400">
                Already Have an Account?
              </p>
              <button
                type="button"
                className="mt-1.5 w-full rounded-full border border-stone-300 px-5 py-2 text-sm font-semibold text-stone-700"
              >
                Login to Account
              </button>
            </div>
          </form>
          </div>
        </div>
      </section>
    </main>
  );
}
