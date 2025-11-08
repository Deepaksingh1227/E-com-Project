# MONSTACK Mock E-Com Cart — Vibe Commerce Screening

## Overview

Small full-stack mock shopping cart app (React + Node/Express + MongoDB). Implements add/remove/update cart, totals, and mock checkout (no real payments). Includes DB persistence for a mock user, error handling, and optional Fake Store API import.

## Structure

- /backend — Express API, Mongoose models, seed script
- /frontend — React + Vite + TailwindCSS v4 UI

### Backend

1. cd backend
2. Copy .env-> .env and fill:
   MONGO_URI — your MongoDB connection string (Atlas or local)
   PORT (optional)
   USE_FAKESTORE=true`to import sample products from FakeStore API
3. Install & seed:
   bash
   npm install
   nodemon seed.js # seeds products (or imports fakestore if USE_FAKESTORE=true)
   nodemon server.js # runs with nodemon (or `npm start`)
   ```

   ```
