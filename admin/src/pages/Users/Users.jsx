import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Users = ({ url }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${url}/api/admin/users`);
      if (res.data.success) {
        setUsers(res.data.data);
      } else {
        toast.error("Failed to load users");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id, name) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete user "${name}"? 🗑️\n\nThis cannot be undone.`
    );
    if (!confirmDelete) return;

    try {
      const res = await axios.post(`${url}/api/admin/delete-user`, { id });
      if (res.data.success) {
        toast.success("User deleted successfully");
        fetchUsers();
      } else {
        toast.error("Failed to delete user");
      }
    } catch (error) {
      toast.error("Server error");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Filter
  const filteredUsers = users.filter((u) => {
    const query = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query)
    );
  });

  const styles = {
    page: {
      padding: "25px",
      fontFamily: "Poppins, sans-serif",
    },
    heading: {
      fontSize: "28px",
      fontWeight: "800",
      marginBottom: "10px",
      background: "linear-gradient(135deg, #262626, tomato)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },
    subheading: {
      fontSize: "14px",
      color: "#888",
      marginBottom: "20px",
    },
    searchBar: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      background: "white",
      border: "2px solid #eee",
      borderRadius: "50px",
      padding: "10px 20px",
      marginBottom: "25px",
      maxWidth: "500px",
      transition: "0.3s",
    },
    searchInput: {
      flex: 1,
      border: "none",
      outline: "none",
      fontSize: "14px",
      fontFamily: "Poppins, sans-serif",
      background: "transparent",
      color: "#262626",
    },
    clearBtn: {
      background: "#ffe6e0",
      border: "none",
      width: "22px",
      height: "22px",
      borderRadius: "50%",
      cursor: "pointer",
      color: "tomato",
      fontSize: "12px",
      fontWeight: "700",
    },
    table: {
      background: "white",
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
      border: "1px solid #f0f0f0",
    },
    headerRow: {
      display: "grid",
      gridTemplateColumns: "2fr 2.5fr 1fr 1fr 1fr 100px",
      gap: "15px",
      padding: "18px 22px",
      background: "#fafafa",
      borderBottom: "2px solid #f0f0f0",
      fontWeight: "700",
      fontSize: "13px",
      color: "#555",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    row: {
      display: "grid",
      gridTemplateColumns: "2fr 2.5fr 1fr 1fr 1fr 100px",
      gap: "15px",
      padding: "16px 22px",
      alignItems: "center",
      borderBottom: "1px solid #f5f5f5",
      fontSize: "14px",
      transition: "0.3s",
    },
    userName: {
      fontWeight: "700",
      color: "#262626",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    avatar: {
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, tomato, #e74c3c)",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "700",
      fontSize: "15px",
    },
    email: {
      color: "#888",
      fontSize: "13px",
    },
    badge: (color) => ({
      display: "inline-block",
      padding: "4px 12px",
      borderRadius: "50px",
      fontSize: "12px",
      fontWeight: "700",
      background: `${color}15`,
      color: color,
    }),
    deleteBtn: {
      background: "linear-gradient(135deg, #e74c3c, #c0392b)",
      color: "white",
      border: "none",
      padding: "6px 14px",
      borderRadius: "8px",
      fontSize: "12px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "0.3s",
      fontFamily: "Poppins, sans-serif",
    },
    empty: {
      textAlign: "center",
      padding: "50px 20px",
      color: "#aaa",
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

  if (loading) {
    return <div style={styles.loading}>👥 Loading users...</div>;
  }

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Users Management</h2>
      <p style={styles.subheading}>
        Total <b>{users.length}</b> registered users
      </p>

      {/* Search */}
      <div style={styles.searchBar}>
        <span>🔍</span>
        <input
          style={styles.searchInput}
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button style={styles.clearBtn} onClick={() => setSearchQuery("")}>
            ✕
          </button>
        )}
      </div>

      {/* Table */}
      <div style={styles.table}>
        <div style={styles.headerRow}>
          <div>User</div>
          <div>Email</div>
          <div>Orders</div>
          <div>Spent</div>
          <div>Joined</div>
          <div>Action</div>
        </div>

        {filteredUsers.length === 0 ? (
          <p style={styles.empty}>
            {searchQuery
              ? `No users found for "${searchQuery}" 🔍`
              : "No users yet"}
          </p>
        ) : (
          filteredUsers.map((u, i) => (
            <div
              key={i}
              style={styles.row}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#fafafa")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "white")
              }
            >
              <div style={styles.userName}>
                <div style={styles.avatar}>
                  {u.name.charAt(0).toUpperCase()}
                </div>
                {u.name}
              </div>
              <div style={styles.email}>{u.email}</div>
              <div>
                <span style={styles.badge("#3498db")}>{u.orderCount}</span>
              </div>
              <div>
                <span style={styles.badge("#27ae60")}>₹{u.totalSpent}</span>
              </div>
              <div style={{ fontSize: "13px", color: "#888" }}>
                {new Date(u.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>
              <div>
                <button
                  style={styles.deleteBtn}
                  onClick={() => deleteUser(u._id, u.name)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Users;




