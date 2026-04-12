
import { useEffect, useMemo, useState } from "react";
import {
    FaCalendarAlt,
    FaHeart,
    FaLeaf,
    FaMapMarkerAlt,
    FaRegHeart,
    FaRegStar,
    FaShoppingCart,
} from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../utils/axios";
import { toast } from "react-hot-toast";

export default function Postetails() {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    const [quantity, setQuantity] = useState(5);
    const [post, setPost] = useState(location.state?.post || null);
    const [isLoading, setIsLoading] = useState(!location.state?.post);
    const [error, setError] = useState("");
    const [isSaved, setIsSaved] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const [buyNowLoading, setBuyNowLoading] = useState(false);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingForm, setBookingForm] = useState({
        pickupDate: "",
        timeInterval: "06:00 AM - 09:00 AM",
        pickupLocation: "",
    });

    const decreaseQty = () => setQuantity((prev) => Math.max(1, prev - 1));
    const increaseQty = () => setQuantity((prev) => Math.min(99, prev + 1));

    useEffect(() => {
        const fetchPostDetails = async () => {
            if (!id) {
                setError("Invalid product id.");
                return;
            }

            const token = localStorage.getItem("token");
            if (!token) {
                setError("Please login to view product details.");
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError("");

                const response = await api.get(`/post/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPost(response?.data || null);
            } catch (fetchError) {
                const message =
                    fetchError?.response?.data?.message ||
                    "Failed to fetch product details.";
                setError(message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPostDetails();
    }, [id]);

    useEffect(() => {
        const fetchWishlistStatus = async () => {
            if (!id) {
                return;
            }

            const token = localStorage.getItem("token");
            if (!token) {
                return;
            }

            try {
                const response = await api.get(`/wishlist/check/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setIsSaved(Boolean(response?.data?.saved));
            } catch {
                setIsSaved(false);
            }
        };

        fetchWishlistStatus();
    }, [id]);

    const toggleWishlist = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login to manage wishlist.");
            return;
        }

        if (!id || wishlistLoading) {
            return;
        }

        try {
            setWishlistLoading(true);
            const response = await api.post(
                `/wishlist/toggle/${id}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } },
            );

            if (typeof response?.data?.saved === "boolean") {
                setIsSaved(response.data.saved);
                toast.success(
                    response.data.saved
                        ? "Added to wishlist"
                        : "Removed from wishlist",
                );
            } else {
                setIsSaved((prev) => {
                    const next = !prev;
                    toast.success(next ? "Added to wishlist" : "Removed from wishlist");
                    return next;
                });
            }
        } catch (toggleError) {
            setIsSaved((prev) => prev);
            const message =
                toggleError?.response?.data?.message ||
                "Failed to update wishlist. Please try again.";
            toast.error(message);
        } finally {
            setWishlistLoading(false);
        }
    };

    const handleBuyNow = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login to place order.");
            return;
        }

        if (!id || buyNowLoading) {
            return;
        }

        try {
            setBuyNowLoading(true);
            const totalAmount = quantity * displayPost.price;
            const checkoutQuery = new URLSearchParams({
                amount: String(totalAmount),
                gateway: "esewa",
                postId: id,
                quantity: String(quantity),
                productName: displayPost.title,
                deliveryAddress: displayPost.location,
            }).toString();

            navigate(`/buyer/payment/checkout?${checkoutQuery}`);
        } finally {
            setBuyNowLoading(false);
        }
    };

    useEffect(() => {
        setBookingForm((prev) => ({
            ...prev,
            pickupLocation: post?.postLocation || prev.pickupLocation || "",
        }));
    }, [post?.postLocation]);

    const handleBookingInput = (event) => {
        const { name, value } = event.target;
        setBookingForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleBookNow = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login to create booking.");
            return;
        }

        if (!id || bookingLoading) {
            return;
        }

        if (!bookingForm.pickupDate) {
            toast.error("Please select pickup date.");
            return;
        }

        try {
            setBookingLoading(true);
            await api.post(
                "/bookings",
                {
                    productId: id,
                    quantity,
                    bookingMode: "reserve_pickup",
                    paymentMethod: "cod",
                    pickupDate: bookingForm.pickupDate,
                    timeInterval: bookingForm.timeInterval,
                    pickupLocation: bookingForm.pickupLocation || displayPost.location,
                    deliveryAddress: bookingForm.pickupLocation || displayPost.location,
                },
                { headers: { Authorization: `Bearer ${token}` } },
            );

            toast.success("Booking created successfully");
            setIsBookingModalOpen(false);
            navigate("/buyer/bookings");
        } catch (bookingError) {
            const message =
                bookingError?.response?.data?.message ||
                "Failed to create booking. Please try again.";
            toast.error(message);
        } finally {
            setBookingLoading(false);
        }
    };
    

    const displayPost = useMemo(
        () => ({
            title: post?.postTitle || "Himalayan Red Potatoes",
            category: post?.category || "Vegetables",
            subCategory: post?.tag || "Root Vegetables",
            price: Number(post?.price || 185),
            quantity: Number(post?.quantity || 450),
            location: post?.postLocation || "Mustang, Nepal",
            description:
                post?.postDescription ||
                "Fresh produce from trusted local growers.",
            contact: post?.contactInfo || post?.user?.email || "Contact unavailable",
            variety: post?.variety || "Farm Fresh",
            minimumOrder: Number(post?.minimumOrder || 1),
            image:
                post?.postImage ||
                "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=1200&q=80",
            seller: post?.user?.name || "Local Farmer",
            sellerEmail: post?.user?.email || "",
            postedDate: post?.createdAt
                ? new Date(post.createdAt).toISOString().slice(0, 10)
                : "N/A",
            approval: post?.adminApproval || "Pending",
        }),
        [post],
    );

    const thumbnails = [
        {
            id: 1,
            image:
                "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=320&q=80",
            label: "Harvest View",
        },
        {
            id: 2,
            image:
                "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=320&q=80",
            label: "Terrace Fields",
        },
        {
            id: 3,
            image:
                "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=320&q=80",
            label: "Mustang Region",
        },
    ];

    const highlights = useMemo(
        () => [
            {
                id: 1,
                icon: <FaCalendarAlt className="text-sm text-emerald-700" />,
                label: "POSTED DATE",
                value: displayPost.postedDate,
            },
            {
                id: 2,
                icon: <FaMapMarkerAlt className="text-sm text-emerald-700" />,
                label: "LOCATION",
                value: displayPost.location,
            },
            {
                id: 3,
                icon: <FaLeaf className="text-sm text-emerald-700" />,
                label: "VARIETY",
                value: displayPost.variety,
            },
            {
                id: 4,
                icon: <FaRegStar className="text-sm text-emerald-700" />,
                label: "LISTING STATUS",
                value: displayPost.approval,
            },
        ],
        [displayPost],
    );

    if (isLoading) {
        return (
            <section className="min-h-screen bg-[#f4f5f4] px-4 py-8 sm:px-8 lg:px-12">
                <div className="mx-auto max-w-7xl rounded-2xl border border-emerald-100 bg-white p-8 text-center text-slate-600">
                    Loading product details...
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="min-h-screen bg-[#f4f5f4] px-4 py-8 sm:px-8 lg:px-12">
                <div className="mx-auto max-w-7xl rounded-2xl border border-rose-100 bg-rose-50 p-8 text-center">
                    <p className="text-sm font-medium text-rose-700">{error}</p>
                    <button
                        type="button"
                        onClick={() => navigate("/buyer/marketplace")}
                        className="mt-4 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
                    >
                        Back to Marketplace
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-screen bg-[#f4f5f4] px-4 py-8 sm:px-8 lg:px-12">
            <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.2fr_0.95fr]">
                <div className="space-y-5">
                    <div className="relative overflow-hidden rounded-3xl bg-[#111] shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
                        <span className="absolute left-4 top-4 z-10 rounded-full bg-[#2d7f28] px-4 py-1 text-xs font-bold tracking-wide text-white">
                            ORGANIC CERTIFIED
                        </span>
                        <span className="absolute left-4 top-14 z-10 rounded-full bg-white px-4 py-1 text-xs font-semibold text-stone-800">
                            Limited Harvest
                        </span>
                        <img
                            src={displayPost.image}
                            alt={displayPost.title}
                            loading="lazy"
                            className="h-[360px] w-full object-cover sm:h-[420px]"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-3 sm:gap-4">
                        {thumbnails.map((item) => (
                            <div
                                key={item.id}
                                className="group relative overflow-hidden rounded-2xl shadow-sm"
                            >
                                <img
                                    src={item.image}
                                    alt={item.label}
                                    loading="lazy"
                                    className="h-24 w-full object-cover transition duration-300 group-hover:scale-105 sm:h-28"
                                />
                                <span className="absolute inset-x-2 bottom-2 rounded-full bg-white/85 px-2 py-1 text-center text-[11px] font-semibold text-stone-700 backdrop-blur-sm">
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="pt-2">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <h2 className="text-2xl font-semibold text-stone-800">
                                Product Description
                            </h2>
                        </div>

                        <article className="rounded-3xl bg-[#eef0ee] p-5 text-stone-700 shadow-[0_8px_20px_rgba(0,0,0,0.06)] sm:p-6">
                            <p className="text-sm leading-7 text-stone-600 sm:text-base">
                                {displayPost.description || "No description available for this listing."}
                            </p>
                            <div className="mt-4 grid gap-2 text-xs text-stone-500 sm:grid-cols-2">
                                <p>
                                    <span className="font-semibold text-stone-700">Category:</span> {displayPost.category}
                                </p>
                                <p>
                                    <span className="font-semibold text-stone-700">Variety:</span> {displayPost.variety}
                                </p>
                                <p>
                                    <span className="font-semibold text-stone-700">Location:</span> {displayPost.location}
                                </p>
                                <p>
                                    <span className="font-semibold text-stone-700">Min Order:</span> {displayPost.minimumOrder} kg
                                </p>
                            </div>
                        </article>
                    </div>
                </div>

                <div className="space-y-5">
                    <div>
                        <p className="text-sm font-medium text-stone-500">
                            Marketplace <span className="mx-1">›</span> {displayPost.category}
                            <span className="mx-1">›</span>
                            <span className="font-semibold text-[#68853b]">{displayPost.subCategory}</span>
                        </p>
                        <h1 className="mt-2 text-2xl font-semibold leading-tight text-stone-900 sm:text-3xl">
                            {displayPost.title}
                        </h1>
                        <div className="mt-4 flex items-center gap-3 text-sm">
                            <span className="font-semibold text-[#628f22]">★ 4.9</span>
                            <span className="text-stone-500">(124 Reviews)</span>
                            <span className="h-4 w-px bg-stone-300" />
                            <span className="font-semibold text-emerald-700">{displayPost.quantity} kg available</span>
                        </div>
                        <p className="mt-2 text-sm text-slate-500">
                            Sold by <span className="font-semibold text-emerald-700">{displayPost.seller}</span> from {displayPost.location}
                        </p>
                    </div>

                    <div className="rounded-3xl bg-[#eceeed] p-5 shadow-[0_14px_32px_rgba(0,0,0,0.08)] sm:p-6">
                        <p className="text-sm text-stone-500">Price per kg</p>
                        <div className="mt-2 flex items-start justify-between gap-4">
                            <div className="flex items-start gap-2">
                                <p className="text-2xl font-semibold leading-none text-[#0d5239]">
                                    NPR {displayPost.price}
                                </p>
                                <span className="mt-1.5 text-base font-medium text-stone-500">/kg</span>
                            </div>
                            <span className="rounded-full bg-[#f6d0cd] px-3 py-1.5 text-xs font-semibold text-[#b63d36]">
                                Next Harvest: 12 Days
                            </span>
                        </div>

                        <div className="mt-6 flex items-center justify-between gap-4">
                            <div className="flex items-center rounded-full border border-stone-300 bg-white px-2 py-1">
                                <button
                                    type="button"
                                    onClick={decreaseQty}
                                    className="flex size-9 items-center justify-center rounded-full text-2xl text-stone-600 transition hover:bg-stone-100"
                                >
                                    -
                                </button>
                                <span className="w-10 text-center text-base font-semibold text-stone-800">
                                    {quantity}
                                </span>
                                <button
                                    type="button"
                                    onClick={increaseQty}
                                    className="flex size-9 items-center justify-center rounded-full text-2xl text-stone-600 transition hover:bg-stone-100"
                                >
                                    +
                                </button>
                            </div>

                            <div className="text-right">
                                <p className="text-xs uppercase tracking-wide text-stone-500">Subtotal</p>
                                <p className="text-2xl font-semibold text-stone-800">
                                    NPR {(quantity * displayPost.price).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                            <button
                                type="button"
                                onClick={handleBuyNow}
                                disabled={buyNowLoading}
                                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0b5b40] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#094d36]"
                            >
                                <FaShoppingCart className="text-sm" /> {buyNowLoading ? "Placing..." : "Buy Now"}
                            </button>

                            <button
                                type="button"
                                onClick={toggleWishlist}
                                disabled={wishlistLoading}
                                className="flex w-full items-center justify-center gap-2 rounded-full border border-emerald-700 bg-white px-6 py-4 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {isSaved ? <FaHeart className="text-sm" /> : <FaRegHeart className="text-sm" />}
                                {wishlistLoading ? "Saving..." : isSaved ? "Saved to Wishlist" : "Save to Wishlist"}
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsBookingModalOpen(true)}
                            className="mt-3 w-full rounded-lg bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-200"
                        >
                            Book it
                        </button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        {highlights.map((item) => (
                            <article
                                key={item.id}
                                className="rounded-3xl bg-[#eceeed] p-4 shadow-[0_8px_16px_rgba(0,0,0,0.05)]"
                            >
                                <div className="flex items-center gap-2">{item.icon}</div>
                                <p className="mt-2 text-xs font-semibold tracking-wide text-stone-500">
                                    {item.label}
                                </p>
                                <p className="mt-1 text-lg font-semibold leading-snug text-stone-800">
                                    {item.value}
                                </p>
                            </article>
                        ))}
                    </div>

                </div>
            </div>

            {isBookingModalOpen ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
                        <h3 className="text-xl font-semibold text-slate-900">Schedule Booking</h3>
                        <p className="mt-1 text-sm text-slate-500">
                            Choose booking date and preferred time interval.
                        </p>

                        <div className="mt-4 space-y-3">
                            <div>
                                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Pickup Date
                                </label>
                                <input
                                    type="date"
                                    name="pickupDate"
                                    min={new Date().toISOString().slice(0, 10)}
                                    value={bookingForm.pickupDate}
                                    onChange={handleBookingInput}
                                    className="w-full rounded-xl border border-emerald-200 bg-emerald-50/30 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Time Interval
                                </label>
                                <select
                                    name="timeInterval"
                                    value={bookingForm.timeInterval}
                                    onChange={handleBookingInput}
                                    className="w-full rounded-xl border border-emerald-200 bg-emerald-50/30 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white"
                                >
                                    <option>06:00 AM - 09:00 AM</option>
                                    <option>09:00 AM - 12:00 PM</option>
                                    <option>12:00 PM - 03:00 PM</option>
                                    <option>03:00 PM - 06:00 PM</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Pickup Location
                                </label>
                                <input
                                    type="text"
                                    name="pickupLocation"
                                    value={bookingForm.pickupLocation}
                                    onChange={handleBookingInput}
                                    className="w-full rounded-xl border border-emerald-200 bg-emerald-50/30 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white"
                                />
                            </div>
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setIsBookingModalOpen(false)}
                                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleBookNow}
                                disabled={bookingLoading}
                                className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {bookingLoading ? "Booking..." : "Confirm Booking"}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </section>
    );
}