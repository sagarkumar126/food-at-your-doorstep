import orderModel from "../models/orderModel.js";
import foodModel from "../models/foodModel.js";
import userModel from "../models/userModel.js";
import adminModel from "../models/adminModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client();

// ✅ Admin Google Login/Register
export const adminGoogleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.json({ success: false, message: "No token provided" });
    }

    // Google token verify karo
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    // Check karo admin exists ya nahi
    let admin = await adminModel.findOne({ email });

    if (!admin) {
      // Naya admin banao (Google se register)
      const randomPassword = Math.random().toString(36).slice(-16);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      admin = await new adminModel({
        name,
        email,
        password: hashedPassword,
        role: "admin",
      }).save();
    }

    // JWT token banao
    const appToken = jwt.sign(
      { id: admin._id, email: admin.email, role: "admin" },
      process.env.ADMIN_JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Admin authenticated successfully",
      token: appToken,
      admin: { id: admin._id, name: admin.name, email: admin.email },
    });
  } catch (error) {
    console.log("Admin Google auth error:", error);
    res.json({ success: false, message: "Google authentication failed" });
  }
};

// ✅ Verify Admin Token
export const verifyAdmin = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    res.json({ success: true, admin: decoded });
  } catch (error) {
    res.json({ success: false, message: "Invalid token" });
  }
};

// ✅ Dashboard Stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await orderModel.countDocuments();
    const totalFoods = await foodModel.countDocuments();
    const totalUsers = await userModel.countDocuments();

    const orders = await orderModel.find({ payment: true });
    const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);

    const recentOrders = await orderModel.find({}).sort({ date: -1 }).limit(5);

    const processingOrders = await orderModel.countDocuments({
      status: "Food Processing",
    });
    const deliveredOrders = await orderModel.countDocuments({
      status: "Delivered",
    });
    const outForDelivery = await orderModel.countDocuments({
      status: "Out for delivery",
    });

    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue,
        totalFoods,
        totalUsers,
        recentOrders,
        orderStatus: {
          processing: processingOrders,
          delivered: deliveredOrders,
          outForDelivery: outForDelivery,
        },
      },
    });
  } catch (error) {
    console.log("Dashboard error:", error);
    res.json({ success: false, message: "Error fetching dashboard stats" });
  }
};

// ✅ Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel
      .find({})
      .select("-password")
      .sort({ createdAt: -1 });

    const usersWithOrders = await Promise.all(
      users.map(async (user) => {
        const orderCount = await orderModel.countDocuments({
          userId: user._id.toString(),
        });
        const orders = await orderModel.find({
          userId: user._id.toString(),
          payment: true,
        });
        const totalSpent = orders.reduce((sum, o) => sum + o.amount, 0);

        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          orderCount,
          totalSpent,
        };
      })
    );

    res.json({ success: true, data: usersWithOrders });
  } catch (error) {
    console.log("Get users error:", error);
    res.json({ success: false, message: "Error fetching users" });
  }
};

// ✅ Delete User
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.body;
    await userModel.findByIdAndDelete(id);
    res.json({ success: true, message: "User deleted" });
  } catch (error) {
    console.log("Delete user error:", error);
    res.json({ success: false, message: "Error deleting user" });
  }
};

// ✅ Revenue Chart Data (Last 7 days)
export const getRevenueChart = async (req, res) => {
  try {
    const days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const orders = await orderModel.find({
        payment: true,
        date: { $gte: date, $lt: nextDate },
      });

      const revenue = orders.reduce((sum, o) => sum + o.amount, 0);

      days.push({
        day: date.toLocaleDateString("en-IN", { weekday: "short" }),
        date: date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),
        revenue,
        orders: orders.length,
      });
    }

    const totalRevenue = days.reduce((sum, d) => sum + d.revenue, 0);
    const averageRevenue = Math.round(totalRevenue / 7);

    res.json({
      success: true,
      data: {
        days,
        totalRevenue,
        averageRevenue,
      },
    });
  } catch (error) {
    console.log("Revenue chart error:", error);
    res.json({ success: false, message: "Error fetching chart data" });
  }
};




