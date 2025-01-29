/*
  # Create Clients Table

  1. New Tables
    - `clients`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `company` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on clients table
    - Add policies for CRUD operations
*/

CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  company text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own clients"
  ON clients
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own clients"
  ON clients
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clients"
  ON clients
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clients"
  ON clients
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);