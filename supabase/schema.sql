-- Safe to run (and re-run) in Supabase: Dashboard → SQL Editor → New query → paste → Run.

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  email text not null,
  address text not null,
  method text not null check (method in ('pickup', 'delivery')),
  date date not null,
  notes text,
  items jsonb not null,
  total numeric(8, 2) not null check (total > 0),
  screenshot_path text not null,
  status text not null default 'pending' check (status in ('pending', 'verified', 'rejected', 'completed'))
);

alter table public.orders enable row level security;

-- The only account allowed to see and manage orders (username "admin" on the website login).
create or replace function public.is_arisi_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'admin@arisi.app'
$$;

-- Customers may only create new pending orders for tomorrow or later; they can never read, edit or delete orders.
drop policy if exists "Customers can place orders" on public.orders;
create policy "Customers can place orders"
  on public.orders for insert to anon, authenticated
  with check (status = 'pending' and date >= current_date + 1);

drop policy if exists "Admin can read orders" on public.orders;
create policy "Admin can read orders"
  on public.orders for select to authenticated
  using (public.is_arisi_admin());

drop policy if exists "Admin can update orders" on public.orders;
create policy "Admin can update orders"
  on public.orders for update to authenticated
  using (public.is_arisi_admin())
  with check (public.is_arisi_admin());

grant insert on public.orders to anon;
grant insert, select, update on public.orders to authenticated;

-- Payment screenshots: private bucket. Customers can upload; only the admin account can view.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('payment-screenshots', 'payment-screenshots', false, 5242880, array['image/png', 'image/jpeg', 'image/webp', 'image/heic'])
on conflict (id) do update set public = false;

drop policy if exists "Customers can upload payment screenshots" on storage.objects;
create policy "Customers can upload payment screenshots"
  on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'payment-screenshots');

drop policy if exists "Admin can view payment screenshots" on storage.objects;
create policy "Admin can view payment screenshots"
  on storage.objects for select to authenticated
  using (bucket_id = 'payment-screenshots' and public.is_arisi_admin());
