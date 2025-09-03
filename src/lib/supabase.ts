import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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