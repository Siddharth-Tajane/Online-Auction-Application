import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css"; // Import the CSS file

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get("http://localhost:5000/dashboard", {
          headers: {  Authorization: `Bearer ${token}`},
        });

        setUser(response.data);
      } catch (error) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-box">
        <h2>Dashboard</h2>
        {user ? (
          <>
            <p>Welcome, <strong>{user.email}</strong>!</p>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
