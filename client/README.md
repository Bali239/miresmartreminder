# Remindly — Client Frontend

React (Vite) frontend for Remindly, featuring Tailwind CSS, React Router, Axios, and Recharts.

## Setup & Running

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Ensure `VITE_API_URL` points to your backend:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

3. **Development Mode:**
   ```bash
   npm run dev
   ```

4. **Production Build:**
   ```bash
   npm run build
   ```
