import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const Dashboard = ({ url }) => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalFoods: 0,
    totalUsers: 0,
    recentOrders: [],
    orderStatus: { processing: 0, delivered: 0, outForDelivery: 0 },
  });
  const [chartData, setChartData] = useState({
    days: [],
    totalRevenue: 0,
    averageRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${url}/api/admin/dashboard`);
      if (res.data.success) setStats(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load dashboard");
    }
  };

  const fetchChart = async () => {
    try {
      const res = await axios.get(`${url}/api/admin/revenue-chart`);
      if (res.data.success) setChartData(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchChart();
  }, []);

  const styles = {
    dashboard: {
      padding: "25px",
      fontFamily: "'Poppins', sans-serif",
      width: "100%",
      boxSizing: "border-box",
    },
    heading: {
      fontSize: "28px",
      fontWeight: "800",
      marginBottom: "25px",
      background: "linear-gradient(135deg, #262626, tomato)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },
    statsGrid: {
      display: "flex",
      flexWrap: "wrap",
      gap: "20px",
      marginBottom: "30px",
    },
    statCard: {
      flex: "1 1 220px",
      minWidth: "220px",
      background: "white",
      borderRadius: "18px",
      padding: "22px",
      display: "flex",
      alignItems: "center",
      gap: "18px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
      transition: "all 0.4s",
      cursor: "pointer",
      border: "1px solid #f0f0f0",
    },
    statIcon: {
      fontSize: "30px",
      width: "65px",
      height: "65px",
      borderRadius: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    statLabel: {
      fontSize: "13px",
      color: "#888",
      marginBottom: "6px",
      fontWeight: "600",
      letterSpacing: "0.5px",
      textTransform: "uppercase",
    },
    statValue: {
      fontSize: "26px",
      fontWeight: "800",
      margin: 0,
    },
    section: {
      background: "white",
      borderRadius: "18px",
      padding: "25px",
      marginBottom: "25px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
      border: "1px solid #f0f0f0",
    },
    sectionTitle: {
      fontSize: "20px",
      fontWeight: "700",
      marginBottom: "20px",
      color: "#262626",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    chartHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "15px",
      marginBottom: "20px",
    },
    chartStats: {
      display: "flex",
      gap: "20px",
      flexWrap: "wrap",
    },
    chartStatBox: {
      background: "#fafafa",
      borderRadius: "12px",
      padding: "10px 18px",
      border: "1px solid #f0f0f0",
    },
    chartStatLabel: {
      fontSize: "11px",
      color: "#888",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      marginBottom: "4px",
    },
    chartStatValue: {
      fontSize: "20px",
      fontWeight: "800",
      color: "tomato",
      margin: 0,
    },
    statusGrid: {
      display: "flex",
      flexWrap: "wrap",
      gap: "18px",
    },
    statusCard: {
      flex: "1 1 180px",
      minWidth: "180px",
      borderRadius: "16px",
      padding: "22px",
      textAlign: "center",
      cursor: "pointer",
      transition: "transform 0.3s",
    },
    statusLabel: {
      fontSize: "14px",
      marginBottom: "10px",
      fontWeight: "700",
    },
    statusValue: {
      fontSize: "32px",
      fontWeight: "800",
      margin: 0,
    },
    recentOrders: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    recentItem: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
      padding: "15px 18px",
      borderRadius: "14px",
      background: "#fafafa",
      border: "1px solid #f0f0f0",
    },
    recentImg: {
      width: "45px",
      height: "45px",
      padding: "8px",
      background: "#fff4f2",
      borderRadius: "12px",
    },
    recentInfo: {
      flex: 1,
    },
    recentItems: {
      fontSize: "14px",
      color: "#262626",
      marginBottom: "5px",
      fontWeight: "600",
    },
    recentMeta: {
      display: "flex",
      gap: "20px",
      fontSize: "13px",
      color: "#888",
      fontWeight: "500",
    },
    noData: {
      textAlign: "center",
      color: "#bbb",
      padding: "30px",
      fontSize: "15px",
      fontStyle: "italic",
    },
    loading: {
      padding: "60px",
      textAlign: "center",
      fontSize: "18px",
      color: "#888",
      fontWeight: "600",
    },
  };

  const statCards = [
    {
      icon: "📦",
      label: "Total Orders",
      value: stats.totalOrders,
      color: "#3498db",
      bg: "#e3f2fd",
    },
    {
      icon: "💰",
      label: "Total Revenue",
      value: `₹${stats.totalRevenue}`,
      color: "#27ae60",
      bg: "#e8f5e9",
    },
    {
      icon: "🍔",
      label: "Total Foods",
      value: stats.totalFoods,
      color: "#f39c12",
      bg: "#fff8e1",
    },
    {
      icon: "👥",
      label: "Total Users",
      value: stats.totalUsers,
      color: "#9b59b6",
      bg: "#f3e5f5",
    },
  ];

  // ✅ Custom Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: "white",
            padding: "10px 15px",
            borderRadius: "10px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
            border: "1px solid #f0f0f0",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          <p style={{ margin: 0, fontSize: "13px", fontWeight: "700" }}>
            {payload[0].payload.date}
          </p>
          <p style={{ margin: "5px 0 0", color: "tomato", fontWeight: "700" }}>
            ₹{payload[0].value}
          </p>
          <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>
            {payload[0].payload.orders} orders
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return <div style={styles.loading}>🍽️ Loading dashboard...</div>;
  }

  const maxRevenue = Math.max(...chartData.days.map((d) => d.revenue), 1);

  return (
    <div style={styles.dashboard}>
      <h2 style={styles.heading}>Dashboard Overview</h2>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        {statCards.map((card, index) => (
          <div
            key={index}
            style={styles.statCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow =
                "0 12px 35px rgba(255, 99, 71, 0.15)";
              e.currentTarget.style.borderColor = card.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)";
              e.currentTarget.style.borderColor = "#f0f0f0";
            }}
          >
            <div
              style={{
                ...styles.statIcon,
                background: card.bg,
                color: card.color,
              }}
            >
              {card.icon}
            </div>
            <div>
              <p style={styles.statLabel}>{card.label}</p>
              <h3 style={{ ...styles.statValue, color: card.color }}>
                {card.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Revenue Chart */}
      <div style={styles.section}>
        <div style={styles.chartHeader}>
          <h3 style={{ ...styles.sectionTitle, marginBottom: 0 }}>
            📈 Revenue (Last 7 Days)
          </h3>
          <div style={styles.chartStats}>
            <div style={styles.chartStatBox}>
              <p style={styles.chartStatLabel}>Total</p>
              <p style={styles.chartStatValue}>₹{chartData.totalRevenue}</p>
            </div>
            <div style={styles.chartStatBox}>
              <p style={styles.chartStatLabel}>Daily Avg</p>
              <p style={styles.chartStatValue}>₹{chartData.averageRevenue}</p>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData.days} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: "#888", fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#888" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${v}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#fff4f2" }} />
            <Bar dataKey="revenue" radius={[10, 10, 0, 0]}>
              {chartData.days.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    entry.revenue === maxRevenue && entry.revenue > 0
                      ? "url(#topGradient)"
                      : "url(#barGradient)"
                  }
                />
              ))}
            </Bar>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff8a65" />
                <stop offset="100%" stopColor="tomato" />
              </linearGradient>
              <linearGradient id="topGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#27ae60" />
                <stop offset="100%" stopColor="#2ecc71" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Order Status */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>📊 Order Status</h3>
        <div style={styles.statusGrid}>
          <div
            style={{
              ...styles.statusCard,
              background: "linear-gradient(135deg, #fff8e1, #ffecb3)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <p style={{ ...styles.statusLabel, color: "#f39c12" }}>🍳 Processing</p>
            <h3 style={{ ...styles.statusValue, color: "#f39c12" }}>
              {stats.orderStatus.processing}
            </h3>
          </div>
          <div
            style={{
              ...styles.statusCard,
              background: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <p style={{ ...styles.statusLabel, color: "#3498db" }}>
              🚚 Out for Delivery
            </p>
            <h3 style={{ ...styles.statusValue, color: "#3498db" }}>
              {stats.orderStatus.outForDelivery}
            </h3>
          </div>
          <div
            style={{
              ...styles.statusCard,
              background: "linear-gradient(135deg, #e8f5e9, #c8e6c9)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <p style={{ ...styles.statusLabel, color: "#27ae60" }}>✅ Delivered</p>
            <h3 style={{ ...styles.statusValue, color: "#27ae60" }}>
              {stats.orderStatus.delivered}
            </h3>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>🕐 Recent Orders</h3>
        {stats.recentOrders.length === 0 ? (
          <p style={styles.noData}>No orders yet</p>
        ) : (
          <div style={styles.recentOrders}>
            {stats.recentOrders.map((order, index) => (
              <div
                key={index}
                style={styles.recentItem}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#fff4f2";
                  e.currentTarget.style.transform = "translateX(5px)";
                  e.currentTarget.style.borderColor = "tomato";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#fafafa";
                  e.currentTarget.style.transform = "translateX(0)";
                  e.currentTarget.style.borderColor = "#f0f0f0";
                }}
              >
                <img src={assets.parcel_icon} alt="" style={styles.recentImg} />
                <div style={styles.recentInfo}>
                  <p style={styles.recentItems}>
                    {order.items.map((item, i) => (
                      <span key={i}>
                        {item.name} x {item.quantity}
                        {i !== order.items.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </p>
                  <div style={styles.recentMeta}>
                    <span>💰 ₹{order.amount}</span>
                    <span>📌 {order.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;




