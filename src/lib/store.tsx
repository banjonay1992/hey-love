import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { palette } from '@/theme/tokens';
import type { Collection, Memory } from '@/lib/types';
import {
  ensureSupabaseUser,
  isSupabaseConfigured,
  syncKeepsakes,
  deleteRemoteMemory,
  upsertCollection,
  upsertMemory,
} from '@/lib/supabase';

const MEMORY_KEY = 'heylove.memories.v1';
const COLLECTION_KEY = 'heylove.collections.v1';
const ONBOARDED_KEY = 'heylove.onboarded.v1';

export function newId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

const COLLECTION_ACCENTS = [
  palette.clay,
  palette.moss,
  palette.dustyRose,
  palette.oak,
  palette.sage,
  palette.terracotta,
];

type StoreValue = {
  ready: boolean;
  syncStatus: 'offline' | 'syncing' | 'synced' | 'error';
  syncError?: string;
  onboarded: boolean;
  memories: Memory[];
  collections: Collection[];
  completeOnboarding: () => void;
  addMemory: (m: Omit<Memory, 'id' | 'createdAt'> & Partial<Pick<Memory, 'id' | 'createdAt'>>) => Memory;
  updateMemory: (id: string, patch: Partial<Memory>) => void;
  deleteMemory: (id: string) => void;
  addCollection: (name: string) => Collection;
  getCollection: (id: string) => Collection | undefined;
  getMemory: (id: string) => Memory | undefined;
};

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [syncStatus, setSyncStatus] = useState<StoreValue['syncStatus']>(
    isSupabaseConfigured ? 'syncing' : 'offline',
  );
  const [syncError, setSyncError] = useState<string | undefined>();
  const [onboarded, setOnboarded] = useState(false);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const hydrated = useRef(false);
  const userId = useRef<string | null>(null);
  const memoriesRef = useRef<Memory[]>([]);
  const collectionsRef = useRef<Collection[]>([]);

  const reportSyncError = useCallback((error: unknown) => {
    console.warn('Could not sync your keepsakes', error);
    setSyncStatus('error');
    setSyncError(error instanceof Error ? error.message : 'Could not sync your keepsakes.');
  }, []);

  useEffect(() => {
    (async () => {
      let localMemories: Memory[] = [];
      let localCollections: Collection[] = [];

      try {
        const [m, c, o] = await Promise.all([
          AsyncStorage.getItem(MEMORY_KEY),
          AsyncStorage.getItem(COLLECTION_KEY),
          AsyncStorage.getItem(ONBOARDED_KEY),
        ]);
        localMemories = m ? JSON.parse(m) : [];
        localCollections = c ? JSON.parse(c) : [];
        setMemories(localMemories);
        setCollections(localCollections);
        if (o === 'true') setOnboarded(true);
      } catch (e) {
        console.warn('Could not read your keepsakes', e);
      } finally {
        hydrated.current = true;
        setReady(true);
      }

      if (!isSupabaseConfigured) {
        setSyncStatus('offline');
        return;
      }

      try {
        setSyncStatus('syncing');
        const syncedUserId = await ensureSupabaseUser();
        userId.current = syncedUserId;
        if (!syncedUserId) {
          setSyncStatus('offline');
          return;
        }

        const synced = await syncKeepsakes({
          collections: localCollections,
          memories: localMemories,
          userId: syncedUserId,
        });
        setCollections(synced.collections);
        setMemories(synced.memories);
        await Promise.all([
          AsyncStorage.setItem(COLLECTION_KEY, JSON.stringify(synced.collections)),
          AsyncStorage.setItem(MEMORY_KEY, JSON.stringify(synced.memories)),
        ]);
        setSyncError(undefined);
        setSyncStatus('synced');
      } catch (e) {
        reportSyncError(e);
      }
    })();
  }, [reportSyncError]);

  useEffect(() => {
    if (hydrated.current) AsyncStorage.setItem(MEMORY_KEY, JSON.stringify(memories));
    memoriesRef.current = memories;
  }, [memories]);

  useEffect(() => {
    if (hydrated.current) AsyncStorage.setItem(COLLECTION_KEY, JSON.stringify(collections));
    collectionsRef.current = collections;
  }, [collections]);

  const completeOnboarding = useCallback(() => {
    setOnboarded(true);
    AsyncStorage.setItem(ONBOARDED_KEY, 'true');
  }, []);

  const addMemory = useCallback<StoreValue['addMemory']>((m) => {
    const memory: Memory = {
      id: m.id ?? newId(),
      createdAt: m.createdAt ?? new Date().toISOString(),
      type: m.type,
      title: m.title,
      about: m.about,
      note: m.note,
      prompt: m.prompt,
      audioUri: m.audioUri,
      durationMillis: m.durationMillis,
      photoUri: m.photoUri,
      collectionIds: m.collectionIds ?? [],
      unlockDate: m.unlockDate,
    };
    setMemories((prev) => [memory, ...prev]);
    if (userId.current) {
      void (async () => {
        try {
          for (const collectionId of memory.collectionIds) {
            const collection = collectionsRef.current.find((c) => c.id === collectionId);
            if (collection) await upsertCollection(collection, userId.current!);
          }
          await upsertMemory(memory, userId.current!);
          setSyncError(undefined);
          setSyncStatus('synced');
        } catch (e) {
          reportSyncError(e);
        }
      })();
    }
    return memory;
  }, [reportSyncError]);

  const updateMemory = useCallback<StoreValue['updateMemory']>((id, patch) => {
    let updated: Memory | undefined;
    setMemories((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        updated = { ...m, ...patch };
        return updated;
      }),
    );
    if (userId.current && updated) {
      void upsertMemory(updated, userId.current).catch(reportSyncError);
    }
  }, [reportSyncError]);

  const deleteMemory = useCallback<StoreValue['deleteMemory']>((id) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
    if (userId.current) {
      void deleteRemoteMemory(id, userId.current).catch(reportSyncError);
    }
  }, [reportSyncError]);

  const addCollection = useCallback<StoreValue['addCollection']>((name) => {
    const collection: Collection = {
      id: newId(),
      name: name.trim(),
      accent: COLLECTION_ACCENTS[Math.floor(Math.random() * COLLECTION_ACCENTS.length)],
      createdAt: new Date().toISOString(),
    };
    setCollections((prev) => [...prev, collection]);
    if (userId.current) {
      void upsertCollection(collection, userId.current).catch(reportSyncError);
    }
    return collection;
  }, [reportSyncError]);

  const getCollection = useCallback(
    (id: string) => collections.find((c) => c.id === id),
    [collections],
  );
  const getMemory = useCallback((id: string) => memories.find((m) => m.id === id), [memories]);

  const value = useMemo<StoreValue>(
    () => ({
      ready,
      syncStatus,
      syncError,
      onboarded,
      memories,
      collections,
      completeOnboarding,
      addMemory,
      updateMemory,
      deleteMemory,
      addCollection,
      getCollection,
      getMemory,
    }),
    [
      ready,
      syncStatus,
      syncError,
      onboarded,
      memories,
      collections,
      completeOnboarding,
      addMemory,
      updateMemory,
      deleteMemory,
      addCollection,
      getCollection,
      getMemory,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

/** A memory is visible only once any time-capsule date has passed. */
export function isUnlocked(memory: Memory, now = new Date()) {
  if (!memory.unlockDate) return true;
  return new Date(memory.unlockDate).getTime() <= now.getTime();
}
