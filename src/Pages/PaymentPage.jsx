import React from 'react';

const PaymentPage = ({ transactions = [], user }) => {
  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 min-h-screen font-sans space-y-6 bg-black text-neutral-100">
      
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-neutral-800 pb-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            YOUR HISTORICAL <span className="text-orange-500">LEDGER</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">Track pending, approved, and rejected orders</p>
        </div>
        <span className="text-xs font-extrabold text-orange-400 bg-orange-500/10 px-3.5 py-1.5 rounded-full border border-orange-500/20">
          Total Orders: ({safeTransactions.length})
        </span>
      </div>

      {/* ORDERS LIST */}
      {safeTransactions.length === 0 ? (
        <div className="p-12 bg-neutral-900/40 rounded-3xl border border-dashed border-neutral-800 text-center space-y-2">
          <p className="text-sm font-black text-neutral-300">No Historical Records Found</p>
          <p className="text-xs text-neutral-500">
            Submit an order from your cart to start seeing your history ledger here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {safeTransactions.map((tx, index) => {
            if (!tx) return null;

            const docId = tx.id || `tx-${index}`;
            const refCode = tx.uid || (typeof tx.id === 'string' ? tx.id.slice(0, 8) : `ORD-${index}`);
            const status = String(tx.status || 'PENDING').toUpperCase();
            
            const isAccepted = status === 'APPROVED' || status === 'ACCEPTED';
            const isRejected = status === 'REJECTED' || status === 'DECLINED';
            const isPending = !isAccepted && !isRejected;

            const formattedPrice = Number(tx.price || 0).toLocaleString();

            return (
              <div 
                key={docId} 
                className="p-5 rounded-2xl border border-neutral-800/80 bg-neutral-900/80 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl hover:border-orange-500/40 transition-all"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-orange-400">
                      Ref: {refCode}
                    </span>

                    {/* STATUS BADGES */}
                    {isAccepted && (
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        ACCEPTED
                      </span>
                    )}

                    {isRejected && (
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        REJECTED
                      </span>
                    )}

                    {isPending && (
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase bg-orange-500/10 text-orange-400 border border-orange-500/20">
                        AWAITING REVIEW
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-extrabold text-white">{tx.title || 'Graphic Request'}</h3>
                  <p className="text-xs text-neutral-400">Buyer: {tx.buyerEmail || tx.buyerName || 'Guest User'}</p>

                  {isAccepted && tx.deliveryDays && (
                    <p className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg w-fit border border-emerald-500/20 mt-1">
                      🚚 Delivery: {tx.deliveryDays}
                    </p>
                  )}

                  {isRejected && (
                    <p className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg w-fit border border-rose-500/20 mt-1">
                      ❌ Reason: {tx.rejectionReason || 'Order was declined'}
                    </p>
                  )}
                </div>

                <div className="text-right text-sm font-black text-orange-400">
                  ₦{formattedPrice}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PaymentPage;