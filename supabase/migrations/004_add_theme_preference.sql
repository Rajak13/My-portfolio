-- Add theme preference column to profiles table
ALTER TABLE profiles 
ADD COLUMN theme_preference TEXT DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN profiles.theme_preference IS 'User preferred theme ID';