# AxiomProof

> **Deterministic Academic Verification & Viva-Voce Oral Defense Rehearsal Engine**  
> *Engineered for secondary, senior high school (PR1, PR2, 3Is), and undergraduate thesis programs across quantitative, qualitative, and applied innovation methodologies.*

---

## 🎯 The Core Problem

In academic institutions and secondary research programs worldwide, research advisers typically oversee **dozens of research groups simultaneously**. This causes:
1. **Severe Red-Lining Bottlenecks:** Advisers spend 15+ hours per week catching basic structural mismatches across 80-page drafts.
2. **Passive Generative AI Abuse:** Students paste hallucinated, unverified summaries into literature reviews without critical synthesis.
3. **Structural Misalignment:** Statement of the Problem (SOP) questions in Chapter 1 fail to map to calibrated Chapter 3 instruments and operational variables.
4. **Defense Paralysis:** Research groups enter oral defenses unprepared for rigorous panel scrutiny, leading to panicking and defensive reactions.

---

## 🚀 The AxiomProof Solution

AxiomProof transforms academic research oversight through an intelligent verification funnel:

```
[Module 1: Deterministic Structural Alignment Auditor]
         │  Mathematically cross-maps SOP ↔ Variables ↔ Chapter 3 Data-Gathering Tools.
         ▼
[Module 2: Socratic Literature Synthesis Coach]
         │  Anti-ghostwriting guardrails; forces comparative inquiry & contextual grounding.
         ▼
[Module 3: Viva-Voce Voice Pre-Defense Panelist]
         │  Interactive speech-to-text oral simulation targeting detected manuscript gaps.
         ▼
[Module 4: Teacher Advisory & Cohort Intelligence]
         Cohort risk heatmaps, audit matrices, and one-click digital defense clearance tokens.
```

---

## 🛠️ Architecture & Tech Stack

AxiomProof adopts a modular, feature-driven colocation architecture:

* **Framework:** [Next.js 15+ (App Router)](https://nextjs.org/) with React 19 & TypeScript (Strict zero-`any` policy)
* **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL with Row Level Security, Auth, and Storage)
* **AI Engine:** Google Gemini 3.5 Flash-Lite & 3.1 Flash-Lite via official [`@google/genai`](https://www.npmjs.com/package/@google/genai) SDK with Cloudflare AI Gateway & failover cascade routing
* **Styling & UI:** Tailwind CSS v4, Lucide React, and Radix UI primitives
* **Design Language:** Curated academic palette (`#8b718e`, `#b6beac`, `#93a999`), organic `InsetCard` containers, and `rounded-full` pill controls
* **Audio & Speech:** Browser Native Web Speech Recognition (STT) + SpeechSynthesis (TTS) with real-time Web Audio API waveform visualization

---

## 📂 Project Structure

```
src/
├── app/                       # Routing only (thin containers)
│   ├── page.tsx               # Standalone Public Marketing Website (Distinct UI)
│   ├── workspace/             # Internal Research System Workspace Hub (In Layout shell)
│   ├── audit/                 # Chapter 1–3 Alignment Matrix Auditor
│   ├── synthesis/             # Socratic Literature Synthesis Coach
│   ├── defense/               # Viva-Voce Voice Pre-Defense Panelist
│   ├── teacher/               # Advisory Heatmap & Cohort Triage
│   └── (auth)/login/          # Universal Multi-Institution Auth
├── features/                  # Domain-driven feature implementations
│   ├── audit/                 # SOP-to-Instrument Alignment Matrix
│   ├── synthesis/             # Socratic RRL Coach with past session history
│   ├── defense/               # Viva-Voce Voice Pre-Defense Simulation
│   └── teacher/               # Advisory Heatmap & Cohort Analytics
├── layout/                    # App shell (Capsule Sidebar, Header, Mobile Drawer)
├── services/                  # Global I/O (Supabase, Gemini AI, Mock fallbacks)
├── components/ui/             # Reusable primitives (InsetCard, Button, Badge)
└── lib/                       # Pure logic (RBAC, SHA-256 deduplication, Rubrics)
```

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js 20+
- pnpm

### 2. Environment Setup
Create your `.env.local` file with the required credentials:
```bash
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Install & Run
```bash
pnpm install
pnpm dev
```

Visit `http://localhost:3005` in your browser:
* **Public Website:** `http://localhost:3005/`
* **System Workspace:** `http://localhost:3005/workspace`

---

## 🏆 SPEED October AI Challenge
Developed for the **SPEED October AI Challenge**, demonstrating how ethical, curriculum-grounded AI can empower teachers, eliminate research blindspots, and elevate research literacy across secondary and higher education.
