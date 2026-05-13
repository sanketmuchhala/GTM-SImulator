# CLAUDE.md — GTM Simulation Lab

## Project Purpose
This is a fork of MiroFish adapted into a **GTM Simulation Lab**.
It helps founders and GTM teams simulate buyer reactions and outbound messaging
before launching real outreach.

**Working name:** GTM Simulation Lab
**Pitch:** *"Simulate your GTM before launching outreach."*

---

## Branding Rules
- Product name: **GTM Simulation Lab**
- Tagline: *"Simulate your GTM before launching outreach."*
- Do not imply external brand affiliations or endorsements
- Replace all MiroFish, "swarm intelligence", and "parallel digital world" copy with GTM-focused language

---

## Coding Rules

1. **JSON-first output** — All simulation and report data must be structured JSON before rendering in UI. No hardcoded strings in simulation output.

2. **No overbuild** — Do not add complexity beyond the current phase's acceptance criteria. Three similar lines is better than a premature abstraction.

3. **No auth / database / billing** — File-system persistence only. No login required for the MVP. No Postgres, Redis, or external storage.

4. **Preserve existing structure** — Do not delete or rename existing working modules. Add new GTM modules alongside them. The original MiroFish simulation flow must remain runnable.

5. **Keep demo runnable** — The app must run end-to-end at all times. Never leave a broken import, missing route, or unhandled exception.

6. **Phase-locked development** — Only build what the current phase spec in `docs/PHASE_PLAN.md` requires. Document deferred work in that file rather than implementing it early.

7. **Mock mode required** — Every LLM-dependent feature must have a mock fallback. Support `MOCK_MODE=true` env var and `?mock=true` query param on all GTM API endpoints. Mock data lives in `backend/mock_data/`.

8. **English only** — All code comments, docstrings, log messages, and UI strings in English.

9. **No new dependencies** unless explicitly required by the phase spec and approved in the commit. Do not add npm or pip packages speculatively.

---

## Phase-by-Phase Development Rule

Read `docs/PHASE_PLAN.md` before starting any implementation.

Each phase has:
- A clear goal
- A list of files likely affected
- Acceptance criteria
- An explicit "do not" list

After completing each phase:
1. Run the full app and verify it works end-to-end
2. Run `grep -r '[一-鿿]' frontend/ backend/ --include='*.py' --include='*.vue' --include='*.js'` to confirm no Chinese text crept in
3. Commit with the format below
4. Stop and wait for the next phase instruction

**Current phase: Phase 0 (documentation only — complete)**

---

## Architecture Summary

See `docs/ARCHITECTURE_NOTES.md` for the full data flow and file map.

Key reusable modules for GTM work:
- `backend/app/services/oasis_profile_generator.py` → pattern for buyer persona generation
- `backend/app/services/report_agent.py` → GTM report generation (ReACT + reflection)
- `backend/app/services/zep_tools.py` → retrieval tools for report agent
- `backend/app/utils/llm_client.py` → all LLM calls (OpenAI-compatible)
- `backend/app/utils/retry.py` → resilient API calls
- `backend/app/models/task.py` → background task tracking

---

## Repository Structure (Key Paths)

```
frontend/src/
  views/          ← 7 page views (one per workflow step)
  components/     ← 9 step components + GraphPanel + HistoryDatabase
  api/            ← API client modules (graph.js, simulation.js, report.js)
  store/          ← Pinia state (minimal — pendingUpload.js)
  i18n/           ← vue-i18n setup

backend/app/
  api/            ← Flask blueprints (graph.py, simulation.py, report.py)
  services/       ← Business logic (12 modules)
  models/         ← Data models (project.py, task.py)
  utils/          ← Shared utilities (llm_client, retry, logger, etc.)

locales/          ← en.json, zh.json (i18n strings)
docs/             ← Project documentation (this folder)
backend/mock_data/ ← Pre-generated mock JSON for demo mode (Phase 2+)
```

---

## Commit Message Format

```
<phase>.<sub>: <one-line summary>

Changed files:
- path/to/file1 — what changed
- path/to/file2 — what changed

Next: Phase <N+1> — <goal>
```

Example:
```
2.1: add GTM brief API endpoint

Changed files:
- backend/app/api/gtm.py — new blueprint, POST /api/gtm/brief
- backend/app/__init__.py — register gtm blueprint

Next: Phase 2.2 — GTMBriefForm.vue frontend component
```
