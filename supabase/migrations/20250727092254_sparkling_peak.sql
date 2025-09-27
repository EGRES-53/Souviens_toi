/*
  # Create stories table

  1. New Tables
    - `stories`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `content` (text, not null)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)
      - `created_by` (uuid, references auth.users)

  2. Security
    - Enable RLS on `stories` table
    - Add policies for authenticated users to manage their own stories
    - Users can only read, create, update, and delete their own stories

  3. Triggers
    - Add trigger to automatically update `updated_at` timestamp
*/

-- Create stories table
CREATE TABLE IF NOT EXISTS public.stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

-- Create policies for stories table
CREATE POLICY "stories_insert_own"
  ON public.stories
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "stories_select_own"
  ON public.stories
  FOR SELECT
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "stories_update_own"
  ON public.stories
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "stories_delete_own"
  ON public.stories
  FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Create trigger for updating timestamps (reuse existing function)
CREATE TRIGGER update_stories_updated_at
  BEFORE UPDATE ON public.stories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stories TO authenticated;