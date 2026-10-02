import express from "express";
import {
  adminGoogleAuth,
  verifyAdmin,
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getRevenueChart,
} from "../controllers/adminController.js";

const adminRouter = express.Router();

// ✅ Auth routes
adminRouter.post("/google", adminGoogleAuth);
adminRouter.get("/verify", verifyAdmin);

// ✅ Data routes
adminRouter.get("/dashboard", getDashboardStats);
adminRouter.get("/users", getAllUsers);
adminRouter.post("/delete-user", deleteUser);
adminRouter.get("/revenue-chart", getRevenueChart);

export default adminRouter;




