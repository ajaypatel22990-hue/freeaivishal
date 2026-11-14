import React from 'react';
import { UserCheck, Shield, Phone, Mail, MapPin, Calendar, DollarSign, Award, Globe, ExternalLink, FileText, CheckCircle2 } from 'lucide-react';
import { Employee, CompanyWebsite, Announcement } from '../types';
import { useToast } from './Toast';

interface EmployeeDashboardViewProps {
  employee: Employee;
  websites: CompanyWebsite[];
  announcements: Announcement[];
}

export const EmployeeDashboardView: React.FC<EmployeeDashboardViewProps> = ({
  employee,
  websites,
  announcements,
}) => {
  const { showToast } = useToast();
  const [showAadhaar, setShowAadhaar] = React.useState(false);
  const publicWebsites = websites.filter((site) => !site.isPrivate);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-violet-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative flex flex-col md:flex-row items-center gap-6">
          <img
            src={employee.photoUrl}
            alt={employee.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white/20 shadow-2xl"
          />
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-semibold">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>सक्रिय एम्प्लॉई पोर्टल (Employee Portal)</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black">स्वागत है, {employee.name}!</h1>
            <p className="text-indigo-200 text-sm">
              रोल नंबर: <span className="font-mono font-bold text-white">{employee.rollNumber}</span> | पद: <span className="font-bold text-white">{employee.role}</span> ({employee.department})
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Personal Details Card */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-lg font-black text-slate-900">एम्प्लॉई विवरण (Your Profile)</h3>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">
              सक्रिय (Active)
            </span>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">नाम:</span>
              <span className="font-bold text-slate-900">{employee.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">रोल नंबर (ID):</span>
              <span className="font-mono font-bold text-indigo-600">{employee.rollNumber}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">मोबाइल नंबर:</span>
              <span className="font-mono font-bold text-slate-900">{employee.mobileNumber}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">आधार कार्ड नंबर:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-900">
                  {showAadhaar ? employee.aadhaarNumber : `XXXX-XXXX-${(employee.aadhaarNumber || '1234').slice(-4)}`}
                </span>
                <button
                  type="button"
                  onClick={() => setShowAadhaar(!showAadhaar)}
                  className="text-[10px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-lg border border-indigo-200 transition-colors"
                >
                  {showAadhaar ? 'छिपाएं' : 'दिखाएं'}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">विभाग:</span>
              <span className="font-bold text-slate-900">{employee.department}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">मासिक वेतन (Salary):</span>
              <span className="font-bold text-emerald-600">₹{employee.salary.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">ज्वाइनिंग तारीख:</span>
              <span className="font-bold text-slate-900">{employee.joiningDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">ईमेल:</span>
              <span className="font-medium text-slate-700 text-xs truncate max-w-[180px]">{employee.email}</span>
            </div>
            <div className="pt-2 border-t border-slate-100">
              <span className="text-slate-500 font-medium block mb-1">पता (Address):</span>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">{employee.address}</p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => showToast('पेस्लिप डाउनलोड अनुरोध सफलतापूर्वक भेजा गया है।', 'success')}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-100 transition-all flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>मासिक पेस्लिप डाउनलोड करें</span>
            </button>
          </div>
        </div>

        {/* Main Content Area: Linked Websites & Announcements */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Linked Websites Quick Access */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900">कंपनी की लिंक्ड वेबसाइट्स</h3>
                <p className="text-xs text-slate-500 mt-0.5">एक क्लिक में किसी भी कंपनी पोर्टल पर जाएं।</p>
              </div>
              <Globe className="w-6 h-6 text-indigo-600" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {publicWebsites.map((site) => (
                <div
                  key={site.id}
                  className="p-4 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between space-y-3 bg-slate-50/50"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                      {site.category}
                    </span>
                    <h4 className="text-base font-bold text-slate-900">{site.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2">{site.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                    <span className="text-[11px] text-slate-400 font-mono truncate max-w-[140px]">{site.url}</span>
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <span>विजिट</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Announcements */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-slate-900">नवीनतम कंपनी घोषणाएँ</h3>
            <div className="space-y-4">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full">
                      {ann.date}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">द्वारा: {ann.author}</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{ann.title}</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
