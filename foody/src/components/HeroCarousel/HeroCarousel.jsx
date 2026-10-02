import React, { useState, useEffect } from "react";

const HeroCarousel = () => {
  const slides = [
    {
      id: 1,
      title: "Order Your Favourite Food Here",
      subtitle: "Choose from a diverse menu and end your cravings",
      btnText: "View Menu",
      bg: "linear-gradient(135deg, #ff6347 0%, #e74c3c 100%)",
      emoji: "🍕",
      tag: "🔥 Limited Time Offer",
    },
    {
      id: 2,
      title: "50% OFF on First Order",
      subtitle: "Use code WELCOME50 and get instant discount",
      btnText: "Order Now",
      bg: "linear-gradient(135deg, #27ae60 0%, #16a085 100%)",
      emoji: "🎉",
      tag: "💰 Save Big",
    },
    {
      id: 3,
      title: "Free Delivery on ₹500+",
      subtitle: "No delivery charges on your big orders",
      btnText: "Explore Menu",
      bg: "linear-gradient(135deg, #3498db 0%, #2980b9 100%)",
      emoji: "🚚",
      tag: "⚡ Fast Delivery",
    },
    {
      id: 4,
      title: "Fresh & Healthy Salads",
      subtitle: "Try our new range of organic salads",
      btnText: "Try Now",
      bg: "linear-gradient(135deg, #f39c12 0%, #e67e22 100%)",
      emoji: "🥗",
      tag: "🌱 Pure Veg",
    },
  ];

  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // ✅ Auto slide
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const scrollToMenu = () => {
    const el = document.getElementById("explore-menu");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const styles = {
    wrapper: {
      position: "relative",
      width: "100%",
      height: "480px",
      borderRadius: "24px",
      overflow: "hidden",
      marginTop: "20px",
      marginBottom: "30px",
      boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
      fontFamily: "Poppins, sans-serif",
    },
    slide: (active, bg) => ({
      position: "absolute",
      inset: 0,
      background: bg,
      opacity: active ? 1 : 0,
      transition: "opacity 0.8s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "60px 80px",
      pointerEvents: active ? "auto" : "none",
    }),
    content: {
      maxWidth: "55%",
      color: "white",
      zIndex: 2,
    },
    tag: {
      display: "inline-block",
      background: "rgba(255, 255, 255, 0.25)",
      backdropFilter: "blur(10px)",
      padding: "8px 18px",
      borderRadius: "50px",
      fontSize: "13px",
      fontWeight: "700",
      marginBottom: "20px",
      color: "white",
      letterSpacing: "0.5px",
    },
    title: {
      fontSize: "48px",
      fontWeight: "800",
      lineHeight: "1.15",
      marginBottom: "18px",
      color: "white",
      textShadow: "0 4px 20px rgba(0,0,0,0.15)",
    },
    subtitle: {
      fontSize: "17px",
      lineHeight: "1.6",
      marginBottom: "30px",
      color: "rgba(255, 255, 255, 0.95)",
      maxWidth: "450px",
    },
    btn: {
      background: "white",
      color: "#262626",
      border: "none",
      padding: "16px 36px",
      borderRadius: "50px",
      fontSize: "15px",
      fontWeight: "700",
      cursor: "pointer",
      fontFamily: "Poppins, sans-serif",
      boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
      transition: "0.3s",
    },
    emoji: {
      fontSize: "200px",
      lineHeight: "1",
      filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.25))",
      animation: "float 3s ease-in-out infinite",
      userSelect: "none",
    },
    arrow: (side) => ({
      position: "absolute",
      top: "50%",
      [side]: "25px",
      transform: "translateY(-50%)",
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      background: "rgba(255, 255, 255, 0.25)",
      backdropFilter: "blur(10px)",
      border: "2px solid rgba(255, 255, 255, 0.4)",
      color: "white",
      fontSize: "22px",
      fontWeight: "700",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "0.3s",
      zIndex: 5,
    }),
    dots: {
      position: "absolute",
      bottom: "25px",
      left: "50%",
      transform: "translateX(-50%)",
      display: "flex",
      gap: "10px",
      zIndex: 5,
    },
    dot: (active) => ({
      width: active ? "35px" : "12px",
      height: "12px",
      borderRadius: "50px",
      background: active ? "white" : "rgba(255, 255, 255, 0.5)",
      border: "none",
      cursor: "pointer",
      transition: "all 0.4s",
    }),
  };

  return (
    <div
      style={styles.wrapper}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        `}
      </style>

      {slides.map((slide, i) => (
        <div key={slide.id} style={styles.slide(i === current, slide.bg)}>
          <div style={styles.content}>
            <span style={styles.tag}>{slide.tag}</span>
            <h1 style={styles.title}>{slide.title}</h1>
            <p style={styles.subtitle}>{slide.subtitle}</p>
            <button
              style={styles.btn}
              onClick={scrollToMenu}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px) scale(1.05)";
                e.currentTarget.style.boxShadow =
                  "0 12px 35px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.2)";
              }}
            >
              {slide.btnText} →
            </button>
          </div>

          <div style={styles.emoji}>{slide.emoji}</div>
        </div>
      ))}

      {/* ✅ Prev Arrow */}
      <button
        style={styles.arrow("left")}
        onClick={prevSlide}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.5)";
          e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)";
          e.currentTarget.style.transform = "translateY(-50%) scale(1)";
        }}
      >
        ‹
      </button>

      {/* ✅ Next Arrow */}
      <button
        style={styles.arrow("right")}
        onClick={nextSlide}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.5)";
          e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)";
          e.currentTarget.style.transform = "translateY(-50%) scale(1)";
        }}
      >
        ›
      </button>

      {/* ✅ Dots */}
      <div style={styles.dots}>
        {slides.map((_, i) => (
          <button
            key={i}
            style={styles.dot(i === current)}
            onClick={() => setCurrent(i)}
            title={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;





