// ✅ Dummy offers (baad mein backend se aayenge)
export const getOffers = () => {
  return [
    {
      id: 1,
      code: "WELCOME50",
      title: "50% OFF",
      subtitle: "On your first order",
      description: "Max discount ₹150",
      minOrder: 200,
      bg: "linear-gradient(135deg, #ff6347, #e74c3c)",
      emoji: "🎉",
      expiry: "31 Dec 2026",
    },
    {
      id: 2,
      code: "FREEDEL",
      title: "Free Delivery",
      subtitle: "On orders above ₹300",
      description: "Save ₹40 delivery charges",
      minOrder: 300,
      bg: "linear-gradient(135deg, #27ae60, #16a085)",
      emoji: "🚚",
      expiry: "31 Dec 2026",
    },
    {
      id: 3,
      code: "SAVE100",
      title: "Flat ₹100 OFF",
      subtitle: "On orders above ₹500",
      description: "Use code at checkout",
      minOrder: 500,
      bg: "linear-gradient(135deg, #3498db, #2980b9)",
      emoji: "💰",
      expiry: "31 Dec 2026",
    },
    {
      id: 4,
      code: "VEG20",
      title: "20% OFF on Veg",
      subtitle: "Pure Veg items only",
      description: "Max discount ₹80",
      minOrder: 150,
      bg: "linear-gradient(135deg, #f39c12, #e67e22)",
      emoji: "🥗",
      expiry: "31 Dec 2026",
    },
  ];
};



