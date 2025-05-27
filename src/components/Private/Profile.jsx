import React, { useEffect, useState } from "react";
import { auth } from "../../../firebase";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { updateProfile, updateEmail, updatePassword } from "firebase/auth";
import { useNavigate } from "react-router";
import "../../assets/style/privateComponent.css";

const db = getFirestore();

function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(profile);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!auth.currentUser) {
        navigate("/register");
        return;
      }
      const user = auth.currentUser;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};
      setProfile({
        name: user.displayName || "",
        email: user.email || "",
        password: "",
        phone: userData.phone || "",
        address: userData.address || "",
      });
      setForm({
        name: user.displayName || "",
        email: user.email || "",
        password: "",
        phone: userData.phone || "",
        address: userData.address || "",
      });
      setLoading(false);
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = () => setEditMode(true);

  const handleCancel = () => {
    setForm(profile);
    setEditMode(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      // Update Firebase Auth profile
      if (form.name !== profile.name) {
        await updateProfile(auth.currentUser, { displayName: form.name });
      }
      if (form.email !== profile.email) {
        await updateEmail(auth.currentUser, form.email);
      }
      if (form.password) {
        await updatePassword(auth.currentUser, form.password);
      }
      // Update Firestore user document
      await setDoc(
        doc(db, "users", auth.currentUser.uid),
        {
          phone: form.phone,
          address: form.address,
        },
        { merge: true }
      );
      setProfile({ ...form, password: "" });
      setEditMode(false);
    } catch (error) {
      alert("Error updating profile: " + error.message);
    }
    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mt-5">
      <h2>Profile</h2>
      <form onSubmit={handleSave}>
        <div className="mb-3">
          <label className="form-label">Name:</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={form.name}
            onChange={handleChange}
            disabled={!editMode}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={form.email}
            onChange={handleChange}
            disabled={!editMode}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password:</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={form.password}
            onChange={handleChange}
            disabled={!editMode}
            placeholder="Enter new password"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone:</label>
          <input
            type="text"
            className="form-control"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            disabled={!editMode}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Address:</label>
          <input
            type="text"
            className="form-control"
            name="address"
            value={form.address}
            onChange={handleChange}
            disabled={!editMode}
          />
        </div>
        {editMode ? (
          <>
            <button type="submit" className="btn btn-success me-2">
              Save
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          </>
        ) : (
          <button type="button" className="btn btn-primary" onClick={handleEdit}>
            Edit Profile
          </button>
        )}
      </form>
    </div>
  );
}

export default Profile;