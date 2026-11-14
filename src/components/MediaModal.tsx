import React, { useState } from 'react';
import { X, ArrowLeft, Download, Image as ImageIcon, Video, Calendar, Check, ExternalLink } from 'lucide-react';
import { MediaItem } from '../types';
import { useToast } from './Toast';

interface MediaModalProps {
  isOpen: boolean;
  item: MediaItem | null;
  onClose: () => void;
}

export const MediaModal: React.FC<MediaModalProps> = ({ isOpen, item, onClose }) => {
  const { showToast } = useToast();
  const [downloading, setDownloading] = useState(false);

  if (!isOpen || !item) return null;

  const handleDownload = async () => {
    try {
      setDownloading(true);
      showToast(`${item.type === 'video' ? 'वीडियो' : 'फ़ोटो'} डाउनलोड हो रहा है...`, 'info');

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

      showToast(`'${item.title}' सफलतापूर्वक डाउनलोड हो गया!`, 'success');
    } catch (err) {
      // Fallback for cross-origin restricted images/videos
      const link = document.createElement('a');
      link.href = item.url;
      link.target = '_blank';
      link.download = item.title;
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`डाउनलोड लिंक खोला गया!`, 'success');
    } finally {
      setDownloading(false);
    }
  };

  const isVideoUrl = item.type === 'video' && (item.url.includes('.mp4') || item.url.includes('.webm') || item.url.includes('video'));

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/60 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-4 sm:p-5 text-white flex items-center justify-between border-b border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>वापस जाएँ (Back)</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/30 disabled:opacity-50"
              title="डाउनलोड करें"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'डाउनलोड हो रहा है...' : 'डाउनलोड करें (Download)'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              title="बंद करें"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Media Preview Box */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 bg-slate-950/70">
          <div className="rounded-2xl overflow-hidden bg-black/60 border border-slate-800 flex items-center justify-center min-h-[300px] max-h-[58vh]">
            {item.type === 'video' ? (
              isVideoUrl ? (
                <video
                  src={item.url}
                  controls
                  autoPlay
                  className="max-h-[58vh] w-auto max-w-full object-contain"
                />
              ) : (
                <div className="relative w-full h-[380px] flex flex-col items-center justify-center bg-slate-900 text-center p-6 space-y-4">
                  <img
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80"
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                  />
                  <div className="relative z-10 space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-600/80 backdrop-blur-md flex items-center justify-center mx-auto text-white shadow-xl shadow-indigo-600/30">
                      <Video className="w-8 h-8" />
                    </div>
                    <p className="text-white text-base font-bold">{item.title}</p>
                    <p className="text-slate-400 text-xs max-w-md">{item.description}</p>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-all"
                    >
                      <span>वीडियो स्ट्रीम खोलें</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              )
            ) : (
              <img
                src={item.url}
                alt={item.title}
                className="max-h-[58vh] w-auto max-w-full object-contain select-none"
              />
            )}
          </div>

          {/* Details & Actions */}
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-3 text-white">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase flex items-center gap-1.5">
                  {item.type === 'video' ? <Video className="w-3.5 h-3.5" /> : <ImageIcon className="w-3.5 h-3.5" />}
                  {item.type}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {item.date}
                </span>
              </div>

              <button
                onClick={handleDownload}
                disabled={downloading}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>डाउनलोड</span>
              </button>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white">{item.title}</h2>
            <p className="text-sm text-slate-300 leading-relaxed">{item.description}</p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-400">फ्री एआई विशाल कंपनी • आधिकारिक मीडिया पोर्टल</p>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
          >
            बंद करें (Close)
          </button>
        </div>

      </div>
    </div>
  );
};
