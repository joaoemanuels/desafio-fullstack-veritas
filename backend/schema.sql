-- Habilita a função gen_random_uuid() (já vem ativa por padrão no Supabase)
create extension if not exists pgcrypto;

create table tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text,
  priority text,
  status text not null default 'todo',
  "order" integer not null default 0
);
