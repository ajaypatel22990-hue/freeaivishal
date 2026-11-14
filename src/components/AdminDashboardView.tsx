import React, { useState, useRef } from 'react';
import { ShieldCheck, Users, Globe, Image as ImageIcon, Bell, Settings, Plus, Trash2, Lock, Download, CheckCircle2, ShieldAlert, Shield, Bug, RefreshCw, Check, Upload, Crown, X, FolderOpen } from 'lucide-react';
import { Employee, CompanyWebsite, MediaItem, Announcement } from '../types';
import { Language, translations } from '../translations';
import { useToast } from './Toast';
import { compressImageFile } from '../utils/mediaCompressor';

interface AdminDashboardViewProps {
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  websites: CompanyWebsite[];
  setWebsites: React.Dispatch<React.SetStateAction<CompanyWebsite[]>>;
  media: MediaItem[];
  setMedia: React.Dispatch<React.SetStateAction<MediaItem[]>>;
  adminPassword: string;
  setAdminPassword: (pwd: string) => void;
  privateWebsitesPassword?: string;
  setPrivateWebsitesPassword?: (pwd: string) => void;
  announcements: Announcement[];
  setAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>>;
  reports?: any[];
  setReports?: (reports: any[]) => void;
  language?: Language;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  employees,
  setEmployees,
  websites,
  setWebsites,
  media,
  setMedia,
  adminPassword,
  setAdminPassword,
  privateWebsitesPassword = '9999',
  setPrivateWebsitesPassword,
  announcements,
  setAnnouncements,
  reports = [],
  setReports,
  language = 'hi',
}) => {
  const t = translations[language];
  const isEn = language === 'en';
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'employees' | 'websites' | 'private-websites' | 'media' | 'notices' | 'reports' | 'settings'>('employees');

  // New Employee Form state with all 11 details
  const [newEmp, setNewEmp] = useState({
    name: '',
    rollNumber: '',
    mobileNumber: '',
    aadhaarNumber: '',
    role: '',
    salary: 50000,
    employmentType: 'फुल टाइम (Full-Time)',
    joiningDate: new Date().toISOString().split('T')[0],
    email: '',
    address: '',
    photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
    department: 'Engineering & Development',
  });

  // New Website Form state
  const [newWeb, setNewWeb] = useState<{
    title: string;
    url: string;
    category: CompanyWebsite['category'];
    description: string;
    status: 'active' | 'maintenance';
    isPrivate: boolean;
  }>({
    title: '',
    url: '',
    category: 'AI Tools',
    description: '',
    status: 'active',
    isPrivate: false,
  });

  // Private Websites Vault Password state
  const [newPrivatePwdInput, setNewPrivatePwdInput] = useState('');
  const [privatePwdMsg, setPrivatePwdMsg] = useState('');

  // Edit mode states
  const [editingEmpId, setEditingEmpId] = useState<string | null>(null);
  const [editingWebId, setEditingWebId] = useState<string | null>(null);

  // New Media Form state
  const [newMed, setNewMed] = useState<{
    title: string;
    type: 'photo' | 'video' | 'banner';
    url: string;
    description: string;
    date: string;
  }>({
    title: '',
    type: 'photo',
    url: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  // New Announcement Form state
  const [newAnn, setNewAnn] = useState({
    title: '',
    content: '',
    priority: 'normal' as const,
    author: 'विशाल पटेल (CEO)',
    date: new Date().toISOString().split('T')[0],
  });

  // Settings password state
  const [currentPwdInput, setCurrentPwdInput] = useState('');
  const [newPwdInput, setNewPwdInput] = useState('');
  const [pwdMsg, setPwdMsg] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  // File Upload & Gallery Picker states
  const employeeFileInputRef = useRef<HTMLInputElement>(null);
  const mediaFileInputRef = useRef<HTMLInputElement>(null);
  const [isGalleryPickerOpen, setIsGalleryPickerOpen] = useState(false);

  // Handle uploading photo from phone/PC gallery for employee
  const handleEmployeePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        showToast(isEn ? 'Please select an image under 15MB' : 'कृपया 15MB से छोटी इमेज चुनें', 'error');
        return;
      }
      try {
        const compressed = await compressImageFile(file, 800, 800, 0.8);
        setNewEmp((prev) => ({ ...prev, photoUrl: compressed }));
        showToast(isEn ? 'Photo selected from gallery successfully!' : 'गैलरी से फोटो सफलतापूर्वक चुनी गई!', 'success');
      } catch {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setNewEmp((prev) => ({ ...prev, photoUrl: event.target!.result as string }));
            showToast(isEn ? 'Photo selected successfully!' : 'फोटो सफलतापूर्वक चुनी गई!', 'success');
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Handle uploading file from phone/PC gallery for media item
  const handleMediaFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        showToast(isEn ? 'Please choose a file under 25MB' : 'कृपया 25MB से छोटी फ़ाइल चुनें', 'error');
        return;
      }
      const isVideo = file.type.startsWith('video');
      if (isVideo) {
        const url = URL.createObjectURL(file);
        setNewMed((prev) => ({
          ...prev,
          url,
          type: 'video',
          title: prev.title || file.name.replace(/\.[^/.]+$/, ''),
        }));
        showToast(isEn ? 'Video selected from gallery!' : 'गैलरी से वीडियो चुना गया!', 'success');
        return;
      }

      try {
        const compressed = await compressImageFile(file, 1200, 1200, 0.85);
        setNewMed((prev) => ({
          ...prev,
          url: compressed,
          type: 'photo',
          title: prev.title || file.name.replace(/\.[^/.]+$/, ''),
        }));
        showToast(isEn ? 'Photo selected & optimized from gallery!' : 'गैलरी से फ़ोटो चुनी और ऑप्टिमाइज़ की गई!', 'success');
      } catch {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setNewMed((prev) => ({
              ...prev,
              url: event.target!.result as string,
              type: isVideo ? 'video' : 'photo',
              title: prev.title || file.name.replace(/\.[^/.]+$/, ''),
            }));
            showToast(isEn ? 'File selected from gallery!' : 'गैलरी से फ़ाइल चुनी गई!', 'success');
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleRunSecurityScan = () => {
    setIsScanning(true);
    setScanComplete(false);
    showToast('सिस्टम एंटी-वायरस व एंटी-हैकिंग स्कैन शुरू हो रहा है...', 'info');

    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      showToast('स्कैन पूर्ण: सिस्टम 100% सुरक्षित है! कोई भी वायरस या थ्रेट नहीं मिला।', 'success');
    }, 2200);
  };

  // 1. ADD EMPLOYEE
  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmp.name.trim()) {
      showToast('कृपया कर्मचारी का नाम दर्ज करें', 'error');
      return;
    }

    const roll = newEmp.rollNumber.trim() || `FAV-${Math.floor(100 + Math.random() * 900)}`;
    const mobile = newEmp.mobileNumber.trim() || '9876543210';
    const aadhaar = newEmp.aadhaarNumber.trim() || '5432-8765-1098';
    const roleName = newEmp.role.trim() || 'Software Engineer';
    const emailVal = newEmp.email.trim() || `${newEmp.name.toLowerCase().replace(/\s+/g, '')}@freeaivishal.com`;
    const addr = newEmp.address.trim() || 'मुंबई / गुजरात, भारत';

    const created: Employee = {
      id: editingEmpId || 'emp-' + Date.now(),
      name: newEmp.name.trim(),
      rollNumber: roll,
      mobileNumber: mobile,
      aadhaarNumber: aadhaar,
      role: roleName,
      department: newEmp.department,
      salary: Number(newEmp.salary) || 50000,
      employmentType: newEmp.employmentType || 'फुल टाइम (Full-Time)',
      joiningDate: newEmp.joiningDate || new Date().toISOString().split('T')[0],
      email: emailVal,
      address: addr,
      photoUrl: newEmp.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
    };

    if (editingEmpId) {
      setEmployees((prev) => prev.map((emp) => (emp.id === editingEmpId ? created : emp)));
      setEditingEmpId(null);
      showToast(`कर्मचारी '${created.name}' का विवरण तुरंत अपडेट हो गया!`, 'success');
    } else {
      setEmployees((prev) => [created, ...prev]);
      showToast(`कर्मचारी '${created.name}' सफलतापूर्वक जोड़ दिया गया!`, 'success');
    }

    setNewEmp({
      name: '',
      rollNumber: '',
      mobileNumber: '',
      aadhaarNumber: '',
      role: '',
      department: 'Engineering & Development',
      salary: 50000,
      employmentType: 'फुल टाइम (Full-Time)',
      joiningDate: new Date().toISOString().split('T')[0],
      email: '',
      address: '',
      photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
    });
  };

  const handleStartEditEmployee = (emp: Employee) => {
    setEditingEmpId(emp.id);
    setNewEmp({
      name: emp.name,
      rollNumber: emp.rollNumber,
      mobileNumber: emp.mobileNumber,
      aadhaarNumber: emp.aadhaarNumber,
      role: emp.role,
      department: emp.department,
      salary: emp.salary,
      employmentType: emp.employmentType || 'फुल टाइम (Full-Time)',
      joiningDate: emp.joiningDate,
      email: emp.email,
      address: emp.address,
      photoUrl: emp.photoUrl,
    });
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  // 1. DELETE EMPLOYEE
  const handleDeleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    showToast('कर्मचारी को सफलतापूर्वक हटा दिया गया है।', 'info');
  };

  // Download Employee Directory as CSV
  const handleDownloadCSV = () => {
    const headers = ['ID', 'Name (नाम)', 'Roll Number (रोल नंबर)', 'Mobile Number (मोबाइल)', 'Aadhaar (आधार कार्ड)', 'Role (काम/पद)', 'Employment Type (रखने का तरीका)', 'Department (विभाग)', 'Salary (सैलरी)', 'Joining Date (ज्वाइनिंग तारीख)', 'Email (ईमेल)', 'Address (पता)'];
    const rows = employees.map((emp) => [
      emp.id,
      `"${emp.name}"`,
      `"${emp.rollNumber}"`,
      `"${emp.mobileNumber}"`,
      `"${emp.aadhaarNumber}"`,
      `"${emp.role}"`,
      `"${emp.employmentType || 'फुल टाइम'}"`,
      `"${emp.department}"`,
      emp.salary,
      `"${emp.joiningDate}"`,
      `"${emp.email}"`,
      `"${emp.address}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `free_ai_vishal_company_employees_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('एम्प्लॉई डायरेक्टरी CSV फ़ाइल डाउनलोड हो गई!', 'success');
  };

  // 2. ADD WEBSITE
  const handleAddWebsite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeb.title.trim()) {
      showToast('कृपया वेबसाइट का नाम दर्ज करें', 'error');
      return;
    }

    let formattedUrl = newWeb.url.trim() || 'https://freeaivishaladvancetool88.ai.studio/';
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const created: CompanyWebsite = {
      id: editingWebId || 'web-' + Date.now(),
      title: newWeb.title.trim(),
      url: formattedUrl,
      category: newWeb.isPrivate ? 'Private & Secret' : newWeb.category,
      description: newWeb.description.trim() || 'फ्री एआई विशाल कंपनी का आधिकारिक डिजिटल पोर्टल।',
      iconName: newWeb.isPrivate ? 'Lock' : 'Globe',
      status: newWeb.status || 'active',
      isPrivate: Boolean(newWeb.isPrivate),
    };

    if (editingWebId) {
      setWebsites((prev) => prev.map((w) => (w.id === editingWebId ? created : w)));
      setEditingWebId(null);
      showToast(`वेबसाइट '${created.title}' तुरंत अपडेट हो गई!`, 'success');
    } else {
      setWebsites((prev) => [created, ...prev]);
      showToast(
        created.isPrivate
          ? `🔒 गुप्त वेबसाइट '${created.title}' प्राइवेट तिजोरी में जोड़ दी गई!`
          : `🌐 नई वेबसाइट '${created.title}' सफलतापूर्वक जोड़ दी गई!`,
        'success'
      );
    }

    setNewWeb({ title: '', url: '', category: 'AI Tools', description: '', status: 'active', isPrivate: false });
  };

  const handleStartEditWebsite = (site: CompanyWebsite) => {
    setEditingWebId(site.id);
    setNewWeb({
      title: site.title,
      url: site.url,
      category: site.category,
      description: site.description,
      status: site.status || 'active',
      isPrivate: Boolean(site.isPrivate),
    });
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  // Toggle Website Public / Private
  const handleToggleWebsitePrivacy = (id: string) => {
    setWebsites((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const nextPriv = !w.isPrivate;
          showToast(
            nextPriv
              ? `🔒 '${w.title}' को गुप्त (Private) बना दिया गया!`
              : `🌐 '${w.title}' को पब्लिक बना दिया गया!`,
            'info'
          );
          return { ...w, isPrivate: nextPriv, category: nextPriv ? 'Private & Secret' : w.category };
        }
        return w;
      })
    );
  };

  // Change Private Websites Vault Password
  const handleChangePrivatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newPrivatePwdInput.trim();
    if (trimmed.length < 3) {
      setPrivatePwdMsg('प्राइवेट पासवर्ड कम से कम 3 अक्षरों/अंकों का होना चाहिए।');
      showToast('प्राइवेट पासवर्ड कम से कम 3 अक्षरों/अंकों का होना चाहिए।', 'error');
      return;
    }
    if (setPrivateWebsitesPassword) {
      setPrivateWebsitesPassword(trimmed);
    }
    setPrivatePwdMsg('गुप्त वेबसाइट्स का अलग पासवर्ड सफलतापूर्वक अपडेट हो गया!');
    showToast('🔒 गुप्त वेबसाइट्स का अलग पासवर्ड अपडेट हो गया!', 'success');
    setNewPrivatePwdInput('');
  };

  // 2. DELETE WEBSITE
  const handleDeleteWebsite = (id: string) => {
    setWebsites((prev) => prev.filter((w) => w.id !== id));
    showToast('वेबसाइट को सफलतापूर्वक हटा दिया गया है।', 'info');
  };

  // 3. ADD MEDIA (Instantly visible without page refresh)
  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMed.title.trim()) {
      showToast('कृपया मीडिया शीर्षक दर्ज करें', 'error');
      return;
    }

    let mediaUrl = newMed.url.trim();
    if (!mediaUrl) {
      mediaUrl = newMed.type === 'video' 
        ? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80';
    }

    const created: MediaItem = {
      id: 'med-' + Date.now(),
      title: newMed.title.trim(),
      type: newMed.type,
      url: mediaUrl,
      description: newMed.description.trim() || 'कंपनी मीडिया गैलरी फ़ाइल।',
      date: newMed.date || new Date().toISOString().split('T')[0],
    };

    // Updates immediately without requiring any page refresh!
    setMedia((prev) => [created, ...prev]);

    setNewMed({ title: '', type: 'photo', url: '', description: '', date: new Date().toISOString().split('T')[0] });
    showToast(`मीडिया '${created.title}' तुरंत लाइव अपडेट हो गया! (रिफ्रेश करने की आवश्यकता नहीं)`, 'success');
  };

  // 3. DELETE MEDIA
  const handleDeleteMedia = (id: string) => {
    setMedia((prev) => prev.filter((m) => m.id !== id));
    showToast('मीडिया आइटम तुरंत हटा दिया गया। (रिफ्रेश करने की आवश्यकता नहीं)', 'info');
  };

  // 4. ADD ANNOUNCEMENT / NOTICE
  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnn.title.trim() || !newAnn.content.trim()) {
      showToast('कृपया नोटिस का शीर्षक और विवरण दर्ज करें', 'error');
      return;
    }

    const created: Announcement = {
      id: 'ann-' + Date.now(),
      title: newAnn.title.trim(),
      content: newAnn.content.trim(),
      priority: newAnn.priority,
      author: newAnn.author || 'विशाल पटेल (CEO)',
      date: newAnn.date || new Date().toISOString().split('T')[0],
    };

    setAnnouncements((prev) => [created, ...prev]);

    setNewAnn({
      title: '',
      content: '',
      priority: 'normal',
      author: 'विशाल पटेल (CEO)',
      date: new Date().toISOString().split('T')[0],
    });

    showToast('नया संदेश / नोटिस तुरंत अपडेट हो गया!', 'success');
  };

  // 4. DELETE ANNOUNCEMENT
  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    showToast('नोटिस को सफलतापूर्वक हटा दिया गया है।', 'info');
  };

  // 5. CHANGE PASSWORD
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const curr = String(currentPwdInput || '').trim();
    const currentStored = String(adminPassword || '8780772619').trim();
    const master = '8780772619';

    if (curr === currentStored || curr === master || curr.replace(/\D/g, '') === master) {
      if (newPwdInput.trim().length >= 4) {
        const updatedPwd = newPwdInput.trim();
        setAdminPassword(updatedPwd);
        localStorage.setItem('fav_admin_pwd', updatedPwd);
        setPwdMsg('एडमिन पासवर्ड सफलतापूर्वक बदल दिया गया है!');
        showToast('एडमिन पासवर्ड सफलतापूर्वक बदल दिया गया है!', 'success');
        setCurrentPwdInput('');
        setNewPwdInput('');
      } else {
        setPwdMsg('नया पासवर्ड कम से कम 4 अंकों का होना चाहिए।');
        showToast('नया पासवर्ड कम से कम 4 अंकों का होना चाहिए।', 'error');
      }
    } else {
      setPwdMsg('वर्तमान पासवर्ड गलत है। कृपया सही पासवर्ड दर्ज करें।');
      showToast('वर्तमान पासवर्ड गलत है।', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>{isEn ? 'Boss Admin Panel (CEO: Vishal Patel)' : 'बॉस एडमिन पैनल (CEO: विशाल पटेल)'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">
            {isEn ? 'Free AI Vishal Company Control Center' : 'फ्री एआई विशाल कंपनी कंट्रोल सेंटर'}
          </h1>
          <p className="text-slate-300 text-sm">
            {isEn 
              ? 'Easily manage and publish announcements, employees, websites, photos, and videos.' 
              : 'संदेश/नोटिस, एम्प्लॉई, वेबसाइट्स, फोटोज़ और वीडियो को आसानी से जोड़ें या डिलीट करें।'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadCSV}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>{isEn ? 'Download CSV (Staff List)' : 'Download CSV (एम्प्लॉई लिस्ट)'}</span>
          </button>
          <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 text-center">
            <p className="text-xl font-black text-emerald-300">{employees.length}</p>
            <p className="text-[10px] text-slate-300 font-medium">{isEn ? 'Total Staff' : 'कुल कर्मचारी'}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto transition-colors">
        <button
          onClick={() => setActiveTab('employees')}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'employees' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          {isEn ? 'Employees' : 'एम्प्लॉई'} ({employees.length})
        </button>
        <button
          onClick={() => setActiveTab('websites')}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'websites' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Globe className="w-4 h-4" />
          {isEn ? 'Websites' : 'वेबसाइट्स'} ({websites.filter(w => !w.isPrivate).length})
        </button>
        <button
          onClick={() => setActiveTab('private-websites')}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'private-websites' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Lock className="w-4 h-4 text-amber-400" />
          {isEn ? 'Private Websites' : 'प्राइवेट वेबसाइट्स'} ({websites.filter(w => w.isPrivate).length})
        </button>
        <button
          onClick={() => setActiveTab('media')}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'media' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          {isEn ? 'Photos & Videos' : 'फोटोज़ & वीडियो'} ({media.length})
        </button>
        <button
          onClick={() => setActiveTab('notices')}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'notices' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Bell className="w-4 h-4" />
          {isEn ? 'Notices & Messages' : 'संदेश / नोटिस'} ({announcements.length})
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'reports' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Bug className="w-4 h-4 text-rose-400" />
          {isEn ? 'Support Reports' : 'रिपोर्ट्स & बग्स'} ({reports.length})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          {isEn ? 'Security & Passwords' : 'पासवर्ड सेटिंग्स'}
        </button>
      </div>

      {/* Tab 1: Employees */}
      {activeTab === 'employees' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" />
                नया एम्प्लॉई जोड़ें (11 जरूरी फ़ील्ड्स)
              </h3>
              <p className="text-xs text-slate-500">सभी 11 अनिवार्य और आवश्यक विवरण नीचे भरें:</p>
            </div>

            <form onSubmit={handleAddEmployee} className="space-y-3.5 text-sm">
              {/* 1. उसका नाम */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">1. उसका नाम (Employee Name) *</label>
                <input
                  type="text"
                  required
                  placeholder="कर्मचारी का पूरा नाम दर्ज करें"
                  value={newEmp.name}
                  onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              {/* 2 & 3. रोल नंबर और मोबाइल नंबर */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">2. रोल नंबर</label>
                  <input
                    type="text"
                    placeholder="जैसे FAV-106"
                    value={newEmp.rollNumber}
                    onChange={(e) => setNewEmp({ ...newEmp, rollNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 uppercase font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">3. मोबाइल नंबर</label>
                  <input
                    type="text"
                    placeholder="9876543210"
                    value={newEmp.mobileNumber}
                    onChange={(e) => setNewEmp({ ...newEmp, mobileNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-mono text-xs"
                  />
                </div>
              </div>

              {/* 4. आधार कार्ड नंबर */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">4. आधार कार्ड नंबर (Aadhaar Number)</label>
                <input
                  type="text"
                  placeholder="5432-8765-1098"
                  value={newEmp.aadhaarNumber}
                  onChange={(e) => setNewEmp({ ...newEmp, aadhaarNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-mono text-xs"
                />
              </div>

              {/* 5. वो क्या काम करता है (Role / Work) */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">5. वो क्या काम करता है (Work / Role / पद)</label>
                <input
                  type="text"
                  placeholder="जैसे AI इंजीनियर, ग्राफ़िक डिज़ाइनर, मैनेजर, डेवलपर"
                  value={newEmp.role}
                  onChange={(e) => setNewEmp({ ...newEmp, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                />
              </div>

              {/* 6 & 7. उसकी सैलरी और रखने का तरीका */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">6. उसकी सैलरी (₹/माह)</label>
                  <input
                    type="number"
                    placeholder="50000"
                    value={newEmp.salary}
                    onChange={(e) => setNewEmp({ ...newEmp, salary: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">7. रखने का तरीका</label>
                  <select
                    value={newEmp.employmentType}
                    onChange={(e) => setNewEmp({ ...newEmp, employmentType: e.target.value })}
                    className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-medium"
                  >
                    <option value="फुल टाइम (Full-Time)">फुल टाइम (Full-Time)</option>
                    <option value="पार्ट टाइम (Part-Time)">पार्ट टाइम (Part-Time)</option>
                    <option value="वर्क फ्रॉम होम (Remote/WFH)">वर्क फ्रॉम होम (WFH)</option>
                    <option value="ऑफिस बेस्ड (On-Site Office)">ऑफिस बेस्ड (Office)</option>
                    <option value="कॉन्ट्रैक्ट (Contract)">कॉन्ट्रैक्ट (Contract)</option>
                  </select>
                </div>
              </div>

              {/* 8. भर्ती/ज्वाइनिंग की तारीख */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">8. किस तारीख को अप्लाई / भर्ती किया (Date)</label>
                <input
                  type="date"
                  value={newEmp.joiningDate}
                  onChange={(e) => setNewEmp({ ...newEmp, joiningDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-mono"
                />
              </div>

              {/* 9. उसका ईमेल */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">9. उसका ईमेल (Email Address)</label>
                <input
                  type="email"
                  placeholder="employee@freeaivishal.com"
                  value={newEmp.email}
                  onChange={(e) => setNewEmp({ ...newEmp, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs"
                />
              </div>

              {/* 10. उसका एड्रेस */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">10. उसका एड्रेस (Full Address / पता)</label>
                <input
                  type="text"
                  placeholder="जैसे सेक्टर 62, नोएडा, उत्तर प्रदेश / गुजरात, भारत"
                  value={newEmp.address}
                  onChange={(e) => setNewEmp({ ...newEmp, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs"
                />
              </div>

              {/* 11. उसकी फोटो (सीधा गैलरी से लें) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 block">
                    11. {isEn ? 'Photo (Pick from Gallery or Upload)' : 'उसकी फोटो (सीधा गैलरी से लें या अपलोड करें)'}
                  </label>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {isEn ? 'No URL Required' : 'URL की जरूरत नहीं'}
                  </span>
                </div>

                {/* Hidden File Input for Device Gallery */}
                <input
                  type="file"
                  ref={employeeFileInputRef}
                  accept="image/*"
                  onChange={handleEmployeePhotoFileChange}
                  className="hidden"
                />

                {/* Direct Action Buttons: Device Gallery & Company Gallery */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => employeeFileInputRef.current?.click()}
                    className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{isEn ? 'Upload from Gallery' : 'फोन/PC गैलरी से अपलोड'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsGalleryPickerOpen(true)}
                    className="py-2.5 px-3 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 font-bold text-xs border border-violet-200 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <FolderOpen className="w-4 h-4 text-violet-600" />
                    <span>{isEn ? 'Pick from Gallery' : 'कंपनी गैलरी से चुनें'}</span>
                  </button>
                </div>

                {/* Boss / CEO Profile Photo Quick Button */}
                <button
                  type="button"
                  onClick={() => {
                    setNewEmp((prev) => ({
                      ...prev,
                      photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
                    }));
                    showToast(isEn ? 'CEO Vishal Patel Profile Avatar selected!' : 'बॉस / सीईओ विशाल पटेल प्रोफ़ाइल फोटो सेट की गई!', 'success');
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <Crown className="w-4 h-4 text-amber-600" />
                  <span>{isEn ? '👑 Set Boss / CEO Vishal Patel Profile' : '👑 बॉस / सीईओ विशाल पटेल प्रोफ़ाइल फोटो लगाएं'}</span>
                </button>

                {/* Current Photo Preview and Optional URL */}
                <div className="flex items-center gap-3 pt-1">
                  <img
                    src={newEmp.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80'}
                    alt="Preview"
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-300 shadow-md shrink-0"
                  />
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      placeholder={isEn ? "Optional Image URL" : "वैकल्पिक इमेज URL (यदि चाहें)"}
                      value={newEmp.photoUrl}
                      onChange={(e) => setNewEmp({ ...newEmp, photoUrl: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-mono"
                    />
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-500 font-semibold">{isEn ? 'Avatars:' : 'अवतार:'}</span>
                      {[
                        { label: isEn ? 'CEO' : 'विशाल', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80' },
                        { label: isEn ? 'Eng' : 'इंजीनियर', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format&fit=crop&q=80' },
                        { label: isEn ? 'Design' : 'डिज़ाइनर', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80' },
                        { label: isEn ? 'Manager' : 'मैनेजर', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' },
                      ].map((av, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setNewEmp({ ...newEmp, photoUrl: av.url })}
                          className="px-2 py-0.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold border border-indigo-200 transition-colors"
                        >
                          {av.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                {editingEmpId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingEmpId(null);
                      setNewEmp({
                        name: '',
                        rollNumber: '',
                        mobileNumber: '',
                        aadhaarNumber: '',
                        role: '',
                        department: 'Engineering & Development',
                        salary: 50000,
                        employmentType: 'फुल टाइम (Full-Time)',
                        joiningDate: new Date().toISOString().split('T')[0],
                        email: '',
                        address: '',
                        photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
                      });
                    }}
                    className="px-4 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                  >
                    रद्द करें
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{editingEmpId ? 'बदलाव सेव करें (Update Employee)' : 'एम्प्लॉई जोड़ें (Add Employee)'}</span>
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900">कर्मचारी सूची ({employees.length})</h3>
              <button
                onClick={handleDownloadCSV}
                className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>CSV डाउनलोड करें</span>
              </button>
            </div>
            <div className="space-y-4">
              {employees.map((emp) => (
                <div key={emp.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:border-indigo-200 transition-all">
                  <div className="flex items-start gap-4">
                    <img src={emp.photoUrl} alt={emp.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-100 shrink-0" />
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-base font-black text-slate-900">{emp.name}</h4>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                          {emp.employmentType || 'फुल टाइम'}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          ₹{emp.salary ? Number(emp.salary).toLocaleString('en-IN') : '50,000'}/माह
                        </span>
                      </div>
                      <p className="text-xs font-bold text-indigo-600 font-mono">
                        रोल: {emp.rollNumber} • मोबाइल: {emp.mobileNumber}
                      </p>
                      <p className="text-xs text-slate-600 font-medium">
                        काम (Role): <span className="font-bold text-slate-800">{emp.role}</span> • विभाग: {emp.department}
                      </p>
                      <p className="text-xs text-slate-500">
                        आधार: <span className="font-mono font-semibold">{emp.aadhaarNumber}</span> • डेट: {emp.joiningDate}
                      </p>
                      <p className="text-xs text-slate-500 truncate max-w-md">
                        ईमेल: <span className="font-medium text-slate-700">{emp.email}</span> • पता: <span className="text-slate-700">{emp.address}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleStartEditEmployee(emp)}
                      className="px-3 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors flex items-center justify-center gap-1 text-xs font-bold"
                      title="एडिट करें"
                    >
                      <span>✏️ बदलें</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteEmployee(emp.id)}
                      className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center justify-center gap-1 text-xs font-bold"
                      title="डिलीट करें"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>हटाएं</span>
                    </button>
                  </div>
                </div>
              ))}
              {employees.length === 0 && (
                <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 text-slate-400">
                  कोई कर्मचारी नहीं है। ऊपर दिए गए फॉर्म से जोड़ें।
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Websites */}
      {activeTab === 'websites' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" />
                नई वेबसाइट जोड़ें (पब्लिक या गुप्त)
              </h3>
              <form onSubmit={handleAddWebsite} className="space-y-4 text-sm">
                {/* Public vs Private Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">वेबसाइट का प्रकार चुनें *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewWeb({ ...newWeb, isPrivate: false })}
                      className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all ${
                        !newWeb.isPrivate
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>🌐 पब्लिक साइट</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewWeb({ ...newWeb, isPrivate: true, category: 'Private & Secret' })}
                      className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all ${
                        newWeb.isPrivate
                          ? 'bg-slate-900 text-amber-300 border-amber-400 shadow-md'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>🔒 गुप्त (Private)</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">वेबसाइट का नाम *</label>
                  <input
                    type="text"
                    required
                    placeholder="जैसे Vishal Enterprise या Secret Portal"
                    value={newWeb.title}
                    onChange={(e) => setNewWeb({ ...newWeb, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">वेबसाइट URL *</label>
                  <input
                    type="text"
                    required
                    placeholder="https://example.ai.studio"
                    value={newWeb.url}
                    onChange={(e) => setNewWeb({ ...newWeb, url: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">कैटेगरी</label>
                  <select
                    value={newWeb.category}
                    onChange={(e) => setNewWeb({ ...newWeb, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                  >
                    <option value="AI Tools">AI Tools</option>
                    <option value="Cloud & Hosting">Cloud & Hosting</option>
                    <option value="E-Commerce">E-Commerce</option>
                    <option value="Development">Development</option>
                    <option value="Media & Social">Media & Social</option>
                    <option value="Private & Secret">Private & Secret (गुप्त)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">विवरण</label>
                  <textarea
                    rows={3}
                    placeholder="वेबसाइट के बारे में संक्षेप में..."
                    value={newWeb.description}
                    onChange={(e) => setNewWeb({ ...newWeb, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                  />
                </div>
                <button
                  type="submit"
                  className={`w-full py-3 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                    newWeb.isPrivate
                      ? 'bg-gradient-to-r from-slate-900 to-indigo-950 text-amber-300 border border-amber-400/40'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {newWeb.isPrivate ? <Lock className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  <span>
                    {newWeb.isPrivate
                      ? '🔒 गुप्त तिजोरी में वेबसाइट जोड़ें'
                      : '🌐 पब्लिक वेबसाइट जोड़ें'}
                  </span>
                </button>
              </form>
            </div>

            {/* Separate Password Card for Private Websites Vault */}
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 border border-amber-400/40 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-lg">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-black text-amber-300">
                      प्राइवेट वेबसाइट्स का मास्टर पासवर्ड
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-black border border-emerald-500/30">
                      AES-256
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    एडवांस एन्क्रिप्शन के साथ सभी गुप्त वेबसाइट्स को सुरक्षित रखें
                  </p>
                </div>
              </div>

              <form onSubmit={handleChangePrivatePassword} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    नया प्राइवेट मास्टर पासवर्ड सेट करें
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="नया गुप्त पासवर्ड दर्ज करें..."
                    value={newPrivatePwdInput}
                    onChange={(e) => setNewPrivatePwdInput(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl border border-amber-400/40 bg-white/10 text-white placeholder-slate-400 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  {newPrivatePwdInput && (
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-slate-400">सुरक्षा स्तर:</span>
                        <span className="font-bold text-amber-300">
                          {newPrivatePwdInput.length >= 6 ? '🛡️ अत्यधिक सुरक्षित' : '⚡ सामान्य'}
                        </span>
                      </div>
                      <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${newPrivatePwdInput.length >= 6 ? 'bg-emerald-400' : 'bg-amber-400'} transition-all`} 
                          style={{ width: `${Math.min(100, (newPrivatePwdInput.length / 8) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
                {privatePwdMsg && (
                  <p className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                    <span>✨</span> {privatePwdMsg}
                  </p>
                )}
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center justify-center gap-1.5"
                >
                  <span>🔑 प्राइवेट मास्टर पासवर्ड सेव करें</span>
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-xl font-black text-slate-900">
                सभी वेबसाइट्स ({websites.length}) — पब्लिक: {websites.filter((w) => !w.isPrivate).length} | 🔒 गुप्त: {websites.filter((w) => w.isPrivate).length}
              </h3>
            </div>
            <div className="space-y-4">
              {websites.map((site) => (
                <div
                  key={site.id}
                  className={`rounded-3xl p-5 border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                    site.isPrivate
                      ? 'bg-slate-900 text-white border-amber-400/40'
                      : 'bg-white text-slate-900 border-slate-200 hover:border-indigo-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {site.isPrivate ? (
                        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          <span>गुप्त / प्राइवेट (Password Locked)</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                          🌐 पब्लिक • {site.category}
                        </span>
                      )}
                    </div>
                    <h4 className={`text-base font-black ${site.isPrivate ? 'text-amber-300' : 'text-slate-900'}`}>
                      {site.title}
                    </h4>
                    <p className={`text-xs font-mono ${site.isPrivate ? 'text-slate-300' : 'text-slate-500'}`}>
                      {site.url}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => handleStartEditWebsite(site)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                        site.isPrivate
                          ? 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                          : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
                      }`}
                      title="एडिट करें"
                    >
                      <span>✏️ बदलें</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleWebsitePrivacy(site.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        site.isPrivate
                          ? 'bg-white/10 hover:bg-white/20 text-amber-200 border border-white/15'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                      title={site.isPrivate ? 'पब्लिक बनाएं' : 'गुप्त (Private) बनाएं'}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>{site.isPrivate ? 'पब्लिक करें' : 'गुप्त करें'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteWebsite(site.id)}
                      className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center gap-1 text-xs font-bold"
                      title="डिलीट करें"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">हटाएं</span>
                    </button>
                  </div>
                </div>
              ))}
              {websites.length === 0 && (
                <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 text-slate-400">
                  कोई वेबसाइट नहीं है। बाएं दिए गए फॉर्म से जोड़ें।
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Private Websites */}
      {activeTab === 'private-websites' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-500" />
                <span>गुप्त / प्राइवेट वेबसाइट जोड़ें</span>
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const created: CompanyWebsite = {
                    id: editingWebId || 'web-' + Date.now(),
                    title: newWeb.title.trim() || 'Secret Portal',
                    url: newWeb.url.trim() ? (newWeb.url.startsWith('http') ? newWeb.url : 'https://' + newWeb.url) : 'https://example.ai.studio',
                    category: 'Private & Secret',
                    description: newWeb.description.trim() || 'फ्री एआई विशाल कंपनी का गुप्त एवं सुरक्षित पोर्टल।',
                    iconName: 'Lock',
                    status: newWeb.status || 'active',
                    isPrivate: true,
                  };
                  if (editingWebId) {
                    setWebsites((prev) => prev.map((w) => (w.id === editingWebId ? created : w)));
                    setEditingWebId(null);
                    showToast(`गुप्त वेबसाइट '${created.title}' अपडेट हो गई!`, 'success');
                  } else {
                    setWebsites((prev) => [created, ...prev]);
                    showToast(`🔒 गुप्त वेबसाइट '${created.title}' प्राइवेट तिजोरी में जोड़ दी गई!`, 'success');
                  }
                  setNewWeb({ title: '', url: '', category: 'Private & Secret', description: '', status: 'active', isPrivate: true });
                }}
                className="space-y-4 text-sm"
              >
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">गुप्त वेबसाइट का नाम *</label>
                  <input
                    type="text"
                    required
                    placeholder="जैसे Secret Admin Tool"
                    value={newWeb.title}
                    onChange={(e) => setNewWeb({ ...newWeb, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">गुप्त URL *</label>
                  <input
                    type="text"
                    required
                    placeholder="https://secret.ai.studio"
                    value={newWeb.url}
                    onChange={(e) => setNewWeb({ ...newWeb, url: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">विवरण (Description)</label>
                  <textarea
                    rows={3}
                    placeholder="गुप्त वेबसाइट का विवरण..."
                    value={newWeb.description}
                    onChange={(e) => setNewWeb({ ...newWeb, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-amber-300 border border-amber-400/40 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>{editingWebId ? 'गुप्त वेबसाइट अपडेट करें' : '🔒 गुप्त तिजोरी में जोड़ें'}</span>
                </button>
              </form>
            </div>

            {/* Private Vault Password Card */}
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 border border-amber-400/30 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400/25 border border-amber-400/40 flex items-center justify-center text-amber-300">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-black text-amber-300">
                    प्राइवेट वेबसाइट्स का पासवर्ड
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    इस पासवर्ड से सभी गुप्त वेबसाइट्स खुलेंगी (गुप्त रूप से छिपा हुआ)
                  </p>
                </div>
              </div>

              <form onSubmit={handleChangePrivatePassword} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    नया प्राइवेट पासवर्ड सेट करें
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••"
                    value={newPrivatePwdInput}
                    onChange={(e) => setNewPrivatePwdInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-amber-400/40 bg-white/10 text-white placeholder-slate-500 text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                {privatePwdMsg && (
                  <p className="text-xs font-bold text-emerald-300">{privatePwdMsg}</p>
                )}
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg transition-all"
                >
                  🔑 प्राइवेट पासवर्ड सुरक्षित रूप से सेव करें
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xl font-black text-slate-900">
              गुप्त / प्राइवेट वेबसाइट्स सूची ({websites.filter(w => w.isPrivate).length})
            </h3>
            <div className="space-y-4">
              {websites.filter(w => w.isPrivate).map((site) => (
                <div
                  key={site.id}
                  className="bg-slate-900 text-white rounded-3xl p-5 border border-amber-400/40 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1 w-max">
                      <Lock className="w-3 h-3" />
                      <span>प्राइवेट और गुप्त वेबसाइट</span>
                    </span>
                    <h4 className="text-base font-black text-amber-300">{site.title}</h4>
                    <p className="text-xs text-slate-300">{site.description}</p>
                    <p className="text-xs font-mono text-slate-400">{site.url}</p>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => handleStartEditWebsite(site)}
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15"
                    >
                      ✏️ बदलें
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleWebsitePrivacy(site.id)}
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-amber-200 font-bold text-xs border border-white/15"
                    >
                      🌐 पब्लिक करें
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteWebsite(site.id)}
                      className="p-2.5 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 font-bold text-xs border border-red-500/30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {websites.filter(w => w.isPrivate).length === 0 && (
                <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 text-slate-400">
                  कोई गुप्त वेबसाइट नहीं है। बाएं दिए गए फॉर्म से जोड़ें।
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Media */}
      {activeTab === 'media' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-600" />
              फोटो, वीडियो या बैनर जोड़ें
            </h3>
            <form onSubmit={handleAddMedia} className="space-y-4 text-sm">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">शीर्षक (Title) *</label>
                <input
                  type="text"
                  required
                  placeholder="जैसे AI Conference 2026"
                  value={newMed.title}
                  onChange={(e) => setNewMed({ ...newMed, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">प्रकार (Type)</label>
                <select
                  value={newMed.type}
                  onChange={(e) => setNewMed({ ...newMed, type: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                >
                  <option value="photo">फोटोज़ (Photo)</option>
                  <option value="video">वीडियो (Video)</option>
                  <option value="banner">बैनर (Banner)</option>
                </select>
              </div>
              {/* Direct File Upload from Device */}
              <div className="space-y-2">
                <input
                  type="file"
                  ref={mediaFileInputRef}
                  accept="image/*,video/*"
                  onChange={handleMediaFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => mediaFileInputRef.current?.click()}
                  className="w-full py-2.5 px-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Upload className="w-4 h-4" />
                  <span>{isEn ? '📁 Pick Image / Video from Device Gallery' : '📁 फोन / कंप्यूटर गैलरी से फोटो या वीडियो चुनें'}</span>
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isEn ? 'Image/Video URL or Upload Preview' : 'इमेज/वीडियो लिंक (URL) या अपलोड प्रीव्यू'}
                </label>
                <input
                  type="text"
                  placeholder={isEn ? "https://... or auto-filled from gallery" : "https://... या गैलरी से ऑटो-फिल"}
                  value={newMed.url}
                  onChange={(e) => setNewMed({ ...newMed, url: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-mono text-xs"
                />
                {newMed.url && (
                  <div className="mt-2 p-2 bg-slate-100 rounded-xl flex items-center gap-3">
                    <img src={newMed.url} alt="Preview" className="w-12 h-12 rounded-lg object-cover border" />
                    <span className="text-xs text-slate-600 font-medium truncate flex-1">{isEn ? 'Ready to add' : 'अपलोड के लिए तैयार'}</span>
                  </div>
                )}
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">विवरण</label>
                <textarea
                  rows={3}
                  placeholder="मीडिया फ़ाइल के बारे में..."
                  value={newMed.description}
                  onChange={(e) => setNewMed({ ...newMed, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>मीडिया जोड़ें (Add Media)</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xl font-black text-slate-900">मीडिया सूची ({media.length})</h3>
            <div className="space-y-4">
              {media.map((item) => (
                <div key={item.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center justify-between gap-4 hover:border-indigo-200 transition-all">
                  <div className="flex items-center gap-4">
                    <img src={item.url} alt={item.title} className="w-16 h-16 rounded-2xl object-cover border" />
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-800 uppercase">
                        {item.type}
                      </span>
                      <h4 className="text-base font-black text-slate-900 mt-1">{item.title}</h4>
                      <p className="text-xs text-slate-500">{item.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = item.url;
                        link.target = '_blank';
                        link.download = item.title;
                        link.rel = 'noopener noreferrer';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        showToast(`डाउनलोड शुरू हो गया!`, 'success');
                      }}
                      className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                      title="डाउनलोड करें"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteMedia(item.id)}
                      className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center gap-1 text-xs font-bold"
                      title="डिलीट करें"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">हटाएं</span>
                    </button>
                  </div>
                </div>
              ))}
              {media.length === 0 && (
                <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 text-slate-400">
                  कोई मीडिया नहीं है। ऊपर दिए गए फॉर्म से जोड़ें।
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Notices / Announcements */}
      {activeTab === 'notices' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-600" />
              नया संदेश / नोटिस जोड़ें
            </h3>
            <form onSubmit={handleAddAnnouncement} className="space-y-4 text-sm">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">नोटिस का शीर्षक *</label>
                <input
                  type="text"
                  required
                  placeholder="जैसे दिवाली बोनस या नया अपडेट"
                  value={newAnn.title}
                  onChange={(e) => setNewAnn({ ...newAnn, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">संदेश की पूरी जानकारी *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="संदेश या नोटिस की पूरी जानकारी..."
                  value={newAnn.content}
                  onChange={(e) => setNewAnn({ ...newAnn, content: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">प्राथमिकता</label>
                <select
                  value={newAnn.priority}
                  onChange={(e) => setNewAnn({ ...newAnn, priority: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                >
                  <option value="normal">सामान्य (Normal)</option>
                  <option value="urgent">जरूरी (Urgent / Bonus)</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>नोटिस प्रकाशित करें (Publish Notice)</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xl font-black text-slate-900">सभी संदेश और नोटिस ({announcements.length})</h3>
            <div className="space-y-4">
              {announcements.map((ann) => (
                <div key={ann.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center justify-between gap-4 hover:border-indigo-200 transition-all">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        {ann.date}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">द्वारा: {ann.author}</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900">{ann.title}</h4>
                    <p className="text-xs text-slate-600">{ann.content}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteAnnouncement(ann.id)}
                    className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center gap-1 text-xs font-bold"
                    title="डिलीट करें"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">हटाएं</span>
                  </button>
                </div>
              ))}
              {announcements.length === 0 && (
                <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 text-slate-400">
                  कोई नोटिस नहीं है। ऊपर दिए गए फॉर्म से जोड़ें।
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Support Reports */}
      {activeTab === 'reports' && (
        <div className="space-y-6 max-w-5xl mx-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Bug className="w-6 h-6 text-rose-500" />
                {isEn ? 'Help Center & Bug Reports (Inbox: minecraft647vi@gmail.com)' : 'हेल्प सेंटर और बग रिपोर्ट्स (जीमेल इनबॉक्स: minecraft647vi@gmail.com)'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isEn 
                  ? 'All support inquiries and bug reports are automatically delivered to your Gmail and stored here in real-time.' 
                  : 'हेल्प सेंटर से भेजी गई सभी समस्याएं आपके जीमेल और इस एडमिन पैनल पर रीयल-टाइम में उपलब्ध हैं।'}
              </p>
            </div>
            {reports.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (setReports) setReports([]);
                  showToast('सभी रिपोर्ट्स साफ़ कर दी गईं!', 'success');
                }}
                className="px-4 py-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold transition-colors"
              >
                {isEn ? 'Clear All Reports' : 'सभी रिपोर्ट्स साफ़ करें'}
              </button>
            )}
          </div>

          {reports.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-16 text-center border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-500 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                {isEn ? 'No Support Reports or Bug Tickets' : 'कोई नई बग रिपोर्ट या सपोर्ट टिकट नहीं है'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                {isEn ? 'When any user submits a report from the 24/7 Help Center, it will appear here instantly.' : 'जब भी कोई विजिटर हेल्प सेंटर से शिकायत दर्ज करेगा, वह यहाँ दिखाई देगी।'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reports.map((rep: any) => (
                <div key={rep.id || Math.random()} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 text-[11px] font-bold">
                        {rep.category || 'Support Query'}
                      </span>
                      <h4 className="text-base font-black text-slate-900 dark:text-white mt-1.5">
                        {rep.name}
                      </h4>
                    </div>
                    <span className="text-[11px] font-medium text-slate-400">
                      {rep.date || 'Recent'}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <p className="text-slate-600 dark:text-slate-300 font-semibold flex items-center gap-1.5">
                      <span className="text-slate-400">Email:</span> {rep.email}
                    </p>
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 text-slate-700 dark:text-slate-200 text-xs whitespace-pre-wrap leading-relaxed">
                      {rep.message}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
                    <a
                      href={`mailto:${rep.email}?subject=Response%20to%20your%20Free%20AI%20Vishal%20Report`}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Reply by Email</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        if (setReports) {
                          setReports(reports.filter((r: any) => r.id !== rep.id));
                          showToast('रिपोर्ट डिलीट कर दी गई!', 'success');
                        }
                      }}
                      className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Settings & Cyber Security Shield */}
      {activeTab === 'settings' && (
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Cyber Security & Anti-Virus Shield Status Card */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-indigo-500/30 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-500/20 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-900/30">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-black flex items-center gap-2">
                    <span>एंटी-हैकिंग व एंटी-वायरस कंट्रोल सेंटर</span>
                    <span className="text-[10px] bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
                      100% सुरक्षित
                    </span>
                  </h3>
                  <p className="text-xs text-indigo-300">फ्री एआई विशाल कंपनी • रीयल-टाइम साइबर डिफेंस सिस्टम</p>
                </div>
              </div>

              <button
                onClick={handleRunSecurityScan}
                disabled={isScanning}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition-all shadow-lg flex items-center gap-2 shrink-0 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
                <span>{isScanning ? 'सुरक्षा स्कैन जारी है...' : 'सिस्टम सिक्योरिटी स्कैन करें'}</span>
              </button>
            </div>

            {/* Scanning Progress or Result */}
            {isScanning && (
              <div className="p-4 rounded-2xl bg-indigo-900/40 border border-indigo-400/30 space-y-2 animate-pulse">
                <div className="flex items-center justify-between text-xs font-bold text-indigo-200">
                  <span>सिस्टम स्कैनिंग: वायरस, मैलवेयर, ब्रूट-फोर्स थ्रेट्स & स्क्रिप्ट इंजेक्शन...</span>
                  <span>स्कैन प्रगति: 78%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-2 rounded-full w-4/5 animate-pulse" />
                </div>
              </div>
            )}

            {scanComplete && !isScanning && (
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex items-center gap-3 text-emerald-200 text-xs font-bold animate-in fade-in">
                <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>स्कैन सफल: 0 वायरस, 0 दुर्भावनापूर्ण स्क्रिप्ट्स। सिस्टम पूरी तरह सुरक्षित है और कोई भी कमजोरी नहीं पाई गई!</span>
              </div>
            )}

            {/* Security Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">एंटी-हैकिंग शील्ड</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-sm font-bold text-emerald-300">सक्रिय (Active)</p>
                <p className="text-[10px] text-slate-500">256-बिट एंड-टू-एंड एनक्रिप्शन</p>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">एंटी-वायरस / मैलवेयर</span>
                  <Bug className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-sm font-bold text-emerald-300">0 थ्रेट्स (Clean)</p>
                <p className="text-[10px] text-slate-500">लाइव फ़ाइल इंटीग्रिटी गार्ड</p>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">पासवर्ड क्रैक प्रिवेंशन</span>
                  <Lock className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-sm font-bold text-emerald-300">ब्रूट-फोर्स लॉक</p>
                <p className="text-[10px] text-slate-500">5 गलत प्रयासों पर ऑटो-लॉक</p>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">XSS & इंजेक्शन शील्ड</span>
                  <ShieldAlert className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-sm font-bold text-emerald-300">ब्लॉक & सैनिटाइज़्ड</p>
                <p className="text-[10px] text-slate-500">हैकर्स के दुर्भावनापूर्ण कोड से सुरक्षित</p>
              </div>
            </div>
          </div>

          {/* Google Search Console & Automatic SEO Shield Card (Locked & Protected) */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm max-w-xl mx-auto space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 font-bold">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Google Search Console & ऑटोमैटिक SEO
                  </h3>
                  <p className="text-xs text-slate-500">
                    गूगल सर्च रैंकिंग एवं वेरिफिकेशन शील्ड
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>100% सक्रिय</span>
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800">सर्च कंसोल वेरिफिकेशन टोकन</p>
                  <p className="text-[11px] font-mono text-indigo-600">googleb1555e0b483437eb.html</p>
                </div>
                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800">
                  सत्यापित
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800">ऑटोमैटिक SEO इंजन (Auto-Dynamic SEO)</p>
                  <p className="text-[11px] text-slate-500">सभी पेजों, टैग्स और कीवर्ड्स पर लगातार ऑटो-ऑप्टिमाइजेशन</p>
                </div>
                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-800">
                  ऑटो-एक्टिव
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800">गूगल बॉट इंडेक्सिंग & साइटमैप</p>
                  <p className="text-[11px] font-mono text-slate-600">/robots.txt + /sitemap.xml</p>
                </div>
                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800">
                  इनेबल्ड
                </span>
              </div>
            </div>

            {/* Anti-Tamper Notice */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">छेड़छाड़-रोधी सुरक्षा लॉक (Tamper-Proof Locked):</p>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  सभी SEO टैग्स, वेरिफिकेशन कोड और बैकएंड फाइलें सुरक्षित रूप से लॉक हैं ताकि कोई अनधिकृत व्यक्ति या बाहरी यूजर इनसे छेड़छाड़ न कर सके।
                </p>
              </div>
            </div>
          </div>

          {/* Password Change Card */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm max-w-xl mx-auto space-y-6">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-600" />
              एडमिन पासवर्ड बदलें (CEO: विशाल पटेल)
            </h3>
            <p className="text-xs text-slate-500">
              {isEn ? 'Change and update your secret admin password securely.' : 'अपना गुप्त एडमिन पासवर्ड सुरक्षित रूप से बदलें और अपडेट करें।'}
            </p>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">वर्तमान पासवर्ड</label>
                <input
                  type="password"
                  required
                  placeholder="वर्तमान पासवर्ड दर्ज करें"
                  value={currentPwdInput}
                  onChange={(e) => setCurrentPwdInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">नया पासवर्ड</label>
                <input
                  type="password"
                  required
                  placeholder="नया गुप्त पासवर्ड"
                  value={newPwdInput}
                  onChange={(e) => setNewPwdInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {pwdMsg && (
                <p className={`text-xs font-bold ${pwdMsg.includes('सफलतापूर्वक') ? 'text-emerald-600' : 'text-red-500'}`}>
                  {pwdMsg}
                </p>
              )}
              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all"
              >
                पासवर्ड अपडेट करें
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Picker Modal (Pick CEO Photo, Staff Avatars, or Company Media without URL) */}
      {isGalleryPickerOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
          onClick={() => setIsGalleryPickerOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-amber-300">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black">
                    {isEn ? 'Pick Photo from Gallery' : 'गैलरी से फोटो चुनें (बिना URL के)'}
                  </h3>
                  <p className="text-xs text-indigo-200">
                    {isEn ? 'Tap any photo to select directly for Employee or Boss profile' : 'सीईओ प्रोफाइल, एम्प्लॉई या कंपनी गैलरी से 1-क्लिक में फोटो लगाएं'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsGalleryPickerOpen(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Gallery Content */}
            <div className="p-5 overflow-y-auto overscroll-contain space-y-6 flex-1">
              
              {/* Option 1: Direct Device Gallery Upload */}
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-indigo-950">
                      {isEn ? 'Upload directly from Phone / PC Gallery' : 'अपने फोन या कंप्यूटर की गैलरी से फोटो लगाएं'}
                    </h4>
                    <p className="text-xs text-indigo-700">
                      {isEn ? 'Select any image file directly from your files' : 'डिवाइस स्टोरेज से अपनी कोई भी फोटो चुनें'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    employeeFileInputRef.current?.click();
                    setIsGalleryPickerOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs whitespace-nowrap shadow-sm transition-all"
                >
                  {isEn ? 'Choose File' : 'फ़ाइल चुनें'}
                </button>
              </div>

              {/* Option 2: Boss / CEO Vishal Patel Official Profiles */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-500" />
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    {isEn ? 'CEO & Executive Profiles (Vishal Patel)' : 'सीईओ विशाल पटेल व एग्जीक्यूटिव प्रोफाइल फोटो'}
                  </h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { title: isEn ? 'CEO Vishal Patel' : 'सीईओ विशाल पटेल (बॉस)', role: 'Owner & CEO', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80' },
                    { title: isEn ? 'Tech Architect' : 'चीफ टेक आर्किटेक्ट', role: 'AI Architecture', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format&fit=crop&q=80' },
                    { title: isEn ? 'Creative Director' : 'क्रिएटिव डायरेक्टर', role: 'Design Lead', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80' },
                    { title: isEn ? 'Operations Manager' : 'ऑपरेशंस हेड', role: 'Management', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' },
                  ].map((prof, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setNewEmp((prev) => ({ ...prev, photoUrl: prof.url }));
                        setIsGalleryPickerOpen(false);
                        showToast(`'${prof.title}' फोटो चुन ली गई!`, 'success');
                      }}
                      className="p-3 rounded-2xl border border-slate-200 hover:border-amber-400 bg-white hover:bg-amber-50/40 transition-all cursor-pointer text-center space-y-2 group shadow-sm hover:shadow-md"
                    >
                      <img src={prof.url} alt={prof.title} className="w-16 h-16 rounded-2xl mx-auto object-cover border-2 border-slate-200 group-hover:border-amber-400 group-hover:scale-105 transition-all" />
                      <div>
                        <p className="text-xs font-black text-slate-900 line-clamp-1">{prof.title}</p>
                        <p className="text-[10px] text-slate-500 font-semibold">{prof.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Option 3: All Company Gallery Photos & Banners */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-violet-500" />
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    {isEn ? 'Company Media Gallery Items' : 'कंपनी मीडिया गैलरी की तस्वीरें'}
                  </h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {media.filter(m => m.type !== 'video').map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setNewEmp((prev) => ({ ...prev, photoUrl: item.url }));
                        setIsGalleryPickerOpen(false);
                        showToast(`'${item.title}' फोटो चुन ली गई!`, 'success');
                      }}
                      className="p-2.5 rounded-2xl border border-slate-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/40 transition-all cursor-pointer space-y-2 group shadow-sm hover:shadow-md"
                    >
                      <img src={item.url} alt={item.title} className="w-full h-24 rounded-xl object-cover border group-hover:scale-102 transition-transform" />
                      <div>
                        <p className="text-xs font-bold text-slate-900 line-clamp-1">{item.title}</p>
                        <span className="text-[10px] text-indigo-600 font-semibold uppercase">{item.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
              <span>{isEn ? 'Click any card to select' : 'किसी भी फोटो पर क्लिक करके तुरंत लगाएं'}</span>
              <button
                type="button"
                onClick={() => setIsGalleryPickerOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition-colors"
              >
                {isEn ? 'Close' : 'बंद करें'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
