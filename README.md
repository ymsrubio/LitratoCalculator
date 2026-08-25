# 📸 Litrato Studio Profit Calculator

> **Instant, zero-clutter financial decision tool for Litrato Studio.**  
> 🌐 **Live Application:** [https://litrato-calculator.vercel.app/](https://litrato-calculator.vercel.app/)

---

## Overview

**Litrato Studio Profit Calculator** is a specialized, mobile-first web application designed to help **Litrato Photography Studio** make immediate pricing and profitability projections for event packages and rentals.

Built with **React 19 + TypeScript + Vite** and deployed directly on **Vercel**, the calculator requires zero databases, zero backend setup, and operates with zero network lag—all calculations happen synchronously inside the browser render loop.

---

## ✨ Key Features

- 📱 **100% Viewport Limit (Zero Vertical Scrolling)**  
  Designed specifically for mobile devices (`100vh` / `100svh`). All factors, prominent profit projections, and action buttons fit cleanly on a single screen without requiring the user to scroll up or down.

- 👵 **Boomer-Friendly & Ultra-Intuitive Typography**  
  Features extra-large typography, high-contrast charcoal text (`#0f172a`) on crisp white cards (`#ffffff`), and conversational wording (*"Package Price"*, *"Photo Prints"*, *"Staff Helpers"*, *"Gas & Travel"*).

- 🎨 **Modern Light Green QC Aesthetic**  
  Inspired by clean mobile procedure wizards, featuring soft circular/pill minus (`-`) grey steppers and vibrant emerald green plus (`+`) steppers (`#059669`).

- 🔄 **Tab Bar Mode Switcher (Two Distinct Business Models)**  
  Switch instantly between two operational modes without losing your viewport limit:
  - **💼 Package Rental Mode**: For when clients hire Litrato Studio for a fixed event package fee (`Package Price`).
  - **🏪 Retail Booth Mode (Pay-Per-Print)**: For when Litrato Studio rents a venue space and profits based directly on individual copies/prints sold (`Selling Price` × `Copies Sold`). Includes a prominent **Break-Even Point readout** telling your mom exactly how many copies she must sell before making a profit!

- ⚙️ **Dual-Factor Dynamic Adjusters**  
  No hidden hardcoded constants! Every operational factor across both modes can be modified right on the fly:
  - **Package Mode**: Adjust `Package Price`, `Print Volume` & `Print Cost`, `Staff Headcount` & `Helper Pay`, and `Gas & Travel`.
  - **Retail Booth Mode**: Adjust `Selling Price` & `Copies Sold`, `Space Rental Fee`, `Staff Headcount` & `Helper Pay`, and `Print Prod Cost` & `Gas/Travel`.

- 🇵🇭 **Single Currency (`₱` PHP Exclusively)**  
  Streamlined exclusively for Philippine Pesos to eliminate confusing currency toggles.

- 📋 **One-Click Summary Sharing**  
  Includes a **Copy Summary** button that formats the financial breakdown into a clean, emoji-styled text summary ready to be pasted directly into SMS, Viber, or WhatsApp.

---

## 🚀 Quick Start & Local Development

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm`

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/yunaayumii/LitratoCalculator.git
cd LitratoCalculator
npm install
```

### 3. Run Development Server
Start the Vite local development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Cloud accounts (Neon + Google sign-in)
The Calculator itself needs no accounts or network access. Signed-in
features (Jobs, the Ledger) run on Neon Postgres with Google sign-in via
Neon Auth — see `docs/adr/0001-neon-postgres-with-rls.md` and
`docs/adr/0002-neon-auth-google-only.md`. To provision those accounts and
populate `.env.local`, run the guided setup wizard:
```bash
./scripts/provision.sh
```
It's interactive and human-only (it opens the Neon and Google Cloud
dashboards for you to click through) and safe to re-run. See
`docs/provisioning.md` for what each captured value is and how to rotate it.

### 5. Build for Production
To verify TypeScript types and create a production bundle:
```bash
npm run build
```
The static output will be generated in the `/dist` directory, ready for immediate deployment on **Vercel**.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript (`vite` template)
- **Styling**: Bespoke Vanilla CSS (`src/index.css`) enforcing strict 100% viewport single-screen geometry
- **Icons**: `lucide-react`
- **Hosting / Deployment**: [Vercel](https://vercel.com/) (Static SPA)

---

## 📄 License

All rights reserved — **Litrato Photography Studio**.
