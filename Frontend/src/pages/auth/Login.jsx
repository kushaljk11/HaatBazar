import login from "../../assets/login.jpg";

export default function Login() {
  return (
    <main className="min-h-screen bg-stone-100 md:grid md:h-screen md:grid-cols-2 md:overflow-hidden">
      <section className="relative hidden h-screen md:block">
        <img
          src={login}
          alt="Login"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 p-8 text-white lg:p-12">
          <h1 className="text-4xl font-semibold leading-tight">
            Cultivating the future
          </h1>
          <h1 className="text-4xl font-semibold leading-tight">
            of Nepali Agriculture
          </h1>
          <h1 className="text-4xl font-semibold leading-tight">Harvest.</h1>
          <p className="mt-3 max-w-lg text-base text-white/90">
            Join the premier digital marketplace connecting local farmers directly with modern markets. Precision tools meet organic tradition.
          </p>
        </div>
      </section>

      <section className="h-full px-4 py-4 sm:px-6 md:h-screen md:overflow-hidden md:px-10 md:py-3 lg:px-14">
        <div className="mx-auto flex h-full w-full max-w-[440px] items-center">
          <div className="w-full rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-4xl text-center font-semibold tracking-tight text-stone-800">Welcome back</h2>
            <p className="mt-2 text-sm text-center leading-6 text-stone-500">
              Enter your details to manage your farm or marketplace.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-3 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
              >
                <span className="text-base text-red-500">G</span>
                Google
              </button>

              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-3 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
              >
                <span className="text-base text-blue-600">f</span>
                Facebook
              </button>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <div className="h-px flex-1 bg-stone-200" />
              <p className="text-xs font-semibold text-black">
                Or continue with email
              </p>
              <div className="h-px flex-1 bg-stone-200" />
            </div>

            <form className="mt-7 space-y-5">
              <div>
                <label className="text-sm font-semibold text-stone-700">Email Address</label>
                <div className="mt-2 flex items-center rounded-full bg-stone-100 px-4 py-3">
                  <span className="mr-2 text-stone-400">✉</span>
                  <input
                    type="email"
                    placeholder="name@farm.com"
                    className="w-full bg-transparent text-sm text-stone-700 outline-none placeholder:text-stone-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-stone-700">Password</label>
                  <button
                    type="button"
                    className="text-sm font-semibold text-lime-700 transition hover:text-lime-800"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="mt-2 flex items-center rounded-full bg-stone-100 px-4 py-3">
                  <input
                    type="password"
                    placeholder=" ........"
                    className="w-full bg-transparent text-sm text-stone-700 outline-none placeholder:text-stone-400"
                  />
                  
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-stone-600">
                <input type="checkbox" className="h-4 w-4 rounded border-stone-300" />
                Remember me for 30 days
              </label>

              <button
                type="submit"
                className="w-full rounded-full bg-emerald-900 px-5 py-3 text-base font-semibold text-white shadow-md transition hover:bg-emerald-800"
              >
                Sign into Account →
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-stone-600">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                className="font-semibold text-emerald-900 hover:text-emerald-800"
              >
                Register as a Farmer or Buyer
              </button>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
