-- 001_create_core_tables.sql
-- Creates core tables for Book-Club-SaaS
-- Uses pgcrypto for gen_random_uuid(); fallback instructions included below

-- Enable extension for UUID generation (pgcrypto). If unavailable, install uuid-ossp
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clubs
CREATE TABLE IF NOT EXISTS clubs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  organizer_id uuid,
  invite_code text,
  created_at timestamptz DEFAULT now()
);

-- Members
CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid REFERENCES clubs(id) ON DELETE CASCADE,
  name text,
  email text,
  invite_token text,
  invite_status text DEFAULT 'pending',
  joined_at timestamptz DEFAULT now()
);

-- Book proposals
CREATE TABLE IF NOT EXISTS book_proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid REFERENCES clubs(id) ON DELETE CASCADE,
  title text NOT NULL,
  author text,
  description text,
  proposer_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Votes
CREATE TABLE IF NOT EXISTS votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid REFERENCES book_proposals(id) ON DELETE CASCADE,
  voter_token text,
  choice text CHECK (choice IN ('yes','no','abstain')),
  created_at timestamptz DEFAULT now()
);

-- Meetings
CREATE TABLE IF NOT EXISTS meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid REFERENCES clubs(id) ON DELETE CASCADE,
  title text,
  datetime timestamptz,
  location text,
  created_at timestamptz DEFAULT now()
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid REFERENCES clubs(id) ON DELETE CASCADE,
  author_name text,
  content text,
  created_at timestamptz DEFAULT now()
);

-- Down / cleanup (drop in reverse dependency order)
-- To rollback, run the following statements (careful in production):
-- DROP TABLE IF EXISTS messages;
-- DROP TABLE IF EXISTS meetings;
-- DROP TABLE IF EXISTS votes;
-- DROP TABLE IF EXISTS book_proposals;
-- DROP TABLE IF EXISTS members;
-- DROP TABLE IF EXISTS clubs;

-- Notes:
-- If the server does not support pgcrypto, install the "uuid-ossp" extension and
-- replace `gen_random_uuid()` with `uuid_generate_v4()`.
