import { useState } from "react";
import axios from "axios";
import "./page.css";
import hotelLogo1 from './assets/logo.jpg';

function Page() {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [showUserForm, setShowUserForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [ratingFixed, setRatingFixed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  // User info state
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const labels = ["", "😠 Very Bad", "😕 Bad", "😐 Okay", "🙂 Good", "😄 Excellent"];

  // API URL - use environment variable or fallback
  const API_URL = process.env.REACT_APP_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    import.meta.env?.VITE_API_URL ||
    "https://ocean-qr-backend.vercel.app";

  const handleUserInfo = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleRating = (r) => {
    // Only allow rating change if not fixed
    if (ratingFixed) return;

    setRating(r);
    setRatingFixed(true);

    if (r >= 4) {
      // High rating (4-5 stars) - direct redirect to Google Reviews
      alert("Thank you for your positive feedback! Redirecting to Google Reviews...");
      setTimeout(() => {
        window.open("https://g.page/r/Cea7NympeaWAEBM/review", "_blank");
        // Reset form after redirect
        setTimeout(() => {
          resetForm();
        }, 1000);
      }, 1500);
    } else if (r <= 3) {
      // Low rating (1-3 stars) - show user form
      setShowUserForm(true);
    }
  };

  const handleUserSubmit = async () => {
    // Validate user info
    if (!userInfo.name.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!userInfo.email.trim()) {
      alert("Please enter your email.");
      return;
    }

    if (!userInfo.phone.trim()) {
      alert("Please enter a valid phone number.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userInfo.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Phone validation
    if (userInfo.phone.length < 10) {
      alert("Please enter a valid phone number.");
      return;
    }

    // For low ratings (1-3), require feedback message
    if (!message.trim()) {
      alert("Please enter your feedback message.");
      return;
    }

    setIsSubmitting(true);

    // Submit low rating feedback
    try {
      const feedbackData = {
        name: userInfo.name.trim(),
        email: userInfo.email.trim(),
        phone: userInfo.phone.trim(),
        rating: rating,
        message: message.trim()
      };

      console.log("🚀 Submitting to:", `${API_URL}/feedback`);
      console.log("📤 Feedback data:", feedbackData);

      // Configure axios with better error handling
      const response = await axios({
        method: 'POST',
        url: `${API_URL}/feedback`,
        data: feedbackData,
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      });

      console.log("✅ Response:", response.data);
      setSubmitted(true);

    } catch (error) {
      console.error("❌ Full error:", error);

      let errorMessage = "Failed to submit feedback. Please try again.";

      if (error.response) {
        // Server responded with error status
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        errorMessage = error.response.data?.error || `Server error (${error.response.status})`;
      } else if (error.request) {
        // Request was made but no response received
        console.error("No response received:", error.request);
        errorMessage = "Network error. Please check your connection.";
      } else {
        // Something else happened
        console.error("Request setup error:", error.message);
        errorMessage = error.message;
      }

      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setUserInfo({ name: "", email: "", phone: "" });
    setRating(0);
    setMessage("");
    setShowUserForm(false);
    setHoveredRating(0);
    setRatingFixed(false);
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="container">
        <div className="card">
          <div className="hotel-icon"><img src={hotelLogo1} alt="Hotel Logo" /></div>
          <div className="checkmark">✔</div>
          <h2>Thank You!</h2>
          <p className="subtitle">Your feedback helps us improve our service.</p>
          <button className="btn" onClick={resetForm}>Submit Another Review</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div className="hotel-icon"><img src={hotelLogo1} alt="Hotel Logo" /></div>
        <h1>How was your stay?</h1>
        <p className="subtitle">Please rate your experience with us</p>

        {/* Rating Section - Shows first */}
        {!showUserForm && (
          <div className="rating-section">
            <p className="rating-text">Rate your experience:</p>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((r) => (
                <button
                  key={r}
                  className={`star ${r <= (hoveredRating || rating) ? "active" : ""} ${ratingFixed ? "fixed" : ""}`}
                  onClick={() => handleRating(r)}
                  onMouseEnter={() => !ratingFixed && setHoveredRating(r)}
                  onMouseLeave={() => !ratingFixed && setHoveredRating(0)}
                  disabled={ratingFixed}
                >★</button>
              ))}
            </div>
            {rating > 0 && <p className="rating-label">{labels[rating]}</p>}
            {rating >= 4 && (
              <p className="redirect-message">Redirecting to Google Reviews...</p>
            )}
          </div>
        )}

        {/* User Details Section - Only for low ratings (1-3) */}
        {showUserForm && rating <= 3 && (
          <div className="user-details">
            <input
              type="text"
              name="name"
              placeholder="Your Full Name *"
              value={userInfo.name}
              onChange={handleUserInfo}
              className="input-field"
              required
              disabled={isSubmitting}
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address *"
              value={userInfo.email}
              onChange={handleUserInfo}
              className="input-field"
              required
              disabled={isSubmitting}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number *"
              value={userInfo.phone}
              onChange={handleUserInfo}
              className="input-field"
              required
              disabled={isSubmitting}
            />

            {/* Fixed Rating Display - Only selected stars, centered */}
            <div className="rating-display">
              <p className="rating-text">Your rating:</p>
              <div className="selected-stars">
                {Array.from({ length: rating }, (_, index) => (
                  <span key={index} className="star-selected">★</span>
                ))}
              </div>
              <p className="rating-label">{labels[rating]}</p>
            </div>

            {/* Feedback Form - Only for low ratings */}
            <div className="feedback-form">
              <h3>We're sorry to hear that! What went wrong?</h3>
              <textarea
                placeholder="Please describe your experience in detail so we can improve..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                required
                disabled={isSubmitting}
              />
            </div>

            <button
              className="btn"
              onClick={handleUserSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;