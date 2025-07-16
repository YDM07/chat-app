import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import ChatArea from "../components/ChatArea";
import "../Chat.css";

function Chat() {
  const [friendList, setFriendList] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const fetchFriends = async () => {
    const currentUser = auth.currentUser;
    const userRef = doc(db, "users", currentUser.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      const data = snap.data();
      const friends = data.friends || [];

      const detailedFriends = await Promise.all(
        friends.map(async (uid) => {
          const friendSnap = await getDoc(doc(db, "users", uid));
          return friendSnap.exists() ? friendSnap.data() : null;
        })
      );

      setFriendList(detailedFriends.filter(Boolean));
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  return (
    <div className="chat-container">
      <div className="friend-list">
        <h3>Friends</h3>
        <ul>
          {friendList.map((user) => (
            <li key={user.uid} onClick={() => setSelectedFriend(user)}>
              <img
                src={user.photoURL || "https://via.placeholder.com/40"}
                alt="avatar"
              />
              <span>{user.name}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="chat-area">
        {selectedFriend ? (
          <ChatArea selectedFriend={selectedFriend} />
        ) : (
          <div className="empty-chat">
            <h3>Select a friend to start chatting</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
