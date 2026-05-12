import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import Login from "./login";
import hotelLogo2 from './assets/logo.jpg';
import bg2 from './assets/bg.gif';

function DashboardContent({ onLogout }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      console.log("🔄 Fetching feedback data...");
      const response = await axios.get("https://ocean-qr-backend.onrender.com/feedback");
      console.log("📊 Dashboard API Response:", response.data);

      const feedbackData = response.data.data || response.data;
      console.log("📋 Processed feedback data:", feedbackData);

      setData(feedbackData);
      setLoading(false);
    } catch (error) {
      console.error("❌ Dashboard API Error:", error);
      setLoading(false);
    }
  };

  const avgRating = data.length
    ? (data.reduce((s, i) => s + i.rating, 0) / data.length).toFixed(1)
    : "—";

  const filtered = filter === "all" ? data : data.filter(d => d.rating === Number(filter));

  const deleteFeedback = async (id) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      try {
        await axios.delete(`https://ocean-qr-backend.onrender.com/feedback/${id}`);
        setData(data.filter(item => item._id !== id));
        alert("Feedback deleted successfully!");
      } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete feedback");
      }
    }
  };

  // Close sidebar when clicking outside
  const handleOverlayClick = () => {
    setSidebarOpen(false);
  };

  // Close sidebar when clicking on nav items (mobile)
  const handleNavClick = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="dashboard">
      {/* Sidebar Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={handleOverlayClick}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        {/* Close button for mobile */}
        <button
          className="sidebar-close"
          onClick={() => setSidebarOpen(false)}
        >
          ✕
        </button>

        <div className="sidebar-logo">
          <img style={{ height: "100px", width: "100px" }} src={hotelLogo2} alt="Restaurant Logo" />
        </div>
        <h2>Ocean Restaurant</h2>

        <nav>
          <button
            className="nav-item active"
            onClick={handleNavClick}
          >
            📋 Feedback
          </button>
          <button
            className="nav-item"
            onClick={handleNavClick}
          >
            📊 Analytics
          </button>
          <button
            className="nav-item"
            onClick={handleNavClick}
          >
            ⚙️ Settings
          </button>
        </nav>

        <div className="sidebar-footer">
          <p>© 2024 Ocean Restaurant<br />
            All rights reserved</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main">
        <div className="topbar">
          <div className="topbar-left">
            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle menu"
            >
              ☰
            </button>
            <h1>Dashboard</h1>
          </div>
          <div className="topbar-right">
            <span className="badge">{data.length} Total</span>
            <button className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-value">{avgRating}</div>
            <div className="stat-label">Avg Rating</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-value">{data.length}</div>
            <div className="stat-label">Total Feedback</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚠️</div>
            <div className="stat-value">{data.filter(d => d.rating < 4).length}</div>
            <div className="stat-label">Needs Attention</div>
          </div>
          <div className="stat-card good-reviews">
            <div className="stat-icon">😊</div>
            <div className="stat-value">{data.filter(d => d.rating >= 4).length}</div>
            <div className="stat-label">Happy Customers</div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar">
          <span className="filter-label">Filter by rating:</span>
          <div className="filter-buttons">
            {["all", "1", "2", "3", "4", "5"].map(f => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f === "all" ? "All" : "★".repeat(Number(f))}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback List */}
        <div className="feedback-list">
          {loading ? (
            <div className="empty">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="empty">📭 No feedback found.</div>
          ) : (
            filtered.map((item, i) => {
              console.log("🔍 Rendering item:", item);
              return (
                <div key={item._id || i} className={`feedback-card rating-${item.rating} ${item.rating >= 4 ? 'good-review-card' : ''}`}>
                  {/* Good Review Alert */}
                  {item.rating >= 4 && (
                    <div className="good-review-alert">
                      <span className="alert-icon">🎉</span>
                      <span className="alert-text">Good Review - Redirected to Google</span>
                    </div>
                  )}

                  {/* Guest Details Section */}
                  <div className="guest-details">
                    <div className="guest-info-left">
                      <div className="guest-name">
                        <span className="user-icon">👤</span>
                        <span className="name-text">
                          {item.name || "Name not provided"}
                        </span>
                      </div>
                      <div className="contact-details">
                        <div className="contact-row">
                          <span className="contact-icon">📧</span>
                          <span className="contact-value">
                            {item.email || "Email not provided"}
                          </span>
                        </div>
                        <div className="contact-row">
                          <span className="contact-icon">📱</span>
                          <span className="contact-value">
                            {item.phone || "Phone not provided"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="guest-info-right">
                      <div className="rating-display">
                        <span className="stars">
                          {"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}
                        </span>
                        <span className="rating-number">{item.rating}/5</span>
                      </div>
                      <div className="feedback-date">
                        <span className="date-text">
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                        <span className="time-text">
                          {new Date(item.date).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <button
                        className="delete-button"
                        onClick={() => deleteFeedback(item._id)}
                        title="Delete this feedback"
                      >
                        🗑️ <span className="delete-text">Delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Feedback Message */}
                  <div className="feedback-message">
                    <div className="message-header">FEEDBACK:</div>
                    <div className="message-content">
                      {item.message ? (
                        item.message
                      ) : (
                        <em>No message provided</em>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is already logged in (optional - for persistence)
  useEffect(() => {
    const loginStatus = localStorage.getItem('isLoggedIn');
    if (loginStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return <DashboardContent onLogout={handleLogout} />;
}

export default App;
