# Voyager Website Projects

A collection of Next.js projects for the Voyager platform including manager portal, cart frontend, and main website.

## Projects

### 🎯 Manager Portal (`/manager-portal`)
A Next.js-based manager portal for customer segmentation and campaign scheduling.

**Features:**
- **Customer Segments**: Interactive view of 5 customer segments with detailed profiles
- **Interactive Charts**: Hourly demand chart for optimal campaign scheduling
- **Campaign Management**: Schedule campaigns based on user activity patterns
- **Real-time Data**: Live user activity data from 9 AM to 1 AM

**Customer Segments:**
1. **At-Risk Customers** (26.4%) - Low value, high churn risk
2. **High-Value Customers** (23.0%) - High value, low churn risk  
3. **Standard Customers** (20.6%) - Medium value, stable
4. **Price-Sensitive Customers** (18.3%) - Price-focused, active
5. **Premium Customers** (11.7%) - High value, infrequent bookings

**Peak Hours:**
- **14:00** - Peak hour with 38,040 users
- **21:00** - Evening peak with 34,240 users
- **22:00** - Night activity with 34,150 users

### 🛒 Cart Frontend (`/cart-frontend`)
Next.js application for shopping cart functionality.

### 🌐 Enuygun Website (`/enuygun-website`)
Main website project with API integrations and TypeScript support.

## Getting Started

Each project can be run independently:

```bash
# Manager Portal
cd manager-portal
npm run dev

# Cart Frontend
cd cart-frontend
npm run dev

# Enuygun Website
cd enuygun-website
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
voyager-website/
├── manager-portal/     # Manager Portal
│   ├── src/app/        # Next.js app router pages
│   ├── src/components/ # Reusable React components
│   ├── src/lib/        # Utilities, types, and mock data
│   └── public/         # Static assets including Enuygun branding
├── cart-frontend/      # Cart Frontend
└── enuygun-website/    # Main Website
```

## Deploy on Vercel

The easiest way to deploy your Next.js apps is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.