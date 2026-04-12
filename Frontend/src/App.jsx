import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/auth/Register";
import Loader from "./components/Loader";
import Login from "./pages/auth/Login";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Contact from "./pages/Contact";
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
          <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
          <Route path="/marketplace" element={<MarketPlace />} />
          <Route path="/farmer/my-crops" element={<MyCrops />} />
          <Route path="/farmer/list-crops" element={<AddNewCrop />} />
          <Route path="/farmer/orders" element={<Orders />} />
          <Route path="/farmer/bookings" element={<FarmerBooking />} />
          <Route path="/farmer/settings" element={<Setting />} />
          <Route path="/buyer/dashboard" element={<Dashboard />} />
          <Route path="/buyer/marketplace" element={<Marketplace />} />
          <Route path="/buyer/marketplace/:id" element={<Postetails />} />
          <Route path="/buyer/bookings" element={<Booking />} />
          <Route path="/buyer/wishlist" element={<Wishlist />} />
          <Route path="/buyer/orders" element={<BuyerOrders />} />
          <Route path="/buyer/payment" element={<BuyerPayment />} />
          <Route path="/buyer/payment/checkout" element={<PaymentForm />} />
          <Route path="/buyer/payment/success" element={<PaymentSuccess />} />
          <Route path="/buyer/payment/failure" element={<PaymentFailure />} />
          <Route path="/buyer/settings" element={<BuyerSetting />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
