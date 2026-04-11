# Badalin Ecosystem - Visa Web

A robust, premium web application for managing pilgrim visa applications, built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**. This platform provides a seamless experience for pilgrims to manage their family members, upload documents with OCR support, and process visa applications through an interactive multi-stage wizard.

## ✨ Features

- **Pilgrim Management**: Complete management of family members/pilgrims with validation for required documents (Passport, KTP, Selfie).
- **Smart OCR Integration**: Automated data extraction from Passports and KTPs to speed up the registration process.
- **Visa Application Wizard**: A logical, multi-stage flow for submitting visa applications:
  - **Stage 1**: Pilgrim Selection
  - **Stage 2**: Logistics (Flights & Hotels)
  - **Stage 3**: Transportation & Rawdah Schedule
  - **Stage 4**: Summary & Submission
- **Real-time Dashboard**: Overview of transaction history, status tracking (Submitted, Processing, Issued, Expired), and personalized greetings.
- **Internationalization (i18n)**: Full support for **Indonesian (ID)** and **English (EN)** locales using `next-intl`.
- **Responsive & Premium UI**: Fluid layouts, glassmorphism effects, and smooth animations powered by Framer Motion.
- **Secure Authentication**: Protected routes and session management for pilgrim accounts.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Lucide Icons
- **State Management**: TanStack Query (React Query)
- **Form Handling**: React Hook Form with Zod Validation
- **Localization**: next-intl
- **Animations**: Framer Motion
- **UI Components**: Shadcn UI inspired custom components (Atoms, Molecules, Organisms)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router (Locales, Auth, Dashboard)
├── components/            # Atomic Design Pattern
│   ├── atoms/            # Basic UI components (Button, Input, Skeleton)
│   ├── molecules/        # Combined atoms (DatePicker, Modal, HeaderPage)
│   ├── organisms/        # Domain-specific complex components (Wizard, Card, List)
│   └── templates/        # Page layouts (AppLayout)
├── packages/             # Domain Logic & Repository Pattern
│   ├── pilgrim/          # Pilgrim-specific logic
│   │   ├── management/   # Family member management
│   │   ├── transaction/  # Visa application & history
│   │   └── dashboard/    # Dashboard statistics & data
├── shared/              # Shared utilities, hooks, and constants
│   ├── constants/       # ROUTES, API Enums
│   ├── hooks/           # useAuth, useMobile, etc.
│   └── utils/           # formatters, validators, rest-api client
└── messages/             # i18n JSON translation files (en.json, id.json)
```

## 🚦 Getting Started

### Prerequisites

- **Node.js**: 20.x or higher
- **Package Manager**: npm, yarn, pnpm, or bun

### Installation

1.  **Clone the repository**:
    ```bash
    git checkout <repository-url>
    cd badalin-visa-web
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Setup environment variables**:
    ```bash
    cp .env.example .env
    ```
    Adjust the `.env` configuration:
    ```env
    PORT=4011
    NODE_ENV=development
    BASE_URL=http://localhost:4011
    BASE_API_URL=http://localhost:3002
    NEXTAUTH_URL=http://localhost:4011
    NEXTAUTH_SECRET=your-secret-key
    ```

4.  **Run development server**:
    ```bash
    npm run dev
    ```
    Access the app at [http://localhost:4011](http://localhost:4011)

## 📜 Available Scripts

- `npm run dev`: Starts development server on port 4011
- `npm run build`: Generates production build
- `npm run start`: Starts production server
- `npm run lint`: Performs ESLint check
- `npm run format`: Formats code using Prettier
- `npm run validate`: Full check (Prettier + Lint + Type Check)

## 🌍 Localization

Current support:
- 🇮🇩 **Indonesian** (Default)
- 🇺🇸 **English**

Translations are managed in `messages/{locale}.json`. Simply add new keys to both files to support new localized strings.

## 📄 License

Private - Badalin Ecosystem All Rights Reserved

## 👥 Team

Developed by **Badalin Ecosystem Development Team**
