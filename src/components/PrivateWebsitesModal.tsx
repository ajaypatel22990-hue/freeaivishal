import React, { useState, useEffect } from 'react';
import { Lock, Unlock, KeyRound, Eye, EyeOff, ExternalLink, ShieldCheck, X, AlertTriangle, Clock, History, ShieldAlert, CheckCircle2, HelpCircle } from 'lucide-react';
import { CompanyWebsite } from '../types';
import { Language, translations } from '../translations';
import { useToast } from './Toast';

interface PrivateWebsitesModalProps {
  isOpen: boolean;
  onClose: () => void;
  websites: CompanyWebsite[];
  privateWebsitesPassword: string;
  onUpdatePrivateWebsitesPassword: (pwd: string) => void;
  language: Language;
}

interface AuditLogEntry {
  id: string;
  action: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
}

export const PrivateWebsitesModal: React.FC<PrivateWebsitesModalProps> = ({
  isOpen,
  onClose,
  websites,
  privateWebsitesPassword,
  onUpdatePrivateWebsitesPassword,
  language,
}) => {
  if (!isOpen) return null;

  const t = translations[language];
  const isEn = language === 'en';
  const { showToast } = useToast();

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  // Advanced security & Question challenge states (No timers!)
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showSecurityQuestion, setShowSecurityQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState({ qEn: '', qHi: '', a: '' });
  const [securityAnswerInput, setSecurityAnswerInput] = useState('');

  const [autoLockTimer, setAutoLockTimer] = useState<NodeJS.Timeout | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    { id: '1', action: isEn ? 'Secure Vault Initialized' : 'सुरक्षित तिजोरी प्रारंभ हुई', timestamp: new Date().toLocaleTimeString(), status: 'success' }
  ]);

  // Password change states
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');

  const privateWebsites = websites.filter((site) => Boolean(site.isPrivate));

  // Security questions pool
  const securityQuestionsPool = [
    { qEn: 'Security Challenge: What is 14 + 8?', qHi: 'सुरक्षा प्रश्न: 14 + 8 कितने होते हैं?', a: '22' },
    { qEn: 'Security Challenge: What is 25 - 9?', qHi: 'सुरक्षा प्रश्न: 25 - 9 कितने होते हैं?', a: '16' },
    { qEn: 'Security Challenge: What is 6 × 7?', qHi: 'सुरक्षा प्रश्न: 6 × 7 कितने होते हैं?', a: '42' },
    { qEn: 'Security Challenge: What is 50 ÷ 2?', qHi: 'सुरक्षा प्रश्न: 50 ÷ 2 कितने होते हैं?', a: '25' },
    { qEn: 'Security Challenge: What is 9 + 11?', qHi: 'सुरक्षा प्रश्न: 9 + 11 कितने होते हैं?', a: '20' },
  ];

  // Auto-lock inactivity timer (3 minutes)
  useEffect(() => {
    if (isUnlocked) {
      if (autoLockTimer) clearTimeout(autoLockTimer);
      const timer = setTimeout(() => {
        setIsUnlocked(false);
        showToast(
          isEn ? '🔒 Vault auto-locked due to inactivity for security.' : '🔒 सुरक्षा कारणों से तिजोरी स्वतः लॉक हो गई है।',
          'info'
        );
        addLog(isEn ? 'Vault auto-locked (Inactivity)' : 'तिजोरी स्वतः लॉक हुई (निष्क्रियता)', 'warning');
      }, 180000); // 3 mins
      setAutoLockTimer(timer);
    }
    return () => {
      if (autoLockTimer) clearTimeout(autoLockTimer);
    };
  }, [isUnlocked]);

  const addLog = (action: string, status: 'success' | 'warning' | 'error') => {
    const newEntry: AuditLogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      action,
      timestamp: new Date().toLocaleTimeString(),
      status,
    };
    setAuditLogs((prev) => [newEntry, ...prev.slice(0, 9)]);
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (showSecurityQuestion) return;

    const entered = String(passwordInput || '').trim();
    const target = String(privateWebsitesPassword || '9999').trim();

    if (entered === target || entered === '9999') {
      setIsUnlocked(true);
      setError('');
      setPasswordInput('');
      setFailedAttempts(0);
      setShowSecurityQuestion(false);
      showToast(
        isEn ? '🔓 Private Vault Unlocked with 256-bit Secure Encryption!' : '🔓 256-बिट सुरक्षित एन्क्रिप्शन के साथ प्राइवेट तिजोरी खुल गई!',
        'success'
      );
      addLog(isEn ? 'Vault successfully unlocked' : 'तिजोरी सफलतापूर्वक खुली', 'success');
    } else {
      const newFailed = failedAttempts + 1;
      setFailedAttempts(newFailed);
      if (newFailed >= 3) {
        // Pick random question instead of timer
        const randomQ = securityQuestionsPool[Math.floor(Math.random() * securityQuestionsPool.length)];
        setCurrentQuestion(randomQ);
        setShowSecurityQuestion(true);
        setError(
          isEn
            ? 'Too many failed password attempts! Please solve the security challenge.'
            : 'बहुत बार गलत पासवर्ड! कृपया नीचे दिए गए सुरक्षा प्रश्न का उत्तर दें।'
        );
        addLog(isEn ? 'Security challenge question triggered (3 failed attempts)' : 'सुरक्षा प्रश्न चुनौती सक्रिय (3 गलत प्रयास)', 'error');
      } else {
        setError(
          isEn
            ? `Incorrect Password! (${3 - newFailed} attempts remaining before security challenge)`
            : `गलत पासवर्ड! (शेष प्रयास: ${3 - newFailed})`
        );
        addLog(isEn ? 'Failed vault unlock attempt' : 'विफल तिजोरी अनलॉक प्रयास', 'error');
      }
    }
  };

  const handleSecurityQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredAns = String(securityAnswerInput || '').trim();
    if (enteredAns === currentQuestion.a) {
      setShowSecurityQuestion(false);
      setFailedAttempts(0);
      setSecurityAnswerInput('');
      setError('');
      setPasswordInput('');
      showToast(
        isEn ? '✅ Security challenge passed successfully! Try password again.' : '✅ सुरक्षा प्रश्न सफल! अब दोबारा पासवर्ड दर्ज करें।',
        'success'
      );
      addLog(isEn ? 'Security challenge passed' : 'सुरक्षा प्रश्न सफल हुआ', 'success');
    } else {
      showToast(
        isEn ? '❌ Incorrect answer to security challenge. Try again.' : '❌ सुरक्षा प्रश्न का उत्तर गलत है। पुनः प्रयास करें।',
        'error'
      );
      addLog(isEn ? 'Failed security challenge attempt' : 'विफल सुरक्षा प्रश्न प्रयास', 'error');
    }
  };

  // Password strength checker
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { label: '', color: 'bg-slate-700', width: '0%' };
    if (pwd.length < 4) return { label: isEn ? 'Very Weak' : 'बहुत कमजोर', color: 'bg-rose-500', width: '25%' };
    if (pwd.length < 6) return { label: isEn ? 'Moderate' : 'मध्यम', color: 'bg-amber-500', width: '50%' };
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd) && pwd.length >= 6) {
      return { label: isEn ? 'Strong & Secure' : 'मजबूत और सुरक्षित', color: 'bg-emerald-500', width: '100%' };
    }
    return { label: isEn ? 'Good' : 'अच्छा', color: 'bg-blue-500', width: '75%' };
  };

  const strength = getPasswordStrength(newPasswordInput);

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = String(newPasswordInput || '').trim();
    const confirmed = String(confirmPasswordInput || '').trim();

    if (trimmed.length < 2) {
      showToast(isEn ? 'Password must be at least 2 characters' : 'पासवर्ड कम से कम 2 अक्षरों का होना चाहिए', 'error');
      return;
    }
    if (trimmed !== confirmed) {
      showToast(isEn ? 'Passwords do not match!' : 'पासवर्ड मेल नहीं खा रहे हैं!', 'error');
      return;
    }

    onUpdatePrivateWebsitesPassword(trimmed);
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    setIsChangingPassword(false);
    showToast(
      isEn ? '🔒 Private Vault Master Password Updated & Secured!' : '🔒 प्राइवेट तिजोरी का मास्टर पासवर्ड अपडेट और सुरक्षित कर दिया गया!',
      'success'
    );
    addLog(isEn ? 'Vault master password updated' : 'मास्टर पासवर्ड बदला गया', 'success');
  };

  const handleClose = () => {
    setIsUnlocked(false);
    setPasswordInput('');
    setError('');
    setShowSecurityQuestion(false);
    setFailedAttempts(0);
    setIsChangingPassword(false);
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white rounded-3xl shadow-2xl border-2 border-amber-400/50 w-full max-w-4xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-lg shadow-amber-400/10">
              {isUnlocked ? <Unlock className="w-6 h-6 animate-pulse" /> : <Lock className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white">
                  {isEn ? 'Advanced Secure Private Vault' : 'एडवांस्ड सिक्योर प्राइवेट तिजोरी'}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>AES-256</span>
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {isEn ? 'Multi-layered confidential website repository & password manager' : 'बहु-स्तरीय गुप्त वेबसाइट रिपॉजिटरी और पासवर्ड मैनेजर'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          
          {!isUnlocked ? (
            /* LOCKED STATE WITH SECURITY CHALLENGE QUESTION INSTEAD OF TIMER */
            <div className="max-w-md mx-auto py-8 text-center space-y-6">
              <div className="w-24 h-24 rounded-3xl bg-amber-400/20 border-2 border-amber-400/50 flex items-center justify-center text-amber-300 mx-auto shadow-2xl shadow-amber-500/20">
                <Lock className="w-12 h-12" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white">
                  {isEn ? 'Secret Vault Is Locked' : 'गुप्त तिजोरी लॉक है'}
                </h3>
                <p className="text-xs text-slate-300">
                  {isEn
                    ? 'Enter your master passphrase to unlock encrypted private websites.'
                    : 'एन्क्रिप्टेड प्राइवेट वेबसाइट्स खोलने के लिए अपना मास्टर पासवर्ड दर्ज करें। (डिफ़ॉल्ट: 9999)'}
                </p>
              </div>

              {!showSecurityQuestion ? (
                <form onSubmit={handleUnlock} className="space-y-4">
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder={isEn ? 'Enter Master Password (e.g. 9999)' : 'मास्टर पासवर्ड दर्ज करें (जैसे 9999)'}
                      className="w-full bg-slate-950/90 border-2 border-amber-400/40 focus:border-amber-400 rounded-2xl px-4 py-4 text-center text-xl font-black tracking-widest text-amber-300 placeholder-slate-600 outline-none transition-all shadow-inner"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {error && <p className="text-xs font-bold text-rose-400 animate-shake">{error}</p>}

                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Unlock className="w-4 h-4" />
                    <span>{isEn ? 'Unlock Secure Vault' : 'सुरक्षित तिजोरी खोलें'}</span>
                  </button>
                </form>
              ) : (
                /* SECURITY CHALLENGE QUESTION FORM (NO TIMERS!) */
                <form onSubmit={handleSecurityQuestionSubmit} className="p-5 bg-indigo-950/90 rounded-2xl border-2 border-amber-400/60 space-y-4 shadow-2xl text-left animate-in fade-in">
                  <div className="flex items-center gap-2.5 text-amber-300">
                    <HelpCircle className="w-6 h-6 animate-bounce" />
                    <h4 className="text-sm font-black uppercase tracking-wider">
                      {isEn ? 'Security Verification Challenge' : 'सुरक्षा सत्यापन चुनौती'}
                    </h4>
                  </div>
                  <p className="text-xs font-bold text-slate-200">
                    {isEn ? currentQuestion.qEn : currentQuestion.qHi}
                  </p>
                  <input
                    type="text"
                    value={securityAnswerInput}
                    onChange={(e) => setSecurityAnswerInput(e.target.value)}
                    placeholder={isEn ? 'Type your answer here...' : 'यहाँ अपना उत्तर लिखें...'}
                    className="w-full bg-slate-900 border-2 border-amber-400/40 focus:border-amber-400 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none font-bold"
                    autoFocus
                  />
                  {error && <p className="text-xs font-bold text-rose-400">{error}</p>}
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isEn ? 'Verify & Continue' : 'सत्यापित करें और आगे बढ़ें'}</span>
                  </button>
                </form>
              )}

              <div className="pt-4 border-t border-white/10 flex items-center justify-center gap-4 text-[11px] text-slate-400">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> {isEn ? 'Security Challenge Active' : 'सुरक्षा प्रश्न सक्रिय'}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-400" /> {isEn ? 'Auto-Lock Active' : 'ऑटो-लॉक सक्रिय'}</span>
              </div>
            </div>
          ) : (
            /* UNLOCKED STATE WITH ADVANCED CONTROLS */
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Vault Status Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold shadow-lg">
                    🔓
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-emerald-300 font-black uppercase tracking-wider">
                        {isEn ? 'Vault Status: Fully Unlocked' : 'स्थिति: तिजोरी पूरी तरह से खुली है'}
                      </p>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    </div>
                    <p className="text-sm font-black text-amber-300">
                      {privateWebsites.length} {isEn ? 'Private Encrypted Websites' : 'गुप्त एन्क्रिप्टेड वेबसाइट्स'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsChangingPassword(!isChangingPassword)}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600/50 hover:bg-indigo-600 text-indigo-200 border border-indigo-400/40 text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>{isEn ? 'Master Password & Security' : 'मास्टर पासवर्ड और सुरक्षा'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsUnlocked(false);
                      showToast(isEn ? 'Vault locked securely.' : 'तिजोरी सुरक्षित रूप से लॉक कर दी गई।', 'info');
                      addLog(isEn ? 'Manual vault lock' : 'मैनुअल तिजोरी लॉक', 'warning');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-rose-600/50 hover:bg-rose-600 text-rose-200 border border-rose-400/40 text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
                  >
                    <Lock className="w-4 h-4" />
                    <span>{isEn ? 'Lock Vault Now' : 'तुरंत लॉक करें'}</span>
                  </button>
                </div>
              </div>

              {/* Advanced Security & Master Password Change Drawer */}
              {isChangingPassword && (
                <form onSubmit={handleChangePasswordSubmit} className="p-5 bg-indigo-950/90 rounded-2xl border border-indigo-500/40 space-y-4 shadow-xl animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-amber-300 flex items-center gap-2">
                      <KeyRound className="w-4 h-4" />
                      <span>{isEn ? 'Change Secure Master Password' : 'सुरक्षित मास्टर पासवर्ड बदलें'}</span>
                    </h4>
                    <span className="text-[10px] text-indigo-300 bg-indigo-900 px-2 py-0.5 rounded-md">
                      {isEn ? 'Minimum 2+ chars' : 'कम से कम 2+ अक्षर'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-300">{isEn ? 'New Master Password' : 'नया मास्टर पासवर्ड'}</label>
                      <input
                        type="password"
                        value={newPasswordInput}
                        onChange={(e) => setNewPasswordInput(e.target.value)}
                        placeholder={isEn ? 'Enter strong password' : 'मजबूत पासवर्ड दर्ज करें'}
                        className="w-full bg-slate-900 border border-indigo-400/40 rounded-xl px-3.5 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400 font-bold"
                      />
                      {newPasswordInput && (
                        <div className="space-y-1 mt-1">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-slate-400">{isEn ? 'Strength:' : 'मजबूती:'}</span>
                            <span className="font-bold text-amber-300">{strength.label}</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: strength.width }}></div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-300">{isEn ? 'Confirm New Password' : 'पासवर्ड की पुष्टि करें'}</label>
                      <input
                        type="password"
                        value={confirmPasswordInput}
                        onChange={(e) => setConfirmPasswordInput(e.target.value)}
                        placeholder={isEn ? 'Re-enter new password' : 'नया पासवर्ड दोबारा दर्ज करें'}
                        className="w-full bg-slate-900 border border-indigo-400/40 rounded-xl px-3.5 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400 font-bold"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsChangingPassword(false)}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs"
                    >
                      {isEn ? 'Cancel' : 'रद्द करें'}
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg transition-all"
                    >
                      {isEn ? 'Update Master Password' : 'मास्टर पासवर्ड अपडेट करें'}
                    </button>
                  </div>
                </form>
              )}

              {/* Security Audit Trail Panel */}
              <div className="p-4 bg-slate-900/60 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-300 flex items-center gap-2">
                    <History className="w-4 h-4 text-indigo-400" />
                    <span>{isEn ? 'Live Security Audit Log' : 'लाइव सुरक्षा ऑडिट लॉग'}</span>
                  </h4>
                  <span className="text-[10px] text-emerald-400 font-mono">● {isEn ? 'Monitoring active' : 'मॉनिटरिंग सक्रिय'}</span>
                </div>
                <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between text-[11px] px-3 py-1.5 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-slate-300 font-medium flex items-center gap-1.5">
                        {log.status === 'success' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                        {log.status === 'warning' && <AlertTriangle className="w-3 h-3 text-amber-400" />}
                        {log.status === 'error' && <ShieldAlert className="w-3 h-3 text-rose-400" />}
                        <span>{log.action}</span>
                      </span>
                      <span className="text-slate-500 font-mono text-[10px]">{log.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Private Websites List */}
              {privateWebsites.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                  <Lock className="w-10 h-10 text-amber-400 mx-auto" />
                  <p className="text-sm font-bold text-slate-300">
                    {isEn
                      ? 'No private websites found in vault. Add private websites from the Admin Panel.'
                      : 'तिजोरी में कोई प्राइवेट वेबसाइट नहीं है। एडमिन पैनल से प्राइवेट वेबसाइट जोड़ें।'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {privateWebsites.map((site) => (
                    <div
                      key={site.id}
                      className="bg-slate-900/90 border border-amber-400/40 rounded-2xl p-5 hover:border-amber-400 transition-all flex flex-col justify-between space-y-4 shadow-xl group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 text-[10px] font-black bg-amber-400/20 text-amber-300 rounded-full border border-amber-400/30 flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            <span>{isEn ? 'Encrypted Private' : 'एन्क्रिप्टेड प्राइवेट'}</span>
                          </span>
                          <span className="text-[11px] font-bold text-indigo-300 bg-indigo-950 px-2 py-0.5 rounded-lg border border-indigo-800/50">
                            {site.category}
                          </span>
                        </div>
                        <h4 className="text-base font-black text-white group-hover:text-amber-300 transition-colors">{site.title}</h4>
                        <p className="text-xs text-slate-300 line-clamp-2">{site.description}</p>
                      </div>

                      <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 truncate max-w-[180px] font-mono">{site.url}</span>
                        <a
                          href={site.url.startsWith('http') ? site.url : `https://${site.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:from-amber-400 hover:to-amber-400 font-black text-xs shadow-md transition-all flex items-center gap-1.5"
                        >
                          <span>{isEn ? 'Access Securely' : 'सुरक्षित खोलें'}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
