import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import emailjs from '@emailjs/browser';
import { auth, db } from '../firebase';

// EmailJS Credentials
const EMAILJS_SERVICE_ID = 'service_rdvs0xw';
const EMAILJS_TEMPLATE_ID = 'template_5cypt0c';
const EMAILJS_PUBLIC_KEY = 'W1LUkxZrxjdgxkHOn';

const Signup = () => {
  // Input states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Flow & Verification states
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [userOtp, setUserOtp] = useState('');

  // Visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status states
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Initialize EmailJS on component mount
  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }, []);

  const formatPhoneNumber = (inputPhone) => {
    let rawDigits = inputPhone.replace(/\D/g, '');
    if (rawDigits.startsWith('234')) rawDigits = rawDigits.substring(3);
    if (rawDigits.startsWith('0')) rawDigits = rawDigits.substring(1);
    return `+234${rawDigits}`;
  };

  const formatAuthError = (errorMessage) => {
    if (errorMessage.includes('auth/email-already-in-use')) {
      return 'This email address is already registered.';
    }
    if (errorMessage.includes('auth/invalid-email')) {
      return 'Please enter a valid email address.';
    }
    if (errorMessage.includes('auth/weak-password')) {
      return 'Password should be at least 6 characters long.';
    }
    return errorMessage.replace('Firebase: ', '');
  };

  // STAGE 1: Generate OTP, save to Firestore, send to Email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const cleanEmail = email.toLowerCase().trim();

      // 1. Generate 6-digit random numeric code
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

      // 2. Calculate expiration time string for email template (e.g., "11:45 PM")
      const expirationDate = new Date(Date.now() + 15 * 60 * 1000);
      const formattedTime = expirationDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // 3. Store OTP temporarily in Firestore with 15-minute expiration
      await setDoc(doc(db, 'email_otps', cleanEmail), {
        code: generatedOtp,
        expiresAt: expirationDate.getTime(),
      });

      // 4. Send email using EmailJS
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: cleanEmail,
          to_name: fullName,
          otp_code: generatedOtp,
          time: formattedTime, // Passes value for {{time}} tag in template
        },
        EMAILJS_PUBLIC_KEY
      );

      setIsOtpSent(true);
      setSuccessMessage(`A 6-digit verification code has been sent to ${cleanEmail}.`);
    } catch (err) {
      console.error('EmailJS Error Details:', err);
      setError(err?.text || err?.message || 'Failed to send verification code. Check your connection or email.');
    } finally {
      setLoading(false);
    }
  };

  // STAGE 2: Verify typed OTP code and finalize user account creation
  const handleVerifyOtpAndSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (userOtp.length !== 6) {
      setError('Please enter the full 6-digit code.');
      return;
    }

    setLoading(true);

    try {
      const cleanEmail = email.toLowerCase().trim();
      const formattedPhone = formatPhoneNumber(phone);

      // 1. Fetch OTP record from Firestore
      const otpDocRef = doc(db, 'email_otps', cleanEmail);
      const otpSnap = await getDoc(otpDocRef);

      if (!otpSnap.exists()) {
        throw new Error('No verification code found. Please request a new code.');
      }

      const otpData = otpSnap.data();

      // 2. Validate expiration
      if (Date.now() > otpData.expiresAt) {
        await deleteDoc(otpDocRef);
        throw new Error('Verification code expired. Please go back and request a new code.');
      }

      // 3. Validate code match
      if (otpData.code !== userOtp.trim()) {
        throw new Error('Incorrect code. Check your email and try again.');
      }

      // 4. Code is correct: Clean up stored OTP record
      await deleteDoc(otpDocRef);

      // 5. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const user = userCredential.user;

      // 6. Save User Profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        fullName: fullName,
        email: cleanEmail,
        phone: formattedPhone,
        dob: dob,
        createdAt: new Date().toISOString(),
        role: cleanEmail === 'admin@ordermygraphics.com' ? 'seller' : 'buyer'
      });

      setSuccessMessage('Email verified successfully! Creating account...');

      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (err) {
      setError(formatAuthError(err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex font-sans bg-neutral-950 justify-center items-center p-4 py-12">
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 py-6 px-8 text-center">
          <h2 className="text-2xl font-black text-white tracking-tight">
            Create Your Account
          </h2>
          <p className="text-amber-100 text-xs mt-1">
            Join OrderMygraphics to order custom designs & prints
          </p>
        </div>

        {/* Form Body */}
        <div className="p-8">
          {error && (
            <div className="mb-5 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-xs font-medium">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl text-xs font-medium">
              {successMessage}
            </div>
          )}

          {!isOtpSent ? (
            /* STAGE 1 FORM: User Details Input */
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 focus:border-amber-500 outline-none text-white text-sm transition-colors"
                  placeholder="e.g. Abubakar Yellow"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 focus:border-amber-500 outline-none text-white text-sm transition-colors"
                  placeholder="yellow1@gmail.com"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                    Phone Number
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-neutral-400 text-sm font-semibold select-none">
                      +234
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-16 pr-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 focus:border-amber-500 outline-none text-white text-sm transition-colors"
                      placeholder="7072114533"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 focus:border-amber-500 outline-none text-white text-sm transition-colors text-neutral-300"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                    Password
                  </label>
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

                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-4 pr-11 py-3 rounded-xl bg-neutral-800 border border-neutral-700 focus:border-amber-500 outline-none text-white text-sm transition-colors"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors p-1"
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? (
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
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 rounded-xl transition-all duration-200 cursor-pointer shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 mt-4"
              >
                {loading ? 'Sending Code...' : 'Send Email Verification Code'}
              </button>
            </form>
          ) : (
            /* STAGE 2 FORM: 6-Digit OTP Entry Input */
            <form onSubmit={handleVerifyOtpAndSignup} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 text-center">
                  Enter 6-Digit Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={userOtp}
                  onChange={(e) => setUserOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 focus:border-amber-500 outline-none text-white text-2xl text-center font-mono tracking-widest transition-colors"
                  placeholder="123456"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 rounded-xl transition-all duration-200 cursor-pointer shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify Code & Create Account'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOtpSent(false);
                  setError('');
                  setSuccessMessage('');
                }}
                className="w-full text-xs text-neutral-400 hover:text-white transition-colors text-center block pt-2"
              >
                ← Edit Form Details or Change Email
              </button>
            </form>
          )}

          {/* Already have an account link */}
          <p className="text-center text-xs text-neutral-400 pt-5">
            Already have an account?{' '}
            <Link to="/signin" className="text-amber-500 font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Signup;