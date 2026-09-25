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
    <div className="w-full max-w-md mx-auto px-3 py-2 h-[calc(100vh-60px)] flex flex-col justify-between font-sans bg-black text-neutral-100 overflow-hidden box-border">
      
      {/* TOP SECTION: HEADER & CATEGORIES (Matches exact width) */}
      <div className="w-full">
        {/* HEADER BANNER */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-2.5 mb-2 text-white shadow-md relative overflow-hidden backdrop-blur-md w-full">
          <div className="relative z-10">
            <span className="text-[7px] font-black tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              Design Marketplace
            </span>
            <h1 className="text-sm font-black mt-1 tracking-tight text-white truncate">
              Order Services & Projects
            </h1>
          </div>
        </div>

        {/* QUICK CATEGORY PILLS */}
        <div className="mb-2 overflow-x-auto pb-1 scrollbar-none w-full">
          <div className="flex items-center gap-1 min-w-max">
            {QUICK_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-neutral-100 text-neutral-950 shadow-sm'
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
      </div>

      {/* MIDDLE SECTION: 2-COLUMN SCROLLABLE GRID (Matches exact width) */}
      <div className="flex-1 overflow-y-auto my-1 scrollbar-none w-full">
        {filteredServices.length === 0 ? (
          <div className="text-center py-8 bg-neutral-900/40 rounded-lg border border-dashed border-neutral-800 w-full">
            <p className="text-neutral-500 text-[10px] font-bold">
              No items available under this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 w-full">
            {filteredServices.map((service, index) => {
              const isInCart = cartItems.some((c) => c.id === service.id);
              const isFav = favoriteItems.some((f) => f.id === service.id);
              const itemUid = service.uid || `OMG-${index + 1000}`;

              return (
                <div 
                  key={service.id || index} 
                  className="bg-neutral-900/80 border border-neutral-800/80 rounded-lg overflow-hidden shadow-sm hover:border-neutral-700 transition-all flex flex-col justify-between group text-[10px] min-w-0"
                >
                  
                  {/* Image Section */}
                  <div className="relative overflow-hidden bg-neutral-950 h-20">
                    <img 
                      src={service.image || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80'} 
                      alt={service.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <span className="absolute top-1 left-1 text-[6px] font-black uppercase tracking-widest px-1 py-0.5 rounded bg-black/70 backdrop-blur-md text-emerald-400 border border-emerald-500/20 truncate max-w-[70%]">
                      {service.category || 'Service'}
                    </span>

                    {user && (
                      <button 
                        onClick={() => onToggleFavorite(service)}
                        className="absolute top-1 right-1 bg-black/60 backdrop-blur-md p-1 rounded-full border border-white/10 text-neutral-400 hover:text-rose-500 cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill={isFav ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-2.5 h-2.5 ${isFav ? 'text-rose-500' : ''}`}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                      </button>
                    )}

                    <span className="absolute bottom-1 left-1 text-[6px] font-mono font-extrabold px-1 py-0.5 rounded bg-black/80 backdrop-blur-md text-neutral-300 border border-white/10">
                      {itemUid}
                    </span>
                  </div>

                  {/* Info Section */}
                  <div className="p-1.5 flex-1 flex flex-col justify-between min-w-0">
                    <div className="min-w-0">
                      <h3 className="font-bold text-white text-[10px] tracking-tight truncate">{service.title}</h3>
                      <div className="mt-1 pt-1 border-t border-neutral-800/80 flex justify-between items-center">
                        <span className="text-[7px] text-neutral-400 font-bold uppercase">Price</span>
                        <p className="text-[10px] font-black text-white truncate">₦{Number(service.basePrice || 0).toLocaleString()}</p>
                      </div>
                    </div>

                    {/* CART ACTIONS */}
                    <div className="mt-1.5">
                      {user ? (
                        isInCart ? (
                          <div className="space-y-0.5">
                            <button
                              onClick={() => onRemoveFromCart(service.id)}
                              className="w-full bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold py-0.5 rounded text-[8px] hover:bg-rose-500/20 cursor-pointer truncate"
                            >
                              Remove
                            </button>
                            <button
                              onClick={() => navigate('/cart')}
                              className="w-full bg-emerald-600 text-white font-bold py-0.5 rounded text-[8px] hover:bg-emerald-500 cursor-pointer truncate"
                            >
                              Cart
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => onAddToCart(service)}
                            className="w-full bg-white text-black font-extrabold py-1 rounded text-[8px] hover:bg-neutral-200 uppercase tracking-wider cursor-pointer truncate"
                          >
                            Add
                          </button>
                        )
                      ) : (
                        <Link
                          to="/signin"
                          className="block text-center text-[8px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 py-1 rounded hover:bg-emerald-500/20 truncate"
                        >
                          Sign In
                        </Link>
                      )}
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* BOTTOM SECTION: APP BANNER (Locked at bottom, matches exact width) */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-neutral-900 to-neutral-900 border border-emerald-500/30 rounded-lg p-2.5 flex items-center justify-between gap-2 shadow-md shrink-0 w-full">
        <div className="min-w-0">
          <span className="text-[7px] font-black tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
            Android App
          </span>
          <h3 className="text-[10px] font-black text-white mt-0.5 truncate">Get OrderMyGraphics App</h3>
        </div>
        <a 
          href="/app.apk" 
          download
          className="bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black px-2.5 py-1.5 rounded text-[8px] uppercase tracking-wider transition-all shadow-sm flex items-center gap-1 shrink-0 cursor-pointer"
        >
          <span>📱</span> APK
        </a>
      </div>

    </div>
  );
};

export default Service;