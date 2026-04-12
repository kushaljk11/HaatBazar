import login from "../../assets/login.jpg";
import api from "../../utils/axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/login", formData);
      console.log("Login successful:", response.data);

      const user = response?.data?.user;
      const token = response?.data?.token;
      if (user && token) {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
      }

      setSuccess("Login successful! Redirecting...");
      toast.success("Login successful! Redirecting...");
      setTimeout(() => {
        // aile ko lagi about us ma redirect garne
        if (user?.role === "admin") {
          navigate("/admin/dashboard");
        } else if (user?.role === "buyer") {
          navigate("/buyer/dashboard");
        } else {
          navigate("/farmer/dashboard");
        }
      }, 2000);

    } catch (error) {
      toast.error(
        error.response && error.response.data
          ? error.response.data.message || "Login failed"
          : "Login failed",
      );
      console.error(
        "Login failed:",
        error.response ? error.response.data : error.message,
      );
    }
  };
  return (
    <main className="min-h-screen bg-stone-100 md:grid md:h-screen md:grid-cols-2 md:overflow-hidden">
      <section className="relative hidden h-screen md:block">
        <img src={login} alt="Login" className="h-full w-full object-cover" />
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
            Join the premier digital marketplace connecting local farmers
            directly with modern markets. Precision tools meet organic
            tradition.
          </p>
        </div>
      </section>

      <section className="h-full px-4 py-4 sm:px-6 md:h-screen md:overflow-hidden md:px-10 md:py-3 lg:px-14">
        <div className="mx-auto flex h-full w-full max-w-[440px] items-center">
          <div className="w-full rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-4xl text-center font-semibold tracking-tight text-stone-800">
              Welcome back
            </h2>
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
                <label className="text-sm font-semibold text-stone-700">
                  Email Address
                </label>
                <div className="mt-2 flex items-center rounded-full bg-stone-100 px-4 py-3">
                  <span className="mr-2 text-stone-400">✉</span>
                  <input
                    type="email"
                    placeholder="name@farm.com"
                    className="w-full bg-transparent text-sm text-stone-700 outline-none placeholder:text-stone-400"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-stone-700">
                    Password
                  </label>
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
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-stone-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-stone-300"
                />
                Remember me for 30 days
              </label>

              <button
                type="submit"
                className="w-full rounded-full bg-emerald-900 px-5 py-3 text-base font-semibold text-white shadow-md transition hover:bg-emerald-800"
                onClick={handleSubmit}
              >
                Login into Account →
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-stone-600">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                className="font-semibold text-emerald-900 hover:text-emerald-800"
                onClick={() => navigate("/register")}
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
