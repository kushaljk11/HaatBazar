import { lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loader from "./components/Loader";
import Landing from "./pages/Landing";
import ChatbotWidget from "./components/ChatbotWidget";
import PwaInstallPrompt from "./components/PwaInstallPrompt";
import ProtectedRoute from "./components/ProtectedRoute";
import LenisManager from "./components/LenisManager";

const Register = lazy(() => import("./pages/auth/Register"));
const Login = lazy(() => import("./pages/auth/Login"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Profile = lazy(() => import("./pages/Profile"));
const FarmerDashboard = lazy(() => import("./farmer/Dashboard"));
const MarketPlace = lazy(() => import("./farmer/MarketPlace"));
const MyCrops = lazy(() => import("./farmer/MyCrops"));
const AddNewCrop = lazy(() => import("./farmer/AddNewCrops"));
const Orders = lazy(() => import("./farmer/Order"));
const FarmerBooking = lazy(() => import("./farmer/Booking"));
const Setting = lazy(() => import("./farmer/Setting"));
const Dashboard = lazy(() => import("./buyer/Dashboard"));
const Marketplace = lazy(() => import("./buyer/Marketplace"));
const Booking = lazy(() => import("./buyer/Booking"));
const Wishlist = lazy(() => import("./buyer/Wishlist"));
const Postetails = lazy(() => import("./pages/Postetails"));
const BuyerOrders = lazy(() => import("./buyer/Orders"));
const BuyerPayment = lazy(() => import("./buyer/Payment"));
const BuyerSetting = lazy(() => import("./buyer/Setting"));
const PaymentForm = lazy(() => import("./buyer/payment/PaymentForm"));
const PaymentSuccess = lazy(() => import("./buyer/payment/PaymentSuccess"));
const PaymentFailure = lazy(() => import("./buyer/payment/PaymentFailure"));
const AdminDashboard = lazy(() => import("./admin/Dashboard"));
const AdminUserManagement = lazy(() => import("./admin/UserManagement"));
const AdminPostApproval = lazy(() => import("./admin/PostApproval"));
const AdminBooking = lazy(() => import("./admin/Booking"));
const AdminOrder = lazy(() => import("./admin/Order"));
const AdminPayment = lazy(() => import("./admin/Payment"));
const AdminSetting = lazy(() => import("./admin/Setting"));
const AdminLog = lazy(() => import("./admin/Log"));

function App() {
  // if (isCheckingAuth && !authUser)
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <Loader className="size-10 animate-spin" />
  //     </div>
  //   );
  return (
    <>
      <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
        <LenisManager />
        <Suspense
          fallback={
            <div className="flex h-screen items-center justify-center bg-white">
              <Loader className="size-10 animate-spin" />
            </div>
          }
        >
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Landing />} />
          <Route path="/aboutus" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/farmer/dashboard" element={<ProtectedRoute><FarmerDashboard /></ProtectedRoute>} />
          <Route path="/marketplace" element={<ProtectedRoute><MarketPlace /></ProtectedRoute>} />
          <Route path="/farmer/marketplace" element={<ProtectedRoute><MarketPlace /></ProtectedRoute>} />
          <Route path="/farmer/my-crops" element={<ProtectedRoute><MyCrops /></ProtectedRoute>} />
          <Route path="/farmer/list-crops" element={<ProtectedRoute><AddNewCrop /></ProtectedRoute>} />
          <Route path="/farmer/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/farmer/bookings" element={<ProtectedRoute><FarmerBooking /></ProtectedRoute>} />
          <Route path="/farmer/settings" element={<ProtectedRoute><Setting /></ProtectedRoute>} />
          <Route path="/buyer/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/buyer/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
          <Route path="/buyer/marketplace/:id" element={<ProtectedRoute><Postetails /></ProtectedRoute>} />
          <Route path="/buyer/bookings" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
          <Route path="/buyer/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/buyer/orders" element={<ProtectedRoute><BuyerOrders /></ProtectedRoute>} />
          <Route path="/buyer/payment" element={<ProtectedRoute><BuyerPayment /></ProtectedRoute>} />
          <Route path="/buyer/payment/checkout" element={<ProtectedRoute><PaymentForm /></ProtectedRoute>} />
          <Route path="/buyer/payment/success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
          <Route path="/buyer/payment/failure" element={<ProtectedRoute><PaymentFailure /></ProtectedRoute>} />
          <Route path="/buyer/settings" element={<ProtectedRoute><BuyerSetting /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><BuyerPayment /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><PaymentForm /></ProtectedRoute>} />

          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute><AdminUserManagement /></ProtectedRoute>} />
          <Route path="/admin/posts" element={<ProtectedRoute><AdminPostApproval /></ProtectedRoute>} />
          <Route path="/admin/bookings" element={<ProtectedRoute><AdminBooking /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute><AdminOrder /></ProtectedRoute>} />
          <Route path="/admin/payments" element={<ProtectedRoute><AdminPayment /></ProtectedRoute>} />
          <Route path="/admin/log" element={<ProtectedRoute><AdminLog /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute><AdminSetting /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
        <PwaInstallPrompt />
        <ChatbotWidget />
      </BrowserRouter>
    </>
  );
}

export default App;
