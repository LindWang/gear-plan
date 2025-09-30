-- Migration to add missing description column to gear_items table
-- Run this in your Neon SQL Editor
-- Add the description column to the existing gear_items table
ALTER TABLE gear_items
ADD COLUMN IF NOT EXISTS description TEXT;
-- Verify the change
SELECT column_name,
   data_type,
   is_nullable
FROM information_schema.columns
WHERE table_name = 'gear_items'
ORDER BY ordinal_position;
SELECT 'Description column added successfully to gear_items table!' as status;