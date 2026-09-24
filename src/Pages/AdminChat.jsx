import React, { useState, useEffect, useRef } from 'react';
import { collection, onSnapshot, query, orderBy, addDoc, doc, setDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

const AWAY_MESSAGE = "Hello! Thanks for reaching out to OrderMyGraphics. We have received your message and will be with you shortly. Please wait a little bit! 🙏";

const AdminChat = () => {
  const [signedUpUsers, setSignedUpUsers] = useState([]);
  const [chatMeta, setChatMeta] = useState({});
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const messagesEndRef = useRef(null);
  const SELLER_EMAIL = 'sultanoyebamiji1@gmail.com';

  const getUserChatId = (u) => {
    if (!u) return null;
    return u.uid || u.id || (u.email ? u.email.replace(/[@.]/g, '_') : null);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 1. Fetch Users List
  useEffect(() => {
    const usersQuery = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
      const userList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const customersOnly = userList.filter(
        (u) => u.email?.toLowerCase() !== SELLER_EMAIL
      );

      setSignedUpUsers(customersOnly);

      if (customersOnly.length > 0 && !activeUser) {
        setActiveUser(customersOnly[0]);
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Listen to Unread Message Metadata across all chats
  useEffect(() => {
    const chatsQuery = query(collection(db, 'chats'));
    const unsubscribe = onSnapshot(chatsQuery, (snapshot) => {
      const metaMap = {};
      snapshot.docs.forEach((doc) => {
        metaMap[doc.id] = doc.data();
      });
      setChatMeta(metaMap);
    });

    return () => unsubscribe();
  }, []);

  // 3. Fetch Active Chat Messages, Clear Admin Unread Badge, and Handle Auto-Reply
  useEffect(() => {
    if (!activeUser) return;

    const userChatId = getUserChatId(activeUser);
    if (!userChatId) return;

    const chatId = `chat_${userChatId}`;

    // Clear admin unread count upon selecting chat
    const chatDocRef = doc(db, 'chats', chatId);
    setDoc(chatDocRef, { unreadCountAdmin: 0 }, { merge: true });

    const msgsQuery = query(
      collection(db, `chats/${chatId}/messages`),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(msgsQuery, async (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);

      // Auto-reply logic: check if the latest message was sent by customer
      if (msgs.length > 0) {
        const lastMsg = msgs[msgs.length - 1];
        const isFromCustomer = lastMsg.senderEmail !== SELLER_EMAIL && lastMsg.senderUid !== 'ADMIN_AUTO_REPLY';

        if (isFromCustomer && !lastMsg.autoReplied) {
          try {
            // Flag message to prevent multiple replies
            const msgRef = doc(db, `chats/${chatId}/messages`, lastMsg.id);
            await updateDoc(msgRef, { autoReplied: true });

            // Send automated away message after 1s delay
            setTimeout(async () => {
              await addDoc(collection(db, `chats/${chatId}/messages`), {
                senderEmail: SELLER_EMAIL,
                senderUid: 'ADMIN_AUTO_REPLY',
                text: AWAY_MESSAGE,
                createdAt: Date.now(),
                status: 'sent'
              });

              await setDoc(doc(db, 'chats', chatId), {
                lastMessage: AWAY_MESSAGE,
                lastUpdated: serverTimestamp(),
                unreadCountCustomer: increment(1)
              }, { merge: true });
            }, 1000);
          } catch (err) {
            console.error("Auto-reply trigger error:", err);
          }
        }
      }
    });

    return () => unsubscribe();
  }, [activeUser]);

  const handleReply = async (e) => {
    e.preventDefault();
    if ((!input.trim() && !file) || !activeUser) return;

    const userChatId = getUserChatId(activeUser);
    if (!userChatId) return;

    const chatId = `chat_${userChatId}`;
    const textToSend = input;
    const currentFile = file;

    setInput('');
    setFile(null);
    setUploading(true);

    try {
      let mediaUrl = null;
      let mediaType = null;

      if (currentFile) {
        const storageRef = ref(storage, `chat_media/${Date.now()}_${currentFile.name}`);
        await uploadBytes(storageRef, currentFile);
        mediaUrl = await getDownloadURL(storageRef);
        mediaType = currentFile.type.startsWith('image/') ? 'image' : 'video';
      }

      // Add message with time and status
      await addDoc(collection(db, `chats/${chatId}/messages`), {
        senderEmail: SELLER_EMAIL,
        text: textToSend,
        mediaUrl: mediaUrl || null,
        mediaType: mediaType || null,
        createdAt: Date.now(),
        status: 'sent'
      });

      // Update metadata and increment unread message count for Customer
      await setDoc(doc(db, 'chats', chatId), {
        lastMessage: textToSend || (mediaType === 'image' ? '📷 Image' : '🎥 Video'),
        lastUpdated: serverTimestamp(),
        unreadCountCustomer: increment(1),
        unreadCountAdmin: 0
      }, { merge: true });

    } catch (err) {
      console.error('Error sending message from Admin: ', err);
    } finally {
      setUploading(false);
    }
  };

  const formatLastSeen = (timestamp) => {
    if (!timestamp) return 'Offline';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return `Last seen ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-6xl mx-auto my-6 px-4 font-sans bg-black text-neutral-100">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex h-[600px]">
        
        {/* Customer Sidebar */}
        <div className="w-1/3 border-r border-neutral-800 bg-neutral-950 flex flex-col">
          <div className="p-4 border-b border-neutral-800 bg-neutral-900">
            <h2 className="text-sm font-black text-white">Registered Customers</h2>
            <p className="text-[10px] text-neutral-400 font-medium">
              {signedUpUsers.length} total customers
            </p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {signedUpUsers.map((u) => {
              const uChatId = getUserChatId(u);
              const isSelected = getUserChatId(activeUser) === uChatId;
              const unreadCount = chatMeta[`chat_${uChatId}`]?.unreadCountAdmin || 0;
              const displayName = u.fullName || u.email?.split('@')[0] || 'Customer';

              return (
                <button
                  key={u.id || u.uid}
                  type="button"
                  onClick={() => setActiveUser(u)}
                  className={`w-full text-left p-3.5 border-b border-neutral-800/60 transition-colors flex items-center justify-between cursor-pointer ${
                    isSelected ? 'bg-neutral-800 border-l-4 border-l-emerald-500' : 'hover:bg-neutral-900'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                      {u.isOnline && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-neutral-950"></span>
                      )}
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-neutral-200 truncate">{displayName}</p>
                      <p className="text-[10px] text-neutral-400 truncate">{u.email}</p>
                    </div>
                  </div>

                  {/* Unread Message Badge */}
                  {unreadCount > 0 && (
                    <span className="bg-emerald-500 text-black font-black text-[10px] px-2 py-0.5 rounded-full shrink-0">
                      {unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Thread */}
        <div className="flex-1 flex flex-col bg-neutral-900">
          {activeUser ? (
            <>
              <div className="p-4 border-b border-neutral-800 bg-neutral-950 text-white flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-neutral-200">
                    Chat with: <span className="text-white font-extrabold">{activeUser.fullName || activeUser.email}</span>
                  </h3>
                  <p className={`text-[10px] font-semibold ${activeUser.isOnline ? 'text-emerald-400' : 'text-neutral-400'}`}>
                    {activeUser.isOnline ? '● Online' : formatLastSeen(activeUser.lastSeen)}
                  </p>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-black/40">
                {messages.map((msg) => {
                  const isAdmin = msg.senderEmail === SELLER_EMAIL || msg.senderUid === 'ADMIN_AUTO_REPLY';
                  return (
                    <div key={msg.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs sm:max-w-md px-4 py-2.5 rounded-2xl text-xs font-medium ${
                        isAdmin ? 'bg-neutral-100 text-neutral-950 rounded-br-none shadow-md' : 'bg-neutral-800 border border-neutral-700 text-white rounded-bl-none shadow-md'
                      }`}>
                        <p className={`text-[9px] font-bold mb-0.5 ${isAdmin ? 'text-neutral-600' : 'text-emerald-400'}`}>
                          {isAdmin ? 'Admin (You)' : (activeUser.fullName || 'Customer')}
                        </p>

                        {msg.mediaUrl && (
                          <div className="my-2 rounded-lg overflow-hidden">
                            {msg.mediaType === 'image' ? (
                              <img src={msg.mediaUrl} alt="Attachment" className="max-h-60 w-full object-cover rounded-lg" />
                            ) : (
                              <video src={msg.mediaUrl} controls className="max-h-60 w-full rounded-lg" />
                            )}
                          </div>
                        )}

                        {msg.text && <p className="break-words">{msg.text}</p>}

                        {/* Time & Read Status Indicator */}
                        <div className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${isAdmin ? 'text-neutral-500' : 'text-neutral-400'}`}>
                          <span>{formatTime(msg.createdAt)}</span>
                          {isAdmin && (
                            <span className="font-bold text-emerald-600">
                              {msg.status === 'read' ? '✓✓' : '✓'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleReply} className="p-3 bg-neutral-950 border-t border-neutral-800 flex flex-col gap-2">
                {file && (
                  <div className="text-[11px] text-emerald-400 bg-neutral-900 p-2 rounded-lg flex justify-between items-center">
                    <span>Attached: {file.name}</span>
                    <button type="button" onClick={() => setFile(null)} className="text-red-400 font-bold">✕</button>
                  </div>
                )}
                <div className="flex gap-2">
                  <label className="cursor-pointer bg-neutral-800 hover:bg-neutral-700 text-neutral-300 p-2.5 rounded-xl text-xs flex items-center justify-center">
                    📁
                    <input 
                      type="file" 
                      accept="image/*,video/*" 
                      className="hidden" 
                      onChange={(e) => setFile(e.target.files[0])} 
                    />
                  </label>

                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Type a direct message to ${activeUser.fullName || 'user'}...`}
                    className="flex-1 bg-neutral-900 border border-neutral-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-neutral-600"
                  />
                  <button
                    type="submit"
                    disabled={uploading}
                    className="bg-white hover:bg-neutral-200 disabled:bg-neutral-600 text-black font-extrabold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    {uploading ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-neutral-500">
              Select a customer from the sidebar to view chat.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminChat;