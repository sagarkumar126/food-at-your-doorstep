import React, { useEffect, useState } from "react";
import "./Orders.css";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";
import OrderDetailsModal from "./OrderDetailsModal";

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Viewed orders state — localStorage se
  const [viewedIds, setViewedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("viewedOrderIds") || "[]");
    } catch {
      return [];
    }
  });

  const fetchAllOrders = async () => {
    try {
      const res = await axios.get(url + "/api/order/list");
      if (res.data.success) {
        setOrders(res.data.data);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while fetching orders");
    }
  };

  const statusHandler = async (e, id) => {
    const res = await axios.post(url + "/api/order/status", {
      orderId: id,
      status: e.target.value,
    });
    if (res.data.success) {
      toast.success("Status updated!");
      await fetchAllOrders();
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  // ✅ Order ko "viewed" mark karo
  const markAsViewed = (orderId) => {
    if (viewedIds.includes(orderId)) return;

    const updated = [...viewedIds, orderId];
    setViewedIds(updated);
    localStorage.setItem("viewedOrderIds", JSON.stringify(updated));

    window.dispatchEvent(new CustomEvent("ordersViewed"));
  };

  // ✅ "View" click handler
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    markAsViewed(order._id);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  const formatDateTime = (date, orderId) => {
    let d;
    if (date) {
      d = new Date(date);
    } else if (orderId) {
      d = new Date(parseInt(orderId.substring(0, 8), 16) * 1000);
    } else {
      return { date: "N/A", time: "N/A" };
    }
    return {
      date: d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: d.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const counts = {
    All: orders.length,
    "Food Processing": orders.filter((o) => o.status === "Food Processing").length,
    "Out for delivery": orders.filter((o) => o.status === "Out for delivery").length,
    Delivered: orders.filter((o) => o.status === "Delivered").length,
  };

  const filteredOrders = orders.filter((o) => {
    const matchesFilter = filter === "All" || o.status === filter;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      `${o.address?.firstName || ""} ${o.address?.lastName || ""}`
        .toLowerCase()
        .includes(query) ||
      o._id.toLowerCase().includes(query) ||
      (o.address?.phone || "").includes(query);
    return matchesFilter && matchesSearch;
  });

  const filterButtons = [
    { key: "All", label: "All" },
    { key: "Food Processing", label: "🍳 Processing" },
    { key: "Out for delivery", label: "🚚 Out for Delivery" },
    { key: "Delivered", label: "✅ Delivered" },
  ];

  const statusColor = (status) => {
    if (status === "Food Processing") return "processing";
    if (status === "Out for delivery") return "delivery";
    if (status === "Delivered") return "delivered";
    return "default";
  };

  return (
    <div className="orders-page">
      <div className="orders-header">
        <div>
          <h3>Orders</h3>
          <p className="orders-subtitle">
            Manage all customer orders from one place
          </p>
        </div>
        <div className="orders-total-badge">
          <span>Total</span>
          <b>{orders.length}</b>
        </div>
      </div>

      <div className="order-filters">
        {filterButtons.map((btn) => (
          <button
            key={btn.key}
            className={`filter-btn ${filter === btn.key ? "active" : ""}`}
            onClick={() => setFilter(btn.key)}
          >
            {btn.label}
            <span className="filter-count">{counts[btn.key]}</span>
          </button>
        ))}
      </div>

      <div className="order-search-bar">
        <span>🔍</span>
        <input
          type="text"
          placeholder="Search by customer name, phone, or order ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && <button onClick={() => setSearchQuery("")}>✕</button>}
      </div>

      <div className="orders-table-wrapper">
        {filteredOrders.length === 0 ? (
          <p className="no-orders-found">
            {searchQuery
              ? `No orders found for "${searchQuery}" 🔍`
              : filter !== "All"
              ? `No orders with status "${filter}"`
              : "No orders found."}
          </p>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Amount</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o, i) => {
                const dt = formatDateTime(o.date, o._id);
                const isViewed = viewedIds.includes(o._id);
                return (
                  <tr key={i} className={isViewed ? "row-viewed" : ""}>
                    <td className="td-index">
                      {i + 1}
                      {isViewed && <span className="viewed-dot">●</span>}
                    </td>

                    <td className="td-customer">
                      <div className="customer-info">
                        <div className="customer-avatar">
                          {o.address?.firstName?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <div>
                          <p className="customer-name">
                            {o.address?.firstName} {o.address?.lastName}
                          </p>
                          <p className="customer-id">
                            #{o._id.slice(-6).toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="td-items">
                      <p className="items-count">{o.items.length} items</p>
                      <p className="items-preview">
                        {o.items
                          .slice(0, 2)
                          .map((it) => `${it.name} x${it.quantity}`)
                          .join(", ")}
                        {o.items.length > 2 && ` +${o.items.length - 2} more`}
                      </p>
                    </td>

                    <td className="td-address">
                      {o.address?.street}, {o.address?.city}
                    </td>

                    <td className="td-phone">{o.address?.phone}</td>

                    <td className="td-amount">₹{o.amount}</td>

                    <td className="td-datetime">
                      <p className="dt-date">📅 {dt.date}</p>
                      <p className="dt-time">🕐 {dt.time}</p>
                    </td>

                    <td className="td-status">
                      <span className={`status-badge ${statusColor(o.status)}`}>
                        {o.status}
                      </span>
                      <select
                        className="status-select"
                        onChange={(e) => statusHandler(e, o._id)}
                        value={o.status}
                      >
                        <option value="Food Processing">Food Processing</option>
                        <option value="Out for delivery">Out for delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>

                    {/* ✅ View button + Viewed badge dono */}
                    <td className="td-action">
                      <div className="action-wrapper">
                        <button
                          className={`view-details-btn ${isViewed ? "viewed" : ""}`}
                          onClick={() => handleViewOrder(o)}
                          title={isViewed ? "View again" : "View details"}
                        >
                          👁️ View
                        </button>
                        {isViewed && (
                          <span className="viewed-badge-mini">
                            ✅ Viewed
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          url={url}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Orders;