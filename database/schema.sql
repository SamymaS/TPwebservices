-- Schema pour ynov-express: tables posts, comments, likes
-- À exécuter dans l'éditeur SQL de Supabase

-- UUID support
create extension if not exists "pgcrypto";

-- Tables
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  is_published boolean not null default false,
  published_at timestamptz null,
  created_at timestamptz not null default now()
);

create table if not exists public.comments (
  id bigserial primary key,
  post uuid not null references public.posts(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.likes (
  id bigserial primary key,
  post uuid not null references public.posts(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_posts_published on public.posts(is_published);
create index if not exists idx_comments_post on public.comments(post);
create index if not exists idx_likes_post on public.likes(post);

-- RLS
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.likes enable row level security;

-- Policies permissives (démo)
do $$ begin
  -- POSTS
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'posts' and policyname = 'posts_select_all'
  ) then
    create policy posts_select_all on public.posts for select using (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'posts' and policyname = 'posts_insert_all'
  ) then
    create policy posts_insert_all on public.posts for insert with check (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'posts' and policyname = 'posts_update_all'
  ) then
    create policy posts_update_all on public.posts for update using (true) with check (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'posts' and policyname = 'posts_delete_all'
  ) then
    create policy posts_delete_all on public.posts for delete using (true);
  end if;

  -- COMMENTS
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'comments' and policyname = 'comments_select_all'
  ) then
    create policy comments_select_all on public.comments for select using (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'comments' and policyname = 'comments_insert_all'
  ) then
    create policy comments_insert_all on public.comments for insert with check (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'comments' and policyname = 'comments_update_all'
  ) then
    create policy comments_update_all on public.comments for update using (true) with check (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'comments' and policyname = 'comments_delete_all'
  ) then
    create policy comments_delete_all on public.comments for delete using (true);
  end if;

  -- LIKES
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'likes' and policyname = 'likes_select_all'
  ) then
    create policy likes_select_all on public.likes for select using (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'likes' and policyname = 'likes_insert_all'
  ) then
    create policy likes_insert_all on public.likes for insert with check (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'likes' and policyname = 'likes_update_all'
  ) then
    create policy likes_update_all on public.likes for update using (true) with check (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'likes' and policyname = 'likes_delete_all'
  ) then
    create policy likes_delete_all on public.likes for delete using (true);
  end if;
end $$;

-- Optionnel: vue de comptage des likes (non utilisée par l'API actuelle)
-- create or replace view public.post_likes_count as
--   select post, count(*)::int as likes_count
--   from public.likes
--   group by post;


