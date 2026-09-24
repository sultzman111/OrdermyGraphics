import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Nav = ({ user, onLogout, cartCount, favoriteCount, unreadCount = 0 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isAdminSeller = user?.email?.toLowerCase() === 'sultanoyebamiji1@gmail.com' || user?.role === 'admin';

  const getFullName = () => {
    if (!user) return '';
    if (user.firstName || user.lastName) {
      return `${user.firstName || ''} ${user.lastName || ''}`.trim();
    }
    return user.displayName || user.fullName || user.Name || 'User';
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getUserInitials = () => {
    if (!user) return 'U';
    const name = user.displayName || user.fullName || user.firstName || user.Name || user.email || '';
    return name.charAt(0).toUpperCase() || 'U';
  };

  const handleSignOut = (e) => {
    e.preventDefault();
    setShowDropdown(false);
    setIsMobileMenuOpen(false);
    onLogout();
    navigate('/signin');
  };

  const handleMobileNav = (path) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <nav className="bg-white border-b border-neutral-200/80 sticky top-0 z-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between h-20 items-center">

          {/* BRAND LOGO */}
          <div className="flex-shrink-0">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2.5 text-lg sm:text-xl font-black tracking-tight text-amber-600">
              <img src="/ChatGPT.png" alt="OrderMygraphics Logo" className="w-8 h-8 object-contain" />
              OrderMygraphics
            </Link>
          </div>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden md:flex items-center space-x-8">
            {!user ? (
              <div className="flex items-center space-x-8">
                <Link to="/" className="text-sm font-bold text-neutral-600 hover:text-red-700 transition-colors">Home</Link>
                <Link to="/services" className="text-sm font-bold text-neutral-600 hover:text-red-700 transition-colors">Services</Link>
                <Link to="/about" className="text-sm font-bold text-neutral-600 hover:text-red-700 transition-colors">About Us</Link>
              </div>
            ) : (
              <div className="flex items-center space-x-7 text-neutral-600">
                <button 
                  type="button"
                  onClick={() => navigate('/')}
                  className="flex flex-col items-center gap-1 text-[11px] font-bold hover:text-emerald-700 transition-colors cursor-pointer group"
                >
                  <svg className="w-5 h-5 text-neutral-400 group-hover:text-emerald-600 transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Home
                </button>

                {isAdminSeller ? (
                  <>
                    <button 
                      type="button"
                      onClick={() => navigate('/services')}
                      className="flex flex-col items-center gap-1 text-[11px] font-bold hover:text-red-700 transition-colors cursor-pointer group"
                    >
                      <svg className="w-5 h-5 text-neutral-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      Services
                    </button>

                    <button 
                      type="button"
                      onClick={() => navigate('/admin-orders')}
                      className="flex flex-col items-center gap-1 text-[11px] font-bold hover:text-red-700 transition-colors cursor-pointer group"
                    >
                      <svg className="w-5 h-5 text-neutral-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                      Manage Orders
                    </button>

                    <button 
                      type="button"
                      onClick={() => navigate('/AddProperty')}
                      className="flex flex-col items-center gap-1 text-[11px] font-bold hover:text-red-700 transition-colors cursor-pointer group"
                    >
                      <svg className="w-5 h-5 text-neutral-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      Add Property
                    </button>

                    <button 
                      type="button"
                      onClick={() => navigate('/admin-chat')}
                      className="flex flex-col items-center gap-1 text-[11px] font-bold hover:text-amber-600 transition-colors cursor-pointer group relative"
                    >
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-2 flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 text-white text-[9px] font-black items-center justify-center shadow-sm">
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </span>
                        </span>
                      )}
                      <svg className="w-5 h-5 text-neutral-400 group-hover:text-amber-600 transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Seller Chat
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      type="button"
                      onClick={() => navigate('/services')}
                      className="flex flex-col items-center gap-1 text-[11px] font-bold hover:text-red-700 transition-colors cursor-pointer group"
                    >
                      <svg className="w-5 h-5 text-neutral-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      Services
                    </button>

                    <button 
                      type="button"
                      onClick={() => navigate('/about')}
                      className="flex flex-col items-center gap-1 text-[11px] font-bold hover:text-red-700 transition-colors cursor-pointer group"
                    >
                      <svg className="w-5 h-5 text-neutral-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      About Us
                    </button>

                    <button 
                      type="button"
                      onClick={() => navigate('/chat')}
                      className="flex flex-col items-center gap-1 text-[11px] font-bold hover:text-amber-600 transition-colors cursor-pointer group relative"
                    >
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-2 flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 text-white text-[9px] font-black items-center justify-center shadow-sm">
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </span>
                        </span>
                      )}
                      <svg className="w-5 h-5 text-neutral-400 group-hover:text-amber-600 transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Chat Seller
                    </button>

                    <button 
                      type="button"
                      onClick={() => navigate('/favorites')}
                      className="flex flex-col items-center gap-1 text-[11px] font-bold hover:text-red-700 transition-colors cursor-pointer group relative"
                    >
                      {favoriteCount > 0 && (
                        <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                          {favoriteCount}
                        </span>
                      )}
                      <svg className="w-5 h-5 text-neutral-400 group-hover:text-rose-500 transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      Favorites
                    </button>

                    <button 
                      type="button"
                      onClick={() => navigate('/cart')}
                      className="flex flex-col items-center gap-1 text-[11px] font-bold hover:text-red-700 transition-colors cursor-pointer group relative"
                    >
                      {cartCount > 0 && (
                        <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                          {cartCount}
                        </span>
                      )}
                      <svg className="w-5 h-5 text-neutral-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Cart
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* PROFILE & USER DROPDOWN */}
          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <div className="flex items-center gap-2 sm:gap-4 relative" ref={dropdownRef}>
                <button 
                  type="button"
                  onClick={() => navigate('/payment')}
                  className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-red-50 hover:border-red-200 text-xs font-bold text-neutral-600 hover:text-red-700 transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  <span>History</span>
                </button>

                <span className="hidden lg:inline text-xs font-semibold text-neutral-500">
                  Welcome, <strong className="text-neutral-900 font-extrabold">{getFullName()}</strong> 👋
                </span>

                <button 
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setShowDropdown(!showDropdown);
                  }}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neutral-900 text-white font-black text-sm flex items-center justify-center border border-neutral-200 shadow-sm hover:bg-red-700 transition-all cursor-pointer focus:outline-none"
                >
                  {getUserInitials()}
                </button>

                {showDropdown && (
                  <div className="absolute right-0 top-12 sm:top-14 w-56 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-neutral-100 py-3 z-50">
                    <div className="px-4 py-2 border-b border-neutral-100">
                      <p className="text-[9px] text-neutral-400 font-extrabold uppercase tracking-wider">
                        {isAdminSeller ? 'Seller Profile' : 'Buyer Profile'}
                      </p>
                      <p className="text-xs font-bold text-neutral-800 truncate mt-0.5">
                        {getFullName()}
                      </p>
                      <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                        {user.email || user.identifier || 'Logged In'}
                      </p>
                    </div>

                    {isAdminSeller && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowDropdown(false);
                          navigate('/admin-orders');
                        }}
                        className="w-full text-left block px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 font-bold transition-colors cursor-pointer"
                      >
                        Manage Orders
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full text-left block px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50/60 font-bold transition-colors cursor-pointer mt-1"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-bold">
                <Link to="/signin" className="text-neutral-600 hover:text-red-700 px-2.5 py-2 rounded-lg transition-colors whitespace-nowrap">
                  Sign In
                </Link>
                <Link to="/signup" className="bg-neutral-900 hover:bg-red-700 text-white px-3.5 py-2 rounded-xl shadow-sm transition-all whitespace-nowrap">
                  Sign Up
                </Link>
              </div>
            )}

            {/* MOBILE HAMBURGER TOGGLE */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50 active:scale-95 transition-all relative"
            >
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              )}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE SIDEBAR DRAWER */}
      <div className={`fixed inset-0 z-50 transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div 
          className={`absolute inset-0 bg-neutral-900/40 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        <div className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          
          <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-base font-black text-amber-600">
              <img src="/ChatGPT.png" alt="OrderMygraphics Logo" className="w-7 h-7 object-contain" />
              OrderMygraphics
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {user && (
              <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/80 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-900 text-white font-black text-sm flex items-center justify-center shrink-0">
                  {getUserInitials()}
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-neutral-900 truncate">
                    Welcome, {getFullName()} 👋
                  </p>
                  <p className="text-[10px] text-neutral-400 truncate">{user.email || 'Logged In'}</p>
                </div>
              </div>
            )}

            <div className="flex flex-col space-y-1 pt-2">
              <button 
                type="button"
                onClick={() => handleMobileNav('/')}
                className="w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold text-neutral-700 hover:bg-neutral-50 hover:text-red-700 transition-all flex items-center gap-3"
              >
                <span>🏠</span> Home
              </button>

              <button 
                type="button"
                onClick={() => handleMobileNav('/services')}
                className="w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold text-neutral-700 hover:bg-neutral-50 hover:text-red-700 transition-all flex items-center gap-3"
              >
                <span>📦</span> Services
              </button>

              {isAdminSeller ? (
                <>
                  <button 
                    type="button"
                    onClick={() => handleMobileNav('/admin-orders')}
                    className="w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold text-neutral-700 hover:bg-neutral-50 hover:text-red-700 transition-all flex items-center gap-3"
                  >
                    <span>📋</span> Manage Orders
                  </button>

                  <button 
                    type="button"
                    onClick={() => handleMobileNav('/AddProperty')}
                    className="w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold text-neutral-700 hover:bg-neutral-50 hover:text-red-700 transition-all flex items-center gap-3"
                  >
                    <span>➕</span> Add Property
                  </button>

                  <button 
                    type="button"
                    onClick={() => handleMobileNav('/admin-chat')}
                    className="w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold text-neutral-700 hover:bg-neutral-50 hover:text-amber-600 transition-all flex items-center justify-between"
                  >
                    <span className="flex items-center gap-3">💬 Seller Chat</span>
                    {unreadCount > 0 && (
                      <span className="bg-emerald-500 text-white text-[11px] px-2 py-0.5 rounded-full font-black">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <button 
                    type="button"
                    onClick={() => handleMobileNav('/about')}
                    className="w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold text-neutral-700 hover:bg-neutral-50 hover:text-red-700 transition-all flex items-center gap-3"
                  >
                    <span>ℹ️</span> About Us
                  </button>

                  <button 
                    type="button"
                    onClick={() => handleMobileNav('/chat')}
                    className="w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold text-neutral-700 hover:bg-neutral-50 hover:text-amber-600 transition-all flex items-center justify-between"
                  >
                    <span className="flex items-center gap-3">💬 Chat Seller</span>
                    {unreadCount > 0 && (
                      <span className="bg-emerald-500 text-white text-[11px] px-2 py-0.5 rounded-full font-black">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  <button 
                    type="button"
                    onClick={() => handleMobileNav('/favorites')}
                    className="w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold text-neutral-700 hover:bg-neutral-50 hover:text-rose-500 transition-all flex items-center justify-between"
                  >
                    <span className="flex items-center gap-3">❤️ Favorites</span>
                    {favoriteCount > 0 && (
                      <span className="bg-rose-500 text-white text-[11px] px-2 py-0.5 rounded-full font-black">
                        {favoriteCount}
                      </span>
                    )}
                  </button>

                  <button 
                    type="button"
                    onClick={() => handleMobileNav('/cart')}
                    className="w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold text-neutral-700 hover:bg-neutral-50 hover:text-red-600 transition-all flex items-center justify-between"
                  >
                    <span className="flex items-center gap-3">🛒 Cart</span>
                    {cartCount > 0 && (
                      <span className="bg-red-600 text-white text-[11px] px-2 py-0.5 rounded-full font-black">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="p-5 border-t border-neutral-100">
            {user && (
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold py-3 rounded-xl transition-colors"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;