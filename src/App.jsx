import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc, setDoc, getDoc, serverTimestamp, query, where } from 'firebase/firestore';
import { auth, db } from './firebase'; 

import Nav from './Component.jsx/Nav';
import Abt from './Component.jsx/Abt';
import Home from './Pages/Home';
import Service from './Pages/Service';
import Signin from './Pages/Signin';
import Signup from './Pages/Signup';
import ForgotPassword from './Pages/ForgotPassword';
import Fav from './Pages/Fav';   
import Cart from './Pages/Cart'; 
import AddProperty from './Pages/AddProperty';
import MyListings from './Pages/MyListings'; 
import PaymentPage from './Pages/PaymentPage';
import Chat from './Pages/chat'; 
import AdminChat from './Pages/AdminChat';
import AdminOrders from './Pages/AdminOrders';

const SELLER_EMAIL = 'sultanoyebamiji1@gmail.com';

const useUserPresence = (user) => {
  useEffect(() => {
    if (!user?.uid) return;
    const userRef = doc(db, 'users', user.uid);
    updateDoc(userRef, { isOnline: true, lastSeen: serverTimestamp() }).catch(() => {});

    const handleUnload = () => {
      updateDoc(userRef, { isOnline: false, lastSeen: serverTimestamp() }).catch(() => {});
    };
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      updateDoc(userRef, { isOnline: false, lastSeen: serverTimestamp() }).catch(() => {});
    };
  }, [user?.uid]);
};

const ProtectedRoute = ({ user, children, requiredRole }) => {
  const location = useLocation();
  if (!user) return <Navigate to="/signin" state={{ from: location }} replace />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/" replace />;
  return children;
};

const MainContent = ({ 
  user, handleLogout, searchQuery, setSearchQuery, cart, favorites, 
  listings, addToCart, removeFromCart, toggleFavorite, 
  addNewProperty, transactions, handleApproveAndStartChat,
  handleRejectTransaction, setCart, handleBuyerCheckout, unreadCount 
}) => {
  const location = useLocation();
  const isAuthPage = ['/signin', '/signup', '/forgot-password'].includes(location.pathname.toLowerCase());

  return (
    <div className="w-screen min-h-screen flex flex-col bg-black font-sans">
      {!isAuthPage && (
        <div className="shrink-0">
          <Nav 
            user={user} 
            onLogout={handleLogout} 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            cartCount={cart.length}
            favoriteCount={favorites.length}
            unreadCount={unreadCount}
          />
        </div>
      )}

      <main className="flex-1 w-full flex flex-col">
        <Routes>
          <Route path="/" element={<Home user={user} listings={listings} />} />
          <Route path="/services" element={
            <Service 
              user={user} customProperties={listings} cartItems={cart}
              favoriteItems={favorites} onAddToCart={addToCart} 
              onRemoveFromCart={removeFromCart} onToggleFavorite={toggleFavorite}
              searchQuery={searchQuery}
            />
          } />
          
          <Route path="/AddProperty" element={
            <ProtectedRoute user={user} requiredRole="seller">
              <AddProperty onAddProperty={addNewProperty} />
            </ProtectedRoute>
          } />

          <Route path="/admin-orders" element={
            <ProtectedRoute user={user} requiredRole="seller">
              <AdminOrders 
                transactions={transactions} 
                onApproveTransaction={handleApproveAndStartChat} 
                onRejectTransaction={handleRejectTransaction} 
              />
            </ProtectedRoute>
          } />

          <Route path="/mylistening" element={
            <ProtectedRoute user={user}>
              <MyListings transactions={transactions} currentUser={user} />
            </ProtectedRoute>
          } />
          
          <Route path="/favorites" element={
            <ProtectedRoute user={user}>
              <Fav favoriteItems={favorites} onToggleFavorite={toggleFavorite} onAddToCart={addToCart} />
            </ProtectedRoute>
          } />

          <Route path="/cart" element={
            <ProtectedRoute user={user}>
              <Cart 
                user={user} cartItems={cart} onRemoveFromCart={removeFromCart} 
                onClearCart={() => setCart([])} onNavigateToPayment={handleBuyerCheckout}
                transactions={transactions} 
              />
            </ProtectedRoute>
          } />

          <Route path="/payment" element={<ProtectedRoute user={user}><PaymentPage user={user} transactions={transactions} /></ProtectedRoute>} />
          <Route path="/PaymentPage" element={<ProtectedRoute user={user}><PaymentPage user={user} transactions={transactions} /></ProtectedRoute>} />

          <Route path="/chat" element={
            <ProtectedRoute user={user}>
              <Chat user={user} />
            </ProtectedRoute>
          } />

          <Route path="/admin-chat" element={
            <ProtectedRoute user={user} requiredRole="seller">
              <AdminChat user={user} />
            </ProtectedRoute>
          } />
          
          <Route path="/about" element={<Abt />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [listings, setListings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useUserPresence(user);

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [favorites, setFavorites] = useState(() => {
    const savedFavs = localStorage.getItem('favoriteItems');
    return savedFavs ? JSON.parse(savedFavs) : [];
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const cleanEmail = firebaseUser.email?.toLowerCase().trim();
        const phoneNumber = firebaseUser.phoneNumber;
        const isSeller = cleanEmail === SELLER_EMAIL;
        const userRole = isSeller ? 'seller' : 'buyer';
        const userDocRef = doc(db, "users", firebaseUser.uid);
        let name = firebaseUser.displayName;

        try {
          const userSnap = await getDoc(userDocRef);
          if (!name && userSnap.exists()) {
            name = userSnap.data().fullName || userSnap.data().name;
          }
        } catch (e) {
          console.error(e);
        }

        if (!name) {
          name = firebaseUser.email ? firebaseUser.email.split('@')[0] : (phoneNumber || 'User');
        }

        setUser({
          uid: firebaseUser.uid,
          id: firebaseUser.uid,
          email: firebaseUser.email || null,
          phoneNumber: phoneNumber || null,
          displayName: name,
          fullName: name,
          role: userRole,
          isSeller: isSeller
        });

        await setDoc(userDocRef, {
          uid: firebaseUser.uid,
          email: firebaseUser.email || null,
          phoneNumber: phoneNumber || null,
          fullName: name,
          role: userRole,
          isOnline: true,
          lastSeen: serverTimestamp()
        }, { merge: true }).catch(() => {});
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Real-time unread message counter listener
  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    let q;
    if (user.isSeller) {
      // Tracks chats where admin has unread flags
      q = query(collection(db, 'chats'), where('adminHasUnread', '==', true));
    } else {
      // Tracks chat for the current buyer if they have unread flags
      q = query(collection(db, 'chats'), where('buyerUid', '==', user.uid), where('userHasUnread', '==', true));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUnreadCount(snapshot.size);
    }, (error) => {
      console.error("Error fetching unread count: ", error);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const unsubListings = onSnapshot(collection(db, "listings"), (s) => setListings(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubTx = onSnapshot(collection(db, "transactions"), (s) => setTransactions(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubUsers = onSnapshot(collection(db, "users"), (s) => setAllUsers(s.docs.map(d => ({ id: d.id, ...d.data() }))));

    return () => { unsubListings(); unsubTx(); unsubUsers(); };
  }, []);

  useEffect(() => { localStorage.setItem('cartItems', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('favoriteItems', JSON.stringify(favorites)); }, [favorites]);

  const handleLogout = async () => {
    if (user?.uid) {
      await updateDoc(doc(db, 'users', user.uid), { isOnline: false, lastSeen: serverTimestamp() }).catch(() => {});
    }
    await signOut(auth);
    setUser(null);
    setCart([]);
    setFavorites([]);
    localStorage.removeItem('cartItems');    
    localStorage.removeItem('favoriteItems'); 
  };

  const addNewProperty = async (newProperty) => {
    const customUid = `OMG-${Math.floor(100000 + Math.random() * 900000)}`;
    await addDoc(collection(db, "listings"), { 
      ...newProperty, 
      uid: newProperty.uid || customUid,
      sellerId: user?.email || SELLER_EMAIL,
      createdAt: Date.now()
    }).catch(() => {});
  };

  const deleteProperty = async (id) => {
    await deleteDoc(doc(db, "listings", id)).catch(() => {});
  };

  const handleBuyerCheckout = async (totalAmount, customNotes, navigate) => {
    if (cart.length === 0 || !user) return;
    const createdOrderUids = [];

    for (const item of cart) {
      const orderUid = item.uid || `OMG-${Math.floor(100000 + Math.random() * 900000)}`;
      createdOrderUids.push(orderUid);
      await addDoc(collection(db, "transactions"), {
        propertyId: item.id,
        uid: orderUid,
        title: item.title,
        price: item.basePrice || item.price,
        buyerEmail: user.email || null,
        buyerPhone: user.phoneNumber || null,
        buyerName: user.displayName || user.fullName || 'Buyer',
        buyerUid: user.uid,
        customNote: customNotes || '',
        sellerId: item.sellerId || SELLER_EMAIL,
        status: 'PENDING',
        deliveryDays: null,
        createdAt: Date.now()
      });
    }

    const chatId = `chat_${user.uid}`;
    const itemsSummary = cart.map(i => i.title).join(', ');
    const orderIdsText = createdOrderUids.join(', ');
    const now = Date.now();

    await setDoc(doc(db, "chats", chatId), {
      chatId, buyerEmail: user.email, buyerUid: user.uid, sellerEmail: SELLER_EMAIL,
      lastMessage: `Pending Order Ref: ${orderIdsText}`, lastUpdated: now,
      adminHasUnread: true // Triggers the admin's badge counter
    }, { merge: true });

    await addDoc(collection(db, `chats/${chatId}/messages`), {
      senderEmail: user.email || user.uid,
      senderUid: user.uid,
      text: `Hello Admin, I wish to order: ${itemsSummary}\nOrder Ref ID(s): ${orderIdsText}\n\nNotes: "${customNotes || 'None'}"`,
      createdAt: serverTimestamp(), sentAt: now, status: 'sent'
    });

    setCart([]); 
    if (navigate) navigate('/chat');
  };

  const handleApproveAndStartChat = async (transaction, deliveryDays = '2 days from now') => {
    await updateDoc(doc(db, "transactions", transaction.id), { status: 'APPROVED', deliveryDays });
    
    const chatId = `chat_${transaction.buyerUid}`;
    await updateDoc(doc(db, "chats", chatId), {
      userHasUnread: true // Triggers the specific buyer's badge counter
    }).catch(() => {});

    await addDoc(collection(db, `chats/${chatId}/messages`), {
      senderEmail: SELLER_EMAIL,
      text: `✅ Order Ref: ${transaction.uid} (${transaction.title}) APPROVED!\nDelivery: ${deliveryDays}`,
      createdAt: serverTimestamp(), sentAt: Date.now(), status: 'sent'
    });
  };

  const handleRejectTransaction = async (txId, rejectionReason) => {
    await updateDoc(doc(db, "transactions", txId), { status: 'REJECTED', rejectionReason: rejectionReason || 'Declined' });
  };

  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-neutral-900 text-amber-500 font-black text-xl">Loading...</div>;
  }

  return (
    <Router>
      <MainContent 
        user={user} handleLogout={handleLogout} searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        cart={cart} favorites={favorites} listings={listings} allUsers={allUsers}
        addToCart={(item) => setCart(p => p.some(i => i.id === item.id) ? p : [...p, item])}
        removeFromCart={(id) => setCart(p => p.filter(i => i.id !== id))}
        toggleFavorite={(item) => setFavorites(p => p.some(i => i.id === item.id) ? p.filter(i => i.id !== item.id) : [...p, item])}
        addNewProperty={addNewProperty} deleteProperty={deleteProperty} transactions={transactions}
        handleApproveAndStartChat={handleApproveAndStartChat} handleRejectTransaction={handleRejectTransaction}
        setCart={setCart} handleBuyerCheckout={handleBuyerCheckout} unreadCount={unreadCount}
      />
    </Router>
  );
}

export default App;