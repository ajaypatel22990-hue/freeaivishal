import React, { useState } from 'react';
import { Headphones, Mail, Send, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useToast } from './Toast';
import { Language } from '../translations';

interface CustomerCareModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: Language;
}

export const CustomerCareModal: React.FC<CustomerCareModalProps> = ({ isOpen, onClose, language = 'hi' }) => {
  const { showToast } = useToast();
  const isEn = language === 'en';
  const supportEmail = 'freeaivishalcompany@gmail.com';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'Technical Bug / Technical Problem',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) {
      showToast(isEn ? 'Please fill in your name and problem description' : 'कृपया अपना नाम और समस्या का विवरण दर्ज करें', 'error');
      return;
    }

    const reportItem = {
      id: 'rep-' + Date.now(),
      name: formData.name.trim(),
      email: formData.email.trim() || 'Not Provided',
      category: formData.category,
      message: formData.message.trim(),
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'pending'
    };

    // 1. Save to Firestore support_reports collection
    try {
      await setDoc(doc(db, 'support_reports', reportItem.id), reportItem);
    } catch (err) {
      console.warn('Firestore report save warning:', err);
    }

    // 2. Save to Express server backend & trigger sync
    try {
      await fetch('/api/support/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportItem),
      });
    } catch (err) {
      console.warn('Server report save warning:', err);
    }

    // 3. Send email directly to admin inbox (minecraft647vi@gmail.com & freeaivishalcompany@gmail.com) via Web3Forms API
    try {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: '20623049-74e6-42ee-8e4a-4648792015ed',
          subject: `[Free AI Vishal Company Report] ${reportItem.category} - ${reportItem.name}`,
          from_name: reportItem.name,
          email: formData.email.trim() || 'support@freeaivishal.com',
          message: `Name: ${reportItem.name}\nEmail: ${reportItem.email}\nCategory: ${reportItem.category}\n\nProblem Description:\n${reportItem.message}\n\nTarget Inboxes: minecraft647vi@gmail.com, freeaivishalcompany@gmail.com`
        })
      });
    } catch (emailErr) {
      console.warn('Web3Forms dispatch warning:', emailErr);
    }

    // 4. Also open mailto link as backup
    const subject = encodeURIComponent(`[Help Center Report] ${reportItem.category} - ${reportItem.name}`);
    const body = encodeURIComponent(`Name: ${reportItem.name}\nEmail: ${reportItem.email}\nCategory: ${reportItem.category}\n\nProblem Description:\n${reportItem.message}`);
    window.open(`mailto:freeaivishalcompany@gmail.com?subject=${subject}&body=${body}`, '_blank');

    setSubmitted(true);
    showToast(
      isEn 
        ? 'Problem reported successfully! Sent to admin inbox (minecraft647vi@gmail.com) & saved to database.' 
        : 'समस्या सफलतापूर्वक दर्ज हो गई! एडमिन इनबॉक्स (minecraft647vi@gmail.com) पर भेज दी गई और डेटाबेस में सेव हो गई।', 
      'success'
    );

    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', category: 'Technical Bug / Technical Problem', message: '' });
      onClose();
    }, 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-indigo-500/30 text-white animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-slate-900/80 backdrop-blur-md p-6 relative border-b border-indigo-500/20">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 text-white font-bold flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3.5 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-amber-300 shadow-lg shadow-indigo-500/30">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
                <span>{isEn ? '24/7 Help Center' : '24/7 कस्टमर केयर'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black mt-1">
                {isEn ? 'Customer Care & Report Center' : 'कस्टमर केयर और हेल्प सेंटर'}
              </h2>
            </div>
          </div>
          <p className="text-xs text-indigo-300 mt-1">
            {isEn 
              ? `Connected directly to official support: ${supportEmail}` 
              : `आधिकारिक सपोर्ट ईमेल से जुड़ा हुआ: ${supportEmail}`}
          </p>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-400/40 rounded-full flex items-center justify-center text-emerald-400 mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">
              {isEn ? 'Problem Submitted Successfully!' : 'आपकी समस्या दर्ज हो गई है!'}
            </h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              {isEn 
                ? `Your report has been saved to the database and sent to ${supportEmail}.` 
                : `आपकी रिपोर्ट डेटाबेस में सेव हो गई है और ${supportEmail} पर भेज दी गई है।`}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
            <div className="p-3.5 rounded-2xl bg-indigo-900/30 border border-indigo-500/20 text-xs text-indigo-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                {isEn 
                  ? 'Facing any bug, error, or issue? Tell us below to save it to our database and notify support.' 
                  : 'वेबसाइट में कोई एरर, बग या समस्या आ रही है? नीचे फॉर्म भरकर भेजें ताकि यह सीधे डेटाबेस और हमारी सपोर्ट टीम तक पहुंचे।'}
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block">
                {isEn ? 'Your Name' : 'आपका नाम'} *
              </label>
              <input
                type="text"
                required
                placeholder={isEn ? 'Enter your full name' : 'अपना पूरा नाम दर्ज करें'}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-indigo-500/30 bg-slate-950 text-white placeholder-slate-500 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block">
                {isEn ? 'Your Email (Optional)' : 'आपका ईमेल (वैकल्पिक)'}
              </label>
              <input
                type="email"
                placeholder="yourname@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-indigo-500/30 bg-slate-950 text-white placeholder-slate-500 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block">
                {isEn ? 'Issue Category' : 'समस्या का प्रकार'}
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-indigo-500/30 bg-slate-950 text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Technical Bug / Error">Technical Bug / Error (तकनीकी समस्या या एरर)</option>
                <option value="Website Report / DMCA">Website Report / DMCA (वेबसाइट रिपोर्ट)</option>
                <option value="Login / Password Issue">Login / Password Issue (लॉगिन समस्या)</option>
                <option value="Other Query">Other Query (अन्य पूछताछ)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block">
                {isEn ? 'Describe Your Problem' : 'अपनी समस्या या रिपोर्ट विस्तार से बताएं'} *
              </label>
              <textarea
                required
                rows={4}
                placeholder={isEn ? 'Describe the bug or issue you encountered...' : 'यहाँ अपनी समस्या या एरर के बारे में विस्तार से लिखें...'}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-indigo-500/30 bg-slate-950 text-white placeholder-slate-500 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isEn ? 'Submit Problem / Report to Support' : 'समस्या रिपोर्ट भेजें (Submit Report)'}</span>
              </button>
            </div>

            <div className="text-center pt-1">
              <a
                href={`mailto:${supportEmail}?subject=Direct%20Support%20Query`}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Direct Email: {supportEmail}</span>
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
