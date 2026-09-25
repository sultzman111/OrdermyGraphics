import React, { useState } from 'react';

const AdminOrders = ({ 
  transactions = [], 
  onApproveTransaction, 
  onRejectTransaction, 
  onMarkDelivered 
}) => {
  const [txList, setTxList] = useState(transactions);
  const [selectedTx, setSelectedTx] = useState(null);
  const [deliveryDays, setDeliveryDays] = useState('2 days from now');
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'history'

  // Keep local list synchronized if parent prop updates
  React.useEffect(() => {
    setTxList(transactions);
  }, [transactions]);

  // Sort newest transactions to top
  const sortedTransactions = Array.isArray(txList) 
    ? [...txList].sort((a, b) => Number(b?.createdAt || 0) - Number(a?.createdAt || 0))
    : [];

  // Separate active orders from completed/rejected history
  const activeOrders = sortedTransactions.filter(tx => {
    const status = String(tx?.status || 'PENDING').toUpperCase();
    return status !== 'DELIVERED' && status !== 'COMPLETED' && status !== 'REJECTED' && status !== 'DECLINED';
  });

  const historyOrders = sortedTransactions.filter(tx => {
    const status = String(tx?.status || 'PENDING').toUpperCase();
    return status === 'DELIVERED' || status === 'COMPLETED' || status === 'REJECTED' || status === 'DECLINED';
  });

  const displayedTransactions = activeTab === 'active' ? activeOrders : historyOrders;

  const handleApproveSubmit = () => {
    if (!selectedTx) return;
    if (onApproveTransaction) {
      onApproveTransaction(selectedTx, deliveryDays);
    }
    // Transition status to ACCEPTED locally
    setTxList(prev => prev.map(item => item.id === selectedTx.id ? { ...item, status: 'ACCEPTED', deliveryDays } : item));
    setSelectedTx(null);
  };

  const handleRejectClick = (tx) => {
    const reason = window.prompt('Enter reason for rejecting this order:', 'Order declined by seller.');
    if (reason !== null) {
      if (onRejectTransaction) {
        onRejectTransaction(tx.id, reason);
      }
      // Transition status to REJECTED so it moves to History permanently
      setTxList(prev => prev.map(item => item.id === tx.id ? { ...item, status: 'REJECTED', rejectionReason: reason } : item));
    }
  };

  const handleDeliverClick = (txId) => {
    if (onMarkDelivered) {
      onMarkDelivered(txId);
    }
    // Transition status to DELIVERED so it moves permanently to Order History tab
    setTxList(prev => prev.map(item => item.id === txId ? { ...item, status: 'DELIVERED' } : item));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans min-h-screen bg-black text-neutral-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-neutral-800 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Manage Buyer Orders & History</h1>
          <p className="text-xs text-neutral-400 mt-1">Track orders through Pending, Accepted, Delivered, or Rejected stages</p>
        </div>

        {/* TABS SWITCHER */}
        <div className="flex bg-neutral-900 p-1 rounded-xl border border-neutral-800">
          <button
            type="button"
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'active' 
                ? 'bg-amber-500 text-neutral-950 shadow-md' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Active Orders ({activeOrders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'history' 
                ? 'bg-amber-500 text-neutral-950 shadow-md' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Order History ({historyOrders.length})
          </button>
        </div>
      </div>

      {displayedTransactions.length === 0 ? (
        <div className="p-12 text-center bg-neutral-900/40 rounded-2xl border border-dashed border-neutral-800">
          <p className="text-xs text-neutral-500 font-bold">
            {activeTab === 'active' ? 'No active orders found.' : 'No delivery or rejection history recorded yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedTransactions.map((tx, index) => {
            if (!tx) return null;

            const status = String(tx.status || 'PENDING').toUpperCase();
            const isAccepted = status === 'ACCEPTED' || status === 'APPROVED';
            const isRejected = status === 'REJECTED' || status === 'DECLINED';
            const isDelivered = status === 'DELIVERED' || status === 'COMPLETED';

            return (
              <div 
                key={tx.id || index} 
                className="p-5 border border-neutral-800/80 rounded-2xl bg-neutral-900/80 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-neutral-700 transition-all"
              >
                <div className="space-y-1.5">
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

                  {/* TIMELINE & STATUS DETAILS */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {tx.deliveryDays && (
                      <span className="text-[11px] font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                        🚚 Timeline: {tx.deliveryDays}
                      </span>
                    )}

                    {isRejected && (
                      <span className="text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
                        ❌ Reason: {tx.rejectionReason || 'Order declined by seller.'}
                      </span>
                    )}
                  </div>
                </div>

                {/* ACTION CONTROLS & STATUS PILL */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-xs font-bold px-3.5 py-1.5 rounded-xl uppercase tracking-wider ${
                    isDelivered ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    isAccepted ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    isRejected ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 
                    'bg-neutral-800 text-neutral-300 border border-neutral-700'
                  }`}>
                    {status}
                  </span>

                  {/* STAGE 1: PENDING ➔ ACCEPT OR REJECT */}
                  {!isDelivered && !isRejected && !isAccepted && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTx(tx);
                          setDeliveryDays(tx.deliveryDays || '2 days from now');
                        }}
                        className="px-3.5 py-2 bg-amber-500 text-neutral-950 text-xs font-black rounded-xl hover:bg-amber-400 transition-colors shadow-md cursor-pointer"
                      >
                        Accept Order
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRejectClick(tx)}
                        className="px-3.5 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-500 transition-colors shadow-md cursor-pointer"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {/* STAGE 2: ACCEPTED ➔ MARK AS DELIVERED PERMANENTLY */}
                  {isAccepted && !isDelivered && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTx(tx);
                          setDeliveryDays(tx.deliveryDays || '2 days from now');
                        }}
                        className="px-3 py-2 bg-neutral-800 text-neutral-300 text-xs font-bold rounded-xl hover:bg-neutral-700 transition-colors border border-neutral-700 cursor-pointer"
                      >
                        Edit Timeline
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeliverClick(tx.id)}
                        className="px-3.5 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-500 transition-colors shadow-md cursor-pointer"
                      >
                        Mark as Delivered 📦
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TIMELINE INPUT MODAL */}
      {selectedTx && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-950 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-neutral-800">
            <h3 className="text-base font-extrabold text-white">Accept & Set Delivery Timeline</h3>
            <p className="text-xs text-neutral-400">
              Specify the timeframe for <strong className="text-white">{selectedTx.buyerName}</strong>. This changes status from Pending to Accepted.
            </p>
            
            <input
              type="text"
              value={deliveryDays}
              onChange={(e) => setDeliveryDays(e.target.value)}
              placeholder="e.g., 2 days from now"
              className="w-full text-xs p-3 border border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-neutral-900 text-white"
            />
            
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="w-1/2 py-2.5 bg-neutral-900 text-neutral-300 font-bold text-xs rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApproveSubmit}
                className="w-1/2 py-2.5 bg-amber-500 text-neutral-950 font-black text-xs rounded-xl hover:bg-amber-400 transition-colors cursor-pointer"
              >
                Confirm Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;