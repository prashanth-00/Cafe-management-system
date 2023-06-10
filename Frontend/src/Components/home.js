import React from "react";
import { Link } from "react-router-dom";
import backgroundImage from "./backgroundimage.jpg";

const backgroundStyle = {
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const contentStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  padding: 20,
  borderRadius: 5,
};

function HomePage() {
  return (
    <div style={backgroundStyle}>
      <div style={contentStyle}>
        <h1 style={{ textAlign: "center" }}>Cafe Management System</h1>
        <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
          <Link to="/forgot-password">Forgot Password</Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
