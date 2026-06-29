import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

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
      };
    };
  };
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient<Database> | null = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;

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
