/*
  # Add precise_date column to events table

  1. Changes
    - Add `precise_date` column to `events` table
      - Type: boolean
      - Default: true
      - Not null constraint
*/

ALTER TABLE public.events
ADD COLUMN precise_date boolean NOT NULL DEFAULT true;