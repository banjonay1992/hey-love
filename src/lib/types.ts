export type MemoryType = 'voice' | 'sound' | 'photo' | 'note';

export type Memory = {
  id: string;
  type: MemoryType;
  title?: string;
  /** Who or what this is about — a person, a pet, a place. */
  about?: string;
  /** A few words written alongside the memory. */
  note?: string;
  /** The gentle prompt that inspired this, if any. */
  prompt?: string;
  audioUri?: string;
  durationMillis?: number;
  photoUri?: string;
  collectionIds: string[];
  /** Time capsule — hidden until this date arrives. */
  unlockDate?: string;
  createdAt: string;
};

export type Collection = {
  id: string;
  name: string;
  /** A soft accent colour drawn from the palette. */
  accent: string;
  createdAt: string;
};
