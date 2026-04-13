import login from "../../assets/login.jpg";
import api from "../../utils/axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";

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

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      const accessToken = tokenResponse?.access_token;

      if (!accessToken) {
        toast.error("Google login failed");
        return;
      }

      const response = await api.post("/auth/google", { accessToken });

      const user = response?.data?.user;
      const token = response?.data?.token;

      if (user && token) {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
      }

      toast.success("Google login successful! Redirecting...");

      setTimeout(() => {
        if (user?.role === "admin") {
          navigate("/admin/dashboard");
        } else if (user?.role === "buyer") {
          navigate("/buyer/dashboard");
        } else {
          navigate("/farmer/dashboard");
        }
      }, 1200);
    } catch (error) {
      toast.error(
        error.response && error.response.data
          ? error.response.data.message || "Google login failed"
          : "Google login failed",
      );
    }
  };

  const handleGoogleError = () => {
    toast.error("Google login cancelled or failed");
  };

  const startGoogleLogin = useGoogleLogin({
    scope: "openid email profile",
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleError,
  });

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

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="h-10 overflow-hidden rounded-full border border-stone-300 bg-white">
                <button
                  type="button"
                  onClick={() => startGoogleLogin()}
                  className="flex h-full w-full items-center justify-center gap-2 px-3 text-sm font-semibold text-stone-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.655 32.657 29.237 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.27 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.27 4 24 4c-7.682 0-14.41 4.337-17.694 10.691z"/>
                    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.143 35.091 26.715 36 24 36c-5.216 0-9.622-3.316-11.283-7.946l-6.522 5.025C9.438 39.556 16.651 44 24 44z"/>
                    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.048 12.048 0 01-4.084 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
                  </svg>
                  Google
                </button>
              </div>

              <button
                type="button"
                className="flex h-10 items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
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
