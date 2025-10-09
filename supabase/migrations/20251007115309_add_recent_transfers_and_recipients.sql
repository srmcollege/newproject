/*
  # Add Recent Transfers and Recipients Tables

  1. New Tables
    - `recent_recipients`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `recipient_name` (text)
      - `recipient_identifier` (text) - email or phone
      - `last_transfer_date` (timestamptz)
      - `total_amount_sent` (numeric)
      - `transfer_count` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `recent_transfers`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `transaction_id` (uuid, foreign key to transactions)
      - `transfer_type` (text) - 'internal' or 'external'
      - `from_account_name` (text)
      - `to_account_name` (text) - for internal
      - `recipient_name` (text) - for external
      - `amount` (numeric)
      - `transfer_date` (date)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to access their own data
*/

-- Create recent_recipients table
CREATE TABLE IF NOT EXISTS recent_recipients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_name text NOT NULL,
  recipient_identifier text NOT NULL,
  last_transfer_date timestamptz DEFAULT now(),
  total_amount_sent numeric(15,2) DEFAULT 0,
  transfer_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, recipient_identifier)
);

ALTER TABLE recent_recipients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own recipients"
  ON recent_recipients FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recipients"
  ON recent_recipients FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recipients"
  ON recent_recipients FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own recipients"
  ON recent_recipients FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create recent_transfers table
CREATE TABLE IF NOT EXISTS recent_transfers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_id uuid REFERENCES transactions(id) ON DELETE SET NULL,
  transfer_type text NOT NULL CHECK (transfer_type IN ('internal', 'external')),
  from_account_name text NOT NULL,
  to_account_name text,
  recipient_name text,
  amount numeric(15,2) NOT NULL,
  transfer_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE recent_transfers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transfers"
  ON recent_transfers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transfers"
  ON recent_transfers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transfers"
  ON recent_transfers FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own transfers"
  ON recent_transfers FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_recent_recipients_user_id ON recent_recipients(user_id);
CREATE INDEX IF NOT EXISTS idx_recent_recipients_last_transfer ON recent_recipients(user_id, last_transfer_date DESC);
CREATE INDEX IF NOT EXISTS idx_recent_transfers_user_id ON recent_transfers(user_id);
CREATE INDEX IF NOT EXISTS idx_recent_transfers_date ON recent_transfers(user_id, transfer_date DESC);
