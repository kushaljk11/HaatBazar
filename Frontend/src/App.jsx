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
          <Route path="/farmer/marketplace" element={<MarketPlace />} />
          <Route path="/farmer/my-crops" element={<MyCrops />} />
          <Route path="/farmer/list-crops" element={<AddNewCrop />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
