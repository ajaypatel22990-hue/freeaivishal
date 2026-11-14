import React, { useState, useEffect } from 'react';
import { UserCheck, Phone, Hash, User, AlertCircle, X } from 'lucide-react';
import { Employee } from '../types';
import { Language, translations } from '../translations';

interface EmployeeLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  onLoginSuccess: (employee: Employee) => void;
  language: Language;
}

export const EmployeeLoginModal: React.FC<EmployeeLoginModalProps> = ({
  isOpen,
  onClose,
  employees,
  onLoginSuccess,
  language,
}) => {
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [error, setError] = useState('');
  const t = translations[language];

  // Helper to completely clear all sign-in information
  const clearAllFields = () => {
    setName('');
    setRollNumber('');
    setMobileNumber('');
    setError('');
  };

  // Automatically erase all information whenever modal closes or opens afresh
  useEffect(() => {
    if (!isOpen) {
      clearAllFields();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Safe close handler that cleans up all data
  const handleSafeClose = () => {
    clearAllFields();
    onClose();
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const matched = employees.find(
      (emp) =>
        emp.rollNumber.trim().toUpperCase() === rollNumber.trim().toUpperCase() &&
        emp.mobileNumber.trim() === mobileNumber.trim() &&
        emp.name.trim().toLowerCase().includes(name.trim().toLowerCase())
    );

    if (matched) {
      // 1. Immediately wipe all input fields clean so no credentials linger
      clearAllFields();
      // 2. Call success and close
      onLoginSuccess(matched);
      onClose();
    } else {
      setError(
        language === 'en'
          ? 'Invalid name, roll number, or mobile number. Please enter verified credentials (e.g. Roll: FAV-101, Mobile: 9123456789).'
          : 'अमान्य रोल नंबर, मोबाइल नंबर या नाम। कृपया सही जानकारी दर्ज करें (जैसे Roll: FAV-101, Mobile: 9123456789)।'
      );
    }
  };

  const handleDemoFill = (emp: Employee) => {
    setName(emp.name);
    setRollNumber(emp.rollNumber);
    setMobileNumber(emp.mobileNumber);
    setError('');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleSafeClose();
      }}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white relative">
          <button
            type="button"
            onClick={handleSafeClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 text-white font-bold flex items-center justify-center hover:bg-white/30 transition-colors"
            title={t.close}
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-3">
            <UserCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black">{t.employeeSignInTitle || t.employeeLogin}</h2>
          <p className="text-xs text-indigo-100 mt-1">{t.companyName}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} autoComplete="off" className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>{t.employeeNameLabel || t.role}</span>
            </label>
            <input
              type="text"
              required
              autoComplete="off"
              spellCheck={false}
              placeholder={language === 'en' ? 'e.g. Rahul Sharma' : 'जैसे: राहुल शर्मा'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-indigo-600" />
              <span>{t.rollNumberLabel || t.rollNo}</span>
            </label>
            <input
              type="text"
              required
              autoComplete="off"
              spellCheck={false}
              placeholder={language === 'en' ? 'e.g. FAV-101' : 'जैसे: FAV-101'}
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 uppercase font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-indigo-600" />
              <span>{t.mobileNumber}</span>
            </label>
            <input
              type="tel"
              required
              autoComplete="off"
              spellCheck={false}
              placeholder={language === 'en' ? 'e.g. 9123456789' : 'जैसे: 9123456789'}
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-mono"
            />
          </div>

          {/* Quick Demo Fill hints */}
          <div className="pt-2">
            <p className="text-[11px] font-bold text-slate-500 mb-2">{t.demoLoginHint || 'डेमो लॉगिन:'}</p>
            <div className="flex flex-wrap gap-1.5">
              {employees.slice(1, 4).map((emp) => (
                <button
                  key={emp.id}
                  type="button"
                  onClick={() => handleDemoFill(emp)}
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-semibold border border-indigo-200 transition-colors"
                >
                  {emp.name} ({emp.rollNumber})
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleSafeClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-semibold transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-200 transition-all"
            >
              {t.employeeLogin}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
