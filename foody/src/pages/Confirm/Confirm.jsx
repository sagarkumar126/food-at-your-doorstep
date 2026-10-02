import React, { useContext, useState, useEffect } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "./Confirm.css";

const Confirm = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const success = searchParams.get("success");
  const { url, clearCart } = useContext(StoreContext);
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);
  const [verified, setVerified] = useState(false);

  // ✅ Payment verify karo — ye admin tak order pahunchayega
  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const res = await axios.post(url + "/api/order/verify", {
          success,
          orderId,
        });
        if (res.data.success) {
          await clearCart();
          setVerified(true);
          // ✅ 300ms baad popup dikhao
          setTimeout(() => setShowPopup(true), 300);
        } else {
          navigate("/");
        }
      } catch (e) {
        console.error(e);
        navigate("/");
      }
    };
    verifyPayment();
  }, []);

  const handleOk = () => {
    setShowPopup(false);
    navigate("/myorders");
  };

  return (
    <div className="confirm-page">
      {/* Background: success animation */}
      <div className="confirm-page-card">
        <div className="confirm-page-icon">🎉</div>
        <h1 className="confirm-page-title">Payment Successful!</h1>
        <p className="confirm-page-subtitle">
          Finalizing your order...
        </p>
      </div>

      {/* ✅ POPUP */}
      {showPopup && verified && (
        <div className="confirm-popup-overlay" onClick={handleOk}>
          <div
            className="confirm-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="confirm-popup-icon">✅</div>
            <h2 className="confirm-popup-title">Your order is confirmed!</h2>
            <p className="confirm-popup-message">
              Thank you for your order. Your food is being prepared and will
              be delivered soon! 🚚
            </p>
            <div className="confirm-popup-orderid">
              Order ID: <b>#{orderId?.slice(-8).toUpperCase()}</b>
            </div>
            <button className="confirm-popup-btn" onClick={handleOk}>
              OK, Got it! 🎉
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Confirm;