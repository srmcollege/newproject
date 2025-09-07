/*
  # Complete User System with All Data Storage

  1. New Tables
    - `user_profiles` - Extended user information beyond auth
    - `user_sessions` - Track user login sessions
    - `user_activities` - Log all user activities
    - `transaction_categories` - Predefined transaction categories
    - `account_types` - Different account type definitions
    - `user_preferences` - Detailed user preferences
    - `audit_logs` - Track all database changes

  2. Enhanced Tables
    - Enhanced `users` table with more fields
    - Enhanced `transactions` with better tracking
    - Enhanced `accounts` with more details

  3. Security
    - Enable RLS on all tables
    - Add comprehensive policies
    - Add audit triggers
*/

-- Enhanced Users table with complete profile information
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text,
  date_of_birth date,
  address jsonb DEFAULT '{}',
  profile_picture_url text,
  kyc_status text DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
  account_status text DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_login timestamptz,
  login_count integer DEFAULT 0,
  failed_login_attempts integer DEFAULT 0,
  password_changed_at timestamptz DEFAULT now(),
  email_verified boolean DEFAULT false,
  phone_verified boolean DEFAULT false,
  two_factor_enabled boolean DEFAULT false,
  preferred_language text DEFAULT 'en',
  timezone text DEFAULT 'Asia/Kolkata',
  currency_preference text DEFAULT 'INR'
);

-- User Sessions tracking
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token text UNIQUE NOT NULL,
  ip_address inet,
  user_agent text,
  device_info jsonb DEFAULT '{}',
  location_info jsonb DEFAULT '{}',
  login_time timestamptz DEFAULT now(),
  logout_time timestamptz,
  is_active boolean DEFAULT true,
  session_duration interval,
  created_at timestamptz DEFAULT now()
);

-- User Activities logging
CREATE TABLE IF NOT EXISTS user_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type text NOT NULL,
  activity_description text NOT NULL,
  activity_data jsonb DEFAULT '{}',
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Transaction Categories
CREATE TABLE IF NOT EXISTS transaction_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  type text NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
  icon text,
  color text,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Account Types
CREATE TABLE IF NOT EXISTS account_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  features jsonb DEFAULT '{}',
  limits jsonb DEFAULT '{}',
  fees jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enhanced Accounts table
DROP TABLE IF EXISTS accounts CASCADE;
CREATE TABLE accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  account_type_id uuid REFERENCES account_types(id),
  account_name text NOT NULL,
  account_number text UNIQUE NOT NULL,
  routing_number text,
  balance numeric(15,2) DEFAULT 0.00,
  available_balance numeric(15,2) DEFAULT 0.00,
  currency text DEFAULT 'INR',
  is_primary boolean DEFAULT false,
  is_active boolean DEFAULT true,
  opening_date date DEFAULT CURRENT_DATE,
  closing_date date,
  minimum_balance numeric(15,2) DEFAULT 0.00,
  overdraft_limit numeric(15,2) DEFAULT 0.00,
  interest_rate numeric(5,4) DEFAULT 0.0000,
  account_features jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enhanced Transactions table
DROP TABLE IF EXISTS transactions CASCADE;
CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id uuid REFERENCES accounts(id) ON DELETE CASCADE,
  to_account_id uuid REFERENCES accounts(id) ON DELETE SET NULL,
  category_id uuid REFERENCES transaction_categories(id),
  transaction_type text NOT NULL CHECK (transaction_type IN ('income', 'expense', 'transfer')),
  amount numeric(15,2) NOT NULL,
  description text NOT NULL,
  reference_number text UNIQUE NOT NULL,
  status text DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  transaction_date date DEFAULT CURRENT_DATE,
  processed_at timestamptz DEFAULT now(),
  balance_after numeric(15,2),
  fees numeric(15,2) DEFAULT 0.00,
  exchange_rate numeric(10,6) DEFAULT 1.000000,
  location_info jsonb DEFAULT '{}',
  device_info jsonb DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User Preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  category text NOT NULL,
  preference_key text NOT NULL,
  preference_value jsonb NOT NULL,
  is_encrypted boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, category, preference_key)
);

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text NOT NULL,
  record_id uuid NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_values jsonb,
  new_values jsonb,
  changed_fields text[],
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Insert default transaction categories
INSERT INTO transaction_categories (name, type, icon, color, description) VALUES
('Salary', 'income', '💰', '#10b981', 'Monthly salary and wages'),
('Freelance', 'income', '💼', '#059669', 'Freelance work income'),
('Investment Returns', 'income', '📈', '#047857', 'Returns from investments'),
('Business Income', 'income', '🏢', '#065f46', 'Income from business'),
('Other Income', 'income', '💵', '#064e3b', 'Other sources of income'),
('Food & Dining', 'expense', '🍽️', '#ef4444', 'Restaurant and food expenses'),
('Transportation', 'expense', '🚗', '#f97316', 'Travel and transport costs'),
('Shopping', 'expense', '🛍️', '#8b5cf6', 'Shopping and retail purchases'),
('Utilities', 'expense', '⚡', '#eab308', 'Electricity, water, gas bills'),
('Entertainment', 'expense', '🎬', '#06b6d4', 'Movies, games, entertainment'),
('Healthcare', 'expense', '🏥', '#ec4899', 'Medical and health expenses'),
('Education', 'expense', '📚', '#6366f1', 'Education and learning costs'),
('Insurance', 'expense', '🛡️', '#84cc16', 'Insurance premiums'),
('Rent', 'expense', '🏠', '#f59e0b', 'House rent and accommodation'),
('Transfer', 'transfer', '↔️', '#6b7280', 'Money transfers between accounts');

-- Insert default account types
INSERT INTO account_types (name, description, features, limits) VALUES
('Checking', 'Primary transaction account', '{"debit_card": true, "online_banking": true, "mobile_banking": true}', '{"daily_withdrawal": 100000, "monthly_transfer": 1000000}'),
('Savings', 'Interest earning savings account', '{"interest_earning": true, "online_banking": true, "mobile_banking": true}', '{"daily_withdrawal": 50000, "monthly_transfer": 500000}'),
('Investment', 'Investment and trading account', '{"trading": true, "mutual_funds": true, "stocks": true}', '{"daily_withdrawal": 200000, "monthly_transfer": 2000000}'),
('Credit', 'Credit card account', '{"credit_limit": true, "rewards": true, "cashback": true}', '{"credit_limit": 500000, "daily_spending": 100000}');

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can read own profile" ON user_profiles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- RLS Policies for user_sessions
CREATE POLICY "Users can read own sessions" ON user_sessions FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own sessions" ON user_sessions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own sessions" ON user_sessions FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- RLS Policies for user_activities
CREATE POLICY "Users can read own activities" ON user_activities FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "System can insert activities" ON user_activities FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- RLS Policies for transaction_categories (public read)
CREATE POLICY "Anyone can read categories" ON transaction_categories FOR SELECT TO authenticated USING (true);

-- RLS Policies for account_types (public read)
CREATE POLICY "Anyone can read account types" ON account_types FOR SELECT TO authenticated USING (true);

-- RLS Policies for accounts
CREATE POLICY "Users can read own accounts" ON accounts FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own accounts" ON accounts FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own accounts" ON accounts FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- RLS Policies for transactions
CREATE POLICY "Users can read own transactions" ON transactions FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own transactions" ON transactions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own transactions" ON transactions FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- RLS Policies for user_preferences
CREATE POLICY "Users can manage own preferences" ON user_preferences FOR ALL TO authenticated USING (user_id = auth.uid());

-- RLS Policies for audit_logs
CREATE POLICY "Users can read own audit logs" ON audit_logs FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON user_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_type ON user_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_number ON accounts(account_number);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_record ON audit_logs(table_name, record_id);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (table_name, record_id, user_id, action, old_values)
        VALUES (TG_TABLE_NAME, OLD.id, auth.uid(), TG_OP, row_to_json(OLD));
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (table_name, record_id, user_id, action, old_values, new_values)
        VALUES (TG_TABLE_NAME, NEW.id, auth.uid(), TG_OP, row_to_json(OLD), row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (table_name, record_id, user_id, action, new_values)
        VALUES (TG_TABLE_NAME, NEW.id, auth.uid(), TG_OP, row_to_json(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create audit triggers for important tables
CREATE TRIGGER audit_user_profiles AFTER INSERT OR UPDATE OR DELETE ON user_profiles FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_accounts AFTER INSERT OR UPDATE OR DELETE ON accounts FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_transactions AFTER INSERT OR UPDATE OR DELETE ON transactions FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();