/*
  # Create Sample Transactions

  1. Sample Data
    - Creates sample transactions for demo users
    - Includes various transaction types (income, expense, transfer)
    - Covers different categories and time periods
    - Provides realistic transaction amounts and descriptions

  2. Transaction Types
    - Income: Salary, freelance, investments
    - Expenses: Food, utilities, shopping, transportation
    - Transfers: Between accounts

  3. Time Range
    - Past 6 months of transaction history
    - Recent transactions for current month
    - Future scheduled transactions
*/

-- Insert sample transactions for demo purposes
-- Note: This will only work if users and accounts exist

DO $$
DECLARE
    demo_user_id uuid;
    checking_account_id uuid;
    savings_account_id uuid;
    investment_account_id uuid;
BEGIN
    -- Get demo user (first user in the system)
    SELECT id INTO demo_user_id FROM users LIMIT 1;
    
    IF demo_user_id IS NOT NULL THEN
        -- Get account IDs for the demo user
        SELECT id INTO checking_account_id FROM accounts WHERE user_id = demo_user_id AND account_type = 'checking' LIMIT 1;
        SELECT id INTO savings_account_id FROM accounts WHERE user_id = demo_user_id AND account_type = 'savings' LIMIT 1;
        SELECT id INTO investment_account_id FROM accounts WHERE user_id = demo_user_id AND account_type = 'investment' LIMIT 1;
        
        -- Insert sample transactions
        INSERT INTO transactions (user_id, account_id, transaction_type, amount, description, category, reference_number, status, transaction_date) VALUES
        -- Recent Income Transactions
        (demo_user_id, checking_account_id, 'income', 207500.00, 'Monthly Salary', 'Salary', 'TXN_SAL_001', 'completed', '2024-01-15'),
        (demo_user_id, savings_account_id, 'income', 99600.00, 'Freelance Project Payment', 'Freelance', 'TXN_FRL_001', 'completed', '2024-01-12'),
        (demo_user_id, investment_account_id, 'income', 41500.00, 'Dividend Payment', 'Investment', 'TXN_DIV_001', 'completed', '2024-01-09'),
        
        -- Recent Expense Transactions
        (demo_user_id, checking_account_id, 'expense', -9960.00, 'BSES Electricity Bill', 'Utilities', 'TXN_UTL_001', 'completed', '2024-01-13'),
        (demo_user_id, checking_account_id, 'expense', -3765.00, 'Swiggy Food Order', 'Food', 'TXN_FOD_001', 'completed', '2024-01-14'),
        (demo_user_id, checking_account_id, 'expense', -7465.00, 'Amazon Shopping', 'Shopping', 'TXN_SHP_001', 'completed', '2024-01-11'),
        (demo_user_id, checking_account_id, 'expense', -2946.00, 'Petrol - Indian Oil', 'Transportation', 'TXN_TRP_001', 'completed', '2024-01-10'),
        (demo_user_id, checking_account_id, 'expense', -1299.00, 'Airtel Mobile Bill', 'Utilities', 'TXN_UTL_002', 'completed', '2024-01-08'),
        (demo_user_id, checking_account_id, 'expense', -8320.00, 'Movie Tickets - PVR', 'Entertainment', 'TXN_ENT_001', 'completed', '2024-01-05'),
        (demo_user_id, checking_account_id, 'expense', -15600.00, 'Grocery Shopping - Big Bazaar', 'Food', 'TXN_FOD_002', 'completed', '2024-01-03'),
        
        -- Transfer Transactions
        (demo_user_id, checking_account_id, 'transfer', -83000.00, 'Transfer to Savings Account', 'Transfer', 'TXN_TRF_001', 'completed', '2024-01-02'),
        (demo_user_id, investment_account_id, 'transfer', -41500.00, 'Transfer to Checking Account', 'Transfer', 'TXN_TRF_002', 'completed', '2024-01-01'),
        
        -- Previous Month Transactions
        (demo_user_id, checking_account_id, 'income', 207500.00, 'Monthly Salary', 'Salary', 'TXN_SAL_002', 'completed', '2023-12-15'),
        (demo_user_id, checking_account_id, 'expense', -12450.00, 'Credit Card Payment', 'Credit Card', 'TXN_CC_001', 'completed', '2023-12-20'),
        (demo_user_id, checking_account_id, 'expense', -28500.00, 'Car Insurance Premium', 'Insurance', 'TXN_INS_001', 'completed', '2023-12-25'),
        (demo_user_id, savings_account_id, 'income', 75000.00, 'Fixed Deposit Maturity', 'Investment', 'TXN_FD_001', 'completed', '2023-12-30'),
        
        -- Older Transactions for History
        (demo_user_id, checking_account_id, 'income', 207500.00, 'Monthly Salary', 'Salary', 'TXN_SAL_003', 'completed', '2023-11-15'),
        (demo_user_id, checking_account_id, 'expense', -45670.00, 'HDFC Credit Card Bill', 'Credit Card', 'TXN_CC_002', 'completed', '2023-11-22'),
        (demo_user_id, investment_account_id, 'income', 125000.00, 'Mutual Fund Redemption', 'Investment', 'TXN_MF_001', 'completed', '2023-11-28'),
        
        -- Pending/Future Transactions
        (demo_user_id, checking_account_id, 'expense', -1299.00, 'Airtel Mobile Bill', 'Utilities', 'TXN_UTL_003', 'pending', '2024-01-20'),
        (demo_user_id, checking_account_id, 'expense', -9960.00, 'BSES Electricity Bill', 'Utilities', 'TXN_UTL_004', 'pending', '2024-01-25');
        
        RAISE NOTICE 'Sample transactions created successfully for user: %', demo_user_id;
    ELSE
        RAISE NOTICE 'No users found. Please create a user first.';
    END IF;
END $$;