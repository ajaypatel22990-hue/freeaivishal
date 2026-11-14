import React from 'react';
import { Sparkles } from 'lucide-react';
import { Language } from '../translations';

interface AdSenseSlotProps {
  language?: Language;
  slotName?: string;
}

export const AdSenseSlot: React.FC<AdSenseSlotProps> = ({ language = 'hi', slotName = 'Bottom Banner Ad' }) => {
  const isEn = language === 'en';

  return (
    <div className="w-full max-w-5xl mx-auto my-8 px-4">
      <div className="rounded-3xl border-2 border-dashed border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-r from-indigo-50/50 via-slate-50 to-violet-50/50 dark:from-slate-900/60 dark:via-slate-900 dark:to-indigo-950/40 p-5 text-center transition-all shadow-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            {isEn ? 'Google AdSense Ready Space' : 'गूगल एड्सेंस विज्ञापन स्पेस (AdSpace)'}
          </span>
        </div>
        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
          {isEn
            ? `[ AdSense Responsive Ad Unit: ${slotName} ] — Monetization Enabled Space`
            : `[ एड्सेंस रिस्पॉन्सिव विज्ञापन यूनिट: ${slotName} ] — मोनेटाइजेशन रेडी विज्ञापन स्लॉट`}
        </p>
        <p className="text-[10px] text-slate-400 mt-1">
          {isEn
            ? 'When Google AdSense is approved, ads will automatically display in this dedicated container.'
            : 'जब आपकी वेबसाइट गूगल एड्सेंस से मोनेटाइज होगी, तब यहाँ आपका असली विज्ञापन स्वतः चलने लगेगा।'}
        </p>
      </div>
    </div>
  );
};
