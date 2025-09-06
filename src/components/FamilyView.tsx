import React, { useState } from 'react';
import { Users, User, Shield, Eye, EyeOff, Settings, Plus, Crown } from 'lucide-react';

interface FamilyViewProps {
  currentUser?: any;
}

const FamilyView: React.FC<FamilyViewProps> = ({ currentUser }) => {
  const [selectedMember, setSelectedMember] = useState('self');
  const [showBalances, setShowBalances] = useState(true);

  // Get user's name or fallback to default
  const userName = currentUser ? `${currentUser.first_name || currentUser.firstName || 'Rajesh'} ${currentUser.last_name || currentUser.lastName || 'Kumar'}` : 'Rajesh Kumar';
  const userFirstName = currentUser?.first_name || currentUser?.firstName || 'Rajesh';
  const userLastName = currentUser?.last_name || currentUser?.lastName || 'Kumar';
  const userInitials = currentUser ? `${(currentUser.first_name || currentUser.firstName || 'R')[0]}${(currentUser.last_name || currentUser.lastName || 'K')[0]}` : 'RK';

  const familyMembers = [
    {
      id: 'self',
      name: userName,
      role: 'Primary Account Holder',
      avatar: userInitials,
      permissions: ['view_all', 'transfer', 'pay_bills', 'manage_family'],
      accounts: [
        { name: 'Checking Account', balance: 1032450.32, type: 'checking' },
        { name: 'Savings Account', balance: 3752089.45, type: 'savings' },
        { name: 'Investment Account', balance: 6548745.89, type: 'investment' }
      ],
      monthlySpending: 517133,
      lastActive: 'Now'
    },
    {
      id: 'spouse',
      name: `Priya ${userLastName}`,
      role: 'Spouse',
      avatar: `P${userLastName[0]}`,
      permissions: ['view_shared', 'transfer_limited', 'pay_bills'],
      accounts: [
        { name: 'Personal Checking', balance: 245600.75, type: 'checking' },
        { name: 'Joint Savings', balance: 1876044.22, type: 'savings' }
      ],
      monthlySpending: 298450,
      lastActive: '2 hours ago'
    },
    {
      id: 'child1',
      name: `Arjun ${userLastName}`,
      role: 'Child (16 years)',
      avatar: `A${userLastName[0]}`,
      permissions: ['view_own', 'spend_limited'],
      accounts: [
        { name: 'Student Account', balance: 15600.00, type: 'checking' }
      ],
      monthlySpending: 8750,
      lastActive: '1 day ago'
    },
    {
      id: 'parent',
      name: `Ramesh ${userLastName}`,
      role: 'Parent',
      avatar: `R${userLastName[0]}`,
      permissions: ['view_own'],
      accounts: [
        { name: 'Pension Account', balance: 456700.50, type: 'savings' }
      ],
      monthlySpending: 45200,
      lastActive: '3 days ago'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getPermissionLabel = (permission: string) => {
    const labels: { [key: string]: string } = {
      'view_all': 'View All Accounts',
      'view_shared': 'View Shared Accounts',
      'view_own': 'View Own Account Only',
      'transfer': 'Full Transfer Rights',
      'transfer_limited': 'Limited Transfers (₹50,000/day)',
      'spend_limited': 'Limited Spending (₹10,000/month)',
      'pay_bills': 'Pay Bills',
      'manage_family': 'Manage Family Members'
    };
    return labels[permission] || permission;
  };

  const getRoleIcon = (role: string) => {
    if (role.includes('Primary')) return <Crown className="w-4 h-4 text-yellow-600" />;
    if (role.includes('Spouse')) return <Users className="w-4 h-4 text-blue-600" />;
    if (role.includes('Child')) return <User className="w-4 h-4 text-green-600" />;
    return <User className="w-4 h-4 text-gray-600" />;
  };

  const selectedMemberData = familyMembers.find(m => m.id === selectedMember) || familyMembers[0];
  const totalFamilyBalance = familyMembers.reduce((total, member) => 
    total + member.accounts.reduce((sum, account) => sum + account.balance, 0), 0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Family Banking</h1>
          <p className="text-gray-600">Manage your family's financial accounts and permissions</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowBalances(!showBalances)}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {showBalances ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showBalances ? 'Hide' : 'Show'} Balances</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Family Overview */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 mb-2">Total Family Balance</p>
            <p className="text-3xl font-bold">
              {showBalances ? formatCurrency(totalFamilyBalance) : '••••••••'}
            </p>
            <p className="text-blue-100 text-sm mt-1">Across {familyMembers.length} family members</p>
          </div>
          <div className="text-right">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Family Members List */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Family Members</h3>
          
          <div className="space-y-3">
            {familyMembers.map((member) => (
              <button
                key={member.id}
                onClick={() => setSelectedMember(member.id)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedMember === member.id
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                    {member.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900">{member.name}</p>
                      {getRoleIcon(member.role)}
                    </div>
                    <p className="text-sm text-gray-500">{member.role}</p>
                    <p className="text-xs text-gray-400">Last active: {member.lastActive}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Member Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Member Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl">
                  {selectedMemberData.avatar}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedMemberData.name}</h3>
                  <p className="text-gray-600">{selectedMemberData.role}</p>
                  <p className="text-sm text-gray-500">Last active: {selectedMemberData.lastActive}</p>
                </div>
              </div>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>

            {/* Permissions */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Permissions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {selectedMemberData.permissions.map((permission, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-700">{getPermissionLabel(permission)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Spending */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600 mb-1">Monthly Spending</p>
                <p className="text-xl font-bold text-blue-900">
                  {showBalances ? formatCurrency(selectedMemberData.monthlySpending) : '••••••'}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600 mb-1">Total Balance</p>
                <p className="text-xl font-bold text-green-900">
                  {showBalances 
                    ? formatCurrency(selectedMemberData.accounts.reduce((sum, acc) => sum + acc.balance, 0))
                    : '••••••'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Member Accounts */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h4 className="font-medium text-gray-900 mb-4">Accounts</h4>
            
            <div className="space-y-4">
              {selectedMemberData.accounts.map((account, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      account.type === 'checking' ? 'bg-blue-100 text-blue-600' :
                      account.type === 'savings' ? 'bg-green-100 text-green-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{account.name}</p>
                      <p className="text-sm text-gray-500 capitalize">{account.type} Account</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {showBalances ? formatCurrency(account.balance) : '••••••••'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h4 className="font-medium text-gray-900 mb-4">Quick Actions</h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button className="p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                Send Money
              </button>
              <button className="p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium">
                Request Money
              </button>
              <button className="p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium">
                Set Limits
              </button>
              <button className="p-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors text-sm font-medium">
                View Reports
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Family Activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Family Activity</h3>
        
        <div className="space-y-4">
          {[
            { member: `Priya ${userLastName}`, action: 'Transferred ₹25,000 to Joint Savings', time: '2 hours ago', avatar: `P${userLastName[0]}` },
            { member: `Arjun ${userLastName}`, action: 'Spent ₹1,250 at McDonald\'s', time: '1 day ago', avatar: `A${userLastName[0]}` },
            { member: userName, action: 'Paid electricity bill ₹9,960', time: '2 days ago', avatar: userInitials },
            { member: `Ramesh ${userLastName}`, action: 'Received pension deposit ₹45,000', time: '3 days ago', avatar: `R${userLastName[0]}` }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center font-semibold text-sm">
                {activity.avatar}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{activity.member}</p>
                <p className="text-sm text-gray-600">{activity.action}</p>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FamilyView;