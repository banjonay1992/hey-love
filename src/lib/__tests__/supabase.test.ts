jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

import {
  collectionFromRow,
  collectionToInsert,
  memoryCollectionInserts,
  memoryFromRow,
  memoryToInsert,
} from '@/lib/supabase';
import type { Collection, Memory } from '@/lib/types';

describe('Supabase mapping', () => {
  it('maps collections into insert rows', () => {
    const collection: Collection = {
      id: 'box-1',
      name: 'Family',
      accent: '#b98663',
      createdAt: '2026-06-29T08:00:00.000Z',
    };

    expect(collectionToInsert(collection, 'user-1')).toEqual({
      id: 'box-1',
      user_id: 'user-1',
      name: 'Family',
      accent: '#b98663',
      created_at: '2026-06-29T08:00:00.000Z',
    });
  });

  it('maps memories into insert rows with nullable optional fields', () => {
    const memory: Memory = {
      id: 'memory-1',
      type: 'voice',
      title: 'Morning',
      note: 'Keep this',
      audioUri: 'file:///voice.m4a',
      durationMillis: 1200,
      collectionIds: ['box-1', 'box-2'],
      createdAt: '2026-06-29T08:01:00.000Z',
    };

    expect(memoryToInsert(memory, 'user-1')).toEqual({
      id: 'memory-1',
      user_id: 'user-1',
      type: 'voice',
      title: 'Morning',
      about: null,
      note: 'Keep this',
      prompt: null,
      audio_path: 'file:///voice.m4a',
      photo_path: null,
      duration_millis: 1200,
      unlock_date: null,
      created_at: '2026-06-29T08:01:00.000Z',
    });
  });

  it('maps memory collection links', () => {
    const memory: Memory = {
      id: 'memory-1',
      type: 'note',
      collectionIds: ['box-1', 'box-2'],
      createdAt: '2026-06-29T08:01:00.000Z',
    };

    expect(memoryCollectionInserts(memory, 'user-1')).toEqual([
      { memory_id: 'memory-1', collection_id: 'box-1', user_id: 'user-1' },
      { memory_id: 'memory-1', collection_id: 'box-2', user_id: 'user-1' },
    ]);
  });

  it('maps Supabase rows back into local collections and memories', () => {
    expect(
      collectionFromRow({
        id: 'box-1',
        user_id: 'user-1',
        name: 'Family',
        accent: '#b98663',
        created_at: '2026-06-29T08:00:00.000Z',
      }),
    ).toEqual({
      id: 'box-1',
      name: 'Family',
      accent: '#b98663',
      createdAt: '2026-06-29T08:00:00.000Z',
    });

    expect(
      memoryFromRow(
        {
          id: 'memory-1',
          user_id: 'user-1',
          type: 'photo',
          title: null,
          about: 'Garden',
          note: null,
          prompt: 'Look at the light',
          audio_path: null,
          photo_path: 'file:///photo.jpg',
          duration_millis: null,
          unlock_date: '2027-06-29T08:00:00.000Z',
          created_at: '2026-06-29T08:01:00.000Z',
        },
        ['box-1'],
      ),
    ).toEqual({
      id: 'memory-1',
      type: 'photo',
      about: 'Garden',
      prompt: 'Look at the light',
      photoUri: 'file:///photo.jpg',
      collectionIds: ['box-1'],
      unlockDate: '2027-06-29T08:00:00.000Z',
      createdAt: '2026-06-29T08:01:00.000Z',
    });
  });
});
