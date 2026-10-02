import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import AppDownlod from "./components/AppDownlod/AppDownlod";
import LoginPopUp from "./components/LoginPopUp/LoginPopUp";
import Verify from "./pages/Verify/Verify";
import MyOrders from "./pages/MyOrders/MyOrders.jsx";
import Wishlist from "./pages/Wishlist/Wishlist";
import Confirm from "./pages/Confirm/Confirm"; // ✅ IMPORT

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const handleOpenLogin = () => setShowLogin(true);
    window.addEventListener("openLoginPopup", handleOpenLogin);
    return () =>
      window.removeEventListener("openLoginPopup", handleOpenLogin);
  }, []);

  return (
    <>
      {showLogin ? <LoginPopUp setShowLogin={setShowLogin} /> : <></>}
      <div className="app">
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/confirm" element={<Confirm />} /> {/* ✅ ROUTE */}
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;