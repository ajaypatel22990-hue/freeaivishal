import React, { useState } from 'react';
import { Image as ImageIcon, Video, Calendar, ZoomIn, Download } from 'lucide-react';
import { MediaItem } from '../types';
import { Language, translations } from '../translations';
import { MediaModal } from './MediaModal';
import { useToast } from './Toast';

interface GalleryViewProps {
  media: MediaItem[];
  language: Language;
}

export const GalleryView: React.FC<GalleryViewProps> = ({ media, language }) => {
  const t = translations[language];
  const isEn = language === 'en';
  const { showToast } = useToast();
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [filter, setFilter] = useState<'all' | 'photo' | 'video' | 'banner'>('all');

  const filteredMedia = media.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-semibold">
            <ImageIcon className="w-4 h-4" />
            <span>{t.companyName} ({t.ceoTitle})</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">{t.mediaSectionHeading}</h1>
          <p className="text-slate-300 text-sm">{t.mediaSectionSubtitle}</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === 'all' ? 'bg-white text-indigo-900 shadow-md' : 'text-white hover:bg-white/10'
            }`}
          >
            {t.all} ({media.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('photo')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === 'photo' ? 'bg-white text-indigo-900 shadow-md' : 'text-white hover:bg-white/10'
            }`}
          >
            {t.photos}
          </button>
          <button
            type="button"
            onClick={() => setFilter('video')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === 'video' ? 'bg-white text-indigo-900 shadow-md' : 'text-white hover:bg-white/10'
            }`}
          >
            {t.videos}
          </button>
          <button
            type="button"
            onClick={() => setFilter('banner')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === 'banner' ? 'bg-white text-indigo-900 shadow-md' : 'text-white hover:bg-white/10'
            }`}
          >
            {t.banners}
          </button>
        </div>
      </div>

      {/* Media Grid: 2 per row, square format */}
      <div className="grid grid-cols-2 gap-3 sm:gap-6">
        {filteredMedia.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all cursor-pointer group flex flex-col justify-between"
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
              <div className="absolute inset-0 bg-indigo-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                <span className="px-3 py-1.5 rounded-xl bg-white text-slate-900 font-bold text-[10px] sm:text-xs shadow-lg flex items-center gap-1">
                  <ZoomIn className="w-3.5 h-3.5 text-indigo-600" /> {t.tapToViewAndDownload}
                </span>
              </div>
            </div>

            <div className="p-3 sm:p-5 space-y-2">
              <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {item.date}
                </span>
              </div>
              <h3 className="text-xs sm:text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                {item.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-600 line-clamp-2 leading-relaxed hidden sm:block">
                {item.description}
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] sm:text-xs font-bold text-indigo-600 flex items-center gap-1">
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

      {filteredMedia.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
          <p className="text-slate-500 font-medium">{t.noMediaFound}</p>
        </div>
      )}

      {/* Lightbox / Fullscreen Modal with Video Support & Download */}
      <MediaModal
        isOpen={Boolean(selectedItem)}
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />

    </div>
  );
};
