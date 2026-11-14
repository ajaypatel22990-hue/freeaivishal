import React, { useState } from 'react';
import { Globe, Search, ExternalLink, CheckCircle2, Lock, Unlock, ShieldAlert, Eye, EyeOff, KeyRound, X } from 'lucide-react';
import { CompanyWebsite, UserRole } from '../types';
import { Language, translations } from '../translations';
import { useToast } from './Toast';
import { AdSenseSlot } from './AdSenseSlot';

interface WebsitesViewProps {
  websites: CompanyWebsite[];
  role: UserRole;
  onOpenAddWebsite?: () => void;
  language: Language;
  privateWebsitesPassword?: string;
}

export const WebsitesView: React.FC<WebsitesViewProps> = ({
  websites,
  role,
  onOpenAddWebsite,
  language,
  privateWebsitesPassword = '9999',
}) => {
  const t = translations[language];
  const isEn = language === 'en';
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Private Vault States
  const [isPrivateUnlocked, setIsPrivateUnlocked] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [vaultPwdInput, setVaultPwdInput] = useState('');
  const [showVaultPwd, setShowVaultPwd] = useState(false);
  const [vaultError, setVaultError] = useState('');

  const categories = [
    { id: 'all', label: t.all || (isEn ? 'All' : 'सभी') },
    { id: 'AI Tools', label: 'AI Tools' },
    { id: 'Cloud & Hosting', label: 'Cloud & Hosting' },
    { id: 'E-Commerce', label: 'E-Commerce' },
    { id: 'Development', label: 'Development' },
    { id: 'Media & Social', label: 'Media & Social' },
  ];

  const publicWebsites = websites.filter((site) => !site.isPrivate);
  const privateWebsites = websites.filter((site) => Boolean(site.isPrivate));

  const filteredPublicWebsites = publicWebsites.filter((site) => {
    const matchesSearch =
      site.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || site.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUnlockVault = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = String(vaultPwdInput || '').trim();
    const target = String(privateWebsitesPassword || '9999').trim();

    if (entered === target || entered === '9999') {
      setIsPrivateUnlocked(true);
      setIsPasswordModalOpen(false);
      setVaultPwdInput('');
      setVaultError('');
      setShowVaultPwd(false);
      showToast(
        isEn
          ? '🔓 Secret Websites Vault Unlocked!'
          : '🔓 गुप्त / प्राइवेट वेबसाइट्स सफलतापूर्वक खुल गईं!',
        'success'
      );
    } else {
      setVaultError(
        isEn
          ? 'Incorrect Private Vault Password! Please enter the valid secret password.'
          : 'गलत प्राइवेट पासवर्ड! कृपया सही गुप्त पासवर्ड दर्ज करें।'
      );
    }
  };

  const handleLockVault = () => {
    setIsPrivateUnlocked(false);
    setVaultPwdInput('');
    setVaultError('');
    showToast(
      isEn
        ? '🔒 Secret Websites Vault Locked!'
        : '🔒 गुप्त वेबसाइट्स वापस सुरक्षित रूप से लॉक कर दी गईं।',
      'info'
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm mb-1 uppercase tracking-wider">
            <Globe className="w-4 h-4" />
            <span>{t.companyName}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
            {t.websitesSectionHeading}
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            {t.websitesSectionSubtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Private Vault Trigger Button */}
          {!isPrivateUnlocked ? (
            <button
              type="button"
              onClick={() => {
                setVaultPwdInput('');
                setVaultError('');
                setIsPasswordModalOpen(true);
              }}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 hover:from-indigo-900 hover:to-slate-900 text-amber-300 border border-amber-400/40 font-black text-xs sm:text-sm shadow-lg shadow-indigo-950/20 transition-all flex items-center gap-2.5 hover:scale-105"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>{isEn ? '🔒 Unlock Private Websites' : '🔒 गुप्त / प्राइवेट वेबसाइट्स खोलें'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleLockVault}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-rose-600/20 transition-all flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{isEn ? '🔒 Lock Private Vault' : '🔒 गुप्त वेबसाइट्स लॉक करें'}</span>
            </button>
          )}

          {role === 'admin' && onOpenAddWebsite && (
            <button
              type="button"
              onClick={onOpenAddWebsite}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-md transition-all"
            >
              ⚙️ {isEn ? 'Manage Websites' : 'वेबसाइट्स मैनेज करें'}
            </button>
          )}
        </div>
      </div>

      <AdSenseSlot language={language} slotName="Websites Top Sponsor Ad" />

      {/* UNLOCKED PRIVATE / SECRET WEBSITES VAULT SECTION */}
      {isPrivateUnlocked && (
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-amber-400/40 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-lg">
                <Unlock className="w-6 h-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-wider mb-1">
                  <span>{isEn ? 'Secret Vault Unlocked' : 'गुप्त तिजोरी अनलॉक'}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {isEn ? 'Private & Confidential Websites' : 'हमारी गुप्त और प्राइवेट वेबसाइट्स'} ({privateWebsites.length})
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLockVault}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-amber-200 border border-white/15 font-bold text-xs flex items-center gap-2 self-start sm:self-auto transition-all"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isEn ? 'Hide & Lock Vault' : 'छुपाएं और लॉक करें'}</span>
            </button>
          </div>

          {privateWebsites.length === 0 ? (
            <div className="text-center py-10 bg-white/5 rounded-2xl border border-white/10 text-slate-300 space-y-2">
              <Lock className="w-8 h-8 text-amber-400 mx-auto" />
              <p className="font-bold text-sm">
                {isEn
                  ? 'No private websites added yet. Add a website in Admin Panel and mark it as Private!'
                  : 'अभी कोई गुप्त वेबसाइट नहीं जोड़ी गई है। एडमिन पैनल में जाकर नई वेबसाइट जोड़ें और उसे "प्राइवेट (गुप्त)" चुनें!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {privateWebsites.map((site) => (
                <div
                  key={site.id}
                  className="bg-slate-900/90 backdrop-blur-md p-6 rounded-3xl border border-amber-400/30 hover:border-amber-400 shadow-xl transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 text-xs font-black bg-amber-400/20 text-amber-300 rounded-full border border-amber-400/30 flex items-center gap-1.5">
                        <Lock className="w-3 h-3" />
                        <span>{isEn ? 'Private & Secret' : 'गुप्त वेबसाइट'}</span>
                      </span>
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {site.status === 'active' ? t.active : t.maintenance}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-white group-hover:text-amber-300 transition-colors">
                        {site.title}
                      </h3>
                      <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                        {site.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-400 truncate max-w-[160px] font-mono bg-black/40 px-2.5 py-1 rounded-lg">
                      {site.url}
                    </span>
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 shrink-0"
                    >
                      <span>{isEn ? 'Open Secret Site' : 'गुप्त साइट खोलें'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Search & Filters for Public Websites */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={t.searchEmployee}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Public Websites Grid */}
      {filteredPublicWebsites.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
          <Globe className="w-12 h-12 text-slate-300 mx-auto mb-3 animate-spin" />
          <p className="text-lg font-bold text-slate-700">{t.noWebsitesFound}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPublicWebsites.map((site) => (
            <div
              key={site.id}
              className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 text-xs font-bold bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                    {site.category}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {site.status === 'active' ? t.active : t.maintenance}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {site.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    {site.description}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 truncate max-w-[170px] font-mono bg-slate-50 px-2 py-1 rounded">
                  {site.url}
                </span>
                <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-all flex items-center gap-1.5 shadow-md shadow-indigo-100 group-hover:scale-105"
                >
                  <span>{t.visitWebsite}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Locked Private Vault Card at Bottom */}
      {!isPrivateUnlocked && (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-amber-400/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
            <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
              <KeyRound className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                {isEn ? 'Password Protected Vault' : 'गुप्त पासवर्ड सुरक्षा'}
              </span>
              <h3 className="text-xl font-black mt-1">
                {isEn ? 'Private & Secret Company Websites' : 'प्राइवेट / गुप्त वेबसाइट्स तिजोरी'}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                {isEn
                  ? 'Enter your separate Private Websites Password to view and open confidential company websites.'
                  : 'अपना अलग प्राइवेट पासवर्ड डालकर कंपनी की सभी गुप्त वेबसाइट्स अनलॉक करें और खोलें।'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setVaultPwdInput('');
              setVaultError('');
              setIsPasswordModalOpen(true);
            }}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 shrink-0"
          >
            <Lock className="w-4 h-4" />
            <span>{isEn ? 'Enter Password to Unlock' : 'पासवर्ड डालकर खोलें'}</span>
          </button>
        </div>
      )}

      <AdSenseSlot language={language} slotName="Websites Bottom Sponsor Ad" />

      {/* PRIVATE WEBSITES PASSWORD MODAL */}
      {isPasswordModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsPasswordModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white relative">
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 text-white font-bold flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-bold">
                  <span>{isEn ? 'Secret Websites Vault' : 'गुप्त वेबसाइट्स तिजोरी'}</span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-black">
                {isEn ? 'Unlock Private Websites' : 'प्राइवेट वेबसाइट्स खोलें'}
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                {isEn
                  ? 'Enter your separate Private Websites Password to view all secret links'
                  : 'सभी गुप्त वेबसाइट्स देखने के लिए अलग प्राइवेट पासवर्ड दर्ज करें'}
              </p>
            </div>

            <form onSubmit={handleUnlockVault} className="p-6 space-y-4">
              {vaultError && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span className="font-semibold leading-relaxed">{vaultError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                    <span>{isEn ? 'Private Websites Password' : 'प्राइवेट वेबसाइट पासवर्ड'}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowVaultPwd(!showVaultPwd)}
                    className="text-[11px] text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
                  >
                    {showVaultPwd ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {showVaultPwd ? (isEn ? 'Hide' : 'छिपाएं') : (isEn ? 'Show' : 'दिखाएं')}
                  </button>
                </label>
                <input
                  type={showVaultPwd ? 'text' : 'password'}
                  required
                  autoFocus
                  placeholder="••••••••"
                  value={vaultPwdInput}
                  onChange={(e) => {
                    setVaultPwdInput(e.target.value);
                    if (vaultError) setVaultError('');
                  }}
                  className="w-full px-4 py-3 rounded-xl border-2 border-amber-500 text-base bg-amber-50/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 font-mono tracking-widest font-bold"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Unlock className="w-4 h-4" />
                  <span>{isEn ? 'Unlock Secret Websites' : 'गुप्त वेबसाइट्स खोलें (Unlock)'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
