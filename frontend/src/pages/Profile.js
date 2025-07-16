// src/pages/Profile.js
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../Profile.css";

function Profile() {
  const [userData, setUserData] = useState(null);
  const [form, setForm] = useState({ name: "", username: "" });
  const navigate = useNavigate();

  const fetchProfile = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const docRef = doc(db, "users", currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      setUserData(data);
      setForm({ name: data.name || "", username: data.username || "" });
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        name: form.name,
        username: form.username,
      });
      alert("Profile updated successfully!");
      fetchProfile();
    } catch (err) {
      console.error("Error updating profile:", err.message);
      alert("Failed to update profile.");
    }
  };

  const handleLogout = () => {
    auth.signOut();
    navigate("/login");
  };

  if (!userData) return <p>Loading...</p>;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <img
          src={userData.photoURL || "https://via.placeholder.com/100"}
          alt="Profile"
          className="profile-img"
        />
        <form className="profile-form" onSubmit={handleUpdate}>
          <label>
            Name:
            <input type="text" name="name" value={form.name} onChange={handleChange} />
          </label>

          <label>
            Username:
            <input type="text" name="username" value={form.username} onChange={handleChange} />
          </label>

          <label>
            Email:
            <input type="email" value={userData.email} disabled />
          </label>

          <button type="submit">Save Changes</button>
        </form>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
