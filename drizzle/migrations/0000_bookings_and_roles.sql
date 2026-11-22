create type public.app_role as enum ('admin', 'user');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;
create policy "Users read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.assign_admin_role()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if lower(new.email) = 'aleinadnaveja14@gmail.com' then
    insert into public.user_roles (user_id, role) values (new.id, 'admin') on conflict do nothing;
  end if;
  return new;
end $$;
create trigger on_auth_user_created_admin after insert on auth.users for each row execute function public.assign_admin_role();

create sequence public.booking_folio_seq;
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  folio text not null unique default ('K-' || lpad(nextval('public.booking_folio_seq')::text, 4, '0')),
  plan text not null,
  date date not null,
  start_time time not null,
  end_time time not null,
  hours numeric not null,
  nannies_count int not null default 1,
  children_count int not null,
  children_ages int[] not null default '{}',
  notes text,
  municipio text not null,
  colonia text not null,
  name text not null,
  whatsapp text not null,
  email text not null,
  estimated_total numeric,
  status text not null default 'pendiente',
  internal_notes text,
  assigned_nanny text,
  payment_link text,
  paid_amount numeric,
  created_at timestamptz not null default now()
);
create index bookings_whatsapp_created_idx on public.bookings (whatsapp, created_at);
grant select, update on public.bookings to authenticated;
grant all on public.bookings to service_role;
grant usage on sequence public.booking_folio_seq to service_role;
alter table public.bookings enable row level security;
create policy "Admins read bookings" on public.bookings for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins update bookings" on public.bookings for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));