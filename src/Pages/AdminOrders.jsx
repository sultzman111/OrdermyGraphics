import React, { useState } from 'react';

const AdminOrders = ({ transactions = [], onApproveTransaction, onRejectTransaction }) => {
  const [selectedTx, setSelectedTx] = useState(null);
  const [deliveryDays, setDeliveryDays] = useState('2 days from now');

  // Sort newest transactions to top
  const sortedTransactions = Array.isArray(transactions) 
    ? [...transactions].sort((a, b) => Number(b?.createdAt || 0) - Number(a?.createdAt || 0))
    : [];

  const handleApproveSubmit = () => {
    if (!selectedTx) return;
    onApproveTransaction(selectedTx, deliveryDays);
    setSelectedTx(null);
  };

  const handleRejectClick = (tx) => {
    const reason = window.prompt('Enter reason for rejecting this order:', 'Order declined by seller.');
    if (reason !== null) {
      onRejectTransaction(tx.id, reason);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans min-h-screen bg-black text-neutral-100">
      <div className="flex justify-between items-center mb-6 border-b border-neutral-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white">Manage Buyer Orders</h1>
          <p className="text-xs text-neutral-400 mt-1">Review, accept, or reject incoming purchase requests</p>
        </div>
        <span className="text-xs font-bold text-neutral-300 bg-neutral-900 px-3 py-1 rounded-full border border-neutral-800">
          Total: ({sortedTransactions.length})
        </span>
      </div>

      {sortedTransactions.length === 0 ? (
        <div className="p-12 text-center bg-neutral-900/40 rounded-2xl border border-dashed border-neutral-800">
          <p className="text-xs text-neutral-500 font-bold">No buyer orders found in database.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedTransactions.map((tx, index) => {
            if (!tx) return null;

            const status = String(tx.status || 'PENDING').toUpperCase();
            const isApproved = status === 'APPROVED' || status === 'ACCEPTED';
            const isRejected = status === 'REJECTED' || status === 'DECLINED';

            return (
              <div 
                key={tx.id || index} 
                className="p-5 border border-neutral-800/80 rounded-2xl bg-neutral-900/80 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-neutral-700 transition-all"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wide">
                    Ref: {tx.uid || (typeof tx.id === 'string' ? tx.id.slice(0, 8) : `TX-${index}`)}
                  </span>
                  
                  <p className="text-sm font-extrabold text-white">
                    Buyer: {tx.buyerName || 'Unknown Buyer'} ({tx.buyerEmail || tx.buyerPhone || 'No contact info'})
                  </p>
                  
                  <p className="text-xs font-bold text-neutral-300">Item: {tx.title || 'Untitled Graphic'}</p>
                  
                  {tx.customNote && (
                    <p className="text-xs bg-amber-500/10 text-amber-300 p-2.5 rounded-xl border border-amber-500/20 mt-1">
                      <strong className="font-bold">Note:</strong> {tx.customNote}
                    </p>
                  )}

                  <p className="text-sm font-black text-white mt-1">
                    Total: ₦{Number(tx.price || 0).toLocaleString()}
                  </p>

                  {isApproved && tx.deliveryDays && (
                    <p className="text-xs font-bold text-emerald-400 mt-1 bg-emerald-500/10 px-2 py-1 rounded-lg w-fit border border-emerald-500/20">
                      🚚 Delivery: {tx.deliveryDays}
                    </p>
                  )}

                  {isRejected && (
                    <p className="text-xs font-bold text-rose-400 mt-1 bg-rose-500/10 px-2 py-1 rounded-lg w-fit border border-rose-500/20">
                      ❌ Reason: {tx.rejectionReason || 'Order declined.'}
                    </p>
                  )}
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-3 py-1 rounded-lg uppercase ${
                    isApproved ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    isRejected ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {status}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTx(tx);
                      setDeliveryDays(tx.deliveryDays || '2 days from now');
                    }}
                    className="px-3.5 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-500 transition-colors shadow-md cursor-pointer"
                  >
                    {isApproved ? 'Update Timeline' : 'Accept'}
                  </button>

                  {!isRejected && (
                    <button
                      type="button"
                      onClick={() => handleRejectClick(tx)}
                      className="px-3.5 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-500 transition-colors shadow-md cursor-pointer"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TIMELINE MODAL */}
      {selectedTx && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-neutral-800">
            <h3 className="text-base font-extrabold text-white">Set Delivery Timeline</h3>
            <p className="text-xs text-neutral-400">
              Specify estimated delivery timeframe for <strong className="text-white">{selectedTx.buyerName}</strong>:
            </p>
            
            <input
              type="text"
              value={deliveryDays}
              onChange={(e) => setDeliveryDays(e.target.value)}
              placeholder="e.g., 2 days from now"
              className="w-full text-xs p-3 border border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-neutral-950 text-white"
            />
            
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="w-1/2 py-2.5 bg-neutral-800 text-neutral-300 font-bold text-xs rounded-xl hover:bg-neutral-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApproveSubmit}
                className="w-1/2 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-500 transition-colors cursor-pointer"
              >
                Approve Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;