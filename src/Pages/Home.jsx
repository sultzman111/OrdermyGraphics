import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = ({ user, listings = [] }) => {
  const navigate = useNavigate();

  const defaultCategoryShowcase = [
    {
      id: 'def-1',
      title: 'Minimalist Photo Frame Mockup',
      price: 25000,
      image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80', // Minimalist picture frame mockup
      category: 'Frames'
    },
    {
      id: 'def-2',
      title: 'Modern Brand Identity Suite',
      price: 85000,
      image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80', // Branding stationery identity suite
      category: 'Logos & Branding'
    },
    {
      id: 'def-3',
      title: 'Creative Event Poster Design',
      price: 30000,
      image: 'https://images.unsplash.com/photo-1572044162444-ad60f1284dea?auto=format&fit=crop&w=800&q=80', // Creative poster design on wall
      category: 'Flyers & Posters'
    },
    {
      id: 'def-4',
      title: 'Full-Stack React Landing Page',
      price: 150000,
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80', // Web design & UI layout workspace
      category: 'Web Design'
    },
    {
      id: 'def-5',
      title: 'Product Packaging Mockup Set',
      price: 55000,
      image: 'https://images.unsplash.com/photo-1589365252845-d84c0499e8d2?auto=format&fit=crop&w=800&q=80', // Product packaging box mockup
      category: 'Project'
    },
    {
      id: 'def-6',
      title: 'Outdoor Vinyl Billboard Banner',
      price: 45000,
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80', // Outdoor billboard and signage banner
      category: 'Banners & Signage'
    },
    {
      id: 'def-7',
      title: 'Luxury Gold Foil Business Card',
      price: 18000,
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80', // Luxury business card mockup
      category: 'Business Cards'
    },
    {
      id: 'def-8',
      title: 'Custom Digital Canvas Artwork',
      price: 35000,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXTX9RTEe4LGfezlN4ypdCFrD833zNZ7SYWY9CmG_TRA&s=10', // Custom digital art canvas painting
      category: 'Custom Artwork'
    }
  ];

  const categoryShowcase = useMemo(() => {
    if (!listings || listings.length === 0) {
      return defaultCategoryShowcase;
    }

    const uniqueCategoriesMap = new Map();

    listings.forEach((item) => {
      const catKey = item.category ? item.category.trim() : 'Uncategorized';
      if (!uniqueCategoriesMap.has(catKey)) {
        uniqueCategoriesMap.set(catKey, item);
      }
    });

    const categorySelectedListings = Array.from(uniqueCategoriesMap.values());

    if (categorySelectedListings.length < 3) {
      defaultCategoryShowcase.forEach((defaultItem) => {
        if (!uniqueCategoriesMap.has(defaultItem.category)) {
          categorySelectedListings.push(defaultItem);
        }
      });
    }

    return categorySelectedListings;
  }, [listings]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex >= categoryShowcase.length) {
      setCurrentIndex(0);
    }
  }, [categoryShowcase.length, currentIndex]);

  useEffect(() => {
    if (categoryShowcase.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % categoryShowcase.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [categoryShowcase.length]);

  const currentItem = categoryShowcase[currentIndex] || defaultCategoryShowcase[0];
  const displayedGraphics = listings.slice(0, 6);

  const formatPrice = (val) => {
    if (!val) return '0';
    if (typeof val === 'string' && val.includes('₦')) return val.replace('₦', '');
    const num = Number(val);
    return isNaN(num) ? val : num.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-black font-sans text-neutral-100 overflow-x-hidden w-full">
      
      {/* 1. HERO SECTION WITH AUTOMATED CATEGORY CAROUSEL */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-600 via-orange-600 to-amber-800 py-12 sm:py-16 lg:py-28 text-white">
        
        <div className="absolute top-1/4 -left-20 w-72 h-72 sm:w-96 sm:h-96 bg-amber-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 sm:w-80 sm:h-80 bg-orange-900/40 rounded-full blur-3xl animate-bounce duration-1000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-md border border-amber-300/30 text-amber-200 px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              GET GRAPHICS AT THE EASIEST BRANCH
            </div>

            <h1 className="text-3xl sm:text-6xl font-black tracking-tight leading-tight">
              Get your latest <span className="text-black underline decoration-amber-300 underline-offset-8">Graphics job</span> here with us.
            </h1>

            <p className="text-amber-100 text-sm sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
              Discover flashy, affordable graphic designs. We provide premium Logo Design, Print Materials, and Complete Brand Identities delivered with speed.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              {!user ? (
                <Link 
                  to="/signin" 
                  className="bg-black hover:bg-neutral-900 text-white font-bold px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl shadow-2xl transition-all hover:-translate-y-1 active:scale-95 text-center text-xs sm:text-base"
                >
                  Get Started
                </Link>
              ) : (
                <Link 
                  to="/services" 
                  className="bg-black hover:bg-neutral-900 text-white font-bold px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl shadow-2xl transition-all hover:-translate-y-1 active:scale-95 text-center text-xs sm:text-base"
                >
                  Explore Design Shop
                </Link>
              )}

              <a 
                href="#offers" 
                className="bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/30 px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl transition-all backdrop-blur-md text-center hover:-translate-y-1 text-xs sm:text-base"
              >
                Explore Offers
              </a>

              <a 
                href="/app.apk"
                download
                className="bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold px-6 py-3.5 sm:px-6 sm:py-4 rounded-xl shadow-2xl transition-all hover:-translate-y-1 active:scale-95 text-center flex items-center justify-center gap-2 text-xs sm:text-base"
              >
                <span>📱</span> Download App (APK)
              </a>
            </div>

            <p className="text-[11px] sm:text-xs text-amber-200/80 pt-1">
              Over 20+ design categories ready for instant delivery.
            </p>
          </div>

          {/* Right Showcase Display */}
          <div className="relative group w-full max-w-md mx-auto lg:max-w-none">
            <div className="relative z-10 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-neutral-900 transition-all duration-500 transform group-hover:rotate-1">
              <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
                <img 
                  key={currentItem.id || currentItem.image}
                  src={currentItem.image || currentItem.imageUrl || 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80'} 
                  alt={currentItem.title} 
                  className="w-full h-full object-cover transition-all duration-700 ease-in-out transform scale-100 animate-fadeIn"
                />
                
                <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-orange-500 text-white font-extrabold text-[10px] sm:text-xs px-3 py-1 rounded-full shadow-lg uppercase tracking-wider">
                  📂 {currentItem.category || 'Category Showcase'}
                </span>

                <span className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-black/70 text-amber-300 font-bold text-[10px] sm:text-xs px-3 py-1 rounded-md backdrop-blur-md border border-white/10">
                  {currentIndex + 1} / {categoryShowcase.length} Categories
                </span>
              </div>

              <div className="p-4 sm:p-6 bg-neutral-900 flex justify-between items-center border-t border-neutral-800">
                <div className="max-w-[70%]">
                  <h3 className="font-bold text-white text-sm sm:text-lg truncate">{currentItem.title}</h3>
                  <p className="text-[10px] sm:text-[11px] text-neutral-400">Featured item from <strong className="text-orange-400">{currentItem.category}</strong></p>
                </div>
                <span className="text-lg sm:text-2xl font-black text-orange-400 whitespace-nowrap">
                  ₦{formatPrice(currentItem.price || currentItem.basePrice)}
                </span>
              </div>
            </div>

            <div className="flex justify-center gap-1.5 mt-3 sm:mt-4">
              {categoryShowcase.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentIndex === idx ? 'w-8 bg-black' : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to category slide ${idx + 1}`}
                />
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* 2. LIVE GRAPHICS LISTINGS SECTION */}
      <section id="offers" className="py-12 sm:py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <span className="text-orange-500 text-[11px] sm:text-xs font-bold uppercase tracking-wider">Live Storefront</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">Featured Graphics & Works</h2>
          </div>
          <Link 
            to="/services" 
            className="text-xs sm:text-sm font-bold text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1"
          >
            View All Services &rarr;
          </Link>
        </div>

        {displayedGraphics.length === 0 ? (
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-8 sm:p-12 text-center text-neutral-400">
            <p className="text-base sm:text-lg font-medium">No graphics published yet!</p>
            <p className="text-xs sm:text-sm mt-1 text-neutral-500">When you post new works from your account, they will automatically appear here in real time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayedGraphics.map((item) => (
              <div key={item.id} className="bg-neutral-900/80 border border-neutral-800 rounded-2xl overflow-hidden hover:border-orange-500/50 transition-all duration-300 group flex flex-col justify-between hover:-translate-y-1 shadow-xl">
                <div>
                  <div className="h-48 sm:h-56 overflow-hidden relative">
                    <img 
                      src={item.image || item.imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80'} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-orange-500 text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                      {item.category || 'Design'}
                    </span>
                  </div>

                  <div className="p-4 sm:p-6">
                    <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-orange-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-neutral-400 text-xs mt-2 line-clamp-2">
                      {item.description || 'Custom crafted graphic design ready for branding and print usage.'}
                    </p>
                  </div>
                </div>

                <div className="p-4 sm:p-6 pt-0">
                  <div className="flex justify-between items-center pt-4 border-t border-neutral-800 gap-2">
                    <span className="text-xl sm:text-2xl font-black text-orange-450 text-orange-400 whitespace-nowrap">
                      ₦{formatPrice(item.price || item.basePrice)}
                    </span>

                    {!user ? (
                      <button 
                        onClick={() => navigate('/signin')}
                        className="bg-neutral-800 hover:bg-neutral-700 text-orange-400 text-[11px] sm:text-xs font-bold px-3 sm:px-4 py-2 rounded-lg transition-colors border border-orange-500/30 cursor-pointer whitespace-nowrap"
                      >
                        Sign in to Order
                      </button>
                    ) : (
                      <Link 
                        to="/services" 
                        className="bg-orange-500 hover:bg-orange-600 text-white text-[11px] sm:text-xs font-bold px-3.5 sm:px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap"
                      >
                        View Graphic
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. ABOUT US SECTION */}
      <section className="bg-neutral-900 border-t border-neutral-800 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          <div className="grid grid-cols-2 gap-4">
            <img src="/ChatGPT.png" alt="ChatGPT Logo" className="w-full object-contain" />
            <img 
              src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80" 
              alt="Digital Branding and Code Screen Studio" 
              className="rounded-2xl h-48 sm:h-64 w-full object-cover shadow-lg border border-neutral-800 mt-0 sm:mt-8 hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="space-y-4 sm:space-y-6">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-md inline-block">
              Our Story
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              Redefining graphic production & brand design.
            </h2>
            <p className="text-neutral-400 text-xs sm:text-base leading-relaxed">
              OrderMygraphics connects clients directly with tailored visual solutions. From quick promotional flyers to complete corporate identity kits, order directly online and track design status seamlessly.
            </p>
            <div className="pt-2">
              <Link 
                to="/about" 
                className="inline-flex items-center gap-2 text-orange-400 font-bold hover:text-orange-300 transition-colors group text-xs sm:text-sm"
              >
                Learn More About Us 
                <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;