import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

import type { Collection, Memory } from '@/lib/types';

export type Database = {
  public: {
    Tables: {
      collections: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          accent: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          accent: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['collections']['Insert']>;
        Relationships: [];
      };
      memories: {
        Row: {
          id: string;
          user_id: string;
          type: Memory['type'];
          title: string | null;
          about: string | null;
          note: string | null;
          prompt: string | null;
          audio_path: string | null;
          photo_path: string | null;
          duration_millis: number | null;
          unlock_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: Memory['type'];
          title?: string | null;
          about?: string | null;
          note?: string | null;
          prompt?: string | null;
          audio_path?: string | null;
          photo_path?: string | null;
          duration_millis?: number | null;
          unlock_date?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['memories']['Insert']>;
        Relationships: [];
      };
      memory_collections: {
        Row: {
          memory_id: string;
          collection_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          memory_id: string;
          collection_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['memory_collections']['Insert']>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
const canCreateSupabaseClient =
  isSupabaseConfigured && (Platform.OS !== 'web' || typeof window !== 'undefined');

export const supabase: SupabaseClient<Database> | null = canCreateSupabaseClient
  ? createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;

if (supabase && Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}

export type CollectionInsert = Database['public']['Tables']['collections']['Insert'];
export type MemoryInsert = Database['public']['Tables']['memories']['Insert'];
export type MemoryCollectionInsert = Database['public']['Tables']['memory_collections']['Insert'];

export function collectionToInsert(collection: Collection, userId: string): CollectionInsert {
  return {
    id: collection.id,
    user_id: userId,
    name: collection.name,
    accent: collection.accent,
    created_at: collection.createdAt,
  };
}

export function memoryToInsert(memory: Memory, userId: string): MemoryInsert {
  return {
    id: memory.id,
    user_id: userId,
    type: memory.type,
    title: memory.title ?? null,
    about: memory.about ?? null,
    note: memory.note ?? null,
    prompt: memory.prompt ?? null,
    audio_path: memory.audioUri ?? null,
    photo_path: memory.photoUri ?? null,
    duration_millis: memory.durationMillis ?? null,
    unlock_date: memory.unlockDate ?? null,
    created_at: memory.createdAt,
  };
}

export function memoryCollectionInserts(memory: Memory, userId: string): MemoryCollectionInsert[] {
  return memory.collectionIds.map((collectionId) => ({
    memory_id: memory.id,
    collection_id: collectionId,
    user_id: userId,
  }));
}

export async function ensureSupabaseUser() {
  if (!supabase) return null;

  const sessionResult = await supabase.auth.getSession();
  if (sessionResult.error) throw sessionResult.error;
  if (sessionResult.data.session?.user.id) return sessionResult.data.session.user.id;

  const signInResult = await supabase.auth.signInAnonymously();
  if (signInResult.error) throw signInResult.error;

  return signInResult.data.user?.id ?? signInResult.data.session?.user.id ?? null;
}

export function collectionFromRow(row: Database['public']['Tables']['collections']['Row']): Collection {
  return {
    id: row.id,
    name: row.name,
    accent: row.accent,
    createdAt: row.created_at,
  };
}

export function memoryFromRow(
  row: Database['public']['Tables']['memories']['Row'],
  collectionIds: string[],
): Memory {
  return {
    id: row.id,
    type: row.type,
    title: row.title ?? undefined,
    about: row.about ?? undefined,
    note: row.note ?? undefined,
    prompt: row.prompt ?? undefined,
    audioUri: row.audio_path ?? undefined,
    durationMillis: row.duration_millis ?? undefined,
    photoUri: row.photo_path ?? undefined,
    collectionIds,
    unlockDate: row.unlock_date ?? undefined,
    createdAt: row.created_at,
  };
}

function mergeById<T extends { id: string; createdAt: string }>(local: T[], remote: T[]) {
  const merged = new Map<string, T>();
  for (const item of remote) merged.set(item.id, item);
  for (const item of local) merged.set(item.id, item);
  return [...merged.values()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function upsertCollection(collection: Collection, userId: string) {
  if (!supabase) return;

  const { error } = await supabase
    .from('collections')
    .upsert(collectionToInsert(collection, userId), { onConflict: 'id' });
  if (error) throw error;
}

export async function upsertMemory(memory: Memory, userId: string) {
  if (!supabase) return;

  const { error: memoryError } = await supabase
    .from('memories')
    .upsert(memoryToInsert(memory, userId), { onConflict: 'id' });
  if (memoryError) throw memoryError;

  const { error: deleteLinksError } = await supabase
    .from('memory_collections')
    .delete()
    .eq('memory_id', memory.id)
    .eq('user_id', userId);
  if (deleteLinksError) throw deleteLinksError;

  const links = memoryCollectionInserts(memory, userId);
  if (links.length === 0) return;

  const { error: linksError } = await supabase.from('memory_collections').insert(links);
  if (linksError) throw linksError;
}

export async function deleteRemoteMemory(memoryId: string, userId: string) {
  if (!supabase) return;

  const { error } = await supabase
    .from('memories')
    .delete()
    .eq('id', memoryId)
    .eq('user_id', userId);
  if (error) throw error;
}

export async function syncKeepsakes(input: {
  collections: Collection[];
  memories: Memory[];
  userId: string;
}) {
  if (!supabase) return input;

  for (const collection of input.collections) {
    await upsertCollection(collection, input.userId);
  }
  for (const memory of input.memories) {
    await upsertMemory(memory, input.userId);
  }

  const [collectionsResult, memoriesResult, linksResult] = await Promise.all([
    supabase.from('collections').select('*').order('created_at', { ascending: false }),
    supabase.from('memories').select('*').order('created_at', { ascending: false }),
    supabase.from('memory_collections').select('memory_id, collection_id'),
  ]);

  if (collectionsResult.error) throw collectionsResult.error;
  if (memoriesResult.error) throw memoriesResult.error;
  if (linksResult.error) throw linksResult.error;

  const collectionIdsByMemory = new Map<string, string[]>();
  for (const link of linksResult.data ?? []) {
    collectionIdsByMemory.set(link.memory_id, [
      ...(collectionIdsByMemory.get(link.memory_id) ?? []),
      link.collection_id,
    ]);
  }

  const remoteCollections = (collectionsResult.data ?? []).map(collectionFromRow);
  const remoteMemories = (memoriesResult.data ?? []).map((row) =>
    memoryFromRow(row, collectionIdsByMemory.get(row.id) ?? []),
  );

  return {
    collections: mergeById(input.collections, remoteCollections),
    memories: mergeById(input.memories, remoteMemories),
  };
}
