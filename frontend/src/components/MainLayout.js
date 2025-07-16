// src/components/MainLayout.js
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "../MainLayout.css";

function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="main-layout">
      <div className="page-content">
        <Outlet />
      </div>

      <nav className="bottom-nav">
        <button
          className={location.pathname === "/app/chat" ? "active" : ""}
          onClick={() => navigate("/app/chat")}
        >
          💬 Chat
        </button>
        <button
          className={location.pathname === "/app/requests" ? "active" : ""}
          onClick={() => navigate("/app/requests")}
        >
          📩 Requests
        </button>
        <button
          className={location.pathname === "/app/profile" ? "active" : ""}
          onClick={() => navigate("/app/profile")}
        >
          👤 Profile
        </button>
      </nav>
    </div>
  );
}

export default MainLayout;
