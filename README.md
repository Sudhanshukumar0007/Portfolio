# ShadowByte Folio 2026

A highly optimized, motion-rich, and serverless developer portfolio engineered with modern aesthetics and enterprise-grade performance. Features a bespoke interactive canvas, robust Content Management System powered by Supabase, and automated integration cycles.

## 🚀 Core Architecture & Tech Stack

### Frontend Frameworks
*   **React 19 + Vite 8**: Blazing fast Hot Module Replacement (HMR) and hyper-optimized production bundles.
*   **React Router v7**: Intelligent path handling and seamless cross-route scrolling behaviors.
*   **Vanilla CSS Modules**: Maximum layout flexibility with natively scoped styles for zero-bloat class handling.

### Logic & State
*   **Framer Motion & GSAP**: Combined power for seamless entrance reveals, micro-interaction staggering, and complex physics-based visual flows.
*   **HTML5 Canvas API**: Native high-performance animation engine driving the neural networking background.

### Backend & Services (Serverless)
*   **Supabase**: Powering real-time persistence, Row Level Security (RLS), and administrative login mechanics.
*   **Hashnode GraphQL API**: Dynamically ingesting tech writing publications directly onto the frontend.
*   **EmailJS**: Enterprise-level decoupled infrastructure for secure instant-delivery contact notifications.
*   **GitHub API**: Interfacing live star counts and project velocity stats dynamically.

---

## 🎨 Highlighted Features

### 🔐 Dynamic Administration Panel
Built-in secured dashboard at `/admin` authenticated via Supabase. Manage and perform CRUD operations for **Projects**, **Certifications**, **Skills Inventory**, and a **Message Inbox** without utilizing custom Node.js intermediaries.

### 📈 High-Performance SEO & Core Web Vitals
*   **Automatic Route Lazy-Loading**: Utilizing `Suspense` and `React.lazy` to prevent initial load bloat.
*   **Asset Pre-rendering & Prioritization**: Image tags equipped with native `loading="lazy"`, explicitly dimensioned width/height ratios, and critical elements marked with `fetchpriority="high"`.
*   **Integrated Discovery Protocol**: Contains fully baked `robots.txt`, dynamically loaded canonical meta, and structured `sitemap.xml`.

### 🌓 Native Adaptive Theming
Global CSS variables integrated into the document root supporting seamless, zero-repaint transitions between the default "Warm Researcher's Notebook" aesthetic and sleek "Obsidian Dark Mode."

### 🛡️ Advanced Safety Measures
*   **Environment Scrubbing**: Automatic terminal log mitigation applied automatically upon Production compile to prevent information leakage.
*   **Local Rate Limiting**: Spam-prevention logic implemented on the contact controller using timestamp-comparison checks.
*   **CORS Hardened Directives**: Secure linkage enforced globally using `rel="noopener noreferrer"`.

---

## 🛠️ Setup & Installation

Follow the local workflow instructions below to spin up the development instance:

### Prerequisites
*   Node.js (v18.x or higher recommended)
*   NPM / Yarn

### 1. Clone and Initialize
```bash
git clone <repository-url>
cd frontend
npm install
```

### 2. Environment Setup
Create a `.env` file inside the root path referencing your private keys (see `.env.example` for strict template structure):

```properties
VITE_SUPABASE_URL=your-supabase-endpoint
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_EMAILJS_SERVICE_ID=your-service-id
VITE_EMAILJS_TEMPLATE_ID=your-template-id
VITE_EMAILJS_PUBLIC_KEY=your-user-public-key
VITE_ADMIN_PASSWORD=your-custom-dashboard-entry-token
```

### 3. Database Bootstrap
Ensure your connected Supabase PostgreSQL environment contains the correct tables outlined below:
- `projects` (id, title, subtitle, description, tech_stack, github_url, demo_url, order_index)
- `certifications` (id, title, issuer, date, verify_url, color, skills, preview_image)
- `skills` (id, name, category)
- `messages` (id, name, email, message, read, created_at)

### 4. Launch Environment
```bash
npm run dev
```

---

## 📦 Compilation & Deployment

The application ships strictly compiled static assets ready for Vercel, Netlify, or traditional VPS environments.

### Build Protocol
```bash
npm run build
```

This command performs recursive transformation and packages assets securely into the `dist/` directory.

### CI/CD Injection Checklist
When deploying externally, inject the aforementioned Environment Variables into the provider's settings dashboard to establish production endpoints instantly.

---

Developed with ☕ and meticulous attention to detail. All core assets explicitly compressed for sub-second responsiveness.
