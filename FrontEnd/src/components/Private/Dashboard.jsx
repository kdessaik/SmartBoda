import React, { useEffect, useState } from "react";
import { auth } from "../../../firebase";
import { useNavigate } from "react-router"; // Fix import path

function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserData(user);
        setDisplayName(user.displayName || "User"); // Set display name
      } else {
        navigate("/register"); // Redirect if not authenticated
      }
    });

    return () => unsubscribe(); // Cleanup listener
  }, [navigate]);



  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <h1>Dashboard</h1>
      <h2>Welcome, {displayName}!</h2>
      <button onClick={handleLogout}>Logout</button>
    </>
  );
}

export default Dashboard;
