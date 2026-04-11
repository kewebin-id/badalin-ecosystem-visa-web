# Car Ordering System Web

A web-based vehicle ordering management system built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Vehicle Management**: Complete vehicle CRUD operations (license plate, brand, model, capacity, etc.)
- **Admin Dashboard**: Admin interface for managing vehicles and orders
- **Responsive Design**: Optimal display across various screen sizes
- **Authentication**: Authentication system using NextAuth.js
- **Data Table**: Interactive data tables with sorting, filtering, and pagination
- **Form Validation**: Robust form validation
- **API Integration**: Backend API integration

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **State Management**: TanStack Query (React Query)
- **Form Handling**: React Hook Form
- **Authentication**: NextAuth.js
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Date Handling**: Moment.js

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin pages
│   │   └── vehicles/      # Vehicle management
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── atoms/            # Basic components (Button, Input, etc.)
│   ├── molecules/        # Combined components
│   ├── organisms/        # Complex components
│   └── templates/        # Layout templates
├── packages/             # Business logic & API
│   ├── booking/         # Booking module
│   ├── driver/          # Driver module
│   ├── trip/            # Trip module
│   └── vehicle/         # Vehicle module
└── shared/              # Utilities & constants
    ├── constants/       # Application constants
    ├── context/         # React Context
    ├── hooks/           # Custom hooks
    ├── providers/       # Providers
    ├── styles/          # Global styles
    └── utils/           # Helper functions
```

## 🚦 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm, yarn, pnpm, or bun

### Installation

1. Clone repository:

```bash
git clone <repository-url>
cd car-ordering-system-web
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Setup environment variables:

```bash
cp .env.example .env
```

Edit the `.env` file and adjust according to your configuration:

```env
PORT=4009
NODE_ENV=development
BASE_URL=http://localhost:4009
BASE_API_URL=http://localhost:3002
NEXTAUTH_URL=http://localhost:4009
NEXTAUTH_SECRET=your-secret-key
```

4. Run development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open browser and access [http://localhost:4009](http://localhost:4009)

## 📜 Available Scripts

- `npm run dev` - Run development server on port 4009
- `npm run build` - Build application for production
- `npm start` - Run production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run validate` - Code validation (prettier + lint + type check)
- `npm run check:types` - Type checking with TypeScript

## 🎨 Component Architecture

This project uses Atomic Design Pattern:

- **Atoms**: Basic UI components (Button, Input, Select, etc.)
- **Molecules**: Combination of atoms (InputText, InputSelect, etc.)
- **Organisms**: Complex components (VehicleForm, DataTable, etc.)
- **Templates**: Page layout and structure

## 🔐 Authentication

The application uses NextAuth.js for authentication with support for:

- Google OAuth
- Session management
- Protected routes

## 🌐 API Integration

API endpoints are configured through the `BASE_API_URL` environment variable. API client structure is available in the `src/packages/` folder.

## 📱 Responsive Design

Fully responsive application with breakpoints:

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🧪 Code Quality

- **ESLint**: Linting with Next.js configuration
- **Prettier**: Code formatting
- **TypeScript**: Type safety
- **Husky**: Pre-commit hooks (optional)

## 📦 Build & Deployment

### Build for Production

```bash
npm run build
```

### Run Production Build

```bash
npm start
```

### Deployment

The application can be deployed to:

- Vercel (recommended for Next.js)
- AWS
- Google Cloud Platform
- Heroku
- Docker

## 🤝 Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Create a Pull Request

## 📄 License

Private - All rights reserved

## 👥 Team

Developed by Car Ordering System Team

## 📞 Support

For questions or support, please contact the development team.
