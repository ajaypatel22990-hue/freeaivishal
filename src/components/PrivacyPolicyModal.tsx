import React from 'react';
import { ShieldCheck, X, Mail } from 'lucide-react';
import { Language } from '../translations';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: Language;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose, language = 'hi' }) => {
  if (!isOpen) return null;
  const isEn = language === 'en';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-indigo-100 dark:border-slate-800 p-6 sm:p-8 space-y-6 text-slate-800 dark:text-slate-200" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {isEn ? 'Privacy Policy' : 'प्राइवेसी पॉलिसी (Privacy Policy)'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Free AI Vishal Company • Last Updated: 2026</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <p>
            {isEn
              ? 'At Free AI Vishal Company (accessible via our official portals, created by Vishal Patel - CEO), the privacy of our visitors is of extreme importance to us. This Privacy Policy document outlines the types of personal information is received and collected by Free AI Vishal Company and how it is used.'
              : 'फ्री एआई विशाल कंपनी (संस्थापक व सीईओ: विशाल पटेल) में हमारे विजिटर्स की गोपनीयता हमारे लिए अत्यंत महत्वपूर्ण है। यह प्राइवेसी पॉलिसी दस्तावेज़ उन प्रकार की व्यक्तिगत जानकारी को रेखांकित करता है जो फ्री एआई विशाल कंपनी द्वारा प्राप्त और एकत्र की जाती है।'}
          </p>

          <h3 className="text-sm font-bold text-slate-900 dark:text-white pt-2">
            {isEn ? 'Google AdSense & Third-Party Vendors' : 'गूगल एड्सेंस और थर्ड-पार्टी विज्ञापनदाता'}
          </h3>
          <p>
            {isEn
              ? 'Google, as a third-party vendor, uses cookies to serve ads on our site. Google\'s use of the DART cookie enables it to serve ads to our users based on their visit to our sites and other sites on the Internet. Users may opt out of the use of the DART cookie by visiting the Google ad and content network privacy policy.'
              : 'गूगल, एक थर्ड-पार्टी वेंडर के रूप में, हमारी साइट पर विज्ञापन दिखाने के लिए कुकीज़ का उपयोग करता है। गूगल का DART कुकी का उपयोग इसे हमारी साइटों और इंटरनेट पर अन्य साइटों पर उनकी यात्रा के आधार पर हमारे उपयोगकर्ताओं को विज्ञापन परोसने में सक्षम बनाता है। उपयोगकर्ता गूगल विज्ञापन और कंटेंट नेटवर्क प्राइवेसी पॉलिसी पर जाकर DART कुकी के उपयोग से ऑप्ट-आउट कर सकते हैं।'}
          </p>

          <h3 className="text-sm font-bold text-slate-900 dark:text-white pt-2">
            {isEn ? 'Log Files & Analytics' : 'लॉग फाइल्स और एनालिटिक्स'}
          </h3>
          <p>
            {isEn
              ? 'Like many other Web sites, Free AI Vishal Company makes use of log files. The information inside the log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date/time stamp, referring/exit pages, and number of clicks to analyze trends, administer the site, track user\'s movement around the site, and gather demographic information.'
              : 'कई अन्य वेबसाइटों की तरह, फ्री एआई विशाल कंपनी लॉग फाइल्स का उपयोग करती है। लॉग फाइल्स के अंदर की जानकारी में आईपी पते, ब्राउज़र प्रकार, आईएसपी, दिनांक/समय स्टैंप, रेफरेरिंग/एग्जिट पेज और क्लिक्स शामिल होते हैं।'}
          </p>

          <h3 className="text-sm font-bold text-slate-900 dark:text-white pt-2">
            {isEn ? 'Contact Information' : 'संपर्क जानकारी'}
          </h3>
          <p>
            {isEn
              ? 'If you require any more information or have any questions about our privacy policy, please feel free to contact us by email at freeaivishalcompany@gmail.com.'
              : 'यदि आपको हमारी प्राइवेसी पॉलिसी के बारे में अधिक जानकारी की आवश्यकता है या कोई प्रश्न पूछना है, तो कृपया बेझिझक हमसे freeaivishalcompany@gmail.com पर संपर्क करें।'}
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <a href="mailto:freeaivishalcompany@gmail.com" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
            <Mail className="w-4 h-4" />
            <span>freeaivishalcompany@gmail.com</span>
          </a>
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-200 dark:shadow-none hover:bg-indigo-500 transition-colors">
            {isEn ? 'Close' : 'बंद करें'}
          </button>
        </div>
      </div>
    </div>
  );
};
