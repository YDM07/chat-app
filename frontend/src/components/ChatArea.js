// src/components/ChatArea.js
import React, { useEffect, useRef, useState } from "react";
import { db, storage, auth } from "../firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "../ChatArea.css";

function ChatArea({ selectedFriend }) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const fileInputRef = useRef();

  const currentUid = auth.currentUser.uid;
  const chatId = [currentUid, selectedFriend.uid].sort().join("_");

  const scrollRef = useRef();

  // 🔁 Realtime message fetch
  useEffect(() => {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => doc.data());
      setMessages(msgs);
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (text.trim() === "") return;

    const msgRef = collection(db, "chats", chatId, "messages");
    await addDoc(msgRef, {
      sender: currentUid,
      text: text.trim(),
      timestamp: serverTimestamp(),
    });
    setText("");
  };

  const handleUpload = async (file) => {
    if (!file) return;

    const storageRef = ref(storage, `chats/${chatId}/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);

    const msgRef = collection(db, "chats", chatId, "messages");
    await addDoc(msgRef, {
      sender: currentUid,
      mediaUrl: url,
      mediaType: file.type,
      timestamp: serverTimestamp(),
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="chat-area-full" onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
      <div className="messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message ${msg.sender === currentUid ? "sent" : "received"}`}
          >
            {msg.text && <p>{msg.text}</p>}
            {msg.mediaUrl && (
              <>
                {msg.mediaType.startsWith("image/") && (
                  <img src={msg.mediaUrl} alt="media" />
                )}
                {msg.mediaType.startsWith("video/") && (
                  <video controls src={msg.mediaUrl} />
                )}
                {!msg.mediaType.startsWith("image/") &&
                  !msg.mediaType.startsWith("video/") && (
                    <a href={msg.mediaUrl} target="_blank" rel="noopener noreferrer">
                      {msg.mediaUrl}
                    </a>
                  )}
              </>
            )}
          </div>
        ))}
        <div ref={scrollRef}></div>
      </div>

      <form className="chat-input" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Type message or paste link..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          type="file"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={(e) => handleUpload(e.target.files[0])}
        />
        <button type="button" onClick={() => fileInputRef.current.click()}>
          📎
        </button>
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatArea;
