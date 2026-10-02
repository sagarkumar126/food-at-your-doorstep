import React, { useState } from "react";
import { getOffers } from "../../utils/offers";
import { toast } from "react-toastify";

const OffersSection = () => {
  const offers = getOffers();
  const [copiedId, setCopiedId] = useState(null);

  const copyCode = async (offer) => {
    try {
      await navigator.clipboard.writeText(offer.code);
      setCopiedId(offer.id);
      toast.success(`Code "${offer.code}" copied! 🎉`);

      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = offer.code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedId(offer.id);
      toast.success(`Code "${offer.code}" copied! 🎉`);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const styles = {
    section: {
      margin: "50px 0",
      fontFamily: "Poppins, sans-serif",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "25px",
      flexWrap: "wrap",
      gap: "15px",
    },
    title: {
      fontSize: "28px",
      fontWeight: "800",
      background: "linear-gradient(135deg, #262626, tomato)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      margin: 0,
    },
    subtitle: {
      fontSize: "14px",
      color: "#888",
      marginTop: "5px",
    },
    badge: {
      background: "#fff4f2",
      color: "tomato",
      padding: "6px 16px",
      borderRadius: "50px",
      fontSize: "13px",
      fontWeight: "700",
      border: "2px solid #ffd5cc",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "20px",
    },
    card: (bg) => ({
      background: bg,
      borderRadius: "20px",
      padding: "25px",
      color: "white",
      position: "relative",
      overflow: "hidden",
      transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      cursor: "pointer",
      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
    }),
    emoji: {
      position: "absolute",
      top: "15px",
      right: "20px",
      fontSize: "60px",
      opacity: 0.25,
      pointerEvents: "none",
    },
    discountTitle: {
      fontSize: "26px",
      fontWeight: "800",
      marginBottom: "4px",
      lineHeight: "1.1",
    },
    discountSub: {
      fontSize: "13px",
      opacity: 0.9,
      marginBottom: "12px",
    },
    desc: {
      fontSize: "12px",
      opacity: 0.85,
      marginBottom: "18px",
    },
    codeRow: {
      display: "flex",
      gap: "8px",
      alignItems: "center",
      background: "rgba(255, 255, 255, 0.2)",
      backdropFilter: "blur(10px)",
      borderRadius: "12px",
      padding: "8px 8px 8px 16px",
      border: "2px dashed rgba(255, 255, 255, 0.4)",
      marginBottom: "12px",
    },
    code: {
      flex: 1,
      fontSize: "15px",
      fontWeight: "800",
      letterSpacing: "1px",
      fontFamily: "monospace",
    },
    copyBtn: (copied) => ({
      background: copied ? "#27ae60" : "white",
      color: copied ? "white" : "#262626",
      border: "none",
      padding: "8px 14px",
      borderRadius: "8px",
      fontSize: "12px",
      fontWeight: "800",
      cursor: "pointer",
      transition: "0.3s",
      fontFamily: "Poppins, sans-serif",
      whiteSpace: "nowrap",
    }),
    footer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: "11px",
      opacity: 0.85,
      marginTop: "10px",
    },
  };

  return (
    <div style={styles.section}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>🎁 Offers & Coupons</h2>
          <p style={styles.subtitle}>
            Grab these deals before they expire!
          </p>
        </div>
        <span style={styles.badge}>
          🔥 {offers.length} Active Offers
        </span>
      </div>

      <div style={styles.grid}>
        {offers.map((offer) => (
          <div
            key={offer.id}
            style={styles.card(offer.bg)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
              e.currentTarget.style.boxShadow =
                "0 15px 40px rgba(0,0,0,0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
            }}
          >
            <span style={styles.emoji}>{offer.emoji}</span>

            <h3 style={styles.discountTitle}>{offer.title}</h3>
            <p style={styles.discountSub}>{offer.subtitle}</p>
            <p style={styles.desc}>{offer.description}</p>

            <div style={styles.codeRow}>
              <span style={styles.code}>{offer.code}</span>
              <button
                style={styles.copyBtn(copiedId === offer.id)}
                onClick={(e) => {
                  e.stopPropagation();
                  copyCode(offer);
                }}
                onMouseEnter={(e) => {
                  if (copiedId !== offer.id) {
                    e.currentTarget.style.transform = "scale(1.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                {copiedId === offer.id ? "✓ Copied!" : "📋 Copy"}
              </button>
            </div>

            <div style={styles.footer}>
              <span>Min order: ₹{offer.minOrder}</span>
              <span>Valid till {offer.expiry}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OffersSection;





