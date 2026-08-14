# Zamra Frontend

This is the frontend application for the Zamra Water Plant admin panel, built with Next.js and React.

## Overview

The app provides a dashboard experience for managing:

- admin login
- company information
- prices
- production/stock data
- password updates
- invoice and billing-related flows

## Tech Stack

- Next.js 16 (App Router) and React 19
- TypeScript
- Tailwind CSS v4 (design tokens in app/globals.css)
- Axios
- Lucide React
- Headless UI (accessible dialogs and selects)
- Chart.js / react-chartjs-2 and Recharts
- jspdf + html2canvas-pro (invoice PDF), @react-pdf/renderer (report PDF)

## Project Structure

- app/ - app router pages, layouts, and API route handlers
  - (login)/ - the sign-in route (`/`)
  - (dashboard)/ - protected pages, each with its own components/ folder
    - data/ - the bottle-type catalogue shared across the app
    - services/ - browser-side API calls, one module per resource
    - types/ - shared entity types (invoice, prices, stock)
    - utils/ - small helpers such as CSV export
  - api/ - route handlers proxying the backend
    - \_lib/ - shared backend client and session cookie contract
  - src/ - framework-agnostic building blocks
    - components/ui/ - reusable primitives (buttons, fields, tables, states)
    - components/layout/ - app shell: sidebar, top bar, page scaffolding
    - components/providers/ - client-side providers
    - lib/ - formatting, chart theme, navigation config, toast bus
- public/ - static assets
- proxy.ts - route guard (the Next.js 16 replacement for middleware.ts)

## Configuration

Create a `.env` file in the project root with the backend base URL:

```
BACKEND=https://your-backend-host
```

The route handlers append paths such as `/auth/login` and `/price/create` to it.
Without this variable every API call fails with a configuration error.

Node.js 20.9 or newer is required by Next.js 16.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Available Scripts

- npm run dev - start the development server
- npm run build - create a production build
- npm run start - run the production build
- npm run lint - run ESLint checks

## API Routes

All browser requests go to same-origin handlers, which attach the session token
server-side and forward to the backend. Every handler answers errors with
`{ success: false, message }`.

| Route | Methods | Backend |
| --- | --- | --- |
| /api/login | POST | /auth/login |
| /api/logout | POST | — (clears the session cookie) |
| /api/change-password | POST | /auth/update |
| /api/prices | GET, POST | /price, /price/create |
| /api/selling-prices | GET, POST | /selling-price/active, /selling-price/create |
| /api/stock | GET, POST | /daily-stock, /daily-stock/create |
| /api/monthly-profit | GET | /profit/monthly |
| /api/customers | GET | /customers |
| /api/shipping-addresses | GET | /shipping-addresses |
| /api/company-info | POST | /company/register |
| /api/invoices | POST | /invoice/create |
| /api/chatbot | POST | /rag/query |

## Notes

- The session token lives in an httpOnly cookie, so it is never readable by
  client scripts; only route handlers attach it to backend calls.
- A global toast system reports API outcomes: pass `{ showToast: true }` on an
  axios request and the response is announced automatically.
- Protected pages are listed in `proxy.ts`; a page missing from that matcher is
  publicly reachable.
- Monthly records are still backed by a local placeholder generator
  (`app/(dashboard)/monthly-records/components/fetchMonthlyTimeline.ts`) because
  the backend exposes no per-day, per-bottle endpoint yet. It is the only
  fabricated data source in the app and is marked as such in the file.
