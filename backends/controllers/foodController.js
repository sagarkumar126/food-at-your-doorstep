import foodModel from "../models/foodModel.js";
import fs from "fs";

// ✅ Add Food (multiple images + discount + veg)
export const addFood = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.json({ success: false, message: "At least 1 image required" });
    }

    const imageFiles = req.files.map((file) => file.filename);
    const mainImage = imageFiles[0];

    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      category: req.body.category,
      stock: req.body.stock ? Number(req.body.stock) : 50,
      image: mainImage,
      images: imageFiles,
      discount: req.body.discount ? Number(req.body.discount) : 0,
      isVeg: req.body.isVeg === "true" || req.body.isVeg === true,
    });

    await food.save();
    res.json({ success: true, message: "Food Added" });
  } catch (error) {
    console.error("Error while saving food:", error);
    res.json({ success: false, message: "Error", error: error.message });
  }
};

// ✅ List Food
export const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

// ✅ Remove Food (saari images delete karo)
export const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (food) {
      if (food.image) {
        fs.unlink(`uploads/${food.image}`, () => {});
      }
      if (food.images && food.images.length > 0) {
        food.images.forEach((img) => {
          fs.unlink(`uploads/${img}`, () => {});
        });
      }
    }
    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, msg: "Food removed" });
  } catch (error) {
    console.log("not removed");
    res.json({ success: false, msg: "Food not removed" });
  }
};

// ✅ Update Food (multiple images + discount + veg)
export const updateFood = async (req, res) => {
  try {
    const { id, name, description, price, category, stock, discount, isVeg } =
      req.body;

    const updateData = {
      name,
      description,
      price: Number(price),
      category,
      stock: stock !== undefined ? Number(stock) : 50,
      discount: discount !== undefined ? Number(discount) : 0,
      isVeg: isVeg === "true" || isVeg === true,
    };

    // Agar nayi images upload ki hain
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => file.filename);
      updateData.image = newImages[0];
      updateData.images = newImages;

      // Purani images delete karo
      const oldFood = await foodModel.findById(id);
      if (oldFood) {
        if (oldFood.images && oldFood.images.length > 0) {
          oldFood.images.forEach((img) => {
            fs.unlink(`uploads/${img}`, () => {});
          });
        } else if (oldFood.image) {
          fs.unlink(`uploads/${oldFood.image}`, () => {});
        }
      }
    }

    const updated = await foodModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updated) {
      return res.json({ success: false, message: "Food not found" });
    }

    res.json({
      success: true,
      message: "Food updated successfully",
      data: updated,
    });
  } catch (error) {
    console.log("Update food error:", error);
    res.json({ success: false, message: "Error updating food" });
  }
};




