import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('A password reset link has been sent to your email address. Please check your inbox or spam folder.');
    } catch (err) {
      if (err.message.includes('auth/user-not-found')) {
        setError('No account found with this email address.');
      } else if (err.message.includes('auth/invalid-email')) {
        setError('Please enter a valid email address.');
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
            Reset Your Password
          </h2>
          <p className="text-amber-100 text-xs mt-1">
            Enter your email to receive a password reset link
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleResetPassword} className="p-8 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-xs font-medium">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl text-xs font-medium">
              {message}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 focus:border-amber-500 outline-none text-white text-sm transition-colors"
              placeholder="Enter your registered email"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 rounded-xl transition-all duration-200 cursor-pointer shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 mt-2"
          >
            {loading ? 'Sending Link...' : 'Send Reset Link'}
          </button>

          <div className="text-center text-xs text-neutral-400 pt-2 space-y-2">
            <p>
              Remembered your password?{' '}
              <Link to="/signin" className="text-amber-500 font-bold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;