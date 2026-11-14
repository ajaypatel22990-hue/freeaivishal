import React, { useEffect, useState } from 'react';
import { Languages, X, Check, Search, Globe } from 'lucide-react';
import { Language, languageNames } from '../translations';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onSelectLanguage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Lock background scroll when modal is open to prevent home page from scrolling
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isEn = currentLanguage === 'en';

  const filteredLanguages = (Object.keys(languageNames) as Language[]).filter((key) => {
    const name = languageNames[key].toLowerCase();
    const q = searchQuery.toLowerCase();
    return name.includes(q) || key.includes(q);
  });

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-amber-300">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black">
                {isEn ? 'Select Language' : 'भाषा चुनें (Language Settings)'}
              </h2>
              <p className="text-xs text-indigo-200">
                {isEn ? 'Choose English or Hindi for full translation' : 'पूरी वेबसाइट की भाषा 100% बदलने के लिए चुनें'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            title={isEn ? 'Close' : 'बंद करें'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={isEn ? 'Search language...' : 'भाषा खोजें (Search language)...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
            />
          </div>
        </div>

        {/* Dedicated Scrollable Language List with Touch & Wheel Lock */}
        <div
          className="p-4 overflow-y-auto overscroll-contain space-y-2 flex-1 scroll-smooth"
          style={{
            touchAction: 'pan-y',
            WebkitOverflowScrolling: 'touch',
          }}
          onWheel={(e) => e.stopPropagation()}
        >
          {filteredLanguages.map((langKey) => {
            const isSelected = currentLanguage === langKey;
            const isPrimary = langKey === 'hi' || langKey === 'en';

            return (
              <button
                key={langKey}
                onClick={() => {
                  onSelectLanguage(langKey);
                  onClose();
                }}
                className={`w-full p-3.5 rounded-2xl text-left transition-all flex items-center justify-between border cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200 scale-[1.01]'
                    : isPrimary
                    ? 'bg-indigo-50/60 hover:bg-indigo-100/80 border-indigo-200 text-indigo-950 font-bold'
                    : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black uppercase ${
                      isSelected
                        ? 'bg-white text-indigo-700'
                        : isPrimary
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {langKey}
                  </div>
                  <div>
                    <span className={`text-sm font-bold block ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {languageNames[langKey]}
                    </span>
                    {langKey === 'en' && (
                      <span className={`text-[10px] block ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>
                        100% Complete English Version
                      </span>
                    )}
                    {langKey === 'hi' && (
                      <span className={`text-[10px] block ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>
                        100% संपूर्ण हिंदी संस्करण
                      </span>
                    )}
                    {langKey === 'gu' && (
                      <span className={`text-[10px] block ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>
                        100% સંપૂર્ણ ગુજરાતી આવૃત્તિ (Full Gujarati)
                      </span>
                    )}
                    {langKey === 'mr' && (
                      <span className={`text-[10px] block ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>
                        100% संपूर्ण मराठी आवृत्ती (Full Marathi)
                      </span>
                    )}
                    {langKey === 'ks' && (
                      <span className={`text-[10px] block ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>
                        100% پُورٕ کٲشُر ترجمہٕ (Full Kashmiri)
                      </span>
                    )}
                    {langKey === 'bn' && (
                      <span className={`text-[10px] block ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>
                        100% সম্পূর্ণ বাংলা সংস্করণ (Full Bengali)
                      </span>
                    )}
                    {langKey === 'pa' && (
                      <span className={`text-[10px] block ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>
                        100% ਸੰਪੂਰਨ ਪੰਜਾਬੀ ਸੰਸਕਰਣ (Full Punjabi)
                      </span>
                    )}
                    {langKey === 'ta' && (
                      <span className={`text-[10px] block ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>
                        100% முழுமையான தமிழ் பதிப்பு (Full Tamil)
                      </span>
                    )}
                    {langKey === 'te' && (
                      <span className={`text-[10px] block ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>
                        100% సంపూర్ణ తెలుగు వెర్షన్ (Full Telugu)
                      </span>
                    )}
                    {langKey === 'ur' && (
                      <span className={`text-[10px] block ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>
                        100% مکمل اردو ترجمہ (Full Urdu)
                      </span>
                    )}
                    {langKey === 'sa' && (
                      <span className={`text-[10px] block ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>
                        100% सम्पूर्णं संस्कृतम् (Full Sanskrit)
                      </span>
                    )}
                  </div>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-white text-indigo-600 flex items-center justify-center shrink-0 shadow-sm">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}

          {filteredLanguages.length === 0 && (
            <div className="py-8 text-center text-slate-400 text-xs font-semibold">
              {isEn ? 'No language found' : 'कोई भाषा नहीं मिली'}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>{isEn ? 'Select English for 100% English' : 'हिंदी या इंग्लिश चुनें'}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition-colors"
          >
            {isEn ? 'Cancel' : 'रद्द करें'}
          </button>
        </div>
      </div>
    </div>
  );
};
