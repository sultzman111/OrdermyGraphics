import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = ({ 
  user, 
  cartItems = [], 
  onRemoveFromCart, 
  onClearCart, 
  onNavigateToPayment,
  transactions = [] 
}) => {
  const navigate = useNavigate();
  const [customNotes, setCustomNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + Number(item.basePrice || item.price || 0), 0
  );

  // Filter ONLY PENDING orders for current buyer & limit to max 5 items
  const activePendingTransactions = transactions
    .filter(tx => 
      (tx.buyerEmail === user?.email || tx.buyerUid === user?.uid) &&
      (tx.status || 'PENDING').toUpperCase() === 'PENDING'
    )
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    .slice(0, 5); // Capped at 5 maximum

  const handleCheckoutSubmit = async () => {
    if (cartItems.length === 0) return;
    setSubmitting(true);

    try {
      if (onNavigateToPayment) {
        await onNavigateToPayment(totalAmount, customNotes, navigate);
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("Failed to submit order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 min-h-screen font-sans space-y-12 bg-black text-neutral-100">
      
      {/* ACTIVE CART SECTION */}
      <div>
        <h1 className="text-3xl font-black text-white mb-8">Review & Submit Order</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* CART ITEMS LIST */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-sm font-extrabold text-neutral-400 uppercase tracking-wider mb-2">
              Items in Cart ({cartItems.length})
            </h2>

            {cartItems.length === 0 ? (
              <div className="p-8 bg-neutral-900/40 rounded-2xl border border-dashed border-neutral-800 text-center">
                <p className="text-xs text-neutral-500 font-bold">Your active cart is empty.</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 flex items-center justify-between shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-16 h-16 rounded-xl object-cover bg-neutral-950"
                    />
                    <div>
                      <h3 className="font-extrabold text-white text-sm">{item.title}</h3>
                      <p className="text-xs text-emerald-400 font-bold mt-0.5">
                        ₦{Number(item.basePrice || item.price || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveFromCart(item.id)}
                    className="text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-lg hover:bg-rose-500/20 transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}

            {cartItems.length > 0 && (
              <div className="mt-6 bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5">
                <label className="block text-xs font-black text-neutral-200 uppercase tracking-wider mb-2">
                  Customization Details / Message for Admin
                </label>
                <textarea
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="Enter custom text, names, colors, or specific instructions for this order..."
                  rows={4}
                  className="w-full text-xs p-3.5 rounded-xl border border-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-neutral-950 text-white placeholder-neutral-500"
                />
              </div>
            )}
          </div>

          {/* ORDER SUMMARY */}
          <div className="bg-neutral-900 border border-neutral-800 text-white rounded-3xl p-6 h-fit shadow-2xl">
            <h2 className="text-base font-extrabold mb-4 border-b border-neutral-800 pb-3">Order Summary</h2>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Estimated Total</span>
                <span className="font-bold text-white">₦{totalAmount.toLocaleString()}</span>
              </div>
              <div className="pt-3 border-t border-neutral-800 flex justify-between text-sm font-black text-emerald-400">
                <span>Total</span>
                <span>₦{totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <button
              disabled={cartItems.length === 0 || submitting}
              onClick={handleCheckoutSubmit}
              className={`w-full mt-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                cartItems.length === 0 || submitting
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-900/20'
              }`}
            >
              {submitting ? 'Submitting Order...' : 'Submit Order & Open Admin Chat 💬'}
            </button>
          </div>

        </div>
      </div>

      {/* PENDING ORDERS (MAX 5) */}
      <div className="pt-8 border-t border-neutral-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-black text-white">Pending Orders ({activePendingTransactions.length}/5)</h2>
          <button 
            onClick={() => navigate('/mylistening')} 
            className="text-xs font-bold text-emerald-400 hover:underline cursor-pointer"
          >
            View Full History →
          </button>
        </div>
        
        {activePendingTransactions.length === 0 ? (
          <p className="text-xs text-neutral-500 font-medium">No pending orders currently awaiting admin approval.</p>
        ) : (
          <div className="space-y-3">
            {activePendingTransactions.map((tx) => (
              <div key={tx.id} className="p-4 rounded-2xl border border-neutral-800/80 bg-neutral-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white">
                      Order Ref: {tx.uid || tx.id.slice(0, 8)}
                    </span>
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      PENDING
                    </span>
                  </div>
                  <p className="text-xs font-bold text-neutral-300 mt-1">{tx.title}</p>
                  <p className="text-xs text-neutral-400">Total: ₦{Number(tx.price || 0).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Cart;