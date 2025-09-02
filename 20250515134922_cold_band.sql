/*
  # Add family relations support

  1. New Tables
    - `relations`
      - `id` (uuid, primary key)
      - `person1_id` (uuid, references persons)
      - `person2_id` (uuid, references persons) 
      - `relation_type` (text)
      - `created_at` (timestamptz)
      - `created_by` (uuid, references auth.users)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create relations table
CREATE TABLE public.relations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  person1_id uuid REFERENCES public.persons(id) ON DELETE CASCADE,
  person2_id uuid REFERENCES public.persons(id) ON DELETE CASCADE,
  relation_type text NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  UNIQUE(person1_id, person2_id)
);

-- Enable RLS
ALTER TABLE public.relations ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Enable all access for authenticated users" ON public.relations
  FOR ALL USING (
    auth.role() = 'authenticated'
  ) WITH CHECK (
    auth.role() = 'authenticated'
  );

-- Create index for better performance
CREATE INDEX idx_relations_persons ON public.relations(person1_id, person2_id);