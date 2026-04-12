import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/auth/Register";
import Loader from "./components/Loader";
import Login from "./pages/auth/Login";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import FarmerDashboard from "./farmer/Dashboard";
import MarketPlace from "./farmer/MarketPlace";
import MyCrops from "./farmer/MyCrops";
import AddNewCrop from "./farmer/AddNewCrops";
import Orders from "./farmer/Order";
import FarmerBooking from "./farmer/Booking";
import Setting from "./farmer/Setting";
import Dashboard from "./buyer/Dashboard";
import Marketplace from "./buyer/Marketplace";
import Booking from "./buyer/Booking";
import Wishlist from "./buyer/Wishlist";
import Postetails from "./pages/Postetails";
import BuyerOrders from "./buyer/Orders";
import BuyerPayment from "./buyer/Payment";
import BuyerSetting from "./buyer/Setting";
import PaymentForm from "./buyer/payment/PaymentForm";
import PaymentSuccess from "./buyer/payment/PaymentSuccess";
import PaymentFailure from "./buyer/payment/PaymentFailure";
import AdminDashboard from "./admin/Dashboard";
import AdminUserManagement from "./admin/UserManagement";
import AdminPostApproval from "./admin/PostApproval";
import AdminBooking from "./admin/Booking";
import AdminOrder from "./admin/Order";
import AdminPayment from "./admin/Payment";
import AdminSetting from "./admin/Setting";
import AdminLog from "./admin/Log";
import ChatbotWidget from "./components/ChatbotWidget";
import PwaInstallPrompt from "./components/PwaInstallPrompt";
import ProtectedRoute from "./components/ProtectedRoute";

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
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Landing />} />
          <Route path="/aboutus" element={<About />} />
          <Route path="/contact" element={<Contact />} />
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
        </Routes>
        <PwaInstallPrompt />
        <ChatbotWidget />
      </BrowserRouter>
    </>
  );
}

export default App;
