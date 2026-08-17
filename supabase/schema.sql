-- SHA CATTERY SUPABASE DATABASE SCHEMA & STORAGE CONFIGURATION
-- Execute this SQL script in your Supabase SQL Editor (https://app.supabase.com)

-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

-- Insert Default Categories if empty
INSERT INTO categories (name) 
VALUES 
  ('Persian Cat'), 
  ('Siamese Cat'), 
  ('Maine Coon'), 
  ('Bengal Cat'), 
  ('British Shorthair'), 
  ('Himalayan Cat')
ON CONFLICT (name) DO NOTHING;

-- 2. Create Cats (Listings) Table
CREATE TABLE IF NOT EXISTS cats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id INT REFERENCES categories(id) ON DELETE SET NULL,
  title VARCHAR(150) NOT NULL,
  age VARCHAR(50) NOT NULL, -- (e.g., "54 days", "2 months", "2 years")
  color VARCHAR(100) NOT NULL, -- (e.g., "Blue", "White Pointed")
  eye_color VARCHAR(100) NOT NULL,
  gender VARCHAR(20) CHECK (gender IN ('Male', 'Female')),
  is_vaccinated BOOLEAN DEFAULT false,
  status VARCHAR(50) CHECK (status IN ('Available', 'Sold Out', 'Reserved')),
  price NUMERIC(10, 2), -- Optional price field
  description TEXT,
  main_image_url TEXT NOT NULL,
  gallery_urls TEXT[], -- Array of additional image URLs
  video_url TEXT, -- URL for the cat's video
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Indexes for fast filtering and searching
CREATE INDEX IF NOT EXISTS idx_cats_status ON cats(status);
CREATE INDEX IF NOT EXISTS idx_cats_category ON cats(category_id);
CREATE INDEX IF NOT EXISTS idx_cats_created ON cats(created_at DESC);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Categories
CREATE POLICY "Public Read Categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Public Insert Categories" ON categories
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Update Categories" ON categories
  FOR UPDATE USING (true);

CREATE POLICY "Public Delete Categories" ON categories
  FOR DELETE USING (true);

-- RLS Policies for Cats
CREATE POLICY "Public Read Cats" ON cats
  FOR SELECT USING (true);

CREATE POLICY "Public Insert Cats" ON cats
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Update Cats" ON cats
  FOR UPDATE USING (true);

CREATE POLICY "Public Delete Cats" ON cats
  FOR DELETE USING (true);

-- 5. Storage Buckets Configuration for Supabase Storage
INSERT INTO storage.buckets (id, name, public) 
VALUES ('cat-media', 'cat-media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to storage bucket
CREATE POLICY "Public Access Cat Media" ON storage.objects
  FOR SELECT USING (bucket_id = 'cat-media');

-- Allow public upload and delete for media files
CREATE POLICY "Public Upload Cat Media" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'cat-media');

CREATE POLICY "Public Delete Cat Media" ON storage.objects
  FOR DELETE USING (bucket_id = 'cat-media');
