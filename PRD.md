# Product Requirements Document (PRD): AI Footprint Survey & Calculator MVP

## 1. Project Overview & Objectives
This web application is an interactive "AI Educational Carbon & Water Footprint Calculator" built to support a Pre-test/Post-test Intervention Study. The primary goal is to study the "Value-Action Gap" (the disconnect between pro-environmental attitudes and actual digital consumption habits) among Malaysian secondary school and pre-university students.

### Core Objectives
*   **Measure Awareness**: Assess baseline knowledge regarding AI's environmental impact.
*   **Intervention**: Provide a dynamic visualization tool that converts abstract digital metrics (kWh, grams of $CO_2$) into relatable real-world physical analogies.
*   **Evaluate Effectiveness**: Measure how the visualization intervention shifts user concern and behavioral intentions.
*   **Analyze Correlations**: Study the relationship between a user's AI fluency/competency and their environmental waste (token overhead).

## 2. Target Audience
Secondary School students (Form 4 & above) and Pre-University students in Malaysia.

## 3. User Flow & Core Features (The 5-Step Model)
The MVP follows a progressive 5-step model to ensure scientifically robust data collection without overwhelming the user.

### Step 1: Pre-Intervention Survey (Baseline KAP)
*   Captures initial environmental concern on a 1–10 scale.
*   Collects prior estimations of AI's environmental impact.
*   Assesses baseline awareness of water cooling systems in data centers.

### Step 2: AI Usage Profile (Calculator Inputs)
*   **Location Select**: Collects the user's regional location (Peninsular Malaysia, Sarawak, or Sabah) to determine accurate Grid Emission Factors (GEF).
*   **Daily Prompt Volume**: Tracks daily prompts across four categories:
    1.  Simple Chat (e.g., quick questions)
    2.  Advanced Reasoning (e.g., complex multi-step reasoning models)
    3.  Coding/Development (e.g., code generation/debugging)
    4.  Heavy Image/Media Generation (e.g., Midjourney, Stable Diffusion, DALL-E)

### Step 3: AI Fluency & Competency Evaluation
*   Concealed evaluation using a 1–5 frequency scale (Never to Always) to determine the user's natural problem-solving style:
    *   Iterative vs. Monolithic prompt structure
    *   Error Recovery patterns
    *   Contextual Priming habits
*   Classifies users into one of three **Eco-Digital Personas** based on their token waste and efficiency:
    *   **Level 1: The Searcher**
    *   **Level 2: The Automator**
    *   **Level 3: The Director**

### Step 4: The Intervention (Dynamic Footprint Visualizer)
*   **Calculations Engine**: Converts raw inputs into precise carbon ($CO_2$) and water footprints.
*   **Analogies Engine**: Translates abstract metrics into relatable physical analogies (e.g., "equivalent to 3 standard bathtubs of water" or "15 miles driven in a gas car").
*   **Predictive Analytics**: Forecasts the user's future environmental footprint over the next semester or year based on their current usage rate.

### Step 5: Post-Intervention Survey & Comparative Dashboard
*   Records new "Real-time Impact" concern score (1–10 scale) and behavioral intentions to change habits.
*   **Interactive Analytical Dashboard (Chart.js)**: Displays a "Pre- vs. Post-Concern Delta Analysis" double-bar graph to visualize the educational impact.
*   **Comparative Analytics**: Compares individual profiles against a pre-loaded global sandbox database of other respondents.

---

## 4. Mathematical Logic & Backend Algorithms
The environmental footprint will be calculated client-side in the browser using the following variables and formula:

### Formula
$$CF = \sum_i (N_i \times E_i) \times \text{PUE} \times \text{GEF}_r$$

### Variables
*   **$N_i$**: Number of queries of category $i$.
*   **$E_i$**: Energy/Impact per query for category $i$ (varies from approx. 3g $CO_2$ equivalent for text to 180g for images).
*   **PUE**: Power Usage Effectiveness (constant at $1.3$).
*   **$\text{GEF}_r$**: Grid Emission Factor, adjusted dynamically based on the user's chosen region $r$ (Peninsular Malaysia, Sarawak, or Sabah).

---

## 5. Technical Architecture & Tooling
The application is designed to be lightweight, fast, and completely free to host.

*   **Code Generation**: "Vibe coded" utilizing Claude Code alongside Antigravity, or alternative AI coding assistants like Cursor or Lovable.
*   **Frontend Framework**: React, Vue, or Vanilla JS combined with Chart.js for interactive data visualization.
*   **Database / Backend**: Supabase or Firebase to securely log anonymous sessions, survey scores, and calculations.
*   **Authentication Flow**: No complex login system. The app will generate an anonymous session ID in local storage to prevent survey abandonment and track progress.
*   **Hosting**: Deployed live via Vercel, Netlify, or Render.

---

## 6. Development Timeline & Costs
*   **Estimated Cost**: $0 (utilizing generous free tiers for research).
*   **Estimated Build Timeline**: 5 to 9 days (30–50 hours).

| Phase | Duration | Focus Area |
| :--- | :--- | :--- |
| **Phase 1** | 1 Day | Database & Backend Setup (Supabase/Firebase relational tables) |
| **Phase 2** | 2-3 Days | Front-End Architecture & wizard UI state management |
| **Phase 3** | 1-2 Days | Mathematical Logic algorithms & client-side calculations |
| **Phase 4** | 1-2 Days | Chart.js Dashboard & comparative analytics integration |
| **Phase 5** | 1 Day | Deployment & Pilot Testing for edge cases |

---

## 7. Team Roles
*   **Technical Lead**: Owns the MVP stability, deployment, UI, and secure database logging.
*   **Data Analyst**: Handles the statistical verification (e.g., Paired t-Test), data cleaning, NLP sentiment analysis on qualitative feedback, and K-Means Clustering for personas.
*   **Literature Specialist**: Provides theoretical background (SDGs, VAG frameworks) and validates empirical carbon/water metrics.
*   **Project Coordinator**: Manages user recruitment (aiming for $N \ge 100$) and synthesizes the final discussion and conclusions.
