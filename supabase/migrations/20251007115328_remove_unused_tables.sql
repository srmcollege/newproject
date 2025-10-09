/*
  # Remove Unused Tables

  1. Tables Being Removed
    - user_profiles (data stored in auth.users metadata)
    - users (using auth.users instead)
    - user_settings (not used in app)
    - user_preferences (not used in app)
    - user_sessions (handled by Supabase Auth)
    - user_activities (not used in app)
    - audit_logs (not used in app)
    - notifications (not used in app)
    - bills (not used in app)
    - budgets (not used in app)
    - cards (not used in app)
    - spending_locks (not used in app)
    - financial_goals (not used in app)
    - family_members (not used in app)
    - carbon_footprint (not used in app)
    - currency_rates (not used in app)
    - account_types (not used in app, accounts have direct type field)
    - ai_chat_history (not used in app)

  2. Tables Being Kept
    - accounts (user accounts)
    - transactions (transaction records)
    - transaction_categories (transaction categories)
    - recent_recipients (newly created)
    - recent_transfers (newly created)
*/

-- Drop unused tables
DROP TABLE IF EXISTS ai_chat_history CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS bills CASCADE;
DROP TABLE IF EXISTS budgets CASCADE;
DROP TABLE IF EXISTS carbon_footprint CASCADE;
DROP TABLE IF EXISTS cards CASCADE;
DROP TABLE IF EXISTS currency_rates CASCADE;
DROP TABLE IF EXISTS family_members CASCADE;
DROP TABLE IF EXISTS financial_goals CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS spending_locks CASCADE;
DROP TABLE IF EXISTS user_activities CASCADE;
DROP TABLE IF EXISTS user_preferences CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS user_settings CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS account_types CASCADE;
