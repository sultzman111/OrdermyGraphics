import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Service = ({ 
  user, 
  customProperties = [], 
  cartItems = [], 
  favoriteItems = [], 
  onAddToCart, 
  onRemoveFromCart, 
  onToggleFavorite, 
  searchQuery = '' 
}) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const QUICK_CATEGORIES = [
    { label: 'All Services', key: 'All', icon: '✨' },
    { label: 'Project', key: 'Project', icon: '📚' },
    { label: 'Web Design', key: 'Web Design', icon: '💻' },
    { label: 'Frames', key: 'Frames', icon: '🖼️' },
    { label: 'Flyers & Posters', key: 'Flyers & Posters', icon: '📄' },
    { label: 'Logos & Branding', key: 'Logos & Branding', icon: '🎨' },
    { label: 'Banners & Signage', key: 'Banners & Signage', icon: '🚩' },
    { label: 'Business Cards', key: 'Business Cards', icon: '📇' },
    { label: 'Custom Artwork', key: 'Custom Artwork', icon: '✏️' },
  ];

  const filteredServices = customProperties.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const titleMatch = item.title?.toLowerCase().includes(query);
    const descMatch = item.description?.toLowerCase().includes(query);
    const categoryMatch = item.category?.toLowerCase().includes(query);

    return matchesCategory && (titleMatch || descMatch || categoryMatch);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 min-h-screen font-sans bg-black text-neutral-100">
      
      {/* HEADER BANNER */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-8 md:p-12 mb-8 text-white shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="relative z-10 max-w-2xl">
          <span className="text-[10px] font-black tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Design Marketplace
          </span>
          <h1 className="text-3xl md:text-5xl font-black mt-3 tracking-tight text-white">
            Order Services & Projects
          </h1>
          <p className="text-xs md:text-sm text-neutral-400 mt-2 font-medium">
            Select items to add to your cart, submit your order, and chat with us once approved.
          </p>
        </div>
      </div>

      {/* QUICK CATEGORY PILLS */}
      <div className="mb-8 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-3 min-w-max">
          {QUICK_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-neutral-100 text-neutral-950 shadow-lg shadow-white/5 scale-105'
                    : 'bg-neutral-900/80 text-neutral-400 border border-neutral-800 hover:bg-neutral-800 hover:text-white'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* LISTINGS GRID */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-20 bg-neutral-900/40 rounded-3xl border border-dashed border-neutral-800 mb-12">
          <p className="text-neutral-500 text-xs font-bold">
            No items available under this category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredServices.map((service, index) => {
            const isInCart = cartItems.some((c) => c.id === service.id);
            const isFav = favoriteItems.some((f) => f.id === service.id);
            const itemUid = service.uid || `OMG-${index + 1000}`;

            return (
              <div 
                key={service.id || index} 
                className="bg-neutral-900/80 border border-neutral-800/80 rounded-3xl overflow-hidden shadow-xl hover:border-neutral-700 transition-all flex flex-col justify-between group"
              >
                
                {/* Image Section */}
                <div className="relative overflow-hidden bg-neutral-950 h-60">
                  <img 
                    src={service.image || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80'} 
                    alt={service.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <span className="absolute top-4 left-4 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-emerald-400 border border-emerald-500/20">
                    {service.category || 'Service'}
                  </span>

                  {user && (
                    <button 
                      onClick={() => onToggleFavorite(service)}
                      className="absolute top-4 right-4 bg-black/60 backdrop-blur-md p-2.5 rounded-full border border-white/10 shadow-md text-neutral-400 hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill={isFav ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 ${isFav ? 'text-rose-500' : ''}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                      </svg>
                    </button>
                  )}

                  <span className="absolute bottom-3 left-4 text-[9px] font-mono font-extrabold px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-neutral-300 border border-white/10">
                    UID: {itemUid}
                  </span>
                </div>

                {/* Info Section */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-white text-base tracking-tight">{service.title}</h3>
                    {service.description && (
                      <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{service.description}</p>
                    )}
                    <div className="mt-4 pt-4 border-t border-neutral-800/80 flex justify-between items-center">
                      <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Starting Price</span>
                      <p className="text-lg font-black text-white">₦{Number(service.basePrice || 0).toLocaleString()}</p>
                    </div>
                  </div>

                  {/* CART ACTIONS */}
                  <div className="mt-6">
                    {user ? (
                      isInCart ? (
                        <div className="space-y-2">
                          <button
                            onClick={() => onRemoveFromCart(service.id)}
                            className="w-full bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold py-3 rounded-xl text-xs hover:bg-rose-500/20 transition-colors cursor-pointer"
                          >
                            Remove from Cart
                          </button>
                          <button
                            onClick={() => navigate('/cart')}
                            className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl text-xs hover:bg-emerald-500 transition-colors cursor-pointer shadow-lg shadow-emerald-900/20"
                          >
                            View Cart & Proceed
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onAddToCart(service)}
                          className="w-full bg-white text-black font-extrabold py-3.5 rounded-xl text-xs hover:bg-neutral-200 transition-all shadow-md uppercase tracking-wider cursor-pointer"
                        >
                          Add to Cart
                        </button>
                      )
                    ) : (
                      <Link
                        to="/signin"
                        className="block text-center text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 py-3.5 rounded-xl hover:bg-emerald-500/20 transition-colors"
                      >
                        Sign in to Order
                      </Link>
                    )}
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* MOBILE APP DOWNLOAD BANNER (PLACED AT THE BOTTOM BEFORE FOOTER) */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-neutral-900 to-neutral-900 border border-emerald-500/30 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl mt-12">
        <div className="space-y-1 text-center md:text-left">
          <span className="text-[10px] font-black tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Android App Available
          </span>
          <h3 className="text-lg md:text-xl font-black text-white mt-2">Get the OrderMyGraphics App</h3>
          <p className="text-xs text-neutral-400 max-w-xl">
            Download our official Android APK for a faster mobile experience, instant order updates, and direct chats.
          </p>
        </div>
        <a 
          href="/app.apk" 
          download
          className="bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black px-6 py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <span>📱</span> Download APK
        </a>
      </div>

    </div>
  );
};

export default Service;