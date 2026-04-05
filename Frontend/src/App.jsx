import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import BuyerDashboard from "./buyer/pages/BuyerDashboard";
import Marketplace from "./buyer/pages/Marketplace";
import OrderHistory from "./buyer/pages/OrderHistory";
import SavedPost from "./buyer/pages/SavedPost";
import Cart from "./buyer/pages/Cart";
import Settings from "./buyer/pages/Settings";
import { CartProvider } from "./context/CartContext";

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
        <CartProvider>
          <Toaster position="top-center" reverseOrder={false} />
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Landing />} />
            <Route path="/aboutus" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
            <Route path="/buyer/marketplace" element={<Marketplace />} />
            <Route path="/buyer/order-history" element={<OrderHistory />} />
            <Route path="/buyer/saved-post" element={<SavedPost />} />
            <Route path="/buyer/cart" element={<Cart />} />
            <Route path="/buyer/settings" element={<Settings />} />
          </Routes>
        </CartProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
