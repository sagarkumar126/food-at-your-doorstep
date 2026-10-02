import React, { useContext, useState } from "react";
import "./LoginPopUp.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";

const LoginPopUp = ({ setShowLogin }) => {
  const { url, setToken, setUser } = useContext(StoreContext);
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");

  const onGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(`${url}/api/user/google`, {
        token: credentialResponse.credential,
        mode: mode,
      });

      if (res.data.success) {
        // ✅ Token save
        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);

        // ✅ User data save
        if (res.data.user) {
          setUser(res.data.user);
          localStorage.setItem("userData", JSON.stringify(res.data.user));
        }

        toast.success(
          mode === "login"
            ? `Welcome back, ${res.data.user?.name || "User"}! 🎉`
            : `Welcome, ${res.data.user?.name || "User"}! 🎉`
        );
        setShowLogin(false);
      } else {
        setError(res.data.message);
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Google error:", error);
      setError("Google authentication failed. Please try again.");
      toast.error("Google authentication failed");
    }
  };

  const styles = {
    subtitle: {
      textAlign: "center",
      color: "#555",
      fontSize: "14px",
      margin: "10px 0 20px",
    },
    googleWrapper: {
      display: "flex",
      justifyContent: "center",
      margin: "20px 0",
    },
    error: {
      color: "#e74c3c",
      textAlign: "center",
      fontSize: "14px",
      background: "#ffe6e6",
      padding: "10px",
      borderRadius: "6px",
      margin: "10px 0",
    },
    switch: {
      textAlign: "center",
      fontSize: "14px",
      marginTop: "15px",
    },
    switchSpan: {
      color: "tomato",
      cursor: "pointer",
      fontWeight: "600",
    },
    note: {
      textAlign: "center",
      fontSize: "12px",
      color: "#999",
      marginTop: "15px",
    },
  };

  return (
    <div className="login-popup">
      <div className="login-popup-container">
        <div className="login-popup-title">
          <h2>{mode === "login" ? "Login" : "Register"}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt="close"
          />
        </div>

        <p style={styles.subtitle}>
          {mode === "login"
            ? "Sign in with your Google account"
            : "Create your account with Google"}
        </p>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.googleWrapper}>
          <GoogleLogin
            onSuccess={onGoogleSuccess}
            onError={() => {
              setError("Google login failed");
              toast.error("Google login failed");
            }}
            text={mode === "login" ? "signin_with" : "signup_with"}
            shape="rectangular"
            theme="outline"
            size="large"
            width="300"
          />
        </div>

        {mode === "login" ? (
          <p style={styles.switch}>
            New here?{" "}
            <span
              style={styles.switchSpan}
              onClick={() => {
                setMode("register");
                setError("");
              }}
            >
              Register Now
            </span>
          </p>
        ) : (
          <p style={styles.switch}>
            Already registered?{" "}
            <span
              style={styles.switchSpan}
              onClick={() => {
                setMode("login");
                setError("");
              }}
            >
              Login Here
            </span>
          </p>
        )}

        <p style={styles.note}>
          Only registered users can login. First time? Register.
        </p>
      </div>
    </div>
  );
};

export default LoginPopUp;




