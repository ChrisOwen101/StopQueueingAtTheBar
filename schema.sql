-- Run against your Postgres database. Safe to re-run: it only creates what is missing.
CREATE TABLE IF NOT EXISTS signatures (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT        NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  email       TEXT        NOT NULL CHECK (char_length(email) BETWEEN 3 AND 254),
  consent     BOOLEAN     NOT NULL DEFAULT TRUE,
  consent_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One signature per email address, case-insensitive.
CREATE UNIQUE INDEX IF NOT EXISTS signatures_email_unique ON signatures (lower(email));

-- The poll: single file, for or against. One row per vote, and nothing in it identifies anyone
-- (no IP, no email). The voter id is a random UUID the Worker keeps in an HttpOnly cookie, so a
-- browser votes once and is shown the results when it comes back.
CREATE TABLE IF NOT EXISTS poll_votes (
  id          BIGSERIAL   PRIMARY KEY,
  choice      TEXT        NOT NULL CHECK (choice IN ('single', 'cluster')),
  voter       UUID        NOT NULL UNIQUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Votes per network per day, so one connection can't stuff the poll. The key is a hash of the
-- day and the IP address (or IPv6 /64), never the address, and the Worker deletes past days.
CREATE TABLE IF NOT EXISTS poll_limits (
  key    TEXT    PRIMARY KEY,
  day    DATE    NOT NULL,
  votes  INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS poll_limits_day ON poll_limits (day);
