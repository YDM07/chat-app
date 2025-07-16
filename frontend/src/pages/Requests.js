// src/pages/Requests.js
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import "../Requests.css";

function Requests() {
  const [allUsers, setAllUsers] = useState([]);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [incomingRequests, setIncomingRequests] = useState([]);

  const fetchAllUsers = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    // All users (excluding self)
    const snapshot = await getDocs(collection(db, "users"));
    const users = [];
    snapshot.forEach((docSnap) => {
      if (docSnap.id !== currentUser.uid) {
        users.push(docSnap.data());
      }
    });

    // Current user's data
    const userSnap = await getDoc(doc(db, "users", currentUser.uid));
    if (userSnap.exists()) {
      const data = userSnap.data();
      setCurrentUserData(data);

      // Load full info of users who sent request
      const incoming = await Promise.all(
        (data.requestsReceived || []).map(async (senderId) => {
          const senderSnap = await getDoc(doc(db, "users", senderId));
          return senderSnap.exists() ? senderSnap.data() : null;
        })
      );
      setIncomingRequests(incoming.filter(Boolean));
    }

    setAllUsers(users);
  };

  const sendRequest = async (targetUser) => {
    const currentUid = auth.currentUser.uid;
    const senderRef = doc(db, "users", currentUid);
    const receiverRef = doc(db, "users", targetUser.uid);

    await updateDoc(senderRef, {
      requestsSent: [...(currentUserData.requestsSent || []), targetUser.uid],
    });

    const receiverSnap = await getDoc(receiverRef);
    const receiverData = receiverSnap.data();
    await updateDoc(receiverRef, {
      requestsReceived: [...(receiverData.requestsReceived || []), currentUid],
    });

    alert("Request sent!");
    fetchAllUsers();
  };

  const acceptRequest = async (senderUid) => {
    const currentUid = auth.currentUser.uid;
    const currentRef = doc(db, "users", currentUid);
    const senderRef = doc(db, "users", senderUid);

    const currentSnap = await getDoc(currentRef);
    const senderSnap = await getDoc(senderRef);

    const currentData = currentSnap.data();
    const senderData = senderSnap.data();

    await updateDoc(currentRef, {
      friends: [...(currentData.friends || []), senderUid],
      requestsReceived: (currentData.requestsReceived || []).filter((id) => id !== senderUid),
    });

    await updateDoc(senderRef, {
      friends: [...(senderData.friends || []), currentUid],
      requestsSent: (senderData.requestsSent || []).filter((id) => id !== currentUid),
    });

    alert("Connection accepted!");
    fetchAllUsers(); // refresh
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  if (!currentUserData) return <p>Loading...</p>;

  return (
    <div className="requests-page">
      <h2>Incoming Requests</h2>
      {incomingRequests.length === 0 ? (
        <p>No pending requests</p>
      ) : (
        <ul className="user-list">
          {incomingRequests.map((user) => (
            <li key={user.uid} className="user-card">
              <div className="user-info">
                <img
                  src={user.photoURL || "https://via.placeholder.com/40"}
                  alt="pfp"
                />
                <div>
                  <h4>{user.name}</h4>
                  <p>@{user.username}</p>
                </div>
              </div>
              <button onClick={() => acceptRequest(user.uid)}>Accept</button>
            </li>
          ))}
        </ul>
      )}

      <h2>All Users</h2>
      <ul className="user-list">
        {allUsers.map((user) => {
          const isFriend = (currentUserData.friends || []).includes(user.uid);
          const isRequested = (currentUserData.requestsSent || []).includes(user.uid);

          return (
            <li key={user.uid} className="user-card">
              <div className="user-info">
                <img
                  src={user.photoURL || "https://via.placeholder.com/40"}
                  alt="pfp"
                />
                <div>
                  <h4>{user.name}</h4>
                  <p>@{user.username}</p>
                </div>
              </div>

              {isFriend ? (
                <span className="status connected">Connected</span>
              ) : isRequested ? (
                <span className="status requested">Requested</span>
              ) : (
                <button onClick={() => sendRequest(user)}>Send Request</button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Requests;
