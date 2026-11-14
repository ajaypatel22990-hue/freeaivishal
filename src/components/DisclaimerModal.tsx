import React from 'react';
import { AlertCircle, X, Mail } from 'lucide-react';
import { Language } from '../translations';

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: Language;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ isOpen, onClose, language = 'hi' }) => {
  if (!isOpen) return null;
  const isEn = language === 'en';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-indigo-100 dark:border-slate-800 p-6 sm:p-8 space-y-6 text-slate-800 dark:text-slate-200" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {isEn ? 'Disclaimer & Ad Disclosure' : 'डिस्क्लेमर (Disclaimer)'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Free AI Vishal Company • CEO: Vishal Patel</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <p>
            {isEn
              ? 'The information provided by Free AI Vishal Company (created by Vishal Patel - CEO) on our portals is for general informational purposes only. All information is provided in good faith.'
              : 'फ्री एआई विशाल कंपनी (संस्थापक: विशाल पटेल) द्वारा हमारे पोर्टल्स पर प्रदान की गई जानकारी केवल सामान्य सूचना के उद्देश्यों के लिए है।'}
          </p>

          <h3 className="text-sm font-bold text-slate-900 dark:text-white pt-2">
            {isEn ? 'Advertisement Disclosure (Google AdSense)' : 'विज्ञापन डिस्क्लोजर (गूगल एड्सेंस)'}
          </h3>
          <p>
            {isEn
              ? 'We display advertisements served by Google AdSense and third-party ad networks. These networks may use cookies to personalize ads based on your browsing history across the web.'
              : 'हम गूगल एड्सेंस और थर्ड-पार्टी विज्ञापन नेटवर्क द्वारा परोसे जाने वाले विज्ञापन प्रदर्शित करते हैं। ये नेटवर्क आपके ब्राउज़िंग इतिहास के आधार पर विज्ञापनों को वैयक्तिकृत करने के लिए कुकीज़ का उपयोग कर सकते हैं।'}
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
