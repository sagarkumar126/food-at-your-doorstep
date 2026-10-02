import express from "express";
import {
  loginUser,
  registerUser,
  updateCart,
  getCart,
} from "../controllers/userController.js";
import { googleLogin } from "../controllers/googleAuthController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/cart", updateCart);
userRouter.get("/cart", getCart);
userRouter.post("/google", googleLogin);

export default userRouter;




