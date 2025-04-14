Farmers Marketplace
A full-stack e-commerce platform connecting local farmers directly with consumers.

Tech Stack
Frontend
Framework: React 18.3.1
Language: TypeScript 5.5.3
Build Tool: Vite 5.4.2
Styling: Tailwind CSS 3.4.1
Routing: React Router DOM 6.22.3
Icons: Lucide React 0.344.0
Backend & Database
Database: Supabase (PostgreSQL)
Authentication: Supabase Auth
File Storage: Supabase Storage
API Client: @supabase/supabase-js 2.39.7
Database Schema
Users (Supabase Auth)
Farmers
Products
Orders
Order Items
Security Features
Row Level Security (RLS)
Protected API routes
User authentication
Role-based access control
Payment Integration
UPI (Unified Payments Interface)
QR code generation
Support for multiple UPI apps
Transaction verification system
Development Tools
ESLint 9.9.1
PostCSS 8.4.35
Autoprefixer 10.4.18
Key Features
User authentication (login/register)
Product catalog with categories
Shopping cart functionality
Real-time stock management
Secure payment processing
Responsive design
Farmer profiles
Order management
Performance Optimizations
Code splitting
Lazy loading
Optimized images
Tailwind CSS purge
TypeScript strict mode
Vite's HMR (Hot Module Replacement)
Project Structure

src/
├── components/     # Reusable UI components
├── lib/           # Utility functions and configurations
├── data/          # Static data and mock content
├── types/         # TypeScript type definitions
└── assets/        # Static assets
Database Tables
farmers: Stores farmer profiles and details
products: Product catalog with inventory management
orders: Customer order information
order_items: Individual items within orders


https://github.com/user-attachments/assets/30f8c209-6c0b-4c80-adbb-7d926633e1a5

