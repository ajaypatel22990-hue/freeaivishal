/**
 * Safe Storage Utility:
 * Prevents QuotaExceededError and DOMException crashes when handling
 * large base64 photos, mobile camera uploads, or videos.
 * Guarantees that React state updates, string keys, and media persistence never delete photos or videos.
 */
export const safeStorage = {
  setItem: (key: string, value: any): boolean => {
    try {
      const str = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, str);
      return true;
    } catch (err) {
      console.warn(`[SafeStorage] LocalStorage quota reached for ${key}. Optimizing storage to preserve media...`, err);
      try {
        // Clear non-essential cached keys first, NEVER remove fav_media
        localStorage.removeItem('fav_announcements');
        localStorage.removeItem('fav_local_modified');
        const str = typeof value === 'string' ? value : JSON.stringify(value);
        localStorage.setItem(key, str);
        return true;
      } catch (innerErr) {
        console.error('[SafeStorage] Failed to save even after cache clearance:', innerErr);
        return false;
      }
    }
  },

  getItem: <T = any>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(key);
      if (item === null || item === undefined) return fallback;
      try {
        const parsed = JSON.parse(item);
        if (typeof fallback === 'string') {
          return String(parsed) as unknown as T;
        }
        return parsed as T;
      } catch {
        if (typeof fallback === 'string') {
          return String(item) as unknown as T;
        }
        return fallback;
      }
    } catch {
      return fallback;
    }
  },

  removeItem: (key: string): void => {
    try {
      if (key !== 'fav_media') {
        localStorage.removeItem(key);
      }
    } catch {}
  },
};
