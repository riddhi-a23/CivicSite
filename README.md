# 🛡️ CivicSite — Hyperlocal AI Sentinel Platform

> **Vibe2Ship Hackathon Entry**  
> **Problem Statement Selected:** Problem Statement 2 — Community Hero: Hyperlocal Problem Solver  
> **Built Using:** Gemini 3.5 Flash + React + Express (Full Stack Node on Google Cloud)

CivicSite is a comprehensive, production-ready, full-stack web application designed to empower citizens to report, validate, and resolve localized municipal infrastructure hazards. By fusing peer-to-peer crowdsourcing, on-chain style gamification, and advanced Google Gemini intelligence, CivicSite bridges the communication gap between citizens and local municipalities.

---

## 🔗 Submission Directory

- **Live Deployed Application Link (Google Cloud Run):** [https://ais-pre-abkht6xoejhthow7bqrc2e-658222004784.asia-southeast1.run.app](https://ais-pre-abkht6xoejhthow7bqrc2e-658222004784.asia-southeast1.run.app)
- **Development Sandbox Preview:** [https://ais-dev-abkht6xoejhthow7bqrc2e-658222004784.asia-southeast1.run.app](https://ais-dev-abkht6xoejhthow7bqrc2e-658222004784.asia-southeast1.run.app)
- **Official GitHub Repository:** [https://github.com/riddhi-a23/civicsite](https://github.com/riddhi-a23/civicsite)

---

## 🚀 Key Features

### 1. Multi-modal Media Hazard Reporting
- Citizens can describe issues with detailed text, attach photographs (JPG/PNG), or upload video clips showing the hazard in action.
- Uses HTML5 Geolocation API to auto-fetch high-precision latitude/longitude coordinate markers from the device sensor, or fall back to manual address inputs.

### 2. Autonomous Gemini AI Auditing & Categorization
- When submitted, the backend server processes files through memory buffers and feeds them to the **Gemini 3.5 Flash** model.
- Gemini acts as the central auditor, automatically extracting the hazard **category** (e.g., *Water Leakage*, *Pothole*), **severity rating** (*Low*, *Medium*, *High*, *Critical*), **numerical risk score** (0-100), **recommended municipal actions**, **estimated repair costs**, and the exact **responsible government department**.

### 3. Real-Time Tracking & Filtering Dashboard
- Designed with a highly polished, responsive dark-mode dashboard.
- Users can filter reports dynamically by category and track current active statuses (*Open*, *Peer-Verified*, *Resolved/Dispatched*).
- Interactive Google Maps frames are embedded automatically for each report based on its verified coordinates.

### 4. Community Peer-to-Peer Verification
- Encourages decentralized accountability. Fellow citizens can review local feeds, inspect maps/evidence, and verify reports.
- Self-verification is strictly blocked. Verifying neighborhood reports rewards the auditing citizen with **+5 XP**.

### 5. Advanced Predictive AI Insights (Macro Analysis)
- Analyzes spatial-temporal trends across all active community reports.
- Synthesis of multiple inputs identifies cascading risk trends. For instance, multiple water leakages in a sector predict a high probability of localized sub-surface subsidence (sinkholes) within 72 hours.

### 6. Gamification & Engagement Systems
- Live citizen profile highlighting their current **XP**, **Level Progress**, and earned milestones (e.g., *Water Warden*, *Pothole Patrol*).
- Automated rank promotions based on contributions: **Civic Recruit** ➡️ **Neighborhood Watcher** ➡️ **District Guardian** ➡️ **Civic Sentinel**.
- Live community leaderboard tracking top citizen contributors.

---

## 🛡️ Unique Innovations & Competitive Moats

### 🛡️ Feature Moat A: AI Fraud & Spam Prevention System
- *The Problem:* Public reporting utilities suffer from massive volumes of spam (e.g., photos of pets, random items, irrelevant text, video game screenshots).
- *Our Solution:* A server-side real-time AI Gatekeeper inspects the incoming text and files. If it identifies off-topic media or synthetic images, the report is instantly flagged, rejected, and logged into the **AI Spam Guard Dashboard**. It explains the precise rejection reason (e.g., *"Object identified as a domestic pet"* or *"Virtual game render"*), preventing waste of city department resources.

### 🔧 Feature Moat B: Agentic Dispatch Hub
- *The Problem:* Most reporting apps are dead-ends that save reports to database spreadsheets without actionable dispatch.
- *Our Solution:* A dedicated municipal dashboard. Local works officers can view validated reports, inspect the AI-calculated budget/cost estimates, and hit "Execute Dispatch". This routes the ticket to active department work-orders, marks it as dispatched, and updates the public ledger in real-time.

---

## 🛠️ Google Technologies Utilized

1. **Google Gemini API (`models/gemini-3.5-flash`)**
   - Implemented server-side using the modern official `@google/genai` SDK for blazing fast multi-modal analysis.
   - Structured JSON response parsing with strict schemas guaranteeing 100% output reliability.
2. **Google Cloud Run**
   - Microservices are packaged as server containers and deployed on Google Cloud, guaranteeing auto-scaling, high availability, and secure routing.
3. **Google Maps Embed API**
   - Coordinates from reported issues are mapped directly onto high-contrast, interactive satellite frames inside the client interface.
4. **Chrome Engine HTML5 Geolocation**
   - Integrated device sensor synchronization for zero-effort, highly accurate hazard mapping.

---

## 📂 Architecture & Directory Map

```text
├── /server.ts              # Full-stack Express API controller (Analyze, Predict, Vite server bundle)
├── /src/App.tsx            # Highly interactive React Client App (Dashboard, Dispatch, AI Spam Guard)
├── /src/index.css          # Tailwind CSS 4.0 configuration & typography pairings
├── /src/main.tsx           # React entrypoint
├── /index.html             # HTML Shell with dynamic favicon and font headers
├── /metadata.json          # App metadata and Geolocation permission schema
└── /package.json           # Node configuration, scripts, and dependencies
```

---

## ⚙️ Local Development Instructions

### Prerequisites
- Node.js (v18+ recommended)
- A valid Google Gemini API Key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/riddhi-a23/civicsite.git
   cd civicsite
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```env
   GEMINI_API_KEY="YOUR_API_KEY"
   ```

4. Launch the application in development mode:
   ```bash
   npm run dev
   ```

5. Access the local client in your browser at `http://localhost:3000`.

### Building for Production

To compile the React frontend assets and package the TypeScript Express server into a bundled CommonJS file:
```bash
npm run build
```
Start the production server:
```bash
npm run start
```
