import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-neutral-950 border-t border-neutral-800 text-neutral-400 text-sm mt-auto relative z-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        {/* TOP INTERFACE: BRAND & LINKS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Column 1: Identity */}
          <div className="space-y-3">
            <Link to="/" className="text-xl font-black tracking-tight text-white block">
              OrderMygraphics<span className="text-amber-500">.</span>
            </Link>
            <p className="text-xs text-neutral-500 leading-relaxed font-light">
              Providing premium Graphic design, Print, and Brand identity solutions at your maximum comfort.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-200 mb-3">Company</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-amber-400 transition-colors">Home</Link></li>
              <li><Link to="/services" className="hover:text-amber-400 transition-colors">Services</Link></li>
              <li><Link to="/about" className="hover:text-amber-400 transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Column 3: Legals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-200 mb-3">Legals</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-amber-400 transition-colors">Terms of Service</a></li>
              <li><a href="#security" className="hover:text-amber-400 transition-colors">Security & Guarantees</a></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-200 mb-3">Contact</h4>
            <p className="text-xs text-neutral-500 leading-relaxed font-light mb-2">
              Have questions about your design project? Reach out directly.
            </p>
            <span className="text-xs font-semibold text-amber-500 block">
           sultanoyebamiji1@gmail.com
            </span>
          </div>

        </div>

        {/* BOTTOM METRIC: COPYRIGHT & SOCIALS */}
        <div className="border-t border-neutral-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>&copy; {currentYear} OrderMygraphics Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="cursor-pointer hover:text-amber-400 transition-colors">Twitter</span>
            <span className="cursor-pointer hover:text-amber-400 transition-colors">LinkedIn</span>
            <span className="cursor-pointer hover:text-amber-400 transition-colors">Instagram</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;