-- Run once against your Postgres database.
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
