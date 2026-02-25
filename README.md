# FlyToSky - Online Travel Agency

A production-ready, scalable Online Travel Agency (OTA) web application built with modern technologies.

## Features

- **Public Website**: Hero section, featured packages, company information
- **Dynamic Packages**: CRUD management of travel packages
- **Search Functionality**: Flight and hotel search with placeholder APIs
- **Admin Dashboard**: Package management, booking oversight, markup control
- **Affiliate System**: Referral links, commission tracking
- **Role-based Authentication**: Admin, Affiliate, and User roles
- **Pricing Engine**: Dynamic pricing with markup and commission calculations
- **Provider Integration**: Modular architecture ready for external APIs

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt password hashing
- **Validation**: Zod schemas
- **Architecture**: Clean Architecture with modular API structure

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/modules/        # Modular API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── packages/      # Package management
│   │   ├── booking/       # Booking system
│   │   ├── flights/       # Flight search
│   │   ├── hotels/        # Hotel search
│   │   ├── users/         # User management
│   │   └── affiliates/    # Affiliate system
│   ├── admin/             # Admin dashboard
│   ├── affiliate/         # Affiliate dashboard
│   ├── packages/          # Public package pages
│   └── search/            # Search interface
├── lib/                   # Business logic and utilities
│   ├── auth/             # JWT and bcrypt utilities
│   ├── config/           # Environment configuration
│   ├── database/         # Prisma client
│   ├── pricing/          # Pricing engine
│   └── providers/        # External API providers
└── components/           # Reusable UI components
```

## Database Schema

- **User**: Authentication and role management
- **Package**: Travel packages with pricing
- **Booking**: Customer bookings
- **AffiliateTracking**: Commission tracking

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd flytosky
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your database URL and JWT secret
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## API Structure

The application follows Clean Architecture with each module containing:

- **Controller** (`route.ts`): HTTP request handling
- **Service**: Business logic
- **Repository**: Data access layer
- **Types**: TypeScript interfaces and schemas

## Provider Integration

The system is designed for easy integration with external APIs:

- **FlightsProvider**: Abstract interface for flight search
- **HotelsProvider**: Abstract interface for hotel search
- **Mock implementations**: Ready for development and testing

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation with Zod
- Middleware protection for admin/affiliate routes

## Deployment

The application is production-ready and can be deployed to:

- Vercel
- Netlify
- AWS
- DigitalOcean
- Any Node.js hosting platform

## Environment Variables

```env
DATABASE_URL=postgresql://username:password@localhost:5432/flytosky_db
JWT_SECRET=your-jwt-secret-key
FLIGHTS_PROVIDER=mock
HOTELS_PROVIDER=mock
ADMIN_MARKUP_PERCENTAGE=10
SEASONAL_MULTIPLIER=1.0
AFFILIATE_COMMISSION_PERCENTAGE=5
```

## Contributing

1. Follow the established Clean Architecture patterns
2. Write production-level code with proper error handling
3. Add TypeScript types for all data structures
4. Use Zod for input validation
5. Follow the modular API structure

## License

This project is licensed under the MIT License.