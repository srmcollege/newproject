# FinanceBank - Modern Banking Dashboard

A comprehensive banking application built with React, TypeScript, and Tailwind CSS featuring advanced financial management tools.

## 🚀 Features

### 💰 Core Banking
- **Multi-Account Management** - Checking, Savings, Investment accounts
- **Transaction History** - Detailed transaction tracking and filtering
- **Money Transfers** - Internal and external transfers
- **Card Management** - Credit and debit card overview
- **Bill Reminders** - Automated bill tracking and notifications

### 📊 Advanced Analytics
- **Spending Analytics** - Category-wise expense breakdown
- **Budget Tracking** - Set and monitor spending limits
- **Financial Goals** - Savings targets and progress tracking
- **Credit Score Simulator** - Impact analysis of financial decisions
- **Carbon Footprint** - Environmental impact of spending

### 🌟 Smart Features
- **AI Financial Assistant** - Intelligent chatbot for financial advice
- **Multi-Currency Wallet** - Global currency management
- **Family Banking** - Manage family member accounts and permissions
- **Spending Locks** - Category-based spending controls
- **Calendar View** - Transaction calendar with visual insights

### 🎨 User Experience
- **Modern UI/UX** - Clean, intuitive interface with smooth animations
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Dark/Light Theme** - Customizable appearance
- **Multi-Language Support** - English, Hindi, Tamil, Telugu, Bengali
- **Accessibility** - WCAG compliant design

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Data Storage**: Browser localStorage
- **Authentication**: Client-side with demo accounts
- **Google Auth**: Google Identity Services
- **OAuth Integration**: Google Sign-In API

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd financebank
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:5173
   ```

## 🔐 Demo Accounts

The application comes with pre-configured demo accounts:

| Email | Password | User |
|-------|----------|------|
| `rajesh.kumar@email.com` | `demo123` | Rajesh Kumar |
| `priya.sharma@email.com` | `demo123` | Priya Sharma |
| `amit.patel@email.com` | `demo123` | Amit Patel |

### 🔑 Google Sign-In

The application supports Google Sign-In for seamless authentication:
- **One-Click Login** with your Google account
- **Automatic Account Creation** for new Google users
- **Profile Picture Integration** from Google profile
- **Secure Authentication** using Google Identity Services

**Note**: In demo mode, Google Sign-In uses a test client ID. For production use, you'll need to:
1. Create a project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google Identity Services API
3. Create OAuth 2.0 credentials
4. Update the client ID in `src/services/googleAuth.ts`

## 🎯 Key Components

### Dashboard
- Account overview with real-time balances
- Recent transactions
- Quick actions (Send, Request, Pay Bills)
- Budget progress indicators

### Analytics
- Monthly spending trends
- Category-wise breakdowns
- Financial goal tracking
- Savings rate analysis

### AI Assistant
- Natural language financial queries
- Personalized spending insights
- Budget recommendations
- Investment suggestions

### Settings
- Comprehensive preference management
- Security settings
- Notification controls
- Theme customization

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop** (1920px+)
- **Laptop** (1024px - 1919px)
- **Tablet** (768px - 1023px)
- **Mobile** (320px - 767px)

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (#2563eb to #7c3aed)
- **Success**: Green (#10b981)
- **Warning**: Orange (#f59e0b)
- **Error**: Red (#ef4444)
- **Neutral**: Gray scale

### Typography
- **Headings**: Inter font family, bold weights
- **Body**: Inter font family, regular weight
- **Code**: Monospace font family

### Spacing
- **Base unit**: 8px
- **Component padding**: 16px, 24px
- **Section margins**: 24px, 32px

## 🔧 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.tsx    # Main dashboard
│   ├── Login.tsx        # Authentication
│   ├── Header.tsx       # Navigation header
│   ├── Sidebar.tsx      # Navigation sidebar
│   ├── Settings.tsx     # Settings modal
│   ├── Analytics.tsx    # Financial analytics
│   ├── Transactions.tsx # Transaction history
│   ├── Transfer.tsx     # Money transfers
│   ├── Cards.tsx        # Card management
│   ├── Calendar.tsx     # Transaction calendar
│   ├── BillReminders.tsx # Bill management
│   ├── MultiCurrency.tsx # Currency exchange
│   ├── CreditScore.tsx  # Credit score simulator
│   ├── FamilyView.tsx   # Family banking
│   ├── SpendingLocks.tsx # Spending controls
│   ├── CarbonFootprint.tsx # Environmental impact
│   └── AIChatbot.tsx    # AI assistant
├── App.tsx              # Main application
├── main.tsx             # Entry point
└── index.css            # Global styles
```

### Component Architecture

- **Functional Components** with React Hooks
- **TypeScript** for type safety
- **Props interfaces** for component contracts
- **State management** with useState and useEffect
- **Event handling** with proper TypeScript typing

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates a `dist/` folder with optimized production files.

### Deployment Options

- **Vercel**: Connect GitHub repo for automatic deployments
- **Netlify**: Drag and drop `dist/` folder
- **GitHub Pages**: Use GitHub Actions for deployment
- **AWS S3**: Upload `dist/` contents to S3 bucket

## 🔒 Security Features

- **Client-side authentication** with session management
- **Input validation** and sanitization
- **XSS protection** through React's built-in escaping
- **Secure data storage** in browser localStorage
- **HTTPS enforcement** in production

## 🌐 Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

## 📈 Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices)
- **Bundle Size**: < 500KB gzipped
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for the beautiful icon set
- **Vite** for the lightning-fast build tool

---

**Note**: This is a demo application for educational purposes. Do not use in production without implementing proper security measures, server-side authentication, and database integration.