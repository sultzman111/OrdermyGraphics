import React, { useState, useEffect, useRef } from 'react';
import { collection, onSnapshot, query, orderBy, addDoc, doc, setDoc, increment, serverTimestamp, where } from 'firebase/firestore';
import { db } from '../firebase';

const Chat = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isAdminOnline, setIsAdminOnline] = useState(false);
  const messagesEndRef = useRef(null);

  const SELLER_EMAIL = 'sultanoyebamiji1@gmail.com';
  const buyerChatId = user?.uid;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const adminQuery = query(collection(db, 'users'), where('email', '==', SELLER_EMAIL));
    const unsubscribeAdmin = onSnapshot(adminQuery, (snapshot) => {
      if (!snapshot.empty) {
        setIsAdminOnline(snapshot.docs[0].data()?.isOnline || false);
      }
    }, () => {});
    return () => unsubscribeAdmin();
  }, [SELLER_EMAIL]);

  useEffect(() => {
    if (!buyerChatId) return;
    const chatId = `chat_${buyerChatId}`;
    const msgsQuery = query(collection(db, `chats/${chatId}/messages`), orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(msgsQuery, (snapshot) => {
      const msgs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMessages(msgs);
      setDoc(doc(db, 'chats', chatId), { unreadCountCustomer: 0 }, { merge: true }).catch(() => {});
    }, () => {});

    return () => unsubscribe();
  }, [buyerChatId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !buyerChatId) return;

    const chatId = `chat_${buyerChatId}`;
    const textToSend = input.trim();
    const now = Date.now();
    const initialStatus = isAdminOnline ? 'delivered' : 'sent';

    setInput('');

    const tempMessage = {
      id: `temp_${now}`,
      senderEmail: user?.email || 'Buyer',
      senderUid: user?.uid,
      text: textToSend,
      createdAt: now,
      sentAt: now,
      read: false,
      status: initialStatus
    };

    setMessages((prev) => [...prev, tempMessage]);

    try {
      await addDoc(collection(db, `chats/${chatId}/messages`), {
        senderEmail: user?.email || 'Buyer',
        senderUid: user?.uid,
        text: textToSend,
        createdAt: serverTimestamp(),
        sentAt: now,
        read: false,
        status: initialStatus
      });

      await setDoc(doc(db, 'chats', chatId), {
        buyerEmail: user?.email || 'Buyer',
        lastMessage: textToSend,
        lastUpdated: serverTimestamp(),
        unreadCountAdmin: increment(1)
      }, { merge: true });
    } catch (err) {
      console.error(err);
    }
  };

  const formatDateTime = (msg) => {
    let dateObj = null;
    if (msg.sentAt) dateObj = new Date(msg.sentAt);
    else if (msg.createdAt?.toDate) dateObj = msg.createdAt.toDate();
    else if (typeof msg.createdAt === 'number') dateObj = new Date(msg.createdAt);

    if (!dateObj || isNaN(dateObj.getTime())) return 'Just now';
    return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderStatusTicks = (msg) => {
    const isSeen = msg.read || msg.status === 'read';
    const isDelivered = msg.status === 'delivered' || isAdminOnline;

    if (isSeen) {
      return <span className="font-black text-[11px] text-sky-400 tracking-tighter" title="Seen">✓✓✓</span>;
    }
    if (isDelivered) {
      return <span className="font-extrabold text-[11px] text-neutral-300 tracking-tighter" title="Delivered">✓✓</span>;
    }
    return <span className="font-extrabold text-[11px] text-neutral-500 tracking-tighter" title="Sent">✓</span>;
  };

  if (!user) {
    return <div className="h-full w-full flex items-center justify-center bg-neutral-950 text-white font-bold">Please sign in to chat.</div>;
  }

  return (
    <div className="w-full h-full flex flex-col bg-neutral-900 overflow-hidden">
      <div className="w-full max-w-4xl h-full mx-auto flex flex-col bg-neutral-900 border-x border-neutral-800 shadow-2xl relative">
        
        {/* Chat Header */}
        <div className="bg-neutral-950 px-4 py-3 border-b border-neutral-800 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs border border-emerald-500/30">
              S
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white">OrderMyGraphics Support</h3>
              <p className={`text-[10px] font-semibold ${isAdminOnline ? 'text-emerald-400' : 'text-neutral-500'}`}>
                ● {isAdminOnline ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
          <span className="text-[10px] text-neutral-400 hidden sm:inline">
            Logged in: <strong className="text-white">{user?.email}</strong>
          </span>
        </div>

        {/* Scrollable Message Thread Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-neutral-900 pb-20">
          {messages.map((msg) => {
            const isBuyer = msg.senderEmail?.toLowerCase() !== SELLER_EMAIL.toLowerCase() && msg.senderUid !== 'ADMIN_AUTO_REPLY';

            return (
              <div key={msg.id} className={`flex ${isBuyer ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] sm:max-w-[70%] px-3.5 py-2 rounded-xl text-xs flex flex-col gap-1 shadow-md ${
                  isBuyer ? 'bg-neutral-800 text-white rounded-br-none border border-neutral-700' : 'bg-neutral-950 text-neutral-100 rounded-bl-none border border-neutral-800'
                }`}>
                  <span className={`text-[9px] font-bold ${isBuyer ? 'text-neutral-400' : 'text-emerald-400'}`}>
                    {isBuyer ? 'You' : 'OrderMyGraphics Support'}
                  </span>

                  {msg.text && <p className="break-words leading-relaxed">{msg.text}</p>}

                  <div className="flex items-center justify-end gap-1.5 pt-1 mt-0.5 border-t border-white/10 text-[9px] text-neutral-400">
                    <span>{formatDateTime(msg)}</span>
                    {isBuyer && renderStatusTicks(msg)}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Static Pinned Input Form */}
        <div className="absolute bottom-0 left-0 right-0 bg-neutral-950 border-t border-neutral-800 p-3 z-20">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message to Support..."
              className="flex-1 bg-neutral-900 border border-neutral-800 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-neutral-600"
            />
            <button
              type="submit"
              className="bg-white hover:bg-neutral-200 text-black font-extrabold px-5 py-2.5 rounded-xl text-xs cursor-pointer transition-colors"
            >
              Send
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Chat;