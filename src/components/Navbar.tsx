import React, { useState, useRef, useEffect } from 'react';
import { Building2, Globe, Image, Users, ShieldCheck, Sparkles, LogOut, UserCheck, MoreVertical, Briefcase, Plus, Languages, Lock, Unlock } from 'lucide-react';
import { AuthState } from '../types';
import { Language, translations } from '../translations';
import { LanguageModal } from './LanguageModal';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  auth: AuthState;
  onOpenEmployeeLogin: () => void;
  onOpenAdminLogin: () => void;
  onLogout: () => void;
  onOpenAiAssistant: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  onOpenJobApplication: () => void;
  onOpenAddEmployeeFromMenu: () => void;
  onOpenPrivateWebsites: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  auth,
  onOpenEmployeeLogin,
  onOpenAdminLogin,
  onLogout,
  onOpenAiAssistant,
  language,
  setLanguage,
  onOpenJobApplication,
  onOpenAddEmployeeFromMenu,
  onOpenPrivateWebsites,
}) => {
  const t = translations[language];
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside, { passive: true });
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-indigo-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Left Side: Three-Dot Menu & Logo */}
            <div className="flex items-center gap-3">
              
              {/* Three-Dot Menu (Top Left) */}
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  title={t.adminPanel}
                  aria-label="Menu"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-2 border-b border-slate-100 mb-2">
                      <p className="text-xs font-black text-indigo-900">{t.companyName}</p>
                      <p className="text-[10px] text-slate-500">{t.ceoTitle}</p>
                    </div>

                    <div className="space-y-1 px-2">
                      {/* Admin Panel */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          onOpenAdminLogin();
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>{t.adminPanel}</span>
                      </button>

                      {/* Add Employee */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          onOpenAddEmployeeFromMenu();
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                      >
                        <Plus className="w-4 h-4 text-indigo-600" />
                        <span>{t.addEmployee}</span>
                      </button>

                      {/* Private Websites */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          onOpenPrivateWebsites();
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                      >
                        <Lock className="w-4 h-4 text-amber-500" />
                        <span>{language === 'en' ? 'Private Websites' : 'प्राइवेट वेबसाइट्स'}</span>
                      </button>

                      {/* Job Application */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          onOpenJobApplication();
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                      >
                        <Briefcase className="w-4 h-4 text-amber-600" />
                        <span>{t.jobApplication}</span>
                      </button>

                      {/* Language Selection */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsLangModalOpen(true);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                      >
                        <Languages className="w-4 h-4 text-violet-600" />
                        <span>{t.language} ({language.toUpperCase()})</span>
                      </button>

                      {/* Logout option if logged in */}
                      {auth.role !== 'guest' && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsMenuOpen(false);
                            onLogout();
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors border-t border-slate-100 mt-1"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>{t.logout}</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Brand Logo & Name */}
              <button
                type="button"
                onClick={() => setCurrentTab('home')}
                className="flex items-center gap-3 group text-left focus:outline-none"
              >
                <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-indigo-200 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform bg-white">
                  <img
                    src="/assets/aistudio/IMG-20261007-WA0000_f1d2dd69.jpg"
                    alt="Free AI Vishal Company Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="hidden sm:block">
                  <span className="block text-sm font-black tracking-tight bg-gradient-to-r from-indigo-900 via-violet-900 to-slate-900 bg-clip-text text-transparent">
                    {t.companyName}
                  </span>
                  <span className="block text-[11px] font-bold text-indigo-600">
                    {t.ceoTitle}
                  </span>
                </div>
              </button>

            </div>

            {/* Center Tabs (Desktop) */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60">
              <button
                type="button"
                onClick={() => setCurrentTab('home')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  currentTab === 'home'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-4 h-4" />
                {t.home}
              </button>
              <button
                type="button"
                onClick={() => setCurrentTab('websites')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  currentTab === 'websites'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Globe className="w-4 h-4" />
                {t.websites}
              </button>
              <button
                type="button"
                onClick={() => setCurrentTab('gallery')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  currentTab === 'gallery'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Image className="w-4 h-4" />
                {t.gallery}
              </button>
              <button
                type="button"
                onClick={() => setCurrentTab('employees')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  currentTab === 'employees'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4" />
                {t.directory}
              </button>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              
              {/* Language Trigger Button in Header */}
              <button
                type="button"
                onClick={() => setIsLangModalOpen(true)}
                className="px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200/80 transition-all flex items-center gap-1.5 shadow-sm"
                title={t.selectLanguage}
              >
                <Languages className="w-4 h-4 text-indigo-600" />
                <span className="hidden sm:inline font-bold uppercase">{language}</span>
              </button>

              {/* AI Assistant */}
              <button
                type="button"
                onClick={onOpenAiAssistant}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-200 hover:shadow-lg transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">{t.aiAssistant}</span>
              </button>

              {/* Auth / Login */}
              {auth.role === 'guest' && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onOpenEmployeeLogin}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-all flex items-center gap-1.5"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t.employeeLogin}</span>
                  </button>
                </div>
              )}

              {auth.role === 'employee' && (
                <div className="flex items-center gap-2 bg-indigo-50/80 border border-indigo-200 px-3 py-1.5 rounded-2xl">
                  <img src={auth.employee?.photoUrl} alt="" className="w-7 h-7 rounded-full object-cover" />
                  <button type="button" onClick={() => setCurrentTab('employee-dashboard')} className="text-xs bg-indigo-600 text-white px-2.5 py-1 rounded-lg font-bold">
                    {t.employeeDashboard}
                  </button>
                  <button type="button" onClick={onLogout} className="text-slate-500 hover:text-red-600 p-1" title={t.logout}>
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}

              {auth.role === 'admin' && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-2xl">
                  <button type="button" onClick={() => setCurrentTab('admin-dashboard')} className="text-xs bg-emerald-600 text-white px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{t.adminDashboard}</span>
                  </button>
                  <button type="button" onClick={onLogout} className="text-slate-500 hover:text-red-600 p-1" title={t.logout}>
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>

          </div>
        </div>
      </header>

      {/* Language Selector Modal */}
      <LanguageModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
        currentLanguage={language}
        onSelectLanguage={setLanguage}
      />
    </>
  );
};
