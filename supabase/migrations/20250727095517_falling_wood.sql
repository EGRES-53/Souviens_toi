/*
  # Add missing RLS policy for profile insertion

  1. Security Changes
    - Add policy for authenticated users to insert their own profile data
    - This allows new users to create their profile after registration

  2. Problem Solved
    - Fixes the issue where new users cannot create their profiles
    - Enables proper user onboarding flow
*/

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);