# AfricVogue - E-Commerce Website

African fashion e-commerce platform built with Next.js 14, TypeScript, Tailwind CSS, Sanity CMS, Clerk auth, NeonDB (Postgres), and Paystack payments.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **CMS:** Sanity.io (headless CMS for products, hero images)
- **Auth:** Clerk (authentication, user management)
- **Database:** NeonDB (serverless Postgres) with Drizzle ORM
- **Payments:** Paystack (GHS)
- **Deployment:** Vercel

## Features

- **Product Catalog** — Browse by category (Men, Women, Accessories), search, and paginated listing
- **Product Details** — Image gallery, ratings, description, JSON-LD structured data for SEO
- **Shopping Cart** — Persistent cart via NeonDB when signed in, localStorage fallback for guests
- **Wishlist** — Save items with dual persistence (NeonDB / localStorage)
- **Orders** — Past order history with item details, saved to NeonDB on successful payment
- **Checkout** — Paystack payment integration (GHS)
- **Authentication** — Clerk sign-in/sign-up with custom-styled pages
- **Search** — Full-text product search via Sanity GROQ `match`
- **Pagination** — 12 items per page with page navigation
- **Skeleton Loading** — Shimmer placeholders while pages load
- **SEO** — Dynamic metadata, Open Graph / Twitter cards, JSON-LD Product schema, sitemap.xml
- **Responsive** — Mobile-first design with slide-in navigation, dark mode support
- **Accessibility** — ARIA labels, keyboard navigation, semantic HTML
- **Hero Section** — Staggered entrance animations, split layout, circular category buttons

## Getting Started

### Prerequisites

- Node.js 18+
- A Sanity.io project
- A Clerk application
- A NeonDB database
- A Paystack public key

### 1. Clone and install

```bash
git clone https://github.com/hollali/e-store.git
cd e-store
npm install
```

### 2. Set environment variables

Create a `.env` file:

```env
# Clerk (from https://clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk redirect URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Paystack (from https://paystack.com)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...

# Sanity (from Sanity management dashboard)
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id

# NeonDB (from https://neon.tech)
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### 3. Set up the database

```bash
npm run db:push
```

This creates the required tables (`cart_items`, `wishlist_items`, `orders`) in your NeonDB.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or port 3001 if 3000 is in use).

## Project Structure

```
src/
├── app/
│   ├── [category]/         # Dynamic category pages (Men, Women, Accessories)
│   ├── all/                # All products page with pagination
│   ├── api/
│   │   ├── cart/           # Cart CRUD API (NeonDB)
│   │   ├── orders/         # Orders API
│   │   └── wishlist/       # Wishlist API
│   ├── orders/             # Order history page
│   ├── product/[slug]/     # Product detail page
│   ├── search/             # Search results page
│   ├── sign-in/            # Clerk sign-in
│   ├── sign-up/            # Clerk sign-up
│   └── wishlist/           # Wishlist page
├── components/
│   ├── ui/                 # shadcn/ui components (Button, Sheet, Accordion, Skeleton)
│   ├── ProductCard.tsx     # Reusable product card
│   ├── Pagination.tsx      # Page navigation component
│   ├── navbar.tsx          # Main navigation with mobile drawer
│   ├── hero.tsx            # Homepage hero
│   ├── newest.tsx          # Newest products section
│   ├── AddToBag.tsx        # Add to cart + wishlist toggle
│   ├── shoppingCartModal.tsx # Cart sheet with Paystack checkout
│   └── ...                 # Other components
├── context/
│   ├── CartContext.tsx      # Cart state (NeonDB + localStorage)
│   └── WishlistContext.tsx  # Wishlist state (NeonDB + localStorage)
└── lib/
    ├── sanity.ts           # Sanity client + image builder
    ├── db.ts               # Lazy NeonDB + Drizzle client
    └── schema.ts           # Drizzle table schemas
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript check |
| `npm run db:push` | Push Drizzle schema to NeonDB |

## Deployment

Deploy to Vercel. Set all environment variables in the Vercel dashboard (especially `DATABASE_URL` and Clerk keys).

## License

MIT
