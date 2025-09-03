/*
  # Create spending locks table

  1. New Tables
    - `spending_locks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `category` (text)
      - `spending_limit` (decimal)
      - `spent_amount` (decimal)
      - `period_type` (text) - weekly, monthly, quarterly
      - `period_start` (date)
      - `period_end` (date)
      - `is_active` (boolean)
      - `alert_threshold` (decimal) - percentage to trigger alerts
      - `auto_lock` (boolean) - automatically block when limit reached
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `spending_locks` table
    - Add policies for users to manage their own spending locks
*/

CREATE TABLE IF NOT EXISTS spending_locks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category text NOT NULL,
  spending_limit decimal(15,2) NOT NULL,
  spent_amount decimal(15,2) DEFAULT 0.00,
  period_type text NOT NULL CHECK (period_type IN ('weekly', 'monthly', 'quarterly')),
  period_start date NOT NULL,
  period_end date NOT NULL,
  is_active boolean DEFAULT true,
  alert_threshold decimal(5,2) DEFAULT 80.00,
  auto_lock boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE spending_locks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own spending locks"
  ON spending_locks
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own spending locks"
  ON spending_locks
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own spending locks"
  ON spending_locks
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own spending locks"
  ON spending_locks
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE TRIGGER update_spending_locks_updated_at
  BEFORE UPDATE ON spending_locks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_spending_locks_user_id ON spending_locks(user_id);
CREATE INDEX IF NOT EXISTS idx_spending_locks_category ON spending_locks(category);
CREATE INDEX IF NOT EXISTS idx_spending_locks_period ON spending_locks(period_start, period_end);