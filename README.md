# Monitoring PT Order Kuota

A comprehensive monitoring dashboard application for PT Order Kuota built with Next.js. This application provides real-time monitoring and analytics for transactions, suppliers, products, and QRIS operations with interactive data visualizations.

## 🚀 Features

### Transaction Monitoring

- **Transaction Status Tracking**: Monitor success, failed, pending, and complaint transactions
- **Real-time Charts**: Interactive bar charts, line charts, and donut charts for transaction analytics
- **Transaction Generation**: Generate transaction data for testing and analysis

### QRIS Monitoring

- **QRIS Transaction Analytics**: Monitor QRIS payment transactions with detailed charts
- **QRIS Generation**: Create and manage QRIS codes for payments
- **Transaction Comparison**: Compare QRIS performance across different time periods

### Supplier Management

- **Supplier Listing**: View all suppliers with detailed information
- **Supplier Comparison**: Compare performance metrics between suppliers
- **Supplier Details**: Detailed view of individual supplier performance

### Product Analytics

- **Best-Selling Products**: Track and analyze top-performing products
- **Product Categories**: Monitor product performance by categories
- **Sales Metrics**: Comprehensive sales analytics and reporting

### Data Visualization

- **Interactive Charts**: Built with Recharts for responsive data visualization
- **Dynamic Tables**: Sortable and filterable data tables
- **Real-time Updates**: Live data updates with refresh capabilities
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## 🛠️ Technology Stack

- **Frontend**: Next.js 15.3.4, React 19.0.0
- **Styling**: Tailwind CSS 4.0
- **Charts**: Recharts 3.0.2
- **HTTP Client**: Axios 1.10.0
- **Authentication**: JSON Web Token (jsonwebtoken 9.0.2)
- **Testing**: Jest, React Testing Library
- **Development**: JSON Server for mock API

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/v1/            # API endpoints
│   │   ├── auth/          # Authentication routes
│   │   ├── monitor/       # Monitoring APIs
│   │   ├── transactions/  # Transaction APIs
│   │   ├── suppliers/     # Supplier APIs
│   │   └── products/      # Product APIs
│   ├── monitor-qris/      # QRIS monitoring page
│   ├── monitor-transaction/ # Transaction monitoring page
│   ├── supplier/          # Supplier management pages
│   └── transaction-*/     # Transaction status pages
├── components/            # Reusable UI components
│   ├── charts/           # Chart components (Bar, Line, Donut)
│   ├── Card.js           # Card component
│   ├── DynamicTable.js   # Dynamic table component
│   ├── Sidebar.js        # Navigation sidebar
│   └── Header.js         # Header component
├── services/             # API service layer
│   ├── apiClient.js      # Axios configuration
│   ├── auth.js           # Authentication services
│   ├── monitor.js        # Monitoring services
│   ├── transactions.js   # Transaction services
│   └── suppliers.js      # Supplier services
├── mock/                 # Mock JSON data for development
├── utils/                # Utility functions
└── test/                 # Unit tests
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd monitoring_pt_order_kuota
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Development with Mock Data

The project includes mock JSON data for development. The mock API server can be started using JSON Server:

```bash
npx json-server --watch db.json --port 3001
```

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run Jest tests

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
JWT_SECRET=your-jwt-secret-key
```

### API Endpoints

The application provides comprehensive API endpoints:

- **Authentication**: `/api/v1/auth/login`
- **Transaction Monitoring**: `/api/v1/monitor/transactions`
- **QRIS Monitoring**: `/api/v1/monitor/qris`
- **Supplier Management**: `/api/v1/suppliers`
- **Product Analytics**: `/api/v1/products/best-selling`
- **Transaction Status**: `/api/v1/transactions/{status}`

## 🧪 Testing

Run the test suite:

```bash
npm run test
```

The project includes:

- Unit tests for components
- Integration tests for API routes
- Jest configuration with React Testing Library

## 🚀 Deployment

### Vercel (Recommended)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables
4. Deploy automatically

### Other Platforms

1. Build the application:

```bash
npm run build
```

2. Start the production server:

```bash
npm run start
```

## 📊 Key Features Overview

### Dashboard Pages

- **Transaction Monitoring**: Real-time transaction analytics
- **QRIS Dashboard**: QRIS payment monitoring and generation
- **Supplier Management**: Supplier performance tracking
- **Product Analytics**: Best-selling products and sales metrics

### Authentication

- JWT-based authentication system
- Protected routes and API endpoints
- Session management

### Data Visualization

- Interactive charts using Recharts
- Responsive tables with sorting and filtering
- Real-time data updates
- Export capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary.

## 📞 Support

For support and questions, please contact the development team.

---

**Built with ❤️ using Next.js and React**
