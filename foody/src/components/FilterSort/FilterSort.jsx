import React, { useState } from "react";

const FilterSort = ({ onFilterChange, onSortChange, totalCount, filteredCount }) => {
  const [sortBy, setSortBy] = useState("popularity");
  const [priceFilter, setPriceFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [vegOnly, setVegOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const handleSort = (value) => {
    setSortBy(value);
    onSortChange(value);
  };

  const handlePrice = (value) => {
    setPriceFilter(value);
    onFilterChange({
      price: value,
      rating: ratingFilter,
      veg: vegOnly,
    });
  };

  const handleRating = (value) => {
    setRatingFilter(value);
    onFilterChange({
      price: priceFilter,
      rating: value,
      veg: vegOnly,
    });
  };

  const handleVeg = () => {
    const newVal = !vegOnly;
    setVegOnly(newVal);
    onFilterChange({
      price: priceFilter,
      rating: ratingFilter,
      veg: newVal,
    });
  };

  const resetFilters = () => {
    setPriceFilter("all");
    setRatingFilter("all");
    setVegOnly(false);
    setSortBy("popularity");
    onFilterChange({ price: "all", rating: "all", veg: false });
    onSortChange("popularity");
  };

  const styles = {
    wrapper: {
      background: "white",
      borderRadius: "16px",
      padding: "16px 20px",
      marginBottom: "25px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
      border: "1px solid #f0f0f0",
      fontFamily: "Poppins, sans-serif",
    },
    topRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "15px",
      flexWrap: "wrap",
    },
    leftSection: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      flexWrap: "wrap",
    },
    count: {
      fontSize: "14px",
      color: "#888",
    },
    countBold: {
      color: "tomato",
      fontWeight: "700",
    },
    filterToggleBtn: {
      background: "linear-gradient(135deg, tomato, #e74c3c)",
      color: "white",
      border: "none",
      padding: "8px 18px",
      borderRadius: "50px",
      fontSize: "13px",
      fontWeight: "700",
      cursor: "pointer",
      fontFamily: "Poppins, sans-serif",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      transition: "0.3s",
    },
    sortSection: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    sortLabel: {
      fontSize: "13px",
      color: "#888",
      fontWeight: "600",
    },
    sortSelect: {
      padding: "8px 14px",
      borderRadius: "10px",
      border: "2px solid #eee",
      fontSize: "13px",
      fontWeight: "600",
      color: "#262626",
      cursor: "pointer",
      fontFamily: "Poppins, sans-serif",
      background: "white",
      outline: "none",
    },
    filtersPanel: {
      marginTop: "18px",
      paddingTop: "18px",
      borderTop: "1px solid #f0f0f0",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      animation: "fadeIn 0.3s ease",
    },
    filterGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    filterLabel: {
      fontSize: "12px",
      fontWeight: "700",
      color: "#555",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    chipRow: {
      display: "flex",
      gap: "8px",
      flexWrap: "wrap",
    },
    chip: (active) => ({
      padding: "7px 14px",
      borderRadius: "50px",
      fontSize: "13px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "0.3s",
      border: active ? "2px solid tomato" : "2px solid #eee",
      background: active ? "#fff4f2" : "white",
      color: active ? "tomato" : "#666",
      fontFamily: "Poppins, sans-serif",
    }),
    resetBtn: {
      background: "#f5f5f5",
      color: "#666",
      border: "none",
      padding: "7px 16px",
      borderRadius: "50px",
      fontSize: "13px",
      fontWeight: "600",
      cursor: "pointer",
      alignSelf: "flex-start",
      fontFamily: "Poppins, sans-serif",
      transition: "0.3s",
    },
  };

  return (
    <div style={styles.wrapper}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      <div style={styles.topRow}>
        <div style={styles.leftSection}>
          <p style={styles.count}>
            <span style={styles.countBold}>{filteredCount}</span> of{" "}
            {totalCount} items
          </p>
          <button
            style={styles.filterToggleBtn}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "✕ Hide Filters" : "🎛️ Filters"}
          </button>
        </div>

        <div style={styles.sortSection}>
          <span style={styles.sortLabel}>Sort:</span>
          <select
            style={styles.sortSelect}
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
          >
            <option value="popularity">⭐ Popularity</option>
            <option value="priceLow">💰 Price: Low to High</option>
            <option value="priceHigh">💎 Price: High to Low</option>
            <option value="newest">🆕 Newest First</option>
          </select>
        </div>
      </div>

      {showFilters && (
        <div style={styles.filtersPanel}>
          {/* Price */}
          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>💰 Price Range</span>
            <div style={styles.chipRow}>
              <button
                style={styles.chip(priceFilter === "all")}
                onClick={() => handlePrice("all")}
              >
                All
              </button>
              <button
                style={styles.chip(priceFilter === "low")}
                onClick={() => handlePrice("low")}
              >
                Under ₹200
              </button>
              <button
                style={styles.chip(priceFilter === "mid")}
                onClick={() => handlePrice("mid")}
              >
                ₹200 - ₹300
              </button>
              <button
                style={styles.chip(priceFilter === "high")}
                onClick={() => handlePrice("high")}
              >
                ₹300+
              </button>
            </div>
          </div>

          {/* Rating */}
          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>⭐ Rating</span>
            <div style={styles.chipRow}>
              <button
                style={styles.chip(ratingFilter === "all")}
                onClick={() => handleRating("all")}
              >
                All
              </button>
              <button
                style={styles.chip(ratingFilter === "4")}
                onClick={() => handleRating("4")}
              >
                4★ & above
              </button>
              <button
                style={styles.chip(ratingFilter === "4.5")}
                onClick={() => handleRating("4.5")}
              >
                4.5★ & above
              </button>
            </div>
          </div>

          {/* Veg */}
          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>🥗 Dietary</span>
            <div style={styles.chipRow}>
              <button
                style={styles.chip(vegOnly)}
                onClick={handleVeg}
              >
                {vegOnly ? "✅ Veg Only" : "🌱 Veg Only"}
              </button>
            </div>
          </div>

          {/* Reset */}
          <button
            style={styles.resetBtn}
            onClick={resetFilters}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#ffe6e0")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#f5f5f5")}
          >
            🔄 Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterSort;




