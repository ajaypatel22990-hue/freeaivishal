import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Employee, CompanyWebsite, MediaItem, Announcement } from '../types';
import { INITIAL_EMPLOYEES, INITIAL_WEBSITES, INITIAL_MEDIA, INITIAL_ANNOUNCEMENTS } from '../data/initialData';
import { safeStorage } from '../utils/safeStorage';

export interface SyncedCompanyData {
  employees: Employee[];
  websites: CompanyWebsite[];
  media: MediaItem[];
  announcements: Announcement[];
  reports?: any[];
  adminPassword?: string;
  privateWebsitesPassword?: string;
  updatedAt: number;
}

const PORTAL_SYNC_COLLECTION = 'portal_sync';
const PORTAL_SYNC_DOC_ID = 'global';
const PORTAL_SYNC_PATH = `${PORTAL_SYNC_COLLECTION}/${PORTAL_SYNC_DOC_ID}`;

// Cross-tab broadcast channel for instant 0ms multi-tab sync on same device
const broadcastChannel =
  typeof window !== 'undefined' && 'BroadcastChannel' in window
    ? new BroadcastChannel('fav_company_sync_channel')
    : null;

let localVersion = 0;
let pendingMutations = 0;
let lastLocalPushTimestamp = 0;

// In-memory canonical mirror so partial updates always send a complete valid document to Firestore
let currentSnapshotCache: SyncedCompanyData | null = null;

function buildCompletePayload(partial: Partial<SyncedCompanyData>, timestamp: number): SyncedCompanyData {
  const baseEmployees =
    partial.employees ??
    currentSnapshotCache?.employees ??
    safeStorage.getItem<Employee[]>('fav_employees', INITIAL_EMPLOYEES);

  const baseWebsites =
    partial.websites ??
    currentSnapshotCache?.websites ??
    safeStorage.getItem<CompanyWebsite[]>('fav_websites', INITIAL_WEBSITES);

  const baseMedia =
    partial.media ??
    currentSnapshotCache?.media ??
    safeStorage.getItem<MediaItem[]>('fav_media', INITIAL_MEDIA);

  const baseAnnouncements =
    partial.announcements ??
    currentSnapshotCache?.announcements ??
    safeStorage.getItem<Announcement[]>('fav_announcements', INITIAL_ANNOUNCEMENTS);

  const baseReports =
    partial.reports ??
    currentSnapshotCache?.reports ??
    safeStorage.getItem<any[]>('fav_reports', []);

  const baseAdminPassword = (
    partial.adminPassword ??
    currentSnapshotCache?.adminPassword ??
    safeStorage.getItem<string>('fav_admin_pwd', '8780772619') ??
    '8780772619'
  )
    .toString()
    .slice(0, 128) || '8780772619';

  const basePrivatePassword = (
    partial.privateWebsitesPassword ??
    currentSnapshotCache?.privateWebsitesPassword ??
    safeStorage.getItem<string>('fav_private_web_pwd', '9999') ??
    '9999'
  )
    .toString()
    .slice(0, 128) || '9999';

  const complete: SyncedCompanyData = {
    employees: Array.isArray(baseEmployees) ? baseEmployees.slice(0, 500) : INITIAL_EMPLOYEES,
    websites: Array.isArray(baseWebsites) ? baseWebsites.slice(0, 500) : INITIAL_WEBSITES,
    media: Array.isArray(baseMedia) ? baseMedia.slice(0, 500) : INITIAL_MEDIA,
    announcements: Array.isArray(baseAnnouncements) ? baseAnnouncements.slice(0, 500) : INITIAL_ANNOUNCEMENTS,
    reports: Array.isArray(baseReports) ? baseReports.slice(0, 200) : [],
    adminPassword: baseAdminPassword,
    privateWebsitesPassword: basePrivatePassword,
    updatedAt: timestamp,
  };

  // Strip any undefined properties from nested objects so Firestore never rejects with "Unsupported field value: undefined"
  return JSON.parse(JSON.stringify(complete));
}

/**
 * Ultra-Fast Real-Time Multi-Device Sync Engine powered by:
 * 1. Firebase Cloud Firestore onSnapshot (instant real-time push across all mobile phones, PCs, and shared URLs worldwide)
 * 2. Express SSE + REST fallback (/api/sync/*)
 * 3. BroadcastChannel + localStorage events (0ms cross-tab sync)
 */
export const syncService = {
  getLocalVersion(): number {
    return localVersion;
  },

  setLocalVersion(ver: number): void {
    localVersion = Math.max(localVersion, ver);
  },

  /**
   * Fetches latest data from Cloud Firestore first, falling back to Express server if needed
   */
  async fetchRemoteData(): Promise<SyncedCompanyData | null> {
    // 1. Try Firebase Cloud Firestore first (shared across all preview/published instances & devices)
    try {
      const docRef = doc(db, PORTAL_SYNC_COLLECTION, PORTAL_SYNC_DOC_ID);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const cloudData = snap.data() as SyncedCompanyData;
        if (cloudData && typeof cloudData.updatedAt === 'number') {
          localVersion = Math.max(localVersion, cloudData.updatedAt);
          currentSnapshotCache = cloudData;
          return cloudData;
        }
      }
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.GET, PORTAL_SYNC_PATH);
      } catch {
        // Fallback to server API below if offline
      }
    }

    // 2. Fallback to Express server API
    try {
      const res = await fetch('/api/sync/data?t=' + Date.now(), {
        headers: { 'Cache-Control': 'no-cache, no-store' },
      });
      if (!res.ok) return null;
      const data: SyncedCompanyData = await res.json();
      if (data && typeof data.updatedAt === 'number' && data.updatedAt > 0) {
        localVersion = Math.max(localVersion, data.updatedAt);
        currentSnapshotCache = data;
      }
      // Seed Cloud Firestore if it wasn't initialized yet
      if (data) {
        try {
          const initialPayload = buildCompletePayload(data, data.updatedAt || Date.now());
          await setDoc(doc(db, PORTAL_SYNC_COLLECTION, PORTAL_SYNC_DOC_ID), initialPayload);
        } catch {}
      }
      return data;
    } catch {
      return null;
    }
  },

  /**
   * Pushes updates from Admin Panel to Cloud Firestore AND Express Server simultaneously
   * so every mobile, laptop, tab, and shared URL updates in real-time without refreshing.
   */
  async pushRemoteUpdate(data: Partial<SyncedCompanyData>): Promise<boolean> {
    pendingMutations += 1;
    const optimisticTimestamp = Date.now();
    lastLocalPushTimestamp = optimisticTimestamp;
    localVersion = Math.max(localVersion, optimisticTimestamp);

    const completePayload = buildCompletePayload(data, localVersion);
    currentSnapshotCache = completePayload;

    // 1. Immediately broadcast to all other open tabs on the same browser (0ms delay)
    if (broadcastChannel) {
      try {
        broadcastChannel.postMessage({
          type: 'LOCAL_SYNC',
          data: completePayload,
        });
      } catch {}
    }

    let firestoreSuccess = false;
    let serverSuccess = false;

    try {
      // 2. Push to Firebase Cloud Firestore (triggers instant onSnapshot across all devices worldwide)
      const firestorePromise = (async () => {
        try {
          const docRef = doc(db, PORTAL_SYNC_COLLECTION, PORTAL_SYNC_DOC_ID);
          await setDoc(docRef, completePayload);
          firestoreSuccess = true;
        } catch (err) {
          try {
            const lightweightPayload = {
              ...completePayload,
              media: completePayload.media.map(m => ({
                ...m,
                url: m.url && m.url.startsWith('data:') && m.url.length > 50000 
                  ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80' 
                  : m.url
              }))
            };
            const docRef = doc(db, PORTAL_SYNC_COLLECTION, PORTAL_SYNC_DOC_ID);
            await setDoc(docRef, lightweightPayload);
            firestoreSuccess = true;
          } catch (innerErr) {
            handleFirestoreError(innerErr, OperationType.WRITE, PORTAL_SYNC_PATH);
          }
        }
      })();

      // 3. Push to Express server API (keeps server_data/company_data.json & SSE in sync)
      const serverPromise = (async () => {
        try {
          const res = await fetch('/api/sync/update', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache, no-store',
            },
            body: JSON.stringify(completePayload),
          });
          if (res.ok) {
            const result = await res.json();
            if (result.updatedAt) {
              localVersion = Math.max(localVersion, result.updatedAt);
            }
            serverSuccess = true;
          }
        } catch {}
      })();

      await Promise.allSettled([firestorePromise, serverPromise]);
      return firestoreSuccess || serverSuccess;
    } finally {
      pendingMutations = Math.max(0, pendingMutations - 1);
    }
  },

  /**
   * Subscribes to real-time updates across all devices and tabs without page refresh.
   */
  subscribe(onUpdate: (data: Partial<SyncedCompanyData>) => void): () => void {
    let eventSource: EventSource | null = null;
    let isSubscribed = true;

    const applyIncoming = (data: Partial<SyncedCompanyData>, fromLocalTab = false) => {
      if (!data || !isSubscribed) return;

      // Never overwrite local state while a local mutation is in-flight
      if (!fromLocalTab && pendingMutations > 0) {
        return;
      }

      // Guard against older packets arriving right after a local push
      if (
        !fromLocalTab &&
        Date.now() - lastLocalPushTimestamp < 1200 &&
        data.updatedAt &&
        data.updatedAt < localVersion
      ) {
        return;
      }

      if (typeof data.updatedAt === 'number' && data.updatedAt > 0) {
        localVersion = Math.max(localVersion, data.updatedAt);
      }

      currentSnapshotCache = {
        ...(currentSnapshotCache || ({} as SyncedCompanyData)),
        ...data,
        updatedAt: localVersion,
      };

      onUpdate(data);
    };

    // 1. Firebase Cloud Firestore Real-Time Listener (Instant push across all devices/urls)
    const docRef = doc(db, PORTAL_SYNC_COLLECTION, PORTAL_SYNC_DOC_ID);
    const unsubscribeFirestore = onSnapshot(
      docRef,
      (snapshot) => {
        if (!isSubscribed) return;
        if (snapshot.exists()) {
          const cloudData = snapshot.data() as SyncedCompanyData;
          if (cloudData) {
            applyIncoming(cloudData, false);
          }
        } else {
          // Document doesn't exist in Firestore yet — seed it automatically!
          const initialSeed = buildCompletePayload({}, Date.now());
          setDoc(docRef, initialSeed).catch(() => {});
        }
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.GET, PORTAL_SYNC_PATH);
        } catch {
          // Handled gracefully with SSE backup
        }
      }
    );

    // 2. Listen to BroadcastChannel for instant 0ms cross-tab sync
    const handleBroadcast = (event: MessageEvent) => {
      if (event.data?.type === 'LOCAL_SYNC' && event.data.data) {
        applyIncoming(event.data.data, true);
      }
    };
    if (broadcastChannel) {
      broadcastChannel.addEventListener('message', handleBroadcast);
    }

    // 3. Listen to localStorage 'storage' event across tabs as secondary instant fallback
    const handleStorageEvent = (event: StorageEvent) => {
      if (!event.key || !event.newValue) return;
      try {
        if (event.key === 'fav_employees') {
          applyIncoming({ employees: JSON.parse(event.newValue) }, true);
        } else if (event.key === 'fav_websites') {
          applyIncoming({ websites: JSON.parse(event.newValue) }, true);
        } else if (event.key === 'fav_media') {
          applyIncoming({ media: JSON.parse(event.newValue) }, true);
        } else if (event.key === 'fav_announcements') {
          applyIncoming({ announcements: JSON.parse(event.newValue) }, true);
        } else if (event.key === 'fav_admin_pwd') {
          applyIncoming({ adminPassword: event.newValue }, true);
        } else if (event.key === 'fav_private_web_pwd') {
          applyIncoming({ privateWebsitesPassword: event.newValue }, true);
        }
      } catch {}
    };
    window.addEventListener('storage', handleStorageEvent);

    // 4. Server-Sent Events (SSE) backup stream
    const connectSSE = () => {
      if (!isSubscribed) return;
      try {
        if (eventSource) {
          eventSource.close();
        }

        eventSource = new EventSource('/api/sync/stream');

        eventSource.onmessage = (event) => {
          try {
            const parsed: SyncedCompanyData = JSON.parse(event.data);
            if (
              parsed &&
              typeof parsed.updatedAt === 'number' &&
              parsed.updatedAt > 0 &&
              parsed.updatedAt > localVersion
            ) {
              applyIncoming(parsed);
            }
          } catch {}
        };

        eventSource.onerror = () => {
          if (eventSource) {
            eventSource.close();
            eventSource = null;
          }
          if (isSubscribed) {
            setTimeout(connectSSE, 3000);
          }
        };
      } catch {}
    };

    connectSSE();

    return () => {
      isSubscribed = false;
      unsubscribeFirestore();
      if (eventSource) {
        eventSource.close();
      }
      if (broadcastChannel) {
        broadcastChannel.removeEventListener('message', handleBroadcast);
      }
      window.removeEventListener('storage', handleStorageEvent);
    };
  },
};
