-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create projects table
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_index integer,
  title text,
  subtitle text,
  description text,
  bullets text[],
  tech_stack text[],
  github_url text,
  demo_url text,
  video_url text,
  status text DEFAULT 'live',
  created_at timestamp DEFAULT now()
);

-- Create skills table
CREATE TABLE skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text,
  name text,
  created_at timestamp DEFAULT now()
);

-- Create certifications table
CREATE TABLE certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  issuer text,
  name text,
  year text,
  description text,
  verify_url text,
  tags text[],
  created_at timestamp DEFAULT now()
);

-- Create stats table
CREATE TABLE stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  projects_count integer DEFAULT 3,
  dsa_count integer DEFAULT 150,
  certifications_count integer DEFAULT 3
);

-- Setup RLS (Row Level Security) - optional but recommended
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all tables
CREATE POLICY "Public Read Access" ON projects FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON skills FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON certifications FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON stats FOR SELECT USING (true);

-- Provide anon access to update/insert since this is a basic setup
-- In a real production scenario, use authentication to restrict these operations.
CREATE POLICY "Anon Write Access" ON projects FOR ALL USING (true);
CREATE POLICY "Anon Write Access" ON skills FOR ALL USING (true);
CREATE POLICY "Anon Write Access" ON certifications FOR ALL USING (true);
CREATE POLICY "Anon Write Access" ON stats FOR ALL USING (true);

-- Seed Initial Stats
INSERT INTO stats (projects_count, dsa_count, certifications_count) VALUES (3, 150, 3);

-- Schema Updates for Portfolio V2 Features
ALTER TABLE projects ADD COLUMN IF NOT EXISTS milestones jsonb;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS lessons text;
ALTER TABLE certifications ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE certifications ADD COLUMN IF NOT EXISTS credential_id text;
