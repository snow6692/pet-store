# Pet Store 🐾

A full-stack platform that combines E-Commerce functionality with a social community for pet lovers.

## 🌐 Live Website

[https://pet-store-snow66926692.vercel.app/](https://pet-store-snow66926692.vercel.app/)

## 🧠 Overview

This project was built to offer users a space where they can:

- **Shop** for pets and related products.
- **Interact** with a community through posts, comments, and replies.
- **Manage** their orders and wishlist.
- **Admins** can control products, categories, and orders.

## ✨ Features

### E-Commerce

- Product listings, categories & filters
- Shopping cart and wishlist
- Stripe checkout and cash on delivery
- Order history and details page

### Admin Dashboard

- Manage products
- Manage categories
- Manage user orders

### Community

- Post creation and deletion
- Upvotes, comments, and threaded replies
- User profiles showing their posts
- Real-time notifications
- Pagination and infinite scroll

## 🔐 Authentication

- Google OAuth via **NextAuth.js**
- Server-side session handling

## 🛠️ Tech Stack

| Technology   | Purpose                 |
| ------------ | ----------------------- |
| Next.js 15   | Framework               |
| React 19     | UI Library              |
| Tailwind CSS | Styling                 |
| Prisma       | ORM                     |
| PostgreSQL   | Database                |
| React Query  | Data fetching / caching |
| Zod          | Validation              |
| UploadThing  | File uploads            |
| Stripe       | Payment integration     |
| NextAuth     | Authentication          |



Developed by [Ahmed Hamada](https://www.linkedin.com/posts/ahmed-hamada-a83309239_just-launched-a-full-stack-pet-community-activity-7321457453622018051-jMjz) – feel free to connect or give feedback!

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/snow6692/pet-store.git

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run the development server
npm run dev
```
