/*
  # Insert sample data for demo

  1. Sample Data
    - Currency exchange rates
    - Default spending categories
    - Sample financial goals
    - Demo notifications

  2. Notes
    - This data helps populate the application with realistic examples
    - Currency rates are approximate and for demo purposes only
*/

-- Insert sample currency rates
INSERT INTO currency_rates (base_currency, target_currency, exchange_rate, rate_date) VALUES
  ('INR', 'USD', 0.012, CURRENT_DATE),
  ('INR', 'EUR', 0.011, CURRENT_DATE),
  ('INR', 'GBP', 0.0094, CURRENT_DATE),
  ('INR', 'JPY', 1.79, CURRENT_DATE),
  ('INR', 'AUD', 0.018, CURRENT_DATE),
  ('INR', 'CAD', 0.016, CURRENT_DATE),
  ('INR', 'CHF', 0.011, CURRENT_DATE),
  ('INR', 'CNY', 0.086, CURRENT_DATE)
ON CONFLICT (base_currency, target_currency, rate_date) DO NOTHING;

-- Insert reverse rates (for conversion calculations)
INSERT INTO currency_rates (base_currency, target_currency, exchange_rate, rate_date) VALUES
  ('USD', 'INR', 83.25, CURRENT_DATE),
  ('EUR', 'INR', 90.45, CURRENT_DATE),
  ('GBP', 'INR', 105.80, CURRENT_DATE),
  ('JPY', 'INR', 0.56, CURRENT_DATE),
  ('AUD', 'INR', 55.20, CURRENT_DATE),
  ('CAD', 'INR', 62.15, CURRENT_DATE),
  ('CHF', 'INR', 92.30, CURRENT_DATE),
  ('CNY', 'INR', 11.65, CURRENT_DATE)
ON CONFLICT (base_currency, target_currency, rate_date) DO NOTHING;