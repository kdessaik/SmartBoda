import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { auth, db } from "../../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database";

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate("/login");
        return;
      }

      setUser(currentUser);

      try {
        const roleRef = ref(db, `users/${currentUser.uid}`);
        const snapshot = await get(roleRef);
        const userData = snapshot.val();

        if (userData && userData.role === "admin") {
          setIsAuthorized(true);
        } else {
          navigate("/unauthorized");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        navigate("/unauthorized");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) return <p>Loading Admin Dashboard...</p>;

  if (!isAuthorized) return null; // just in case

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p>Welcome, {user?.displayName}</p>

      {/* Add more admin features here: like user list, promote/demote, etc */}
    </div>
  );
};

export default AdminDashboard;
