create extension if not exists "pgcrypto";

create table public.collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  accent text not null,
  created_at timestamptz not null default now()
);

create table public.memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null check (type in ('voice', 'sound', 'photo', 'note')),
  title text,
  about text,
  note text,
  prompt text,
  audio_path text,
  photo_path text,
  duration_millis integer check (duration_millis is null or duration_millis >= 0),
  unlock_date timestamptz,
  created_at timestamptz not null default now()
);

create table public.memory_collections (
  memory_id uuid not null references public.memories (id) on delete cascade,
  collection_id uuid not null references public.collections (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (memory_id, collection_id)
);

create index collections_user_created_idx on public.collections (user_id, created_at desc);
create index memories_user_created_idx on public.memories (user_id, created_at desc);
create index memories_unlock_date_idx on public.memories (user_id, unlock_date);
create index memory_collections_collection_idx on public.memory_collections (collection_id);

alter table public.collections enable row level security;
alter table public.memories enable row level security;
alter table public.memory_collections enable row level security;

create policy "Users can read their collections"
  on public.collections for select
  using (auth.uid() = user_id);

create policy "Users can create their collections"
  on public.collections for insert
  with check (auth.uid() = user_id);

create policy "Users can update their collections"
  on public.collections for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their collections"
  on public.collections for delete
  using (auth.uid() = user_id);

create policy "Users can read their memories"
  on public.memories for select
  using (auth.uid() = user_id);

create policy "Users can create their memories"
  on public.memories for insert
  with check (auth.uid() = user_id);

create policy "Users can update their memories"
  on public.memories for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their memories"
  on public.memories for delete
  using (auth.uid() = user_id);

create policy "Users can read their memory collections"
  on public.memory_collections for select
  using (auth.uid() = user_id);

create policy "Users can create their memory collections"
  on public.memory_collections for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.memories
      where memories.id = memory_id and memories.user_id = auth.uid()
    )
    and exists (
      select 1 from public.collections
      where collections.id = collection_id and collections.user_id = auth.uid()
    )
  );

create policy "Users can delete their memory collections"
  on public.memory_collections for delete
  using (auth.uid() = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'keepsakes',
  'keepsakes',
  false,
  52428800,
  array['audio/m4a', 'audio/mp4', 'audio/mpeg', 'audio/wav', 'image/jpeg', 'image/png', 'image/heic', 'image/heif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Users can read their keepsake objects"
  on storage.objects for select
  using (bucket_id = 'keepsakes' and owner = auth.uid());

create policy "Users can upload their keepsake objects"
  on storage.objects for insert
  with check (bucket_id = 'keepsakes' and owner = auth.uid());

create policy "Users can update their keepsake objects"
  on storage.objects for update
  using (bucket_id = 'keepsakes' and owner = auth.uid())
  with check (bucket_id = 'keepsakes' and owner = auth.uid());

create policy "Users can delete their keepsake objects"
  on storage.objects for delete
  using (bucket_id = 'keepsakes' and owner = auth.uid());
