/*
  # Create cards table

  1. New Tables
    - `cards`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `account_id` (uuid, foreign key to accounts)
      - `card_type` (text) - credit, debit
      - `card_name` (text)
      - `card_number_encrypted` (text) - encrypted card number
      - `card_number_last4` (text) - last 4 digits for display
      - `expiry_month` (integer)
      - `expiry_year` (integer)
      - `credit_limit` (decimal, optional for credit cards)
      - `available_credit` (decimal, optional)
      - `is_active` (boolean)
      - `is_primary` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `cards` table
    - Add policies for users to manage their own cards
*/

CREATE TABLE IF NOT EXISTS cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_id uuid NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  card_type text NOT NULL CHECK (card_type IN ('credit', 'debit')),
  card_name text NOT NULL,
  card_number_encrypted text NOT NULL,
  card_number_last4 text NOT NULL,
  expiry_month integer NOT NULL CHECK (expiry_month >= 1 AND expiry_month <= 12),
  expiry_year integer NOT NULL,
  credit_limit decimal(15,2),
  available_credit decimal(15,2),
  is_active boolean DEFAULT true,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own cards"
  ON cards
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own cards"
  ON cards
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own cards"
  ON cards
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE TRIGGER update_cards_updated_at
  BEFORE UPDATE ON cards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_cards_user_id ON cards(user_id);
CREATE INDEX IF NOT EXISTS idx_cards_account_id ON cards(account_id);