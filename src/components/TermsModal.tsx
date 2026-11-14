import React from 'react';
import { FileText, X, Mail } from 'lucide-react';
import { Language } from '../translations';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: Language;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, language = 'hi' }) => {
  if (!isOpen) return null;
  const isEn = language === 'en';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-indigo-100 dark:border-slate-800 p-6 sm:p-8 space-y-6 text-slate-800 dark:text-slate-200" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {isEn ? 'Terms & Conditions' : 'नियम और शर्तें (Terms & Conditions)'}
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
              ? 'Welcome to Free AI Vishal Company. By accessing and using our website and portals, you accept and agree to be bound by the terms and provision of this agreement.'
              : 'फ्री एआई विशाल कंपनी में आपका स्वागत है। हमारी वेबसाइट और पोर्टल्स का उपयोग करके, आप इस समझौते के नियमों और प्रावधानों से बंधे होने के लिए सहमत हैं।'}
          </p>

          <h3 className="text-sm font-bold text-slate-900 dark:text-white pt-2">
            {isEn ? '1. Use License' : '1. उपयोग लाइसेंस'}
          </h3>
          <p>
            {isEn
              ? 'Permission is granted to temporarily download one copy of the materials on Free AI Vishal Company for personal, non-commercial transitory viewing only.'
              : 'व्यक्तिगत और गैर-व्यापारिक उद्देश्यों के लिए फ्री एआई विशाल कंपनी की सामग्री की एक प्रति अस्थायी रूप से डाउनलोड करने की अनुमति है।'}
          </p>

          <h3 className="text-sm font-bold text-slate-900 dark:text-white pt-2">
            {isEn ? '2. Disclaimer & AdSense Compliance' : '2. अस्वीकरण और एड्सेंस अनुपालन'}
          </h3>
          <p>
            {isEn
              ? 'The materials on Free AI Vishal Company are provided on an \'as is\' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties. Advertisements displayed via Google AdSense are governed by Google\'s policies.'
              : 'फ्री एआई विशाल कंपनी की सामग्री "जैसी है" के आधार पर प्रदान की जाती है। गूगल एड्सेंस के माध्यम से प्रदर्शित विज्ञापन गूगल की नीतियों के अधीन हैं।'}
          </p>

          <h3 className="text-sm font-bold text-slate-900 dark:text-white pt-2">
            {isEn ? '3. Governing Law' : '3. गवर्निंग लॉ'}
          </h3>
          <p>
            {isEn
              ? 'Any claim relating to Free AI Vishal Company shall be governed by the laws of India without regard to its conflict of law provisions.'
              : 'फ्री एआई विशाल कंपनी से संबंधित किसी भी दावे को भारत के कानूनों के अनुसार नियंत्रित किया जाएगा।'}
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
