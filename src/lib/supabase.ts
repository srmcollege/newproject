import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables - using demo mode');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Auth helper functions
export const authHelpers = {
  async signUp(email: string, password: string, userData: { 
    firstName: string; 
    lastName: string; 
    phone?: string;
  }) {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        await this.createDefaultAccounts(authData.user.id);
      }

      return authData;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  async signIn(email: string, password: string) {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  async signOut() {
    if (!supabase) return;
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  async getCurrentUser() {
    if (!supabase) return null;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      return {
        id: user.id,
        email: user.email,
        first_name: user.user_metadata?.first_name || 'User',
        last_name: user.user_metadata?.last_name || '',
        phone: user.user_metadata?.phone || null
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  async createDefaultAccounts(userId: string) {
    if (!supabase) return;

    try {
      const defaultAccounts = [
        {
          user_id: userId,
          account_name: 'Primary Checking',
          account_type: 'checking',
          account_number: `CHK${Date.now()}${Math.random().toString().slice(2, 6)}`,
          balance: 1032450.32,
          currency: 'INR',
          is_primary: true,
          is_active: true
        },
        {
          user_id: userId,
          account_name: 'Savings Account',
          account_type: 'savings',
          account_number: `SAV${Date.now()}${Math.random().toString().slice(2, 6)}`,
          balance: 3752089.45,
          currency: 'INR',
          is_primary: false,
          is_active: true
        },
        {
          user_id: userId,
          account_name: 'Investment Account',
          account_type: 'investment',
          account_number: `INV${Date.now()}${Math.random().toString().slice(2, 6)}`,
          balance: 6548745.89,
          currency: 'INR',
          is_primary: false,
          is_active: true
        }
      ];

      const { error } = await supabase
        .from('accounts')
        .insert(defaultAccounts);

      if (error) throw error;

      await this.createSampleTransactions(userId);
    } catch (error) {
      console.error('Create default accounts error:', error);
      throw error;
    }
  },

  async createSampleTransactions(userId: string) {
    if (!supabase) return;

    try {
      const { data: accounts } = await supabase
        .from('accounts')
        .select('id, account_name')
        .eq('user_id', userId);

      if (!accounts || accounts.length === 0) return;

      const checkingAccount = accounts.find(acc => acc.account_name.includes('Checking'));
      if (!checkingAccount) return;

      const sampleTransactions = [
        {
          user_id: userId,
          account_id: checkingAccount.id,
          transaction_type: 'income',
          amount: 207500,
          description: 'Monthly Salary Deposit',
          category: 'Salary',
          reference_number: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          transaction_date: new Date().toISOString().split('T')[0],
          status: 'completed'
        },
        {
          user_id: userId,
          account_id: checkingAccount.id,
          transaction_type: 'expense',
          amount: -3765,
          description: 'Swiggy Food Order',
          category: 'Food & Dining',
          reference_number: `TXN_${Date.now() + 1}_${Math.random().toString(36).substr(2, 9)}`,
          transaction_date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
          status: 'completed'
        },
        {
          user_id: userId,
          account_id: checkingAccount.id,
          transaction_type: 'expense',
          amount: -9960,
          description: 'BSES Electricity Bill',
          category: 'Utilities',
          reference_number: `TXN_${Date.now() + 2}_${Math.random().toString(36).substr(2, 9)}`,
          transaction_date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
          status: 'completed'
        }
      ];

      const { error } = await supabase
        .from('transactions')
        .insert(sampleTransactions);

      if (error) throw error;
    } catch (error) {
      console.error('Create sample transactions error:', error);
    }
  }
};

// Database helper functions
export const dbHelpers = {
  async getUserAccounts(userId: string) {
    if (!supabase) return [];
    
    try {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('is_primary', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get user accounts error:', error);
      return [];
    }
  },

  async getUserTransactions(userId: string, limit = 50) {
    if (!supabase) return [];
    
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          accounts!transactions_account_id_fkey(account_name)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get user transactions error:', error);
      return [];
    }
  },

  async createTransaction(transaction: any) {
    if (!supabase) throw new Error('Supabase not configured');
    
    try {
      const referenceNumber = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          ...transaction,
          reference_number: referenceNumber
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Create transaction error:', error);
      throw error;
    }
  },

  async updateAccountBalance(accountId: string, newBalance: number) {
    if (!supabase) throw new Error('Supabase not configured');
    
    try {
      const { error } = await supabase
        .from('accounts')
        .update({ 
          balance: newBalance
        })
        .eq('id', accountId);

      if (error) throw error;
    } catch (error) {
      console.error('Update account balance error:', error);
      throw error;
    }
  },

  getTransactionCategories() {
    return [
      { id: '1', name: 'Salary', type: 'income', icon: '💰' },
      { id: '2', name: 'Food & Dining', type: 'expense', icon: '🍽️' },
      { id: '3', name: 'Utilities', type: 'expense', icon: '⚡' },
      { id: '4', name: 'Shopping', type: 'expense', icon: '🛍️' },
      { id: '5', name: 'Transportation', type: 'expense', icon: '🚗' },
      { id: '6', name: 'Investment', type: 'income', icon: '📈' }
    ];
  }
};