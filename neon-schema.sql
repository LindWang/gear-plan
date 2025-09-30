-- Neon PostgreSQL Schema for Gear Plan Application
-- Run this in your Neon SQL Editor or via connection
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Create custom types
CREATE TYPE gear_category_enum AS ENUM (
   'Clothing & Protection',
   'Hydration & Essentials',
   'Shelter',
   'Sleep System',
   'Pack System'
);
CREATE TYPE trip_type_enum AS ENUM (
   'day_hike',
   'overnight_backpacking',
   'multi_day_backpacking',
   'car_camping',
   'winter_camping'
);
-- Simple users table (no complex auth like Supabase)
CREATE TABLE users (
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   email TEXT UNIQUE NOT NULL,
   full_name TEXT,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Gear Lists table (simplified)
CREATE TABLE gear_lists (
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
   name VARCHAR(255) NOT NULL,
   description TEXT,
   trip_type trip_type_enum DEFAULT 'day_hike',
   target_base_weight INTEGER,
   trip_duration INTEGER,
   season VARCHAR(50),
   location VARCHAR(255),
   is_public BOOLEAN DEFAULT FALSE,
   is_template BOOLEAN DEFAULT FALSE,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Gear Items table
CREATE TABLE gear_items (
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   list_id UUID NOT NULL REFERENCES gear_lists(id) ON DELETE CASCADE,
   name VARCHAR(255) NOT NULL,
   description TEXT,
   category gear_category_enum NOT NULL,
   weight_grams INTEGER NOT NULL CHECK (weight_grams > 0),
   brand VARCHAR(100),
   model VARCHAR(100),
   price_cents INTEGER,
   purchase_url TEXT,
   notes TEXT,
   is_packed BOOLEAN DEFAULT FALSE,
   is_worn BOOLEAN DEFAULT FALSE,
   quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Indexes for performance
CREATE INDEX idx_gear_lists_user_id ON gear_lists(user_id);
CREATE INDEX idx_gear_items_list_id ON gear_items(list_id);
CREATE INDEX idx_gear_items_category ON gear_items(category);
-- Simple view for gear list stats
CREATE VIEW gear_list_stats AS
SELECT gl.id as list_id,
   gl.name as list_name,
   gl.user_id,
   COUNT(gi.id) as total_items,
   COALESCE(SUM(gi.weight_grams * gi.quantity), 0) as total_weight_grams,
   COALESCE(
      SUM(
         CASE
            WHEN gi.is_worn = FALSE THEN gi.weight_grams * gi.quantity
            ELSE 0
         END
      ),
      0
   ) as base_weight_grams,
   COUNT(
      CASE
         WHEN gi.is_packed = TRUE THEN 1
      END
   ) as packed_items,
   gl.created_at,
   gl.updated_at
FROM gear_lists gl
   LEFT JOIN gear_items gi ON gl.id = gi.list_id
GROUP BY gl.id,
   gl.name,
   gl.user_id,
   gl.created_at,
   gl.updated_at;
-- Test data
INSERT INTO users (id, email, full_name)
VALUES (
      'f830cb37-887d-40ab-a822-15a88c7ec92e',
      'zetapow@gmail.com',
      'Test User'
   ) ON CONFLICT (email) DO NOTHING;
SELECT 'Neon schema created successfully!' as status;