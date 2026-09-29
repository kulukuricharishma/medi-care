import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { X, User, Stethoscope, Store, Lock, Mail, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
  defaultRole?: UserRole;
  onSuccessfulLogin: (role: UserRole) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
  defaultRole = 'patient',
  onSuccessfulLogin,
}) => {
  const { loginAsRole, showToast } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [isForgotView, setIsForgotView] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsRole(role);
    showToast(`Signed in successfully as ${role}`, 'success');
    onSuccessfulLogin(role);
    onClose();
  };

  const handleQuickDemo = (demoRole: UserRole) => {
    loginAsRole(demoRole);
    onSuccessfulLogin(demoRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden relative">
        {/* Header close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 p-6 text-white text-center">
          <h2 className="text-xl font-bold">
            {isForgotView
              ? 'Reset Password'
              : mode === 'login'
              ? 'Welcome to MediBridge AI'
              : 'Create your MediBridge Account'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {isForgotView
              ? 'Enter your registered email or phone'
              : 'Unified healthcare ecosystem for patients, doctors & pharmacies'}
          </p>
        </div>

        <div className="p-6">
          {/* Quick Demo Sign-in Banner */}
          {!isForgotView && (
            <div className="mb-5 p-3 rounded-xl bg-cyan-50/70 border border-cyan-200">
              <p className="text-[11px] font-bold text-cyan-900 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" />
                1-Click Quick Demo Access
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('patient')}
                  className="px-2 py-1.5 rounded-lg bg-white border border-cyan-200 text-blue-700 text-xs font-semibold hover:bg-blue-50 transition-colors flex flex-col items-center gap-1 shadow-xs"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Patient</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('doctor')}
                  className="px-2 py-1.5 rounded-lg bg-white border border-cyan-200 text-emerald-700 text-xs font-semibold hover:bg-emerald-50 transition-colors flex flex-col items-center gap-1 shadow-xs"
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Doctor</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('store')}
                  className="px-2 py-1.5 rounded-lg bg-white border border-cyan-200 text-amber-700 text-xs font-semibold hover:bg-amber-50 transition-colors flex flex-col items-center gap-1 shadow-xs"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Store</span>
                </button>
              </div>
            </div>
          )}

          {isForgotView ? (
            <div className="space-y-4">
              {forgotSent ? (
                <div className="text-center py-4 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Reset Link Dispatched</h4>
                  <p className="text-xs text-slate-600">
                    If an account matches {identifier || 'your account'}, we sent instructions to reset your password.
                  </p>
                  <button
                    onClick={() => {
                      setIsForgotView(false);
                      setForgotSent(false);
                    }}
                    className="w-full py-2.5 rounded-xl bg-cyan-600 text-white text-xs font-semibold hover:bg-cyan-700"
                  >
                    Return to Login
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    setForgotSent(true);
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Email or Phone
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. user@example.com or +91 98765 43210"
                      value={identifier}
                      onChange={e => setIdentifier(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-cyan-600 text-white text-xs font-semibold rounded-xl hover:bg-cyan-700"
                  >
                    Send Reset Instructions
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsForgotView(false)}
                    className="w-full text-center text-xs text-slate-500 hover:text-slate-800"
                  >
                    Back to Login
                  </button>
                </form>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Your Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('patient')}
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      role === 'patient'
                        ? 'border-blue-600 bg-blue-50/60 text-blue-800 ring-2 ring-blue-500/20 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <User className={`w-4 h-4 ${role === 'patient' ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className="text-[11px]">Patient</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('doctor')}
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      role === 'doctor'
                        ? 'border-emerald-600 bg-emerald-50/60 text-emerald-800 ring-2 ring-emerald-500/20 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Stethoscope className={`w-4 h-4 ${role === 'doctor' ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className="text-[11px]">Doctor</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('store')}
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      role === 'store'
                        ? 'border-amber-600 bg-amber-50/60 text-amber-800 ring-2 ring-amber-500/20 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Store className={`w-4 h-4 ${role === 'store' ? 'text-amber-600' : 'text-slate-400'}`} />
                    <span className="text-[11px]">Medical Store</span>
                  </button>
                </div>
              </div>

              {/* Name for register */}
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {role === 'store' ? 'Store / Pharmacy Name' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={role === 'doctor' ? 'Dr. John Doe' : 'Rahul Verma'}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                  />
                </div>
              )}

              {/* Email / Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email / Phone
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="email@example.com or phone number"
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 pl-8"
                  />
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">Password</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setIsForgotView(true)}
                      className="text-[11px] text-cyan-600 hover:underline"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 pl-8"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <span>{mode === 'login' ? `Login as ${role.toUpperCase()}` : 'Create Account'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Toggle Login / Register */}
              <div className="pt-2 text-center text-xs text-slate-500">
                {mode === 'login' ? (
                  <span>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('register')}
                      className="text-cyan-600 font-bold hover:underline"
                    >
                      Create Account
                    </button>
                  </span>
                ) : (
                  <span>
                    Already registered?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-cyan-600 font-bold hover:underline"
                    >
                      Login here
                    </button>
                  </span>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
