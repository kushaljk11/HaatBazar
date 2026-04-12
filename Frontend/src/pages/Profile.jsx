import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Lock, Save, ShieldCheck, UserCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../utils/axios";

const initialProfile = {
	name: "",
	email: "",
	phone: "",
	location: "",
	gender: "other",
	primaryCrop: "other",
	role: "",
};

const initialPassword = {
	currentPassword: "",
	newPassword: "",
	confirmPassword: "",
};

const getDashboardPath = (role) => {
	if (role === "admin") return "/admin/dashboard";
	if (role === "farmer") return "/farmer/dashboard";
	if (role === "buyer") return "/buyer/dashboard";
	return "/";
};

export default function Profile() {
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [isPasswordSaving, setIsPasswordSaving] = useState(false);
	const [profile, setProfile] = useState(initialProfile);
	const [passwordForm, setPasswordForm] = useState(initialPassword);

	const storedUser = useMemo(
		() => JSON.parse(localStorage.getItem("user") || "null"),
		[],
	);
	const token = localStorage.getItem("token") || storedUser?.token;
	const userId = storedUser?.id || storedUser?._id;
	const dashboardPath = getDashboardPath(profile.role || storedUser?.role);

	useEffect(() => {
		const fetchProfile = async () => {
			if (!token || !userId) {
				toast.error("Please login to view your profile.");
				setIsLoading(false);
				return;
			}

			try {
				setIsLoading(true);
				const response = await api.get(`/user/${userId}`, {
					headers: { Authorization: `Bearer ${token}` },
				});

				const user = response?.data?.user;
				if (!user) {
					throw new Error("User data not found");
				}

				setProfile({
					name: user?.name || "",
					email: user?.email || "",
					phone: user?.phone || "",
					location: user?.location || "",
					gender: user?.gender || "other",
					primaryCrop: user?.primaryCrop || "other",
					role: user?.role || storedUser?.role || "user",
				});
			} catch (error) {
				toast.error(error?.response?.data?.message || "Failed to load profile");
			} finally {
				setIsLoading(false);
			}
		};

		fetchProfile();
	}, [token, userId, storedUser?.role]);

	const handleInput = (event) => {
		const { name, value } = event.target;
		setProfile((prev) => ({ ...prev, [name]: value }));
	};

	const handleSaveProfile = async () => {
		if (!token || !userId) {
			toast.error("Please login again.");
			return;
		}

		try {
			setIsSaving(true);
			const payload = {
				name: profile.name,
				phone: profile.phone,
				location: profile.location,
				gender: profile.gender,
				primaryCrop: profile.primaryCrop,
			};

			const response = await api.put(`/user/update/${userId}`, payload, {
				headers: { Authorization: `Bearer ${token}` },
			});

			const updated = response?.data?.user;
			if (updated) {
				const nextUser = {
					...(storedUser || {}),
					id: updated._id,
					name: updated.name,
					email: updated.email,
					role: updated.role,
					phone: updated.phone,
					location: updated.location,
				};
				localStorage.setItem("user", JSON.stringify(nextUser));
			}

			toast.success("Profile updated successfully");
		} catch (error) {
			toast.error(error?.response?.data?.message || "Failed to update profile");
		} finally {
			setIsSaving(false);
		}
	};

	const handlePasswordInput = (event) => {
		const { name, value } = event.target;
		setPasswordForm((prev) => ({ ...prev, [name]: value }));
	};

	const handlePasswordUpdate = async () => {
		if (!token || !userId) {
			toast.error("Please login again.");
			return;
		}

		if (!passwordForm.currentPassword || !passwordForm.newPassword) {
			toast.error("Please enter current and new password.");
			return;
		}

		if (passwordForm.newPassword !== passwordForm.confirmPassword) {
			toast.error("New password and confirm password do not match.");
			return;
		}

		try {
			setIsPasswordSaving(true);
			await api.put(
				`/user/password/${userId}`,
				{
					currentPassword: passwordForm.currentPassword,
					newPassword: passwordForm.newPassword,
				},
				{ headers: { Authorization: `Bearer ${token}` } },
			);

			setPasswordForm(initialPassword);
			toast.success("Password updated successfully");
		} catch (error) {
			toast.error(error?.response?.data?.message || "Failed to update password");
		} finally {
			setIsPasswordSaving(false);
		}
	};

	return (
		<main className="min-h-screen bg-[#f6f8f7] p-4 md:p-8">
			<div className="mx-auto max-w-5xl">
				<div className="mb-5 flex flex-wrap items-center justify-between gap-3">
					<div>
						<h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">My Profile</h1>
						<p className="mt-1 text-sm text-slate-600">
							Manage your account information and security settings.
						</p>
					</div>
					<Link
						to={dashboardPath}
						className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
					>
						<ArrowLeft className="h-4 w-4" />
						Back to Dashboard
					</Link>
				</div>

				{isLoading ? (
					<div className="rounded-2xl border border-emerald-100 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
						Loading profile...
					</div>
				) : (
					<section className="grid gap-5 lg:grid-cols-3">
						<article className="space-y-5 lg:col-span-2">
							<div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm md:p-6">
								<div className="mb-4 flex items-center gap-2">
									<UserCircle2 className="h-5 w-5 text-emerald-700" />
									<h2 className="text-lg font-semibold text-slate-900">Basic Information</h2>
								</div>

								<div className="grid gap-4 md:grid-cols-2">
									<div>
										<label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
											Full Name
										</label>
										<input
											type="text"
											name="name"
											value={profile.name}
											onChange={handleInput}
											className="w-full rounded-xl border border-emerald-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white"
										/>
									</div>

									<div>
										<label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
											Email Address
										</label>
										<input
											type="email"
											value={profile.email}
											disabled
											className="w-full rounded-xl border border-emerald-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-500 outline-none"
										/>
									</div>

									<div>
										<label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
											Phone Number
										</label>
										<input
											type="tel"
											name="phone"
											value={profile.phone}
											onChange={handleInput}
											className="w-full rounded-xl border border-emerald-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white"
										/>
									</div>

									<div>
										<label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
											Gender
										</label>
										<select
											name="gender"
											value={profile.gender}
											onChange={handleInput}
											className="w-full rounded-xl border border-emerald-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white"
										>
											<option value="male">Male</option>
											<option value="female">Female</option>
											<option value="other">Other</option>
										</select>
									</div>

									<div className="md:col-span-2">
										<label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
											Address / Location
										</label>
										<input
											type="text"
											name="location"
											value={profile.location}
											onChange={handleInput}
											className="w-full rounded-xl border border-emerald-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white"
										/>
									</div>

									<div className="md:col-span-2">
										<label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
											Primary Crop / Interest
										</label>
										<select
											name="primaryCrop"
											value={profile.primaryCrop}
											onChange={handleInput}
											className="w-full rounded-xl border border-emerald-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white"
										>
											<option value="grains">Grains</option>
											<option value="fruits">Fruits</option>
											<option value="vegetables">Vegetables</option>
											<option value="other">Other</option>
										</select>
									</div>
								</div>
							</div>

							<div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm md:p-6">
								<div className="mb-4 flex items-center gap-2">
									<Lock className="h-5 w-5 text-emerald-700" />
									<h2 className="text-lg font-semibold text-slate-900">Password</h2>
								</div>

								<div className="grid gap-3 md:grid-cols-3">
									<input
										type="password"
										name="currentPassword"
										value={passwordForm.currentPassword}
										onChange={handlePasswordInput}
										placeholder="Current password"
										className="w-full rounded-xl border border-emerald-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white"
									/>
									<input
										type="password"
										name="newPassword"
										value={passwordForm.newPassword}
										onChange={handlePasswordInput}
										placeholder="New password"
										className="w-full rounded-xl border border-emerald-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white"
									/>
									<input
										type="password"
										name="confirmPassword"
										value={passwordForm.confirmPassword}
										onChange={handlePasswordInput}
										placeholder="Confirm new password"
										className="w-full rounded-xl border border-emerald-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white"
									/>
								</div>

								<button
									type="button"
									onClick={handlePasswordUpdate}
									disabled={isPasswordSaving}
									className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
								>
									<Lock className="h-4 w-4" />
									{isPasswordSaving ? "Updating..." : "Update Password"}
								</button>
							</div>
						</article>

						<aside className="space-y-5">
							<div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm md:p-6">
								<div className="mb-4 flex items-center gap-2">
									<ShieldCheck className="h-5 w-5 text-emerald-700" />
									<h2 className="text-base font-semibold text-slate-900">Account Summary</h2>
								</div>
								<div className="space-y-2 text-sm text-slate-600">
									<p>
										<span className="font-semibold text-slate-800">Role:</span>{" "}
										{(profile.role || "user").toUpperCase()}
									</p>
									<p>
										<span className="font-semibold text-slate-800">Name:</span>{" "}
										{profile.name || "Not set"}
									</p>
									<p>
										<span className="font-semibold text-slate-800">Email:</span>{" "}
										{profile.email || "Not set"}
									</p>
								</div>
							</div>

							<div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm md:p-6">
								<button
									type="button"
									onClick={handleSaveProfile}
									disabled={isSaving}
									className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
								>
									<Save className="h-4 w-4" />
									{isSaving ? "Saving..." : "Save Profile"}
								</button>
							</div>
						</aside>
					</section>
				)}
			</div>
		</main>
	);
}
