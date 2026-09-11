import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  KeyRound, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  AlertCircle, 
  Hospital,
  ArrowRight
} from 'lucide-react';
import { AppLanguage } from '../types';

interface PasswordGateProps {
  onUnlock: () => void;
  lang?: AppLanguage;
}

const REQUIRED_PASSWORD = 'demo123';

export const PasswordGate: React.FC<PasswordGateProps> = ({ onUnlock, lang = 'el' }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const isEl = lang === 'el';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === REQUIRED_PASSWORD) {
      try {
        localStorage.setItem('medifind_auth', 'true');
      } catch (err) {
        console.warn('Could not persist auth in localStorage:', err);
      }
      setError(false);
      onUnlock();
    } else {
      setError(true);
      setErrorMessage(
        isEl 
          ? 'Λανθασμένος κωδικός πρόσβασης. Παρακαλώ δοκιμάστε ξανά.' 
          : 'Incorrect password. Please try again.'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 px-4 py-8">
      {/* Ambient background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-900/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-900/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80">
        {/* Brand Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white shadow-xl shadow-red-900/40">
            <Hospital className="w-8 h-8" />
          </div>
        </div>

        {/* Title & Description */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-300">
            <Lock className="w-3 h-3 text-amber-400" />
            <span>{isEl ? 'Προστατευμένη Πρόσβαση' : 'Protected Access'}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            MediFind Greece
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xs mx-auto">
            {isEl 
              ? 'Εισάγετε τον κωδικό πρόσβασης για πρόσβαση στον χάρτη εφημεριών & πλοήγησης.' 
              : 'Enter the password to access emergency hospital rosters & live routing.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="site-password-input" 
              className="block text-xs font-semibold text-slate-300 mb-1.5"
            >
              {isEl ? 'Κωδικός Πρόσβασης' : 'Password'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                id="site-password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                autoFocus
                placeholder={isEl ? 'Εισάγετε κωδικό...' : 'Enter password...'}
                className={`w-full pl-9 pr-10 py-3 bg-slate-950/70 border ${
                  error ? 'border-red-500 focus:border-red-400 ring-1 ring-red-500/50' : 'border-slate-700 focus:border-red-500'
                } rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none transition shadow-inner`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-400 animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          <button
            id="password-submit-btn"
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-semibold text-sm shadow-lg shadow-red-900/30 flex items-center justify-center gap-2 transition"
          >
            <span>{isEl ? 'Είσοδος στην Εφαρμογή' : 'Unlock Application'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Persistence Notice */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              {isEl 
                ? 'Απομνημόνευση συσκευής: Δεν θα σας ζητηθεί ξανά.' 
                : 'Device remembered: You will not be asked again.'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
