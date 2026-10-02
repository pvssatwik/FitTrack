CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email         text NOT NULL,
  password_hash text NOT NULL,
  display_name  text NOT NULL,            -- pseudonym shown on boards
  timezone      text NOT NULL DEFAULT 'UTC',
  created_at    timestamptz NOT NULL DEFAULT now(),
  deleted_at    timestamptz
);
CREATE UNIQUE INDEX users_email_lower_idx ON users (lower(email));

-- Phase 1 scope: private groups (friends, office, gym)
CREATE TABLE groups (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  invite_code text NOT NULL UNIQUE,
  owner_id    uuid NOT NULL REFERENCES users(id),
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE group_members (
  group_id  uuid NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id   uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role      text NOT NULL DEFAULT 'member' CHECK (role IN ('owner','member')),
  joined_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (group_id, user_id)
);

-- Per-metric opt-in for leaderboard sharing (health data privacy)
CREATE TABLE leaderboard_opt_in (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  metric  text NOT NULL,
  PRIMARY KEY (user_id, metric)
);

-- Phase 2 (API route): tokens stored encrypted, server-side only
CREATE TABLE provider_connections (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider          text NOT NULL CHECK (provider IN ('ultrahuman','fitbit')),
  access_token_enc  bytea,
  refresh_token_enc bytea,
  expires_at        timestamptz,
  needs_reconnect   boolean NOT NULL DEFAULT false,
  created_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, provider)
);

CREATE TABLE uploads (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider     text CHECK (provider IN ('ultrahuman','fitbit')),  -- null until detected
  object_key   text NOT NULL,
  status       text NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending','processing','done','failed')),
  summary      jsonb,        -- preview: what was found (days per metric, skipped rows)
  error        text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz
);

-- Common store. Both routes (upload, API) end up here.
CREATE TABLE metric_samples (
  user_id  uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  metric   text NOT NULL,
  ts       timestamptz NOT NULL,
  value    double precision NOT NULL,
  provider text NOT NULL,
  source   text NOT NULL CHECK (source IN ('upload','api')),  -- verified vs self-reported
  PRIMARY KEY (user_id, metric, ts)                           -- idempotent upserts
);

CREATE TABLE daily_metrics (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day     date NOT NULL,
  metric  text NOT NULL,
  value   double precision NOT NULL,
  source  text NOT NULL CHECK (source IN ('upload','api')),
  PRIMARY KEY (user_id, day, metric)
);

CREATE TABLE weekly_points (
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  week_start date NOT NULL,
  points     integer NOT NULL DEFAULT 0,
  streak     integer NOT NULL DEFAULT 0,
  breakdown  jsonb,
  PRIMARY KEY (user_id, week_start)
);

CREATE TABLE badges (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind         text NOT NULL,           -- e.g. 'monthly_winner', 'champion'
  period_start date NOT NULL,
  awarded_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, kind, period_start)
);
