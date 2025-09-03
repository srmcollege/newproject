/*
  # Create carbon footprint table

  1. New Tables
    - `carbon_footprint`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `transaction_id` (uuid, foreign key to transactions)
      - `category` (text)
      - `co2_emissions` (decimal) - in kg
      - `calculation_method` (text)
      - `emission_factor` (decimal)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `carbon_footprint` table
    - Add policies for users to read their own carbon data
*/

CREATE TABLE IF NOT EXISTS carbon_footprint (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  transaction_id uuid NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  category text NOT NULL,
  co2_emissions decimal(10,3) NOT NULL,
  calculation_method text DEFAULT 'category_based',
  emission_factor decimal(10,6),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE carbon_footprint ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own carbon footprint"
  ON carbon_footprint
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_carbon_footprint_user_id ON carbon_footprint(user_id);
CREATE INDEX IF NOT EXISTS idx_carbon_footprint_transaction_id ON carbon_footprint(transaction_id);
CREATE INDEX IF NOT EXISTS idx_carbon_footprint_category ON carbon_footprint(category);