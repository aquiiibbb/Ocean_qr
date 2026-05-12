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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // User info state
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: ""
  });


  const labels = ["", "😠 Very Bad", "😕 Bad", "😐 Okay", "🙂 Good", "😄 Excellent"];

  const handleUserInfo = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleRating = async (r) => {
    if (ratingFixed) return;

    setRating(r);
    setRatingFixed(true);

    if (r >= 4) {
      // High rating - save to database first, then redirect to Google Reviews
      try {
        const ratingData = {
          rating: r,
          message: "Redirected to Google Reviews",
          name: "Anonymous",
          email: "anonymous@email.com",
          phone: "0000000000"
        };

        await axios.post(
          "https://ocean-qr-backend.onrender.com/feedback",
          ratingData,
          {
            timeout: 10000
            ,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      } catch (error) {
        console.error("Error saving high rating:", error);
        // Continue with redirect even if save fails
      }

      // Redirect after saving
      setTimeout(() => {
        window.open("https://g.page/r/Cea7NympeaWAEBM/review", "_blank");
        // Reset form after redirect
        setTimeout(() => {
          resetForm();
        }, 100);
      }, 500);
    } else if (r <= 3) {
      // Low rating - show feedback form
      setShowUserForm(true);
    }
  };

  const handleUserSubmit = async () => {
    // Validation
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userInfo.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (userInfo.phone.length < 10) {
      alert("Please enter a valid phone number.");
      return;
    }

    if (!message.trim()) {
      alert("Please enter your feedback message.");
      return;
    }

    setIsSubmitting(true);

    try {
      const feedbackData = {
        name: userInfo.name.trim(),
        email: userInfo.email.trim(),
        phone: userInfo.phone.trim(),
        rating: rating,
        message: message.trim()
      };

      console.log("Submitting feedback:", feedbackData);

      const response = await axios.post(
        "https://ocean-qr-backend.onrender.com/feedback",
        feedbackData,
        {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Feedback saved:", response.data);
      setSubmitted(true);

    } catch (error) {
      console.error("Error submitting feedback:", error);

      let errorMessage = "Failed to submit feedback. Please try again.";

      if (error.code === 'ECONNABORTED') {
        errorMessage = "Request timed out. Server might be starting up - please try again in a moment.";
      } else if (error.response?.status === 502) {
        errorMessage = "Server is temporarily unavailable. Please try again in a moment.";
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
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
              <p className="redirect-message">Saving your rating... Opening Google Reviews...</p>
            )}
          </div>
        )}

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

            <div className="rating-display">
              <p className="rating-text">Your rating:</p>
              <div className="selected-stars">
                {Array.from({ length: rating }, (_, index) => (
                  <span key={index} className="star-selected">★</span>
                ))}
              </div>
              <p className="rating-label">{labels[rating]}</p>
            </div>

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
