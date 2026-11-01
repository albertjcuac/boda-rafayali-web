-- ============================================================================
--  BODA · Esquema de base de datos para Supabase
--  Pégalo entero en  Supabase → SQL Editor → New query → Run
--  Es seguro ejecutarlo más de una vez.
-- ============================================================================

-- 1) TABLA ------------------------------------------------------------------
create table if not exists public.respuestas_boda (
  id                   uuid        primary key default gen_random_uuid(),
  nombre               text        not null
                         check (char_length(btrim(nombre)) between 2 and 120),
  asistencia           text        not null
                         check (asistencia in ('si', 'no')),
  acompanantes         integer     not null default 0
                         check (acompanantes between 0 and 20),
  nombres_acompanantes text
                         check (nombres_acompanantes is null or char_length(nombres_acompanantes) <= 500),
  alergias             text
                         check (alergias is null or char_length(alergias) <= 500),
  cancion              text
                         check (cancion is null or char_length(cancion) <= 200),
  mensaje              text
                         check (mensaje is null or char_length(mensaje) <= 1000),
  -- timestamptz = fecha y hora con zona horaria (recomendado frente a "timestamp" a secas)
  creado_en            timestamptz not null default now()
);

comment on table public.respuestas_boda is 'Respuestas de los invitados a la encuesta de la boda.';

-- 2) ÍNDICES ----------------------------------------------------------------
-- El panel ordena por fecha de creación y filtra por asistencia.
create index if not exists respuestas_boda_creado_en_idx  on public.respuestas_boda (creado_en desc);
create index if not exists respuestas_boda_asistencia_idx on public.respuestas_boda (asistencia);

-- 3) SEGURIDAD (Row Level Security) -----------------------------------------
alter table public.respuestas_boda enable row level security;

-- Empezamos sin permisos para nadie…
revoke all on public.respuestas_boda from anon, authenticated;

-- …y damos solo lo imprescindible:
--   · Usuarios anónimos (los invitados): únicamente INSERT.
--   · Usuarios autenticados (los novios): únicamente SELECT.
grant insert on public.respuestas_boda to anon;
grant select on public.respuestas_boda to authenticated;

-- Políticas (se recrean para poder ejecutar el script varias veces)
drop policy if exists "Anónimos pueden insertar respuestas" on public.respuestas_boda;
create policy "Anónimos pueden insertar respuestas"
  on public.respuestas_boda
  for insert
  to anon
  with check (true);

drop policy if exists "Autenticados pueden leer respuestas" on public.respuestas_boda;
create policy "Autenticados pueden leer respuestas"
  on public.respuestas_boda
  for select
  to authenticated
  using (true);

-- No existen políticas de UPDATE ni DELETE: nadie puede modificar ni borrar respuestas
-- desde la web. Si necesitas borrar alguna, hazlo desde Supabase → Table Editor.

-- ----------------------------------------------------------------------------
--  OPCIONAL · Restringir la lectura a un correo concreto
--  Si quieres que SOLO un email pueda leer las respuestas (aunque existan otros usuarios
--  autenticados), sustituye la política de lectura por esta (cambia el email):
--
--  drop policy if exists "Autenticados pueden leer respuestas" on public.respuestas_boda;
--  create policy "Solo los novios pueden leer respuestas"
--    on public.respuestas_boda
--    for select
--    to authenticated
--    using ((auth.jwt() ->> 'email') = 'tu-correo@ejemplo.com');
-- ----------------------------------------------------------------------------
