/*
  # Initial Database Setup

  1. Authentication Setup
    - Relies on Supabase's built-in auth system
    - No additional auth tables needed

  2. New Tables
    - `print_jobs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `file_url` (text)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  3. Security
    - Enable RLS on print_jobs table
    - Add policies for user access control
*/

-- Create print_jobs table
CREATE TABLE IF NOT EXISTS print_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  file_url text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE print_jobs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own print jobs"
  ON print_jobs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own print jobs"
  ON print_jobs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own print jobs"
  ON print_jobs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own print jobs"
  ON print_jobs
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);