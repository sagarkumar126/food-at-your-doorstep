import orderModel from "../models/orderModel.js";

// ✅ getNotifications — saare paid orders (koi date filter nahi)
export const getNotifications = async (req, res) => {
  try {
    const recentOrders = await orderModel
      .find({ payment: true })
      .sort({ _id: -1 })
      .limit(10);

    const notifications = recentOrders.map((order) => ({
      _id: order._id,
      type: "order",
      title: "🛒 New Order Received",
      message: `${order.address?.firstName || "Customer"} ${
        order.address?.lastName || ""
      } ordered ₹${order.amount}`,
      amount: order.amount,
      status: order.status,
      date: order.date || order._id.getTimestamp(),
      isRead: false,
    }));

    res.json({
      success: true,
      data: notifications,
      count: notifications.length,
    });
  } catch (error) {
    console.log("Notifications error:", error);
    res.json({ success: false, message: "Error fetching notifications" });
  }
};

// ✅ getUnreadCount — saare paid orders ka count
export const getUnreadCount = async (req, res) => {
  try {
    const count = await orderModel.countDocuments({ payment: true });
    res.json({ success: true, count });
  } catch (error) {
    console.log("Unread count error:", error);
    res.json({ success: false, count: 0 });
  }
};