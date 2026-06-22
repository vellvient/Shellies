# AI Footprint — Complete Build Specification
### Ready-to-paste master prompt for Antigravity (or Cursor / Lovable)

---

## CONTEXT & PURPOSE

Build a complete, production-ready single-page React web application called **"AI Footprint"**. This is an educational research tool — a Pre-test → Intervention → Post-test study investigating the "Value-Action Gap" (VAG) in AI usage habits among Malaysian secondary and pre-university students. The app must feel like a polished climate-tech product, not a school project.

The core research question: **Does visualizing the personal environmental footprint of AI usage significantly increase environmental concern and intention to adopt more sustainable habits?**

---

## TECH STACK

| Layer | Choice |
|---|---|
| Framework | React 18 (functional components + hooks) |
| Styling | Tailwind CSS |
| Charts | `recharts` (preferred over Chart.js for React) |
| Animations | `framer-motion` for step transitions |
| Icons | `lucide-react` |
| Database | Supabase (anonymous session logging) |
| Deployment | Vercel |
| Session | UUID via `crypto.randomUUID()` in `localStorage` |

---

## DESIGN SYSTEM

```
Primary Background:   #0f172a  (deep slate, near-black)
Card Background:      #1e293b  (dark slate)
Card Border:          #334155  (subtle border)
Primary Accent:       #10b981  (emerald green — sustainability)
Secondary Accent:     #06b6d4  (cyan — water)
Warning:              #f59e0b  (amber)
Danger:               #ef4444  (red)
Text Primary:         #f1f5f9
Text Muted:           #94a3b8
```

- **Font**: Inter (Google Fonts)
- **Aesthetic**: Dark mode "climate dashboard" — think Carbon Tracker meets Linear.app
- **Layout**: Centered wizard, max-width `760px`, always vertically padded
- **Progress**: Persistent top progress bar showing Steps 1 → 5 with labels
- **Cards**: `rounded-xl`, subtle glow on active step using `box-shadow: 0 0 0 1px #10b981`

---

## GLOBAL STATE & SESSION MANAGEMENT

On app load:
1. Check `localStorage` for `session_id`. If missing, generate with `crypto.randomUUID()`.
2. Store the full `studyData` object to `localStorage` on every state change (prevents survey abandonment).
3. All 5 steps share one React state object — use `useReducer` for clean action-based updates.

### Full State Shape

```javascript
const initialState = {
  session_id: null,
  current_step: 1,

  // STEP 1 — Pre-Survey
  pre_concern: null,               // number 1–10
  prior_awareness: null,           // "none" | "some" | "good" | "expert"
  knows_water_cooling: null,       // true | false
  ai_vs_search_estimate: null,     // "same" | "slightly" | "much_more" | "no_idea"

  // STEP 2 — Usage Profile
  region: null,                    // "peninsular" | "sabah" | "sarawak"
  daily_prompts: {
    simple: 0,
    reasoning: 0,
    coding: 0,
    image: 0,
  },

  // STEP 3 — AI Fluency (AEI)
  aei_scores: { q1: null, q2: null, q3: null, q4: null, q5: null },
  aei_total: null,                 // 5–25
  persona: null,                   // "searcher" | "automator" | "director"

  // STEP 4 — Calculated Footprint (populated automatically)
  footprint: {
    daily_carbon: { low: 0, mid: 0, high: 0 },   // grams CO2
    daily_water:  { low: 0, mid: 0, high: 0 },   // millilitres
    weekly_carbon_mid: 0,
    annual_carbon_mid: 0,
    annual_water_mid: 0,
  },

  // STEP 5 — Post-Survey
  post_concern: null,              // number 1–10
  concern_delta: null,             // post_concern - pre_concern
  pledges: [],                     // array of pledge strings chosen
  behavior_intention: "",          // free-text field
};
```

---

## STEP 1: PRE-INTERVENTION SURVEY

**Heading**: "Before we begin — a few quick questions"
**Subheading**: "This survey is fully anonymous. There are no right or wrong answers."

### Questions

**Q1 — Concern Slider**
> "How concerned are you about the environmental impact of technology in your daily life?"
- Horizontal slider, range 1–10
- Show the current value prominently below the slider
- Labels: "Not at all" (1) → "Extremely concerned" (10)

**Q2 — Awareness Radio**
> "How much do you currently know about AI's environmental footprint?"
- 4 pill-button options (single select):
  - 😶 I had no idea it had one
  - 🤔 I've heard a little about it
  - 📖 I have a decent understanding
  - 🎓 I know a lot about it

**Q3 — Yes/No Toggle**
> "Were you aware that AI data centers require large-scale water-cooling systems to prevent overheating?"
- Large Yes / No toggle cards with icons (💧 Yes / ❓ No)

**Q4 — Energy Estimate Radio**
> "Compared to a standard Google search, how much energy do you think a single ChatGPT prompt uses?"
- 4 pill-button options:
  - ⚡ About the same amount
  - ⚡⚡ Slightly more (2–3×)
  - ⚡⚡⚡⚡ Much more (5–10×)
  - 🤷 I have no idea

**Validation**: All 4 questions required. "Next →" button stays disabled (greyed out) until all answered.

---

## STEP 2: AI USAGE PROFILE

**Heading**: "Your AI Usage Profile"
**Subheading**: "We use your location to apply accurate local electricity emission factors."

### Region Selector
Three large toggle cards (horizontal on desktop, vertical on mobile). Only one selectable at a time.

```
🏙️ Peninsular Malaysia    (Grid: coal & gas dominant)
🌿 Sarawak                (Grid: hydropower dominant — lower emissions)
🏔️ Sabah                  (Grid: mixed — moderate emissions)
```

Show a tooltip/info icon: *"Your region determines the carbon intensity of the electricity powering AI data centres. Sarawak's hydro grid is significantly cleaner."*

### Daily Prompt Volume

For each of the 4 categories below, display:
- An icon + label + 1-line description
- A **5-option button group** (not a free-text field — students cannot accurately count prompts)

| Category | Icon | Description |
|---|---|---|
| Simple Chat | 💬 | Quick questions, summaries, translations, casual chat |
| Advanced Reasoning | 🧠 | Complex analysis, essays, research, long multi-step tasks |
| Coding & Development | 💻 | Code generation, debugging, architecture review |
| Image Generation | 🎨 | DALL-E, Midjourney, Stable Diffusion, etc. |

**Range options for each** (use midpoints as numeric values for calculation):

| Button Label | Numeric Value Used |
|---|---|
| None (0) | 0 |
| 1 – 5 | 3 |
| 6 – 15 | 10 |
| 16 – 30 | 23 |
| 30+ | 40 |

Show a live **"~X prompts per day"** counter that updates as selections change.

---

## STEP 3: AI FLUENCY EVALUATION (CONCEALED)

**Heading**: "How do you use AI?"
**Subheading**: "Tell us about your natural prompting style. This helps us understand usage patterns across students."

> ⚠️ **Do NOT mention this is scored or that it determines a persona yet.** The persona reveal happens in Step 4 as part of the "wow" moment.

### 5 Statements — Likert Scale

Use horizontal pill-buttons labeled: `Never` / `Rarely` / `Sometimes` / `Often` / `Always` (values 1–5).

| # | Statement | Scoring |
|---|---|---|
| Q1 | "I break complex tasks into smaller, sequential prompts." | Normal (1–5) |
| Q2 | "I refine or rewrite my prompt when I get an unsatisfactory answer." | Normal (1–5) |
| Q3 | "I provide background context or examples before asking AI for help." | Normal (1–5) |
| Q4 | "I specify the format or structure I want in the output." | Normal (1–5) |
| Q5 | "I repeatedly regenerate or retry AI responses until I'm happy." | **Reverse scored** |

### AEI Scoring Logic

```javascript
const calculateAEI = ({ q1, q2, q3, q4, q5 }) => {
  const total = q1 + q2 + q3 + q4 + (6 - q5); // q5 is reverse scored
  let persona;
  if (total <= 10) persona = "searcher";
  else if (total <= 18) persona = "automator";
  else persona = "director";
  return { total, persona };
};
```

### Persona Definitions (revealed in Step 4)

| Persona | Score | Description |
|---|---|---|
| 🔍 The Searcher | 5–10 | Treats AI like a search engine. Single broad prompts, high regeneration, low context. Highest token overhead. |
| ⚙️ The Automator | 11–18 | Uses AI regularly with moderate efficiency. Refines sometimes but hasn't fully optimised workflow. |
| 🎯 The Director | 19–25 | Strategic, context-aware prompting. Iterative and precise. Most environmentally efficient usage style. |

---

## STEP 4: THE FOOTPRINT VISUALIZER (THE INTERVENTION)

This is the most important screen. It must be **emotionally impactful, visually rich, and scientifically credible.** Use animated number counters (count up from 0 on load) for all metric reveals.

### Mathematical Engine

#### Constants

```javascript
// Grid Emission Factors — kg CO2 per kWh
// Source: Energy Commission Malaysia (Suruhanjaya Tenaga), 2023
const GEF = {
  peninsular: 0.785,
  sabah:      0.553,
  sarawak:    0.240,
};

// Energy per query — kWh
// Calibrated to: simple ≈ 3g CO2 (Peninsular baseline), image ≈ 180g CO2
const ENERGY_KWH = {
  simple:    0.003,   // ~3 Wh per simple chat query
  reasoning: 0.010,   // ~10 Wh per GPT-4 level / advanced reasoning
  coding:    0.008,   // ~8 Wh per code generation task
  image:     0.176,   // ~176 Wh per image generation
};

// Water consumption per query — millilitres
// Calibrated from University of Glasgow study (500mL per ChatGPT email)
const WATER_ML = {
  simple:    5,
  reasoning: 50,
  coding:    30,
  image:     500,
};

const PUE = 1.3; // Power Usage Effectiveness — industry standard
```

#### Carbon Calculation

```javascript
const calculateFootprint = (daily_prompts, region) => {
  const gef = GEF[region];
  let dailyCarbonG = 0;
  let dailyWaterML = 0;

  Object.keys(daily_prompts).forEach(type => {
    const n = daily_prompts[type];
    // Carbon: grams = N × E(kWh) × PUE × GEF(kg/kWh) × 1000
    dailyCarbonG += n * ENERGY_KWH[type] * PUE * gef * 1000;
    dailyWaterML  += n * WATER_ML[type];
  });

  // Confidence intervals: ±30% low, +50% high (model energy variance)
  return {
    daily_carbon: {
      low:  dailyCarbonG * 0.70,
      mid:  dailyCarbonG,
      high: dailyCarbonG * 1.50,
    },
    daily_water: {
      low:  dailyWaterML * 0.70,
      mid:  dailyWaterML,
      high: dailyWaterML * 1.50,
    },
    weekly_carbon_mid:  dailyCarbonG * 7,
    annual_carbon_mid:  dailyCarbonG * 365,
    annual_water_mid:   dailyWaterML * 365,
  };
};
```

#### Analogies Engine

```javascript
const getAnalogies = (footprint) => {
  const ac = footprint.annual_carbon_mid;  // grams CO2
  const aw = footprint.annual_water_mid;   // millilitres

  return {
    carbon: [
      {
        icon: "📱",
        label: "Smartphone full charges",
        value: Math.round(ac / 10),  // ~10g CO2 per full charge on MY grid
        context: "to charge your phone that many times from flat"
      },
      {
        icon: "🚗",
        label: "Kilometres driven",
        value: (ac / 150).toFixed(1), // ~150g CO2/km for average Malaysian car
        context: "driven in an average petrol car"
      },
      {
        icon: "💡",
        label: "Hours of LED lighting",
        value: Math.round(ac / 7.85), // 10W LED × MY grid factor
        context: "of a 10W LED bulb running"
      },
    ],
    water: [
      {
        icon: "🍶",
        label: "Water bottles",
        value: Math.round(aw / 500),       // 500mL per bottle
        context: "standard 500mL bottles"
      },
      {
        icon: "🛁",
        label: "Bathtubs",
        value: (aw / 150000).toFixed(1),   // 150L per bathtub
        context: "standard bathtubs filled"
      },
      {
        icon: "🚿",
        label: "Showers",
        value: (aw / 60000).toFixed(1),    // 8-min shower ≈ 60L
        context: "8-minute showers"
      },
    ],
  };
};
```

### Step 4 Screen Layout

Build this as a scrollable results page with animated sections that fade/slide in sequentially:

**Section A — Persona Reveal** (top, full-width card, glowing border matching persona color)
- Big icon + persona name + 1-paragraph description
- AEI score displayed as a gauge (0–25)

**Section B — Your Daily Footprint** (two side-by-side cards)
- Left: Carbon card 🌿 — show `mid` value prominently, with `low – high` range below as "Estimated range"
- Right: Water card 💧 — same treatment
- Sub-text: *"Range reflects variation in AI model energy efficiency"*

**Section C — Annual Projection** (timeline bar)
- A simple horizontal bar showing Daily → Weekly → Monthly → Annual accumulation
- Animate the bar filling left to right

**Section D — Real-World Analogies** (grid of 6 analogy cards, 3 carbon + 3 water)
- Each card: icon (large) + number (animated count-up) + label
- These are the emotional centrepiece — make them visually bold

**Section E — Peer Benchmark** (pre-loaded sandbox data)
- Bar or gauge showing: "Your daily prompts: X | Study average: 21 | Top 20% starts at: 45"
- Pre-seed with a static JSON of 30 plausible synthetic respondents so this always renders

**Section F — Behavioural Pledge** (before moving to Step 5)
Heading: *"After seeing your results, I commit to:"*

Four checkbox cards (multi-select allowed):
- ✍️ Writing more specific, detailed prompts
- 🔄 Avoiding unnecessary regenerations
- 🎯 Using AI only when it genuinely helps
- 📚 Learning more about sustainable AI habits
- ➡️ I will continue my current habits (selecting this de-selects others)

This is the commitment mechanism — it generates richer post-intervention data.

---

## STEP 5: POST-SURVEY & COMPARATIVE DASHBOARD

**Heading**: "After Seeing Your Footprint..."
**Subheading**: "Your responses help us measure the real impact of this tool."

### Post-Survey Questions

**Q1 — Concern Slider** (identical design to Step 1 Q1)
> "Now, on a scale of 1–10, how concerned are you about the environmental impact of AI usage?"

**Q2 — Intention Radio**
> "How likely are you to change your AI usage habits after seeing your personal footprint?"
- 🚫 Not at all likely
- 🤷 Slightly likely
- 👍 Moderately likely
- 🌱 Very likely — I'm making changes

**Q3 — Open Text** (optional, 200-char limit)
> "In one sentence, what's one specific thing you'll do differently?" (placeholder: *"e.g., I'll write clearer prompts so I don't need to regenerate as often..."*)

### Dashboard (renders after Post-Survey submitted)

**Panel 1 — Concern Delta** (Recharts BarChart)
- Double bar chart: Pre-concern vs Post-concern
- If delta > 0: show in emerald green with "📈 Your concern increased by +X points"
- If delta = 0: amber, "Your concern stayed the same — you were already aware!"
- Animate bar fill on mount

**Panel 2 — Your Footprint Summary Card**
- Clean printable/shareable card with:
  - Annual carbon + water estimates
  - Persona badge
  - Top 1 analogy each for carbon and water
  - A "Share your result" button (copies a pre-written tweet/WhatsApp message to clipboard)

**Panel 3 — Study Contribution Message**
> "Thank you! Your anonymous data contributes to Malaysia's first student-led study on AI's environmental footprint. Results will be presented at the [KYUEM KYRI] Symposium."
- Show live session count: "You are participant #[N] in this study" (fetch count from Supabase)

---

## SUPABASE DATABASE SCHEMA

### Table: `responses`

```sql
CREATE TABLE responses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id    TEXT NOT NULL UNIQUE,
  created_at    TIMESTAMPTZ DEFAULT now(),
  completed_at  TIMESTAMPTZ,

  -- Step 1
  pre_concern         INT,    -- 1–10
  prior_awareness     TEXT,
  knows_water_cooling BOOLEAN,
  ai_vs_search        TEXT,

  -- Step 2
  region              TEXT,   -- 'peninsular' | 'sabah' | 'sarawak'
  prompts_simple      INT,
  prompts_reasoning   INT,
  prompts_coding      INT,
  prompts_image       INT,
  total_daily_prompts INT,

  -- Step 3
  aei_q1       INT,
  aei_q2       INT,
  aei_q3       INT,
  aei_q4       INT,
  aei_q5       INT,
  aei_total    INT,
  persona      TEXT,   -- 'searcher' | 'automator' | 'director'

  -- Step 4 (calculated)
  daily_carbon_mid    FLOAT,
  annual_carbon_mid   FLOAT,
  annual_water_mid    FLOAT,

  -- Step 5
  post_concern         INT,
  concern_delta        INT,   -- post - pre
  behavior_intention   TEXT,
  pledges              TEXT[], -- array of pledge strings
  change_likelihood    TEXT
);
```

**Submit to Supabase at Step 5 completion only** — never during earlier steps (partial data is not useful for the paired t-test). Store `session_id` in localStorage so a user who refreshes mid-survey doesn't create duplicate entries.

---

## SANDBOX DATA (pre-seed for Peer Benchmark)

Add this as a static JSON file `/src/data/sandbox.json` with 30 synthetic respondents. Include variety across regions, personas, and usage levels. Example:

```json
[
  { "region": "peninsular", "total_prompts": 15, "persona": "automator", "pre_concern": 4, "post_concern": 7 },
  { "region": "sabah",      "total_prompts": 8,  "persona": "searcher",  "pre_concern": 3, "post_concern": 6 },
  { "region": "sarawak",    "total_prompts": 32, "persona": "director",  "pre_concern": 6, "post_concern": 8 }
  // ... 27 more rows
]
```

Compute the "study average" from this data on first render. Real Supabase responses are appended to this array before computing analytics.

---

## KEY COMPONENT ARCHITECTURE

```
src/
├── App.jsx                    # Root — step router, global state
├── components/
│   ├── ProgressBar.jsx        # Persistent top bar, steps 1–5
│   ├── StepWrapper.jsx        # Framer Motion animated container for each step
│   ├── steps/
│   │   ├── Step1PreSurvey.jsx
│   │   ├── Step2UsageProfile.jsx
│   │   ├── Step3Fluency.jsx
│   │   ├── Step4Visualizer.jsx
│   │   └── Step5PostSurvey.jsx
│   ├── ui/
│   │   ├── SliderInput.jsx
│   │   ├── PillSelect.jsx     # Radio buttons as pill buttons
│   │   ├── LikertRow.jsx      # Single AEI statement + 1–5 buttons
│   │   ├── MetricCard.jsx     # Carbon / Water display card
│   │   ├── AnalogyCard.jsx    # Icon + big number + label
│   │   └── PersonaBadge.jsx   # Persona reveal card
│   └── charts/
│       ├── ConcernDeltaChart.jsx   # Recharts bar chart
│       └── PromptRangeChart.jsx    # Peer benchmark bar
├── utils/
│   ├── calculator.js          # All footprint math (pure functions)
│   ├── analogies.js           # Analogies engine
│   └── supabase.js            # Supabase client + submit function
└── data/
    └── sandbox.json           # Pre-seeded synthetic respondents
```

---

## TRANSITIONS & ANIMATION

Use `framer-motion` for all step transitions:
- Steps slide in from the right and out to the left
- Analogy cards in Step 4 stagger in one by one (0.1s delay each)
- All metric numbers use a count-up animation on mount (animate from 0 to final value over 1.5s)
- Persona reveal card has a "glow pulse" animation for 2s on first render

---

## NON-NEGOTIABLE REQUIREMENTS

1. **All calculations must be client-side** — no server calls for the math engine
2. **Confidence intervals must be shown** on all carbon/water metrics — never a single number
3. **Progress auto-saves** — localStorage backup on every state change
4. **Supabase submission happens once** — at Step 5 completion, not before
5. **Mobile-first** — all layouts must work on a 390px wide screen (most students will use phones)
6. **The "Next →" button must be disabled** until all required fields in each step are filled
7. **No login, no email, no personal data** — anonymous session IDs only
8. **Step 4 must not auto-advance** — user must manually scroll through all sections before clicking Next
9. **Share button** on Step 5 summary copies: *"I just calculated my AI carbon footprint 🌿 — try it yourself: [URL] #AIFootprint #Sustainability"* to clipboard
10. **Responsive dark theme** — respect `prefers-color-scheme` but default to dark

---

## COPY & TONE GUIDE

- Friendly, curious, never preachy or guilt-tripping
- Use "your AI footprint" not "your damage"
- Use "sustainable habits" not "reducing harm"
- Metric reveals should feel like a discovery, not a judgment
- The persona reveal should feel like a fun personality test result, not a grade

---

## WHAT TO EXCLUDE FROM MVP V1 (build these later)

❌ NLP sentiment analysis on open-text responses
❌ K-Means clustering (persona assignment is rule-based, not ML)
❌ Predictive semester/year forecasting (annual is sufficient)
❌ Real-time live respondent count (fake it from Supabase row count)
❌ PDF export of results

These can be added after the symposium if needed for publication.

---

*Built for KYUEM KYRI Symposium — AI Educational Research Track*
*Aligned with UN SDGs 4 (Quality Education), 9 (Industry & Innovation), 12 (Responsible Consumption), 13 (Climate Action)*
