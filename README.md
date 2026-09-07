# ScholarFlow (PraxisResearch)

> **Academic Verification & Formative Evaluation Platform for the DepEd Senior High School Research Curriculum**  
> *Engineered for Practical Research 1 (Qualitative), Practical Research 2 (Quantitative), and 3Is (Inquiries, Investigations, and Immersion).*

---

## 🎯 The Core Problem

In Philippine public secondary schools (e.g., Canubing National High School), a single research adviser typically oversees **4–5 sections of 40–50 students** (up to 50 active research groups). This causes:
1. **Severe Red-Lining Bottlenecks:** Advisers spend 15+ hours/week manually catching basic formatting and structural mismatches.
2. **Passive Generative AI Abuse:** Students paste hallucinated summaries into literature reviews without synthesis.
3. **Structural Misalignment:** Statement of the Problem (SOP) questions in Chapter 1 fail to map to Chapter 3 survey/interview instruments.
4. **Defense Paralysis:** Research groups enter oral defenses unprepared for rigorous panel scrutiny.

---

## 🚀 The ScholarFlow Solution

ScholarFlow transforms the research advisory process through an intelligent 3-stage funnel:

```
[Stage 1: Socratic RRL Synthesis Coach]
         │  Anti-ghostwriting guardrails; guides comparative inquiry & local grounding.
         ▼
[Stage 2: Structural Alignment Matrix Auditor]
         │  Maps SOP ↔ Conceptual Variables ↔ Chapter 3 Data-Gathering Tools.
         ▼
[Stage 3: Viva-Voce Voice Pre-Defense Panelist]
         │  Interactive voice simulations targeting detected manuscript gaps.
         ▼
[Teacher Advisory & Cohort Intelligence]
         Section risk heatmaps, audit matrices, and one-click defense clearance badges.
```

---

## 🛠️ Architecture & Tech Stack

ScholarFlow adopts a modular, feature-driven colocation architecture:

* **Framework:** [Next.js 15+ (App Router)](https://nextjs.org/) with React 19 & TypeScript
* **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL with Row Level Security, Auth, and Storage)
* **AI Engine:** Google Gemini 1.5 Pro & Flash via official [`@google/genai`](https://www.npmjs.com/package/@google/genai) SDK with strict structured JSON schemas
* **Styling & UI:** Tailwind CSS v4, Lucide React, and Radix UI primitives
* **Design Language:** Curated academic palette (`#8b718e`, `#b6beac`, `#93a999`), organic `InsetCard` containers, and `rounded-full` pill controls
* **Audio & Speech:** Browser Native Web Speech Recognition (STT) + SpeechSynthesis (TTS) with real-time Web Audio API waveform visualization

---

## 📂 Project Structure

```
src/
├── app/                       # Routing only (thin containers)
├── features/                  # Domain-driven features
│   ├── audit/                 # SOP-to-Instrument Alignment Auditor
│   ├── synthesis/             # Socratic RRL Coach (Anti-ghostwriting)
│   ├── defense/               # Viva-Voce Voice Pre-Defense Simulation
│   ├── teacher/               # Advisory Heatmap & Cohort Analytics
│   ├── workspace/             # Student Project Workspace & Milestones
│   └── auth/                  # RBAC Multi-tenancy & Strand Selection
├── layout/                    # App shell (Sidebar, Header, Mobile Drawer)
├── services/                  # Global I/O (Supabase, Gemini AI, Mock fallbacks)
├── components/ui/             # Reusable primitives (InsetCard, Button, Badge)
├── lib/                       # Pure logic (RBAC, SHA-256 deduplication, DepEd rubrics)
└── types/                     # Shared database & domain TypeScript models
```

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js 20+
- pnpm or npm

### 2. Environment Setup
Copy the example environment file:
```bash
cp .env.example .env.local
```
Fill in your Supabase credentials and Google Gemini API key.

### 3. Install & Run
```bash
npm install
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 🏆 SPEED October AI Challenge
Developed for the **SPEED October AI Challenge**, demonstrating how ethical, curriculum-grounded AI can empower teachers and elevate research literacy across Philippine secondary education.
