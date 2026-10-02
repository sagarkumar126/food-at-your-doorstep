import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  images: { type: [String], default: [] },
  category: { type: String, required: true },
  stock: { type: Number, default: 50 },
  discount: { type: Number, default: 0 },
  isVeg: { type: Boolean, default: false },
});

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);

export default foodModel;



