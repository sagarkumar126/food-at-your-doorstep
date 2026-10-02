import express from "express";
import multer from "multer";
import {
  addFood,
  listFood,
  removeFood,
  updateFood,
} from "../controllers/foodController.js";

const foodRouter = express.Router();

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => cb(null, `${Date.now()}${file.originalname}`),
});

const upload = multer({ storage });

// ✅ Multiple images (max 5)
foodRouter.post("/add", upload.array("images", 5), addFood);
foodRouter.get("/list", listFood);
foodRouter.post("/remove", removeFood);
foodRouter.post("/update", upload.array("images", 5), updateFood);

export default foodRouter;


