import React, { useState } from 'react';
import { Globe, ArrowRight, Zap, Image as ImageIcon, ExternalLink, CheckCircle2, Award, Users, Download, ZoomIn, Video } from 'lucide-react';
import { CompanyWebsite, Announcement, Employee, MediaItem } from '../types';
import { Language, translations } from '../translations';
import { MediaModal } from './MediaModal';
import { useToast } from './Toast';

interface HomeViewProps {
  setCurrentTab: (tab: string) => void;
  websites: CompanyWebsite[];
  announcements: Announcement[];
  employees: Employee[];
  media: MediaItem[];
  onOpenEmployeeLogin: () => void;
  language: Language;
}

export const HomeView: React.FC<HomeViewProps> = ({
  setCurrentTab,
  websites,
  announcements,
  employees,
  media,
  onOpenEmployeeLogin,
  language,
}) => {
  const t = translations[language];
  const isEn = language === 'en';
  const { showToast } = useToast();
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  const handleCardDownload = async (e: React.MouseEvent, item: MediaItem) => {
    e.stopPropagation();
    try {
      showToast(isEn ? `Downloading ${item.type}...` : `${item.type === 'video' ? 'वीडियो' : 'फ़ोटो'} डाउनलोड हो रहा है...`, 'info');
      const response = await fetch(item.url, { mode: 'cors' });
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      const ext = item.type === 'video' ? 'mp4' : 'jpg';
      link.download = `${item.title.replace(/[^a-zA-Z0-9]/g, '_')}_freeaivishal.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      showToast(isEn ? `'${item.title}' downloaded successfully!` : `'${item.title}' डाउनलोड हो गया!`, 'success');
    } catch {
      const link = document.createElement('a');
      link.href = item.url;
      link.target = '_blank';
      link.download = item.title;
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(isEn ? 'Download link opened!' : 'डाउनलोड लिंक खोला गया!', 'success');
    }
  };

  return (
    <div className="space-y-16 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8 border-b border-indigo-900/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(236,72,153,0.15),transparent_50%)]" />
        
        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{t.heroBadge}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight">
            {t.heroTitle}
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            {t.heroSubtitle}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => setCurrentTab('websites')}
              className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-indigo-500/30 hover:scale-105 hover:shadow-indigo-500/50 transition-all flex items-center gap-2.5"
            >
              <Globe className="w-5 h-5" />
              <span>{t.allConnectedWebsites}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onOpenEmployeeLogin}
              className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold text-sm sm:text-base transition-all flex items-center gap-2.5"
            >
              <Users className="w-5 h-5 text-indigo-300" />
              <span>{t.employeeLogin}</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 border-t border-white/10 max-w-3xl mx-auto">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
              <p className="text-3xl font-black text-amber-300">{employees.length}+</p>
              <p className="text-xs text-slate-300 font-medium mt-1">{t.activeEmployeesMetric}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
              <p className="text-3xl font-black text-indigo-300">{websites.filter((w) => !w.isPrivate).length}</p>
              <p className="text-xs text-slate-300 font-medium mt-1">{t.linkedWebsitesMetric}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
              <p className="text-3xl font-black text-pink-300">{media.length}</p>
              <p className="text-xs text-slate-300 font-medium mt-1">{t.mediaMetric}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
              <p className="text-3xl font-black text-emerald-300">24/7</p>
              <p className="text-xs text-slate-300 font-medium mt-1">{t.aiSupportMetric}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      {announcements.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100 border border-amber-200/80 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-amber-200">
                <Zap className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <h2 className="text-lg font-black text-amber-900">{t.announcementsTitle}</h2>
                <p className="text-xs text-amber-700">{t.announcementsSubtitle}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {announcements.map((ann) => (
                <div key={ann.id} className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl border border-amber-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-200/80 text-amber-900">
                      {ann.date}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {t.byAuthor}: {ann.author}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{ann.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Linked Websites Quick Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm mb-1 uppercase tracking-wider">
              <Globe className="w-4 h-4" />
              <span>{t.websitesSectionBadge}</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900">{t.websitesSectionHeading}</h2>
            <p className="text-slate-600 text-sm mt-1">{t.websitesSectionSubtitle}</p>
          </div>
          <button
            type="button"
            onClick={() => setCurrentTab('websites')}
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-bold text-sm transition-colors group"
          >
            <span>{t.viewAll} ({websites.filter((w) => !w.isPrivate).length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {websites.filter((w) => !w.isPrivate).slice(0, 6).map((site) => (
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
                    {t.active}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {site.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {site.description}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 truncate max-w-[180px] font-mono">{site.url}</span>
                <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-100"
                >
                  <span>{t.visitWebsite}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Gallery Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-violet-600 font-bold text-sm mb-1 uppercase tracking-wider">
              <ImageIcon className="w-4 h-4" />
              <span>{t.mediaSectionBadge}</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900">{t.mediaSectionHeading}</h2>
            <p className="text-slate-600 text-sm mt-1">{t.mediaSectionSubtitle}</p>
          </div>
          <button
            type="button"
            onClick={() => setCurrentTab('gallery')}
            className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-800 font-bold text-sm transition-colors group"
          >
            <span>{t.viewFullGallery}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-6">
          {media.slice(0, 4).map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedMedia(item)}
              className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-violet-300 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative aspect-square overflow-hidden bg-slate-100">
                <img
                  src={item.type === 'video' ? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80' : item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                  {item.type === 'video' ? <Video className="w-3 h-3 text-pink-400" /> : <ImageIcon className="w-3 h-3 text-indigo-400" />}
                  <span className="hidden sm:inline">{item.type}</span>
                </div>
                <div className="absolute inset-0 bg-violet-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                  <span className="px-3 py-1.5 rounded-xl bg-white text-slate-900 font-bold text-[10px] sm:text-xs shadow-lg flex items-center gap-1">
                    <ZoomIn className="w-3.5 h-3.5 text-violet-600" /> {t.tapToViewAndDownload}
                  </span>
                </div>
              </div>
              <div className="p-3 sm:p-5 space-y-2">
                <p className="text-[10px] sm:text-xs text-slate-400 font-medium">{item.date}</p>
                <h3 className="text-xs sm:text-base font-bold text-slate-900 line-clamp-1 group-hover:text-violet-600 transition-colors">{item.title}</h3>
                <p className="text-[11px] sm:text-xs text-slate-600 line-clamp-2 hidden sm:block">{item.description}</p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs font-bold text-violet-600 flex items-center gap-1">
                    <ZoomIn className="w-3 h-3" /> {t.tapToOpen}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleCardDownload(e, item)}
                    className="px-2.5 py-1 rounded-lg sm:rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] sm:text-xs transition-colors flex items-center gap-1 border border-emerald-200"
                  >
                    <Download className="w-3 h-3" />
                    <span className="hidden sm:inline">{t.download}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Media Modal */}
      <MediaModal
        isOpen={Boolean(selectedMedia)}
        item={selectedMedia}
        onClose={() => setSelectedMedia(null)}
      />

      {/* Boss / Admin Banner footer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 border border-indigo-900/50">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <Award className="w-4 h-4" />
              <span>{t.adminSecurityBadge}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black">{t.adminSecurityTitle}</h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {t.adminSecurityDesc}
            </p>
          </div>
          <div>
            <button
              type="button"
              onClick={onOpenEmployeeLogin}
              className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg transition-all text-center"
            >
              {t.employeeLogin}
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
