import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import { auth, db } from "../../../firebase";
import '../../assets/style/privateComponent.css';
import underDevImg2  from "../../assets/image/UnderDev3.png"

const DashboardBoda = () => {
  const [user, setUser] = useState(null);
  const [driverInfo, setDriverInfo] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const infoRef = ref(db, `drivers/${currentUser.uid}`);
        onValue(infoRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setDriverInfo(data);
          }
        });
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const notifRef = ref(db, `notifications/${user.uid}`);
    onValue(notifRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const notifArray = Object.values(data);
        setNotifications(notifArray);
      }
    });
  }, [user]);


  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">BodaBoda Driver Dashboard</h2>
  

      <div className="flex items-center space-x-4 bg-white p-4 rounded shadow">
        {driverInfo?.photoUrl && (
          <img
            src={driverInfo.photoUrl}
            alt="Driver"
            className="w-20 h-20 rounded-full object-cover"
          />
        )}
        <div>
          <h3 className="text-xl font-semibold">{driverInfo?.name || "Driver Name"}</h3>
          <p className="text-gray-600">{user?.email}</p>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-lg font-semibold mb-2">Notifications</h4>
        {notifications.length > 0 ? (
          <ul className="space-y-2">
            {notifications.map((notif, index) => (
              <li
                key={index}
                className="p-3 bg-yellow-100 border-l-4 border-yellow-500 rounded"
              >
                {notif.message}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No transportation requests yet.</p>
        )}
      </div>
       <div> <img src={underDevImg2} alt="" className="UnderDevImgP1" /></div>

       
    </div>
  );
};

export default DashboardBoda;
