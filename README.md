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

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Axios
- Lucide React
- Chart.js and react-chartjs-2
- jspdf and html2canvas-pro

## Project Structure

- app/ - app router pages, layouts, and API route handlers
  - (dashboard)/ - protected dashboard pages
  - (login)/ - login experience
  - api/ - Next.js API route proxies to the backend
  - src/ - shared frontend components, utilities, and toast logic
- public/ - static assets such as images and icons

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

## Notes

- The frontend communicates with the backend through the Next.js API route handlers under app/api.
- A global toast notification system is included for API responses and form feedback.
- Some pages use client-side state and server-side route proxies for secure backend communication.
