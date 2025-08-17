export interface Transaction {
  id: string;
  userId: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  description: string;
  category: string;
  account: string;
  toAccount?: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  reference?: string;
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: 'checking' | 'savings' | 'investment' | 'credit';
  balance: number;
  currency: string;
}

class TransactionService {
  private getStorageKey(userId: string, type: 'transactions' | 'accounts'): string {
    return `financebank_${type}_${userId}`;
  }

  // Initialize default accounts for new users
  initializeUserAccounts(userId: string): Account[] {
    const defaultAccounts: Account[] = [
      {
        id: `acc_${userId}_checking`,
        userId,
        name: 'Checking Account',
        type: 'checking',
        balance: 1032450.32,
        currency: 'INR'
      },
      {
        id: `acc_${userId}_savings`,
        userId,
        name: 'Savings Account',
        type: 'savings',
        balance: 3752089.45,
        currency: 'INR'
      },
      {
        id: `acc_${userId}_investment`,
        userId,
        name: 'Investment Account',
        type: 'investment',
        balance: 6548745.89,
        currency: 'INR'
      }
    ];

    localStorage.setItem(this.getStorageKey(userId, 'accounts'), JSON.stringify(defaultAccounts));
    return defaultAccounts;
  }

  // Get user accounts
  getUserAccounts(userId: string): Account[] {
    const stored = localStorage.getItem(this.getStorageKey(userId, 'accounts'));
    if (!stored) {
      return this.initializeUserAccounts(userId);
    }
    return JSON.parse(stored);
  }

  // Update account balance
  updateAccountBalance(userId: string, accountId: string, newBalance: number): void {
    const accounts = this.getUserAccounts(userId);
    const accountIndex = accounts.findIndex(acc => acc.id === accountId || acc.name === accountId);
    
    if (accountIndex !== -1) {
      accounts[accountIndex].balance = newBalance;
      localStorage.setItem(this.getStorageKey(userId, 'accounts'), JSON.stringify(accounts));
    }
  }

  // Get user transactions
  getUserTransactions(userId: string): Transaction[] {
    const stored = localStorage.getItem(this.getStorageKey(userId, 'transactions'));
    return stored ? JSON.parse(stored) : [];
  }

  // Add new transaction
  addTransaction(userId: string, transaction: Omit<Transaction, 'id' | 'userId' | 'date' | 'status'>): Transaction {
    const transactions = this.getUserTransactions(userId);
    const newTransaction: Transaction = {
      ...transaction,
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      date: new Date().toISOString().split('T')[0],
      status: 'completed'
    };

    transactions.unshift(newTransaction);
    localStorage.setItem(this.getStorageKey(userId, 'transactions'), JSON.stringify(transactions));

    // Update account balances
    this.processTransactionBalanceUpdate(userId, newTransaction);

    return newTransaction;
  }

  // Process balance updates for transactions
  private processTransactionBalanceUpdate(userId: string, transaction: Transaction): void {
    const accounts = this.getUserAccounts(userId);
    
    if (transaction.type === 'transfer' && transaction.toAccount) {
      // Transfer between accounts
      const fromAccount = accounts.find(acc => acc.name === transaction.account);
      const toAccount = accounts.find(acc => acc.name === transaction.toAccount);
      
      if (fromAccount && toAccount) {
        this.updateAccountBalance(userId, fromAccount.id, fromAccount.balance - Math.abs(transaction.amount));
        this.updateAccountBalance(userId, toAccount.id, toAccount.balance + Math.abs(transaction.amount));
      }
    } else {
      // Regular income/expense
      const account = accounts.find(acc => acc.name === transaction.account);
      if (account) {
        const newBalance = transaction.type === 'income' 
          ? account.balance + Math.abs(transaction.amount)
          : account.balance - Math.abs(transaction.amount);
        
        this.updateAccountBalance(userId, account.id, newBalance);
      }
    }
  }

  // Create expense transaction
  createExpense(userId: string, amount: number, description: string, category: string, account: string): Transaction {
    return this.addTransaction(userId, {
      type: 'expense',
      amount: -Math.abs(amount),
      description,
      category,
      account
    });
  }

  // Create income transaction
  createIncome(userId: string, amount: number, description: string, category: string, account: string): Transaction {
    return this.addTransaction(userId, {
      type: 'income',
      amount: Math.abs(amount),
      description,
      category,
      account
    });
  }

  // Create transfer transaction
  createTransfer(userId: string, amount: number, fromAccount: string, toAccount: string, description?: string): Transaction {
    return this.addTransaction(userId, {
      type: 'transfer',
      amount: -Math.abs(amount),
      description: description || `Transfer to ${toAccount}`,
      category: 'Transfer',
      account: fromAccount,
      toAccount
    });
  }

  // Get account by name
  getAccountByName(userId: string, accountName: string): Account | undefined {
    const accounts = this.getUserAccounts(userId);
    return accounts.find(acc => acc.name === accountName);
  }

  // Get spending by category for current month
  getMonthlySpendingByCategory(userId: string): { [category: string]: number } {
    const transactions = this.getUserTransactions(userId);
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    
    const monthlySpending: { [category: string]: number } = {};
    
    transactions
      .filter(txn => txn.date.startsWith(currentMonth) && txn.type === 'expense')
      .forEach(txn => {
        monthlySpending[txn.category] = (monthlySpending[txn.category] || 0) + Math.abs(txn.amount);
      });
    
    return monthlySpending;
  }
}

export const transactionService = new TransactionService();