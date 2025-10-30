-- Schéma DEMO indépendant de ta base existante
create extension if not exists "pgcrypto";

create table if not exists public.demo_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  is_published boolean not null default false,
  published_at timestamptz null,
  created_at timestamptz not null default now()
);

create table if not exists public.demo_comments (
  id uuid primary key default gen_random_uuid(),
  post uuid not null references public.demo_posts(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.demo_likes (
  id uuid primary key default gen_random_uuid(),
  post uuid not null references public.demo_posts(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists idx_demo_comments_post on public.demo_comments(post);
create index if not exists idx_demo_likes_post on public.demo_likes(post);

alter table public.demo_posts enable row level security;
alter table public.demo_comments enable row level security;
alter table public.demo_likes enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='demo_posts' and policyname='demo_posts_all') then
    create policy demo_posts_all on public.demo_posts for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='demo_comments' and policyname='demo_comments_all') then
    create policy demo_comments_all on public.demo_comments for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='demo_likes' and policyname='demo_likes_all') then
    create policy demo_likes_all on public.demo_likes for all using (true) with check (true);
  end if;
end $$;


