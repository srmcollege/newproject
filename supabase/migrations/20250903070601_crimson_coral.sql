/*
  # Create currency rates table

  1. New Tables
    - `currency_rates`
      - `id` (uuid, primary key)
      - `base_currency` (text) - base currency code (INR)
      - `target_currency` (text) - target currency code
      - `exchange_rate` (decimal)
      - `rate_date` (date)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `currency_rates` table
    - Add policy for all authenticated users to read rates
*/

CREATE TABLE IF NOT EXISTS currency_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  base_currency text NOT NULL DEFAULT 'INR',
  target_currency text NOT NULL,
  exchange_rate decimal(15,6) NOT NULL,
  rate_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(base_currency, target_currency, rate_date)
);

ALTER TABLE currency_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All users can read currency rates"
  ON currency_rates
  FOR SELECT
  TO authenticated
  USING (true);

CREATE TRIGGER update_currency_rates_updated_at
  BEFORE UPDATE ON currency_rates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_currency_rates_currencies ON currency_rates(base_currency, target_currency);
CREATE INDEX IF NOT EXISTS idx_currency_rates_date ON currency_rates(rate_date);