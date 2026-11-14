import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { WebsitesView } from './components/WebsitesView';
import { GalleryView } from './components/GalleryView';
import { EmployeesView } from './components/EmployeesView';
import { EmployeeLoginModal } from './components/EmployeeLoginModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { EmployeeDashboardView } from './components/EmployeeDashboardView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { AiAssistantModal } from './components/AiAssistantModal';
import { JobApplicationModal } from './components/JobApplicationModal';
import { PrivateWebsitesModal } from './components/PrivateWebsitesModal';
import { CustomerCareModal } from './components/CustomerCareModal';
import { AutoSeoManager } from './components/AutoSeoManager';
import { INITIAL_EMPLOYEES, INITIAL_WEBSITES, INITIAL_MEDIA, INITIAL_ANNOUNCEMENTS } from './data/initialData';
import { Employee, CompanyWebsite, MediaItem, Announcement, AuthState } from './types';
import { Language, translations } from './translations';
import { useToast } from './components/Toast';
import { syncService } from './services/syncService';
import { safeStorage } from './utils/safeStorage';

export default function App() {
  const { showToast } = useToast();
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [language, setLanguage] = useState<Language>(() => {
    return (safeStorage.getItem('fav_lang', 'en') as Language);
  });

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    safeStorage.setItem('fav_lang', lang);
  };

  const [employees, setEmployees] = useState<Employee[]>(() => {
    return safeStorage.getItem('fav_employees', INITIAL_EMPLOYEES);
  });
  const [websites, setWebsites] = useState<CompanyWebsite[]>(() => {
    return safeStorage.getItem('fav_websites', INITIAL_WEBSITES);
  });
  const [media, setMedia] = useState<MediaItem[]>(() => {
    return safeStorage.getItem('fav_media', INITIAL_MEDIA);
  });
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    return safeStorage.getItem('fav_announcements', INITIAL_ANNOUNCEMENTS);
  });
  const [reports, setReports] = useState<any[]>(() => {
    return safeStorage.getItem('fav_reports', []);
  });

  const handleUpdateReports = (next: any[] | ((prev: any[]) => any[])) => {
    setReports((prev) => {
      const updated = typeof next === 'function' ? next(prev) : next;
      safeStorage.setItem('fav_reports', updated);
      safeStorage.setItem('fav_local_modified', true);
      syncService.pushRemoteUpdate({ reports: updated }).catch(() => {});
      return updated;
    });
  };

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return safeStorage.getItem('fav_admin_pwd', '8780772619');
  });

  const [privateWebsitesPassword, setPrivateWebsitesPassword] = useState<string>(() => {
    return safeStorage.getItem('fav_private_web_pwd', '9999');
  });

  const [auth, setAuth] = useState<AuthState>(() => {
    return safeStorage.getItem('fav_auth', { role: 'guest' });
  });

  const [isEmployeeLoginOpen, setIsEmployeeLoginOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isJobAppOpen, setIsJobAppOpen] = useState(false);
  const [isPrivateWebsitesOpen, setIsPrivateWebsitesOpen] = useState(false);
  const [isCustomerCareOpen, setIsCustomerCareOpen] = useState(false);

  // ==========================================
  // REAL-TIME MULTI-DEVICE SYNC ENGINE (ZERO REFRESH)
  // ==========================================
  useEffect(() => {
    // 1. Initial remote fetch & smart reconciliation
    syncService.fetchRemoteData().then((remoteData) => {
      if (!remoteData) return;

      const hasLocalEdits = Boolean(safeStorage.getItem('fav_local_modified', false));

      // If server has untouched seed data (updatedAt === 0) and client already made local changes, push local state to server!
      if (remoteData.updatedAt === 0 && hasLocalEdits) {
        syncService.pushRemoteUpdate({
          employees: safeStorage.getItem('fav_employees', INITIAL_EMPLOYEES),
          websites: safeStorage.getItem('fav_websites', INITIAL_WEBSITES),
          media: safeStorage.getItem('fav_media', INITIAL_MEDIA),
          announcements: safeStorage.getItem('fav_announcements', INITIAL_ANNOUNCEMENTS),
          adminPassword: safeStorage.getItem('fav_admin_pwd', '8780772619'),
          privateWebsitesPassword: safeStorage.getItem('fav_private_web_pwd', '9999'),
        });
        return;
      }

      if (Array.isArray(remoteData.employees)) {
        setEmployees((prevLocal) => {
          const map = new Map<string, Employee>();
          remoteData.employees.forEach((e) => map.set(e.id, e));
          prevLocal.forEach((e) => map.set(e.id, e));
          const merged = Array.from(map.values());
          safeStorage.setItem('fav_employees', merged);
          return merged;
        });
      }
      if (Array.isArray(remoteData.websites)) {
        setWebsites((prevLocal) => {
          const map = new Map<string, CompanyWebsite>();
          remoteData.websites.forEach((w) => map.set(w.id, w));
          prevLocal.forEach((w) => map.set(w.id, w));
          const merged = Array.from(map.values());
          safeStorage.setItem('fav_websites', merged);
          return merged;
        });
      }
      if (Array.isArray(remoteData.media)) {
        setMedia((prevLocal) => {
          const map = new Map<string, MediaItem>();
          remoteData.media.forEach((m) => map.set(m.id, m));
          prevLocal.forEach((m) => map.set(m.id, m));
          const merged = Array.from(map.values());
          safeStorage.setItem('fav_media', merged);
          return merged;
        });
      }
      if (Array.isArray(remoteData.announcements)) {
        setAnnouncements((prevLocal) => {
          const map = new Map<string, Announcement>();
          remoteData.announcements.forEach((a) => map.set(a.id, a));
          prevLocal.forEach((a) => map.set(a.id, a));
          const merged = Array.from(map.values());
          safeStorage.setItem('fav_announcements', merged);
          return merged;
        });
      }
      if (Array.isArray(remoteData.reports)) {
        setReports(remoteData.reports);
        safeStorage.setItem('fav_reports', remoteData.reports);
      }
      if (typeof remoteData.adminPassword === 'string' && remoteData.adminPassword.trim()) {
        setAdminPassword(remoteData.adminPassword);
        safeStorage.setItem('fav_admin_pwd', remoteData.adminPassword);
      }
      if (typeof remoteData.privateWebsitesPassword === 'string' && remoteData.privateWebsitesPassword.trim()) {
        setPrivateWebsitesPassword(remoteData.privateWebsitesPassword);
        safeStorage.setItem('fav_private_web_pwd', remoteData.privateWebsitesPassword);
      }
    });

    // 2. Real-time stream subscription (Instant updates for all mobiles & PCs with ZERO refresh)
    const unsubscribe = syncService.subscribe((incoming) => {
      if (Array.isArray(incoming.employees)) {
        setEmployees((prevLocal) => {
          const map = new Map<string, Employee>();
          incoming.employees!.forEach((e) => map.set(e.id, e));
          prevLocal.forEach((e) => map.set(e.id, e));
          const merged = Array.from(map.values());
          safeStorage.setItem('fav_employees', merged);
          return merged;
        });
      }
      if (Array.isArray(incoming.websites)) {
        setWebsites((prevLocal) => {
          const map = new Map<string, CompanyWebsite>();
          incoming.websites!.forEach((w) => map.set(w.id, w));
          prevLocal.forEach((w) => map.set(w.id, w));
          const merged = Array.from(map.values());
          safeStorage.setItem('fav_websites', merged);
          return merged;
        });
      }
      if (Array.isArray(incoming.media)) {
        setMedia((prevLocal) => {
          const map = new Map<string, MediaItem>();
          incoming.media!.forEach((m) => map.set(m.id, m));
          prevLocal.forEach((m) => map.set(m.id, m));
          const merged = Array.from(map.values());
          safeStorage.setItem('fav_media', merged);
          return merged;
        });
      }
      if (Array.isArray(incoming.announcements)) {
        setAnnouncements((prevLocal) => {
          const map = new Map<string, Announcement>();
          incoming.announcements!.forEach((a) => map.set(a.id, a));
          prevLocal.forEach((a) => map.set(a.id, a));
          const merged = Array.from(map.values());
          safeStorage.setItem('fav_announcements', merged);
          return merged;
        });
      }
      if (Array.isArray(incoming.reports)) {
        setReports(incoming.reports);
        safeStorage.setItem('fav_reports', incoming.reports);
      }
      if (typeof incoming.adminPassword === 'string' && incoming.adminPassword.trim()) {
        setAdminPassword(incoming.adminPassword);
        safeStorage.setItem('fav_admin_pwd', incoming.adminPassword);
      }
      if (typeof incoming.privateWebsitesPassword === 'string' && incoming.privateWebsitesPassword.trim()) {
        setPrivateWebsitesPassword(incoming.privateWebsitesPassword);
        safeStorage.setItem('fav_private_web_pwd', incoming.privateWebsitesPassword);
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync state & push to backend so every connected device receives it instantly
  const handleUpdateEmployees = useCallback((action: React.SetStateAction<Employee[]>) => {
    setEmployees((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      safeStorage.setItem('fav_employees', next);
      safeStorage.setItem('fav_local_modified', true);
      setTimeout(() => {
        syncService.pushRemoteUpdate({
          employees: next,
          websites,
          media,
          announcements,
          adminPassword,
          privateWebsitesPassword,
        });
      }, 0);
      return next;
    });
  }, [websites, media, announcements, adminPassword, privateWebsitesPassword]);

  const handleUpdateWebsites = useCallback((action: React.SetStateAction<CompanyWebsite[]>) => {
    setWebsites((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      safeStorage.setItem('fav_websites', next);
      safeStorage.setItem('fav_local_modified', true);
      setTimeout(() => {
        syncService.pushRemoteUpdate({
          employees,
          websites: next,
          media,
          announcements,
          adminPassword,
          privateWebsitesPassword,
        });
      }, 0);
      return next;
    });
  }, [employees, media, announcements, adminPassword, privateWebsitesPassword]);

  const handleUpdateMedia = useCallback((action: React.SetStateAction<MediaItem[]>) => {
    setMedia((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      safeStorage.setItem('fav_media', next);
      safeStorage.setItem('fav_local_modified', true);
      setTimeout(() => {
        syncService.pushRemoteUpdate({
          employees,
          websites,
          media: next,
          announcements,
          adminPassword,
          privateWebsitesPassword,
        });
      }, 0);
      return next;
    });
  }, [employees, websites, announcements, adminPassword, privateWebsitesPassword]);

  const handleUpdateAnnouncements = useCallback((action: React.SetStateAction<Announcement[]>) => {
    setAnnouncements((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      safeStorage.setItem('fav_announcements', next);
      safeStorage.setItem('fav_local_modified', true);
      setTimeout(() => {
        syncService.pushRemoteUpdate({
          employees,
          websites,
          media,
          announcements: next,
          adminPassword,
          privateWebsitesPassword,
        });
      }, 0);
      return next;
    });
  }, [employees, websites, media, adminPassword, privateWebsitesPassword]);

  const handleUpdateAdminPassword = useCallback((pwd: string) => {
    setAdminPassword(pwd);
    safeStorage.setItem('fav_admin_pwd', pwd);
    safeStorage.setItem('fav_local_modified', true);
    setTimeout(() => {
      syncService.pushRemoteUpdate({
        employees,
        websites,
        media,
        announcements,
        adminPassword: pwd,
        privateWebsitesPassword,
      });
    }, 0);
  }, [employees, websites, media, announcements, privateWebsitesPassword]);

  const handleUpdatePrivateWebsitesPassword = useCallback((pwd: string) => {
    setPrivateWebsitesPassword(pwd);
    safeStorage.setItem('fav_private_web_pwd', pwd);
    safeStorage.setItem('fav_local_modified', true);
    setTimeout(() => {
      syncService.pushRemoteUpdate({
        employees,
        websites,
        media,
        announcements,
        adminPassword,
        privateWebsitesPassword: pwd,
      });
    }, 0);
  }, [employees, websites, media, announcements, adminPassword]);

  useEffect(() => {
    safeStorage.setItem('fav_lang', language);
  }, [language]);

  useEffect(() => {
    safeStorage.setItem('fav_admin_pwd', adminPassword);
  }, [adminPassword]);

  useEffect(() => {
    safeStorage.setItem('fav_auth', auth);
  }, [auth]);

  const handleEmployeeLoginSuccess = (employee: Employee) => {
    setAuth({ role: 'employee', employee });
    setCurrentTab('employee-dashboard');
    showToast(`स्वागत है ${employee.name}! सफलतापूर्वक लॉगिन हो गए।`, 'success');
  };

  const handleAdminLoginSuccess = () => {
    setAuth({ role: 'admin' });
    setCurrentTab('admin-dashboard');
    showToast('बॉस एडमिन मोड सक्रिय! (Admin Panel Logged In)', 'success');
  };

  const handleLogout = () => {
    setAuth({ role: 'guest' });
    setCurrentTab('home');
    showToast('सफलतापूर्वक लॉगआउट कर दिया गया।', 'info');
  };

  const handleAddEmployeeFromMenu = () => {
    if (auth.role === 'admin') {
      setCurrentTab('admin-dashboard');
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleSetCurrentTab = (tab: string) => {
    if (tab === 'admin-dashboard' && auth.role !== 'admin') {
      setIsAdminLoginOpen(true);
      return;
    }
    setCurrentTab(tab);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Background Automatic SEO & Search Ranking Engine (Locked & Hidden) */}
      <AutoSeoManager currentTab={currentTab} language={language} websites={websites} />
      
      <Navbar
        currentTab={currentTab}
        setCurrentTab={handleSetCurrentTab}
        auth={auth}
        onOpenEmployeeLogin={() => setIsEmployeeLoginOpen(true)}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onLogout={handleLogout}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        language={language}
        setLanguage={handleLanguageChange}
        onOpenJobApplication={() => setIsJobAppOpen(true)}
        onOpenAddEmployeeFromMenu={handleAddEmployeeFromMenu}
        onOpenPrivateWebsites={() => setIsPrivateWebsitesOpen(true)}
      />

      <main>
        {currentTab === 'home' && (
          <HomeView
            setCurrentTab={handleSetCurrentTab}
            websites={websites}
            announcements={announcements}
            employees={employees}
            media={media}
            onOpenEmployeeLogin={() => setIsEmployeeLoginOpen(true)}
            language={language}
          />
        )}

        {currentTab === 'websites' && (
          <WebsitesView
            websites={websites}
            role={auth.role}
            onOpenAddWebsite={() => setCurrentTab('admin-dashboard')}
            language={language}
            privateWebsitesPassword={privateWebsitesPassword}
          />
        )}

        {currentTab === 'gallery' && (
          <GalleryView
            media={media}
            language={language}
          />
        )}

        {currentTab === 'employees' && (
          <EmployeesView
            employees={employees}
            role={auth.role}
            onOpenLogin={() => setIsEmployeeLoginOpen(true)}
            language={language}
          />
        )}

        {currentTab === 'employee-dashboard' && auth.role === 'employee' && auth.employee && (
          <EmployeeDashboardView
            employee={
              employees.find(
                (e) => e.id === auth.employee?.id || e.rollNumber === auth.employee?.rollNumber
              ) || auth.employee
            }
            websites={websites}
            announcements={announcements}
          />
        )}

        {currentTab === 'admin-dashboard' && auth.role === 'admin' && (
          <AdminDashboardView
            employees={employees}
            setEmployees={handleUpdateEmployees}
            websites={websites}
            setWebsites={handleUpdateWebsites}
            media={media}
            setMedia={handleUpdateMedia}
            adminPassword={adminPassword}
            setAdminPassword={handleUpdateAdminPassword}
            privateWebsitesPassword={privateWebsitesPassword}
            setPrivateWebsitesPassword={handleUpdatePrivateWebsitesPassword}
            announcements={announcements}
            setAnnouncements={handleUpdateAnnouncements}
            reports={reports}
            setReports={handleUpdateReports}
            language={language}
          />
        )}
      </main>

      <footer className="bg-slate-900 text-white border-t border-slate-800 py-12 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="space-y-2">
              <h2 className="text-xl font-black bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
                {translations[language].companyName}
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'en'
                  ? 'All Rights Reserved © 2026 | Official Corporate Enterprise Portal'
                  : 'सभी अधिकार सुरक्षित © 2026 | आधिकारिक कॉर्पोरेट पोर्टल'}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-5 text-xs text-slate-400">
              <button type="button" onClick={() => setCurrentTab('home')} className="hover:text-white transition-colors">
                {translations[language].home}
              </button>
              <button type="button" onClick={() => setCurrentTab('websites')} className="hover:text-white transition-colors">
                {translations[language].websites}
              </button>
              <button type="button" onClick={() => setCurrentTab('gallery')} className="hover:text-white transition-colors">
                {translations[language].gallery}
              </button>
              <button type="button" onClick={() => setCurrentTab('employees')} className="hover:text-white transition-colors">
                {translations[language].directory}
              </button>
            </div>
          </div>

          {/* Customer Care & Help Center - Exactly at the bottom as requested */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <div>
                <h4 className="text-sm font-black text-white">
                  {language === 'en' ? 'Customer Care & Help Center (24/7 Support)' : 'कस्टमर केयर और हेल्प सेंटर (24/7 सपोर्ट)'}
                </h4>
                <p className="text-xs text-slate-400">
                  {language === 'en'
                    ? 'Report bugs, issues, or send support queries directly to freeaivishalcompany@gmail.com'
                    : 'बग, एरर या किसी भी समस्या की रिपोर्ट करें। कनेक्टेड ईमेल: freeaivishalcompany@gmail.com'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCustomerCareOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2 shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <span>{language === 'en' ? 'Help Center / Report Issue' : 'हेल्प सेंटर / समस्या बताएं'}</span>
            </button>
          </div>
        </div>
      </footer>

      <EmployeeLoginModal
        isOpen={isEmployeeLoginOpen}
        onClose={() => setIsEmployeeLoginOpen(false)}
        employees={employees}
        onLoginSuccess={handleEmployeeLoginSuccess}
        language={language}
      />

      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
        adminPassword={adminPassword}
        language={language}
      />

      <AiAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
      />

      <JobApplicationModal
        isOpen={isJobAppOpen}
        onClose={() => setIsJobAppOpen(false)}
      />

      <PrivateWebsitesModal
        isOpen={isPrivateWebsitesOpen}
        onClose={() => setIsPrivateWebsitesOpen(false)}
        websites={websites}
        privateWebsitesPassword={privateWebsitesPassword}
        onUpdatePrivateWebsitesPassword={handleUpdatePrivateWebsitesPassword}
        language={language}
      />

      <CustomerCareModal
        isOpen={isCustomerCareOpen}
        onClose={() => setIsCustomerCareOpen(false)}
        language={language}
      />

    </div>
  );
}
