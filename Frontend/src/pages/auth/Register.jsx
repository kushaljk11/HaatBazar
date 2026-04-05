import { useState } from "react";
import { Link } from "react-router-dom";
import registerImg from "../../assets/register.jpg";
import api from "../../utils/axios";

export default function Register() {
  const [accountType, setAccountType] = useState("farmer");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "farmer",
    phone: "",
    location: "",
    gender: "male",
    primaryCrop: "grains, vegetables, fruits, other",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleAccountTypeChange = (type) => {
    setAccountType(type);
    setFormData((prev) => ({
      ...prev,
      role: type,
      // Buyer does not select crop on UI, so keep a valid fallback for backend validation.
      primaryCrop: type === "buyer" ? "Other" : prev.primaryCrop || "Grains",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.role ||
      !formData.phone ||
      !formData.location ||
      !formData.gender ||
      !formData.primaryCrop
    ) {
      setErrorMessage("Please fill all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post("/register", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = response.data;

      setSuccessMessage(
        data.message || "Registration successful. You can login now.",
      );

      setFormData({
        name: "",
        email: "",
        password: "",
        role: accountType,
        phone: "",
        location: "",
        gender: "male",
        primaryCrop: accountType === "buyer" ? "Other" : "Grains",
      });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-stone-100 md:grid md:grid-cols-2">
      <section className="relative hidden h-screen md:block">
        <img
          src={registerImg}
          alt="Register"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 p-8 text-white lg:p-12">
          <h1 className="text-4xl font-semibold leading-tight">
            Join the digital
          </h1>
          <h1 className="text-4xl font-semibold leading-tight">Harvest.</h1>
          <p className="mt-3 max-w-lg text-base text-white/90">
            Connect directly with local producers or scale your agriculture
            business through Nepal&apos;s most precise trade network.
          </p>
        </div>
      </section>

      <section className="h-full px-4 py-4 sm:px-6 md:max-h-screen md:overflow-y-auto md:px-10 md:py-6 lg:px-14">
        <div className="mx-auto w-full max-w-[520px]">
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
                onClick={() => handleAccountTypeChange("farmer")}
                className={`rounded-xl px-3 py-1.5 font-semibold transition ${
                  accountType === "farmer"
                    ? "bg-white text-emerald-900 shadow-sm"
                    : "text-stone-700"
                }`}
              >
                Register as Farmer
              </button>
              <button
                type="button"
                onClick={() => handleAccountTypeChange("buyer")}
                className={`rounded-xl px-3 py-1.5 font-semibold transition ${
                  accountType === "buyer"
                    ? "bg-white text-emerald-900 shadow-sm"
                    : "text-stone-700"
                }`}
              >
                Register as Buyer
              </button>
            </div>

            <form className="mt-3 space-y-2.5" onSubmit={handleSubmit}>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-600">
                  Full Name
                </label>
                <div className="mt-1 rounded-2xl bg-stone-100 px-3.5 py-2">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Ram Bahadur"
                    className="w-full bg-transparent text-sm text-stone-700 outline-none placeholder:text-stone-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-600">
                  Email Address
                </label>
                <div className="mt-1 rounded-2xl bg-stone-100 px-3.5 py-2">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full bg-transparent text-sm text-stone-700 outline-none placeholder:text-stone-400"
                    required
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
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="98XXXXXXXX"
                    className="w-full bg-transparent text-sm text-stone-700 outline-none placeholder:text-stone-400"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-600">
                    Gender
                  </label>
                  <div className="mt-1 rounded-2xl bg-stone-100 px-3.5 py-2">
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full appearance-none bg-transparent text-sm text-stone-700 outline-none"
                      required
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-600">
                    District Location
                  </label>
                  <div className="mt-1 rounded-2xl bg-stone-100 px-3.5 py-2">
                    <select
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full appearance-none bg-transparent text-sm text-stone-700 outline-none"
                      required
                    >
                      <option value="">Select District</option>
                      <option value="Kathmandu">Kathmandu</option>
                      <option value="Lalitpur">Lalitpur</option>
                      <option value="Bhaktapur">Bhaktapur</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-600">
                  Create Password
                </label>
                <div className="mt-1 rounded-2xl bg-stone-100 px-3.5 py-2">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="........"
                    className="w-full bg-transparent text-sm text-stone-700 outline-none placeholder:text-stone-400"
                    required
                  />
                </div>
              </div>

              {accountType === "farmer" ? (
                <div className="border-t border-stone-200 pt-2.5">
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-600">
                      Primary Crop
                    </label>
                    <div className="mt-1 rounded-2xl bg-stone-100 px-3.5 py-2">
                      <select
                        name="primaryCrop"
                        value={formData.primaryCrop}
                        onChange={handleChange}
                        className="w-full appearance-none bg-transparent text-sm text-stone-700 outline-none"
                        required
                      >
                        <option value="grains">Grains</option>
                        <option value="vegetables">Vegetables</option>
                        <option value="fruits">Fruits</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border-t border-stone-200 pt-2.5"></div>
              )}

              {errorMessage ? (
                <p className="rounded-xl bg-red-50 px-3 py-2 text-center text-xs text-red-700">
                  {errorMessage}
                </p>
              ) : null}

              {successMessage ? (
                <p className="rounded-xl bg-emerald-50 px-3 py-2 text-center text-xs text-emerald-700">
                  {successMessage}
                </p>
              ) : null}

              <p className="text-center text-[11px] text-stone-500">
                By clicking Register, you agree to our Terms of Service and
                Privacy Policy.
              </p>

              <div className="grid grid-cols-2 gap-2 pt-0.5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-emerald-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>

                <Link
                  to="/login"
                  className="block w-full rounded-full border border-stone-300 px-5 py-2 text-center text-sm font-semibold text-stone-700"
                >
                  Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
