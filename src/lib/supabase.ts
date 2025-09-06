import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables - using demo mode');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          password_hash: string | null;
          first_name: string;
          last_name: string;
          phone: string | null;
          created_at: string;
          updated_at: string;
          is_active: boolean;
          auth_method: string;
          profile_picture_url: string | null;
          last_login: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          password_hash?: string | null;
          first_name: string;
          last_name: string;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
          is_active?: boolean;
          auth_method?: string;
          profile_picture_url?: string | null;
          last_login?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          password_hash?: string | null;
          first_name?: string;
          last_name?: string;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
          is_active?: boolean;
          auth_method?: string;
          profile_picture_url?: string | null;
          last_login?: string | null;
        };
      };
      accounts: {
        Row: {
          id: string;
          user_id: string;
          account_name: string;
          account_type: 'checking' | 'savings' | 'investment' | 'credit';
          balance: number;
          currency: string;
          account_number: string;
          routing_number: string | null;
          is_primary: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          account_name: string;
          account_type: 'checking' | 'savings' | 'investment' | 'credit';
          balance?: number;
          currency?: string;
          account_number: string;
          routing_number?: string | null;
          is_primary?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          account_name?: string;
          account_type?: 'checking' | 'savings' | 'investment' | 'credit';
          balance?: number;
          currency?: string;
          account_number?: string;
          routing_number?: string | null;
          is_primary?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          account_id: string;
          to_account_id: string | null;
          transaction_type: 'income' | 'expense' | 'transfer';
          amount: number;
          description: string;
          category: string;
          reference_number: string;
          status: 'completed' | 'pending' | 'failed';
          transaction_date: string;
          created_at: string;
          updated_at: string;
          metadata: any;
        };
        Insert: {
          id?: string;
          user_id: string;
          account_id: string;
          to_account_id?: string | null;
          transaction_type: 'income' | 'expense' | 'transfer';
          amount: number;
          description: string;
          category: string;
          reference_number: string;
          status?: 'completed' | 'pending' | 'failed';
          transaction_date?: string;
          created_at?: string;
          updated_at?: string;
          metadata?: any;
        };
        Update: {
          id?: string;
          user_id?: string;
          account_id?: string;
          to_account_id?: string | null;
          transaction_type?: 'income' | 'expense' | 'transfer';
          amount?: number;
          description?: string;
          category?: string;
          reference_number?: string;
          status?: 'completed' | 'pending' | 'failed';
          transaction_date?: string;
          created_at?: string;
          updated_at?: string;
          metadata?: any;
        };
      };
    };
  };
}

// Auth helper functions
export const authHelpers = {
  async signUp(email: string, password: string, userData: { firstName: string; lastName: string; phone?: string }) {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    // First create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    if (authData.user) {
      // Create user profile in our users table
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email,
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone,
          auth_method: 'email'
        });

      if (profileError) throw profileError;

      // Create default accounts for the user
      await this.createDefaultAccounts(authData.user.id);
    }

    return authData;
  },

  async signIn(email: string, password: string) {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Update last login
    if (data.user) {
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', data.user.id);
    }

    return data;
  },

  async signOut() {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    if (!supabase) return null;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Get user profile data
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    return profile;
  },

  async createDefaultAccounts(userId: string) {
    if (!supabase) return;

    const defaultAccounts = [
      {
        user_id: userId,
        account_name: 'Checking Account',
        account_type: 'checking' as const,
        balance: 1032450.32,
        currency: 'INR',
        account_number: `CHK${Math.random().toString().slice(2, 12)}`,
        is_primary: true
      },
      {
        user_id: userId,
        account_name: 'Savings Account',
        account_type: 'savings' as const,
        balance: 3752089.45,
        currency: 'INR',
        account_number: `SAV${Math.random().toString().slice(2, 12)}`
      },
      {
        user_id: userId,
        account_name: 'Investment Account',
        account_type: 'investment' as const,
        balance: 6548745.89,
        currency: 'INR',
        account_number: `INV${Math.random().toString().slice(2, 12)}`
      }
    ];

    const { error } = await supabase
      .from('accounts')
      .insert(defaultAccounts);

    if (error) throw error;
  }
};

// Database helper functions
export const dbHelpers = {
  async getUserAccounts(userId: string) {
    if (!supabase) return [];
    
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getUserTransactions(userId: string, limit = 50) {
    if (!supabase) return [];
    
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
  },

  async createTransaction(transaction: Database['public']['Tables']['transactions']['Insert']) {
    if (!supabase) throw new Error('Supabase not configured');
    
    // Generate unique reference number
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
  },

  async updateAccountBalance(accountId: string, newBalance: number) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { error } = await supabase
      .from('accounts')
      .update({ balance: newBalance })
      .eq('id', accountId);

    if (error) throw error;
  },

  async getAccountById(accountId: string) {
    if (!supabase) return null;
    
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', accountId)
      .single();

    if (error) throw error;
    return data;
  }
};