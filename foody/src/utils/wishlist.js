export const getWishlist = () => {
  try {
    return JSON.parse(localStorage.getItem("wishlist") || "[]");
  } catch {
    return [];
  }
};

export const toggleWishlist = (foodId) => {
  try {
    const current = getWishlist();
    let updated;
    if (current.includes(foodId)) {
      updated = current.filter((id) => id !== foodId);
    } else {
      updated = [...current, foodId];
    }
    localStorage.setItem("wishlist", JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
};

export const isInWishlist = (foodId) => {
  return getWishlist().includes(foodId);
};

export const clearWishlist = () => {
  localStorage.removeItem("wishlist");
  return [];
};




