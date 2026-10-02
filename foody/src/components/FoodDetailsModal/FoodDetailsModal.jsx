import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import {
  getFoodRating,
  getFoodReviews,
  saveFoodReview,
} from "../../utils/ratings";
import WishlistIcon from "../WishlistIcon/WishlistIcon";

const FoodDetailsModal = ({ food, onClose }) => {
  const { cartItems, addToCart, removeFromCart, url } =
    useContext(StoreContext);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [userName, setUserName] = useState("");

  const allImages =
    food?.images && food.images.length > 0
      ? food.images
      : food?.image
      ? [food.image]
      : [];
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (food) {
      setReviews(getFoodReviews(food._id));
      setSelectedImage(0);
    }
  }, [food]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  if (!food) return null;

  const { rating, reviewCount } = getFoodRating(food._id);
  const inCart = cartItems[food._id] || 0;

  const discount = food.discount || 0;
  const finalPrice =
    discount > 0 ? Math.round(food.price - (food.price * discount) / 100) : food.price;

  const handlePlus = () => addToCart(food._id);
  const handleMinus = () => {
    if (inCart <= 0) return;
    removeFromCart(food._id);
  };
  const handleAdd = () => addToCart(food._id);

  const submitReview = () => {
    if (!userName.trim()) {
      toast.warning("Please enter your name");
      return;
    }
    if (!comment.trim()) {
      toast.warning("Please write a comment");
      return;
    }

    const review = {
      name: userName.trim(),
      rating: newRating,
      comment: comment.trim(),
      date: new Date().toISOString(),
    };

    saveFoodReview(food._id, review);
    setReviews([review, ...reviews]);
    setComment("");
    setUserName("");
    setNewRating(5);
    setShowReviewForm(false);
    toast.success("Review added! Thanks 🎉");
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "just now";
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hr ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  const styles = {
    overlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.75)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2000,
      padding: "20px",
      animation: "fadeIn 0.3s ease",
    },
    modal: {
      background: "white",
      borderRadius: "24px",
      width: "100%",
      maxWidth: "1000px",
      maxHeight: "92vh",
      overflow: "hidden",
      display: "flex",
      flexDirection: "row",
      boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
      fontFamily: "Poppins, sans-serif",
      animation: "slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      position: "relative",
    },
    closeBtn: {
      position: "absolute",
      top: "15px",
      right: "15px",
      width: "42px",
      height: "42px",
      borderRadius: "50%",
      background: "white",
      border: "none",
      cursor: "pointer",
      fontSize: "20px",
      fontWeight: "700",
      color: "#262626",
      boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
      zIndex: 100,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.3s ease",
    },

    /* ═══════════════════════════════════════════
       IMAGE SECTION (LEFT)
       ═══════════════════════════════════════════ */
    imgSection: {
      flex: "1 1 45%",
      minHeight: "500px",
      position: "relative",
      background: "#fafafa",
      display: "flex",
      flexDirection: "column",
    },
    mainImgWrapper: {
      position: "relative",
      height: "420px",
      overflow: "hidden",
    },
    mainImg: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    vegBadgeOnImage: (isVeg) => ({
      position: "absolute",
      top: "16px",
      left: "16px",
      width: "32px",
      height: "32px",
      borderRadius: "8px",
      background: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
      border: `2px solid ${isVeg ? "#27ae60" : "#e74c3c"}`,
      zIndex: 5,
    }),
    vegDotImg: (isVeg) => ({
      width: "14px",
      height: "14px",
      borderRadius: "50%",
      background: isVeg ? "#27ae60" : "#e74c3c",
    }),
    discountRibbon: {
      position: "absolute",
      top: "16px",
      right: "70px",
      background: "linear-gradient(135deg, #e74c3c, #c0392b)",
      color: "white",
      padding: "6px 14px",
      borderRadius: "50px",
      fontSize: "12px",
      fontWeight: "800",
      boxShadow: "0 4px 15px rgba(231,76,60,0.5)",
      zIndex: 5,
      letterSpacing: "0.5px",
    },
    thumbnails: {
      display: "flex",
      gap: "10px",
      padding: "16px",
      overflowX: "auto",
      background: "white",
      borderTop: "1px solid #f0f0f0",
    },
    thumb: (active) => ({
      width: "65px",
      height: "65px",
      borderRadius: "12px",
      objectFit: "cover",
      cursor: "pointer",
      border: active ? "3px solid tomato" : "3px solid transparent",
      opacity: active ? 1 : 0.5,
      flexShrink: 0,
      transition: "all 0.3s ease",
      boxShadow: active
        ? "0 4px 15px rgba(255,99,71,0.4)"
        : "0 2px 8px rgba(0,0,0,0.08)",
    }),

    /* ═══════════════════════════════════════════
       INFO SECTION (RIGHT)
       ═══════════════════════════════════════════ */
    infoSection: {
      flex: "1 1 55%",
      padding: "36px 36px 36px 32px",
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
      position: "relative",
    },

    /* Category + Wishlist row */
    topRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: "15px",
      marginBottom: "14px",
    },
    category: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      background: "#fff4f2",
      color: "tomato",
      padding: "6px 14px",
      borderRadius: "50px",
      fontSize: "11.5px",
      fontWeight: "800",
      textTransform: "uppercase",
      letterSpacing: "0.8px",
      border: "1.5px solid #ffe0d6",
    },

    /* Food name */
    name: {
      fontSize: "30px",
      fontWeight: "900",
      color: "#262626",
      marginBottom: "14px",
      lineHeight: "1.15",
      letterSpacing: "-0.5px",
    },

    /* Rating + Veg + Reviews */
    ratingRow: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "20px",
      flexWrap: "wrap",
    },
    ratingBadge: {
      display: "flex",
      alignItems: "center",
      gap: "5px",
      background: "linear-gradient(135deg, #27ae60, #2ecc71)",
      padding: "6px 12px",
      borderRadius: "50px",
      fontSize: "13px",
      fontWeight: "800",
      color: "white",
      boxShadow: "0 4px 12px rgba(39,174,96,0.3)",
    },
    vegBadge: (isVeg) => ({
      display: "flex",
      alignItems: "center",
      gap: "5px",
      padding: "6px 12px",
      borderRadius: "50px",
      fontSize: "12px",
      fontWeight: "800",
      background: isVeg ? "#e8f5e9" : "#ffe6e6",
      color: isVeg ? "#27ae60" : "#e74c3c",
      border: `1.5px solid ${isVeg ? "#c8e6c9" : "#ffcdd2"}`,
    }),
    reviewCount: {
      fontSize: "13px",
      color: "#888",
      fontWeight: "600",
    },

    /* Description */
    description: {
      fontSize: "14.5px",
      color: "#555",
      lineHeight: "1.7",
      marginBottom: "24px",
      paddingBottom: "20px",
      borderBottom: "1px dashed #f0f0f0",
    },

    /* Price Block */
    priceBlock: {
      background: "linear-gradient(135deg, #fff9f7, #fff4f2)",
      borderRadius: "16px",
      padding: "20px",
      marginBottom: "24px",
      border: "1.5px solid #ffe0d6",
      position: "relative",
      overflow: "hidden",
    },
    priceLabel: {
      fontSize: "11px",
      color: "#888",
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: "1px",
      marginBottom: "8px",
      display: "block",
    },
    priceRow: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      flexWrap: "wrap",
    },
    price: {
      fontSize: "36px",
      fontWeight: "900",
      background: "linear-gradient(135deg, tomato, #e74c3c)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      margin: 0,
      lineHeight: 1,
      letterSpacing: "-1px",
    },
    oldPrice: {
      fontSize: "18px",
      color: "#aaa",
      textDecoration: "line-through",
      fontWeight: "600",
      margin: 0,
    },
    discountBadge: {
      background: "linear-gradient(135deg, #e74c3c, #c0392b)",
      color: "white",
      padding: "5px 12px",
      borderRadius: "50px",
      fontSize: "12px",
      fontWeight: "800",
      boxShadow: "0 4px 12px rgba(231,76,60,0.35)",
    },
    savingsText: {
      fontSize: "12.5px",
      color: "#27ae60",
      fontWeight: "700",
      marginTop: "8px",
      display: "flex",
      alignItems: "center",
      gap: "5px",
    },

    /* Add to Cart Block */
    addBlock: {
      marginBottom: "24px",
    },
    addBlockLabel: {
      fontSize: "11px",
      color: "#888",
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: "1px",
      marginBottom: "10px",
      display: "block",
    },
    qtyRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "16px",
      flexWrap: "wrap",
    },
    qtySelector: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      background: "linear-gradient(135deg, #fafafa, #f5f5f5)",
      borderRadius: "50px",
      padding: "6px",
      border: "2px solid #ffe0d6",
      boxShadow: "0 4px 12px rgba(255,99,71,0.1)",
    },
    qtyBtn: {
      width: "42px",
      height: "42px",
      borderRadius: "50%",
      border: "none",
      background: "white",
      color: "tomato",
      fontSize: "20px",
      fontWeight: "900",
      cursor: "pointer",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s",
      lineHeight: 1,
    },
    qtyValue: {
      fontSize: "20px",
      fontWeight: "900",
      color: "#262626",
      minWidth: "40px",
      textAlign: "center",
    },
    addBtn: {
      padding: "14px 36px",
      background: "linear-gradient(135deg, tomato, #e74c3c)",
      color: "white",
      border: "none",
      borderRadius: "50px",
      fontSize: "15px",
      fontWeight: "800",
      cursor: "pointer",
      fontFamily: "Poppins, sans-serif",
      boxShadow: "0 8px 25px rgba(255, 99, 71, 0.4)",
      letterSpacing: "0.5px",
      transition: "all 0.3s",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    inCartInfo: {
      fontSize: "13px",
      color: "#27ae60",
      fontWeight: "700",
      marginTop: "12px",
      textAlign: "center",
      padding: "8px 12px",
      background: "#e8f5e9",
      borderRadius: "10px",
      border: "1.5px solid #c8e6c9",
    },

    /* Reviews */
    reviewsSection: {
      paddingTop: "8px",
    },
    reviewsHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "16px",
      flexWrap: "wrap",
      gap: "10px",
    },
    reviewsTitle: {
      fontSize: "17px",
      fontWeight: "800",
      color: "#262626",
      margin: 0,
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    writeReviewBtn: {
      background: "#fff4f2",
      color: "tomato",
      border: "1.5px solid #ffe0d6",
      padding: "9px 18px",
      borderRadius: "50px",
      fontSize: "12.5px",
      fontWeight: "800",
      cursor: "pointer",
      fontFamily: "Poppins, sans-serif",
      transition: "all 0.3s",
    },

    /* Review Form */
    reviewForm: {
      background: "linear-gradient(135deg, #fafafa, #f5f5f5)",
      borderRadius: "16px",
      padding: "20px",
      marginBottom: "20px",
      border: "1.5px solid #f0f0f0",
      animation: "fadeIn 0.3s ease",
    },
    label: {
      fontSize: "11.5px",
      fontWeight: "800",
      color: "#555",
      textTransform: "uppercase",
      letterSpacing: "0.8px",
      marginBottom: "8px",
      display: "block",
    },
    input: {
      width: "100%",
      padding: "11px 15px",
      border: "2px solid #eee",
      borderRadius: "10px",
      fontSize: "14px",
      fontFamily: "Poppins, sans-serif",
      outline: "none",
      boxSizing: "border-box",
      marginBottom: "14px",
      background: "white",
      transition: "all 0.3s",
    },
    textarea: {
      width: "100%",
      padding: "11px 15px",
      border: "2px solid #eee",
      borderRadius: "10px",
      fontSize: "14px",
      fontFamily: "Poppins, sans-serif",
      outline: "none",
      boxSizing: "border-box",
      resize: "vertical",
      minHeight: "80px",
      marginBottom: "14px",
      background: "white",
      transition: "all 0.3s",
    },
    starsRow: {
      display: "flex",
      gap: "8px",
      marginBottom: "14px",
      fontSize: "32px",
      cursor: "pointer",
    },
    submitBtn: {
      background: "linear-gradient(135deg, tomato, #e74c3c)",
      color: "white",
      border: "none",
      padding: "11px 24px",
      borderRadius: "50px",
      fontSize: "14px",
      fontWeight: "800",
      cursor: "pointer",
      fontFamily: "Poppins, sans-serif",
      boxShadow: "0 6px 20px rgba(255,99,71,0.35)",
    },

    /* Review Items */
    reviewItem: {
      background: "#fafafa",
      borderRadius: "14px",
      padding: "16px 18px",
      marginBottom: "12px",
      border: "1.5px solid #f0f0f0",
      transition: "all 0.3s",
    },
    reviewHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "10px",
      flexWrap: "wrap",
      gap: "8px",
    },
    reviewName: {
      fontSize: "14px",
      fontWeight: "800",
      color: "#262626",
      margin: 0,
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    reviewStars: {
      fontSize: "14px",
      color: "#f39c12",
      letterSpacing: "2px",
    },
    reviewComment: {
      fontSize: "13.5px",
      color: "#555",
      lineHeight: "1.6",
      margin: "0 0 8px",
      fontStyle: "italic",
    },
    reviewTime: {
      fontSize: "11px",
      color: "#aaa",
      margin: 0,
      fontWeight: "500",
    },
    noReviews: {
      textAlign: "center",
      padding: "30px 20px",
      color: "#bbb",
      fontSize: "13.5px",
      fontStyle: "italic",
      background: "#fafafa",
      borderRadius: "14px",
      border: "1.5px dashed #f0f0f0",
    },
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <style>
        {`
          @keyframes fadeIn { from {opacity: 0;} to {opacity: 1;} }
          @keyframes slideUp {
            from { transform: translateY(40px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>

      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* CLOSE BUTTON */}
        <button
          style={styles.closeBtn}
          onClick={onClose}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "tomato";
            e.currentTarget.style.color = "white";
            e.currentTarget.style.transform = "rotate(90deg)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "white";
            e.currentTarget.style.color = "#262626";
            e.currentTarget.style.transform = "rotate(0deg)";
          }}
        >
          ✕
        </button>

        {/* ═══════════════════════════════════════════
            LEFT — IMAGE GALLERY
            ═══════════════════════════════════════════ */}
        <div style={styles.imgSection}>
          <div style={styles.mainImgWrapper}>
            <img
              src={`${url}/uploads/${allImages[selectedImage] || food.image}`}
              alt={food.name}
              style={styles.mainImg}
            />

            {/* Veg/Non-Veg badge on image */}
            <div style={styles.vegBadgeOnImage(food.isVeg)}>
              <div style={styles.vegDotImg(food.isVeg)} />
            </div>

            {/* Discount ribbon on image */}
            {discount > 0 && (
              <div style={styles.discountRibbon}>{discount}% OFF</div>
            )}
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div style={styles.thumbnails}>
              {allImages.map((img, i) => (
                <img
                  key={i}
                  src={`${url}/uploads/${img}`}
                  alt={`thumb-${i}`}
                  style={styles.thumb(i === selectedImage)}
                  onClick={() => setSelectedImage(i)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════
            RIGHT — INFO SECTION
            ═══════════════════════════════════════════ */}
        <div style={styles.infoSection}>
          {/* ✅ Top row — Category + Wishlist button */}
          <div style={styles.topRow}>
            <span style={styles.category}>🍽️ {food.category}</span>
            <WishlistIcon foodId={food._id} />
          </div>

          {/* ✅ Food name */}
          <h2 style={styles.name}>{food.name}</h2>

          {/* ✅ Rating + Veg + Reviews count */}
          <div style={styles.ratingRow}>
            <div style={styles.ratingBadge}>
              <span>★</span>
              <span>{rating}</span>
            </div>
            <div style={styles.vegBadge(food.isVeg)}>
              {food.isVeg ? "🌱 Veg" : "🍗 Non-Veg"}
            </div>
            <span style={styles.reviewCount}>
              💬 {reviewCount} reviews
            </span>
          </div>

          {/* ✅ Description */}
          <p style={styles.description}>{food.description}</p>

          {/* ✅ Price Block */}
          <div style={styles.priceBlock}>
            <span style={styles.priceLabel}>💰 Price</span>
            <div style={styles.priceRow}>
              <p style={styles.price}>₹{finalPrice}</p>
              {discount > 0 && (
                <>
                  <p style={styles.oldPrice}>₹{food.price}</p>
                  <span style={styles.discountBadge}>{discount}% OFF</span>
                </>
              )}
            </div>
            {discount > 0 && (
              <p style={styles.savingsText}>
                🎉 You save ₹{food.price - finalPrice}!
              </p>
            )}
          </div>

          {/* ✅ Add to Cart Block */}
          <div style={styles.addBlock}>
            <span style={styles.addBlockLabel}>🛒 Add to Cart</span>
            <div style={styles.qtyRow}>
              {inCart > 0 ? (
                <div style={styles.qtySelector}>
                  <button
                    style={styles.qtyBtn}
                    onClick={handleMinus}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "tomato")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "white")
                    }
                  >
                    −
                  </button>
                  <span style={styles.qtyValue}>{inCart}</span>
                  <button
                    style={styles.qtyBtn}
                    onClick={handlePlus}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "tomato")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "white")
                    }
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  style={styles.addBtn}
                  onClick={handleAdd}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 30px rgba(255,99,71,0.55)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 25px rgba(255,99,71,0.4)";
                  }}
                >
                  🛒 Add to Cart
                </button>
              )}

              <div style={{ textAlign: "right" }}>
                <span style={styles.priceLabel}>
                  {inCart > 0 ? "In Cart Total" : "Total"}
                </span>
                <p style={{ ...styles.price, fontSize: "24px", margin: 0 }}>
                  ₹{finalPrice * (inCart > 0 ? inCart : 1)}
                </p>
              </div>
            </div>

            {inCart > 0 && (
              <p style={styles.inCartInfo}>
                ✅ {inCart} × {food.name} in your cart
              </p>
            )}
          </div>

          {/* ✅ Reviews Section */}
          <div style={styles.reviewsSection}>
            <div style={styles.reviewsHeader}>
              <h3 style={styles.reviewsTitle}>
                💬 Reviews
                <span
                  style={{
                    fontSize: "13px",
                    color: "#888",
                    fontWeight: "600",
                  }}
                >
                  ({reviews.length})
                </span>
              </h3>
              <button
                style={styles.writeReviewBtn}
                onClick={() => setShowReviewForm(!showReviewForm)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "tomato";
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.borderColor = "tomato";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#fff4f2";
                  e.currentTarget.style.color = "tomato";
                  e.currentTarget.style.borderColor = "#ffe0d6";
                }}
              >
                {showReviewForm ? "✕ Cancel" : "✍️ Write Review"}
              </button>
            </div>

            {showReviewForm && (
              <div style={styles.reviewForm}>
                <label style={styles.label}>Your Name</label>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="Enter your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  onFocus={(e) => (e.target.style.borderColor = "tomato")}
                  onBlur={(e) => (e.target.style.borderColor = "#eee")}
                />

                <label style={styles.label}>Your Rating</label>
                <div style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      style={{
                        color:
                          star <= (hoverRating || newRating)
                            ? "#f39c12"
                            : "#ddd",
                        transition: "0.2s",
                        textShadow:
                          star <= (hoverRating || newRating)
                            ? "0 0 10px rgba(243,156,18,0.4)"
                            : "none",
                      }}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setNewRating(star)}
                    >
                      ★
                    </span>
                  ))}
                </div>

                <label style={styles.label}>Your Comment</label>
                <textarea
                  style={styles.textarea}
                  placeholder="Share your experience..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onFocus={(e) => (e.target.style.borderColor = "tomato")}
                  onBlur={(e) => (e.target.style.borderColor = "#eee")}
                />

                <button style={styles.submitBtn} onClick={submitReview}>
                  ✨ Submit Review
                </button>
              </div>
            )}

            {reviews.length === 0 ? (
              <p style={styles.noReviews}>
                🌟 No reviews yet. Be the first to review!
              </p>
            ) : (
              reviews.map((rev, i) => (
                <div key={i} style={styles.reviewItem}>
                  <div style={styles.reviewHeader}>
                    <p style={styles.reviewName}>
                      <span
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, tomato, #e74c3c)",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          fontWeight: "800",
                        }}
                      >
                        {rev.name?.charAt(0).toUpperCase()}
                      </span>
                      {rev.name}
                    </p>
                    <div style={styles.reviewStars}>
                      {"★".repeat(rev.rating)}
                      {"☆".repeat(5 - rev.rating)}
                    </div>
                  </div>
                  <p style={styles.reviewComment}>"{rev.comment}"</p>
                  <p style={styles.reviewTime}>🕐 {timeAgo(rev.date)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetailsModal;