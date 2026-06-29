drop policy if exists "Users can read their memory collections" on public.memory_collections;
drop policy if exists "Users can create their memory collections" on public.memory_collections;
drop policy if exists "Users can delete their memory collections" on public.memory_collections;

alter table public.memory_collections
  drop constraint if exists memory_collections_memory_id_fkey,
  drop constraint if exists memory_collections_collection_id_fkey;

alter table public.collections
  alter column id type text using id::text;

alter table public.memories
  alter column id type text using id::text;

alter table public.memory_collections
  alter column memory_id type text using memory_id::text,
  alter column collection_id type text using collection_id::text;

alter table public.memory_collections
  add constraint memory_collections_memory_id_fkey
    foreign key (memory_id) references public.memories (id) on delete cascade,
  add constraint memory_collections_collection_id_fkey
    foreign key (collection_id) references public.collections (id) on delete cascade;

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
