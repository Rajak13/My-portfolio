-- Allow system themes without a creator
-- This enables seeding default themes before any users exist

-- Make created_by nullable for system themes
ALTER TABLE themes ALTER COLUMN created_by DROP NOT NULL;

-- Add a system flag to identify system-created themes
ALTER TABLE themes ADD COLUMN is_system BOOLEAN DEFAULT FALSE;

-- Create index for system themes
CREATE INDEX idx_themes_system ON themes(is_system);