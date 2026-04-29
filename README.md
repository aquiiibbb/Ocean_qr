# 💬 Client — Guest Feedback Form

React app for guests to rate their hotel stay.

## Setup
```bash
npm install
npm start
```

Runs at: **http://localhost:3000**

## How it works
- Guest selects 1–5 stars
- ⭐⭐⭐⭐ or ⭐⭐⭐⭐⭐ → Redirects to Google Review
- ⭐, ⭐⭐, or ⭐⭐⭐ → Shows private feedback form → saved to DB

## ⚠️ Before going live
Replace in `src/App.js`:
```js
window.location.href = "YOUR_GOOGLE_REVIEW_LINK";
```
