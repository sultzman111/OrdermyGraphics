import React from 'react';

const MyListings = ({ transactions = [], currentUser }) => {
  // Normalize current user details
  const userEmail = (currentUser?.email || '').toLowerCase().trim();
  const userUid = currentUser?.uid || currentUser?.id;

  console.log("Logged In User UID:", userUid);
  console.log("Logged In User Email:", userEmail);
  console.log("All Firestore Transactions:", transactions);

  // Filter completed/reviewed transactions
  const historyTransactions = transactions.filter((tx) => {
    const txEmail = (tx.buyerEmail || '').toLowerCase().trim();
    const txUid = tx.buyerUid || tx.userId || tx.buyerID;

    // Strict user check
    const isMyOrder = 
      (userEmail && txEmail === userEmail) || 
      (userUid && txUid === userUid);

    // Status check
    const status = (tx.status || '').toUpperCase();
    const isCompleted = ['APPROVED', 'ACCEPTED', 'REJECTED'].includes(status);

    // MATCH: Returns true if status is completed AND order belongs to this buyer
    return isCompleted && (isMyOrder || !userUid); // Fallback: shows completed orders if user context is missing
  }).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 min-h-screen font-sans space-y-6">
      <div className="flex justify-between items-center border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-3xl font-black text-neutral-900">Order History</h1>
          <p className="text-xs text-neutral-500 mt-1">Accepted and declined orders</p>
        </div>
        <span className="text-xs font-extrabold text-neutral-700 bg-neutral-100 px-3.5 py-1.5 rounded-full border border-neutral-200">
          Total: {historyTransactions.length}
        </span>
      </div>

      {historyTransactions.length === 0 ? (
        <div className="p-12 bg-neutral-50 rounded-3xl border border-dashed border-neutral-200 text-center space-y-2">
          <p className="text-sm font-black text-neutral-700">No History Records Found</p>
          <p className="text-xs text-neutral-400">
            Make sure an order has been Accepted or Rejected from Admin Orders.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {historyTransactions.map((tx) => {
            const rawStatus = (tx.status || '').toUpperCase();
            const isAccepted = rawStatus === 'APPROVED' || rawStatus === 'ACCEPTED';

            return (
              <div 
                key={tx.id} 
                className="p-5 rounded-2xl border border-neutral-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-neutral-900">
                      Ref: {tx.uid || tx.id.slice(0, 8)}
                    </span>

                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      isAccepted 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                        : 'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}>
                      {isAccepted ? 'ACCEPTED' : 'REJECTED'}
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-neutral-800">{tx.title}</h3>
                  <p className="text-xs text-neutral-600">
                    Amount: <strong className="text-neutral-900">₦{Number(tx.price || 0).toLocaleString()}</strong>
                  </p>

                  {isAccepted && tx.deliveryDays && (
                    <p className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg w-fit border border-emerald-100">
                      🚚 Estimated Delivery: {tx.deliveryDays}
                    </p>
                  )}

                  {!isAccepted && (
                    <p className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg w-fit border border-rose-100">
                      ❌ {tx.rejectionReason || 'Order was declined by admin.'}
                    </p>
                  )}
                </div>

                <div className="text-right text-xs text-neutral-400 font-bold">
                  {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : ''}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyListings;