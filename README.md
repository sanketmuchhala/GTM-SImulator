# Jeeva GTM Simulation Lab

> **Simulate your GTM before launching outreach.**

A Jeeva-inspired, open-source GTM simulation engine for B2B founders and GTM teams.
Enter your product brief, ICP, and messaging. Get back AI-generated buyer personas,
message reaction simulations, ranked objections, and a recommended 7-day outbound experiment —
before sending a single real email.

> **Note:** This is a Jeeva-inspired research project, not an official Jeeva product.
> It is not affiliated with, endorsed by, or built by Jeeva Inc.

---

## What It Does

Most GTM failures happen because founders never tested their assumptions before spending weeks on outreach.
This tool simulates what happens when your message hits your ICP — at zero cost, before you launch.

1. **Input Brief** — Describe your product, ICP, pricing, target market, and pain point
2. **Persona Generation** — AI generates 12 buyer persona types based on your ICP
3. **Message Testing** — 3 outreach angle variants (pain-led, ROI-led, social-proof-led) tested against each persona
4. **Buyer Reactions** — Each persona responds: interested / neutral / objection + likely reply text
5. **GTM Report** — Aggregated analysis: best message angle, top objections with rebuttals, segment readiness scores, 7-day outbound experiment plan

---

## Core Features

- **AI-generated buyer personas** — 12 archetypes from Skeptical VP Sales to Enthusiastic Founder-Seller
- **Outreach message testing** — 3 message angle variants, each scored against every persona
- **Objection simulation** — Surface the exact objections before your SDRs hear them live
- **GTM recommendation engine** — ReACT-pattern agentic analysis with reflection loops
- **Outbound experiment planner** — Concrete 7-day first-outbound plan with success metrics
- **Downloadable report** — Full GTM analysis exported as Markdown
- **Mock mode** — Runs fully without API keys for demos (`MOCK_MODE=true`)

---

## How It Works

```
Input Brief (8 fields)
    ↓
Persona Generator       → 12 buyer personas with pain points, skepticism, channels
    ↓
Message Generator       → 3 outreach angle variants per your brief
    ↓
Buyer Reaction Sim      → LLM simulates reaction per persona × message angle
    ↓
GTM Analyst             → Aggregates results, ranks objections, scores segments
    ↓
Report UI + Download    → Full GTM report with 7-day experiment recommendation
```

---

## Architecture Overview

| Layer | Technology |
|-------|-----------|
| Frontend | Vue 3 SPA + Vue Router + Pinia + Vue i18n |
| Backend | Flask (Python 3.11+) |
| LLM | OpenAI-compatible API (configurable — works with any provider) |
| Memory / Graph | Zep Cloud SDK (knowledge graph for persona context) |
| Simulation Engine | OASIS framework (multi-agent social simulation — used for future deep simulation phases) |
| Report Generation | ReACT-pattern agentic loop with tool-use and reflection |
| Persistence | File-system based — no database required |

---

## MVP Scope

This is intentionally a lightweight simulation demo, not a production outreach tool.

**What it is:**
- A fast way to stress-test GTM assumptions before writing a single email
- A structured way to surface likely buyer objections early
- A demo-able prototype for founder pitches, investor presentations, or GTM kickoffs

**What it is not:**
- A replacement for real customer interviews
- A CRM or outreach sequencer
- A guarantee of real-world reply rates

Treat the output as a structured first hypothesis, not a prediction.

---

## Example Use Cases

- **ICP validation** — Does my ICP description actually produce consistent, realistic buyer personas?
- **Messaging triage** — Which of my 3 message angles is most likely to land?
- **Objection discovery** — What objections will I hear before I hear them?
- **Segment prioritization** — Which buyer segment has the highest readiness score right now?
- **Outbound experiment design** — What should my first 7-day outreach test look like?

---

## Tech Stack

| Component | Stack |
|-----------|-------|
| Frontend | Vue 3, Vue Router, Pinia, Vue i18n, Vite |
| Backend | Python 3.11+, Flask 3.x, flask-cors |
| LLM Client | OpenAI SDK (compatible with any OpenAI-format provider) |
| Memory | Zep Cloud SDK |
| Simulation | OASIS (camel-oasis, camel-ai) |
| File Parsing | PyMuPDF, charset-normalizer |
| Package Manager | uv (Python), npm (Node) |

---

## Running Locally

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18+ |
| Python | 3.11–3.12 |
| uv | latest |

### 1. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and fill in:

```env
# Required: any OpenAI-compatible LLM API
LLM_API_KEY=your_api_key
LLM_BASE_URL=https://api.openai.com/v1
LLM_MODEL_NAME=gpt-4o-mini

# Required: Zep Cloud (free tier sufficient)
# https://app.getzep.com/
ZEP_API_KEY=your_zep_api_key

# Optional: run in mock mode (no API keys needed)
# MOCK_MODE=true
```

### 2. Install dependencies

```bash
npm run setup:all
```

### 3. Start

```bash
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5001`

### Mock mode (no API keys needed)

```bash
MOCK_MODE=true npm run dev
```

All simulation endpoints return pre-built realistic mock data. Full demo flow works without any API keys.

### Docker

```bash
cp .env.example .env
docker compose up -d
```

---

## Roadmap

- [ ] Richer persona memory (multi-round conversation history per persona)
- [ ] Multi-round message refinement (iterate on message based on objections)
- [ ] CRM integrations (export personas + experiment plan to HubSpot / Salesforce)
- [ ] Real outbound feedback loops (compare simulated vs. actual reply rates)
- [ ] Agentic workflow automation (autonomous multi-step GTM planning)
- [ ] Custom persona library (upload your own ICP research)
- [ ] Team collaboration (shared briefs and reports)

---

## Acknowledgments

Built on top of the [MiroFish](https://github.com/666ghj/MiroFish) open-source swarm intelligence engine.
The simulation infrastructure is powered by [OASIS](https://github.com/camel-ai/oasis) from the CAMEL-AI team.

---

## License

AGPL-3.0
