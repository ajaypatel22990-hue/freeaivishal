import React, { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';
import { Language } from '../translations';

interface CookieConsentBannerProps {
  onOpenPrivacyPolicy: () => void;
  language?: Language;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({ onOpenPrivacyPolicy, language = 'hi' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const isEn = language === 'en';

  useEffect(() => {
    const consented = localStorage.getItem('fav_cookie_consented');
    if (!consented) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('fav_cookie_consented', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md text-white border-t border-indigo-500/30 p-4 sm:p-5 shadow-2xl animate-in slide-in-from-bottom duration-300">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-xs sm:text-sm">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-amber-300 shrink-0">
            <Cookie className="w-5 h-5" />
          </div>
          <p className="text-slate-300">
            {isEn
              ? 'We use cookies and Google AdSense to personalize content, analyze traffic, and serve targeted advertisements. By using our site, you agree to our use of cookies.'
              : 'हम सामग्री को वैयक्तिकृत करने, विज्ञापनों को दिखाने और ट्रैफ़िक का विश्लेषण करने के लिए कुकीज़ और गूगल एड्सेंस का उपयोग करते हैं। साइट का उपयोग करके आप हमारी प्राइवेसी पॉलिसी से सहमत होते हैं।'}
            <button
              type="button"
              onClick={onOpenPrivacyPolicy}
              className="text-indigo-400 underline hover:text-indigo-300 font-bold ml-1.5"
            >
              {isEn ? 'Privacy Policy' : 'प्राइवेसी पॉलिसी'}
            </button>
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleAccept}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition-all"
          >
            {isEn ? 'Accept & Continue' : 'स्वीकार करें (Accept)'}
          </button>
        </div>
      </div>
    </div>
  );
};
