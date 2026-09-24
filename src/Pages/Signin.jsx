import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';

const Signin = () => {
  const [identifier, setIdentifier] = useState(''); // Holds either email or phone number
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const cleanIdentifier = identifier.trim();
      let targetEmail = cleanIdentifier;

      // Check if identifier is NOT an email (contains @). If it's a phone number, look up the email in Firestore
      if (!cleanIdentifier.includes('@')) {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('phoneNumber', '==', cleanIdentifier));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          throw new Error('No account found with this phone number.');
        }

        const userDoc = querySnapshot.docs[0].data();
        if (!userDoc.email) {
          throw new Error('Account email configuration missing. Contact support.');
        }

        targetEmail = userDoc.email;
      }

      // Authenticate with Firebase Auth
      await signInWithEmailAndPassword(auth, targetEmail, password);

      // Navigate to Home
      navigate('/');
    } catch (err) {
      if (
        err.message.includes('auth/invalid-credential') || 
        err.message.includes('auth/wrong-password') ||
        err.message.includes('auth/user-not-found')
      ) {
        setError('Invalid login details or password.');
      } else {
        setError(err.message.replace('Firebase: ', ''));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex font-sans bg-neutral-950 justify-center items-center p-4">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 py-6 px-8 text-center">
          <h2 className="text-2xl font-black text-white tracking-tight">
            Welcome Back
          </h2>
          <p className="text-amber-100 text-xs mt-1">
            Sign in with your email or phone number and password
          </p>
        </div>

        <form onSubmit={handleSignin} className="p-8 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-xs font-medium">
              {error}
            </div>
          )}

          {/* Email or Phone Number Input */}
          <div>
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
              Email or Phone Number
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 focus:border-amber-500 outline-none text-white text-sm transition-colors"
              placeholder="name@example.com or +1234567890"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-amber-500 font-bold hover:underline">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-4 pr-11 py-3 rounded-xl bg-neutral-800 border border-neutral-700 focus:border-amber-500 outline-none text-white text-sm transition-colors"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors p-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.033 10.033 0 013.682-.763c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m-1.748 1.748l-14.14-14.14" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 rounded-xl transition-all duration-200 cursor-pointer shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 mt-4"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <p className="text-center text-xs text-neutral-400 pt-2">
            Don't have an account?{' '}
            <Link to="/signup" className="text-amber-500 font-bold hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signin;