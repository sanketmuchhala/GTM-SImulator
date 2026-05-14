<template>
  <div class="personas-page">

    <!-- Header -->
    <header class="pg-header">
      <div class="pg-brand" @click="goHome">GTM SIM LAB</div>

      <div v-if="brief" class="pg-brief-summary">
        <span class="pg-brief-product">{{ brief.product_name }}</span>
        <span class="pg-brief-sep">·</span>
        <span class="pg-brief-goal">{{ goalLabel }}</span>
      </div>

      <div class="pg-step-badge">Step 2 / 5 — Buyer Personas</div>
    </header>

    <!-- Main content -->
    <main class="pg-main">

      <!-- Loading state -->
      <div v-if="viewState === 'loading'" class="pg-loading">
        <div class="pg-loading-title">AI-Generating 12 Buyer Personas</div>
        <div class="pg-steps">
          <div
            v-for="(step, i) in loadingSteps"
            :key="i"
            class="pg-step"
            :class="{ done: i < loadingStep, active: i === loadingStep }"
          >
            <span class="pg-step-dot">{{ i < loadingStep ? '●' : i === loadingStep ? '◉' : '○' }}</span>
            <span class="pg-step-label">{{ step }}</span>
          </div>
        </div>
        <div class="pg-loading-sub">Simulating how 12 different buyer types would evaluate your product.</div>
      </div>

      <!-- Error state -->
      <div v-else-if="viewState === 'error'" class="pg-error">
        <div class="pg-error-title">Persona generation failed</div>
        <div class="pg-error-msg">{{ errorMsg || 'The LLM may be unavailable — using sample personas instead.' }}</div>
        <button class="pg-btn-secondary" @click="retryGeneration">Retry</button>
      </div>

      <!-- Persona grid -->
      <div v-else-if="viewState === 'ready'" class="pg-ready">

        <!-- Summary bar -->
        <div class="pg-summary-bar">
          <div class="pg-summary-stats">
            <span class="pg-stat">
              <span class="pg-stat-num">{{ interestedCount }}</span>
              <span class="pg-stat-label">interested</span>
            </span>
            <span class="pg-stat-sep">·</span>
            <span class="pg-stat">
              <span class="pg-stat-num">{{ neutralCount }}</span>
              <span class="pg-stat-label">neutral</span>
            </span>
            <span class="pg-stat-sep">·</span>
            <span class="pg-stat">
              <span class="pg-stat-num">{{ objectionCount }}</span>
              <span class="pg-stat-label">objections</span>
            </span>
            <span class="pg-stat-sep">·</span>
            <span class="pg-stat">
              <span class="pg-stat-label">best angle:</span>
              <span class="pg-stat-num angle">{{ bestAngle }}</span>
            </span>
          </div>

          <div class="pg-filter-row">
            <button
              v-for="f in filters"
              :key="f.value"
              class="pg-filter-btn"
              :class="{ active: activeFilter === f.value }"
              @click="activeFilter = f.value"
            >
              {{ f.label }}
            </button>
          </div>

          <div class="pg-confidence-note">
            ⚡ Directional signal — validate your top segments with real outreach before committing.
          </div>
        </div>

        <!-- Grid -->
        <div class="pg-grid">
          <PersonaCard
            v-for="persona in filteredPersonas"
            :key="persona.id"
            :persona="persona"
            :compact="false"
          />
        </div>

      </div>
    </main>

    <!-- Footer -->
    <footer v-if="viewState === 'ready'" class="pg-footer">
      <button class="pg-btn-secondary" @click="goHome">← Edit Brief</button>
      <button class="pg-btn-primary" @click="continueToMessageTesting">
        Continue to Message Testing →
      </button>
    </footer>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PersonaCard from '../components/PersonaCard.vue'
import { generatePersonas } from '../api/gtm.js'
import { getGTMState, setPersonas, getPersonas } from '../store/gtmSimulation.js'
import { MOCK_PERSONAS_FULL } from '../mock/gtm_preview.js'
import { getGTMBrief } from '../api/gtm.js'

const props = defineProps({ briefId: String })
const route = useRoute()
const router = useRouter()

const briefId = computed(() => props.briefId || route.params.briefId)

// View state machine
const viewState = ref('loading') // 'loading' | 'ready' | 'error'
const errorMsg = ref('')
const personas = ref([])
const brief = ref(null)

// Loading animation
const loadingSteps = [
  'Analyzing your GTM brief...',
  'Identifying buyer segments...',
  'Generating 12 buyer personas...',
]
const loadingStep = ref(0)
let loadingTimer = null

function startLoadingAnimation() {
  loadingStep.value = 0
  loadingTimer = setInterval(() => {
    if (loadingStep.value < loadingSteps.length - 1) {
      loadingStep.value++
    }
  }, 2000)
}

function stopLoadingAnimation() {
  if (loadingTimer) {
    clearInterval(loadingTimer)
    loadingTimer = null
  }
}

// Computed stats
const interestedCount = computed(() => personas.value.filter(p => p.reaction === 'interested').length)
const neutralCount = computed(() => personas.value.filter(p => p.reaction === 'neutral').length)
const objectionCount = computed(() => personas.value.filter(p => p.reaction === 'objection').length)

const bestAngle = computed(() => {
  if (!personas.value.length) return '—'
  const counts = {}
  for (const p of personas.value) {
    const a = p.likely_message_angle || 'unknown'
    counts[a] = (counts[a] || 0) + 1
  }
  const winner = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
  const labels = { pain_led: 'Pain-Led', roi_led: 'ROI-Led', social_proof_led: 'Social Proof' }
  return labels[winner?.[0]] ?? winner?.[0] ?? '—'
})

const goalLabel = computed(() => {
  const map = {
    first_10_customers: 'First 10 Customers',
    expand_segment: 'Expand Segment',
    new_market: 'New Market',
    reactivate_churned: 'Reactivate Churned',
  }
  return map[brief.value?.gtm_goal] ?? brief.value?.gtm_goal ?? ''
})

// Filters
const filters = [
  { label: 'All', value: 'all' },
  { label: '✓ Interested', value: 'interested' },
  { label: '→ Neutral', value: 'neutral' },
  { label: '⚠ Objection', value: 'objection' },
]
const activeFilter = ref('all')

const filteredPersonas = computed(() => {
  if (activeFilter.value === 'all') return personas.value
  return personas.value.filter(p => p.reaction === activeFilter.value)
})

// Load brief from store or API
async function loadBrief() {
  const state = getGTMState()
  if (state.brief) {
    brief.value = state.brief
    return
  }
  try {
    const res = await getGTMBrief(briefId.value)
    if (res.success) brief.value = res.data
  } catch (_) { /* brief display is optional */ }
}

// Load personas from store cache → API → mock fallback
async function loadPersonas() {
  // 1. Try in-memory store cache
  const cached = getPersonas()
  if (cached?.length) {
    personas.value = cached
    viewState.value = 'ready'
    stopLoadingAnimation()
    return
  }

  // 2. Call the generation API
  try {
    const res = await generatePersonas(briefId.value, 12)
    if (res.success && Array.isArray(res.data) && res.data.length) {
      personas.value = res.data
      setPersonas(res.data)
      viewState.value = 'ready'
    } else {
      throw new Error('Empty persona list returned')
    }
  } catch (err) {
    // 3. Fallback to frontend mock
    personas.value = MOCK_PERSONAS_FULL
    setPersonas(MOCK_PERSONAS_FULL)
    viewState.value = 'ready'
  }
  stopLoadingAnimation()
}

async function retryGeneration() {
  viewState.value = 'loading'
  errorMsg.value = ''
  startLoadingAnimation()
  await loadPersonas()
}

function goHome() {
  router.push({ name: 'Home' })
}

function continueToMessageTesting() {
  router.push({ name: 'GTMMessages', params: { briefId: briefId.value } })
}

onMounted(async () => {
  startLoadingAnimation()
  await loadBrief()
  await loadPersonas()
})
</script>

<style scoped>
.personas-page {
  min-height: 100vh;
  background: #fff;
  font-family: 'Space Grotesk', system-ui, sans-serif;
  display: flex;
  flex-direction: column;
}

/* Header */
.pg-header {
  height: 56px;
  background: #000;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  flex-shrink: 0;
}

.pg-brand {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 800;
  font-size: 14px;
  letter-spacing: 1px;
  cursor: pointer;
}

.pg-brief-summary {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #CCC;
}

.pg-brief-product { color: #fff; font-weight: 600; }
.pg-brief-sep { color: #555; }

.pg-step-badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #888;
  letter-spacing: 0.5px;
}

/* Main */
.pg-main {
  flex: 1;
  padding: 32px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

/* Loading */
.pg-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 24px;
}

.pg-loading-title {
  font-size: 20px;
  font-weight: 700;
  color: #111;
}

.pg-steps {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 320px;
}

.pg-step {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: #AAA;
  transition: color 0.3s;
}

.pg-step.done   { color: #4CAF50; }
.pg-step.active { color: #111; }

.pg-step-dot {
  font-size: 14px;
  width: 16px;
  flex-shrink: 0;
}

.pg-step.active .pg-step-dot { animation: pulse 1s infinite; }
@keyframes pulse { 50% { opacity: 0.4; } }

.pg-loading-sub {
  font-size: 11px;
  color: #AAA;
  font-family: 'JetBrains Mono', monospace;
}

/* Error */
.pg-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  min-height: 300px;
  justify-content: center;
}

.pg-error-title { font-size: 18px; font-weight: 700; color: #E53935; }
.pg-error-msg   { font-size: 13px; color: #666; }

/* Summary bar */
.pg-summary-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.pg-summary-stats {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.pg-stat { display: flex; align-items: center; gap: 4px; }
.pg-stat-num { font-weight: 700; color: #111; font-family: 'JetBrains Mono', monospace; }
.pg-stat-num.angle { color: #FF4500; }
.pg-stat-label { color: #888; font-size: 11px; }
.pg-stat-sep { color: #DDD; }

/* Filter buttons */
.pg-filter-row { display: flex; gap: 6px; }

.pg-filter-btn {
  padding: 4px 10px;
  font-size: 11px;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 600;
  border: 1px solid #DDD;
  border-radius: 3px;
  background: #fff;
  color: #666;
  cursor: pointer;
  transition: all 0.15s;
}

.pg-filter-btn.active, .pg-filter-btn:hover {
  background: #000;
  color: #fff;
  border-color: #000;
}

.pg-confidence-note {
  font-size: 11px;
  color: #888;
  font-family: 'JetBrains Mono', monospace;
  margin-top: 8px;
  padding: 6px 10px;
  background: #FFFBF0;
  border: 1px solid #FFE0A0;
  border-radius: 3px;
}

/* Persona grid */
.pg-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

@media (max-width: 900px) {
  .pg-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 600px) {
  .pg-grid { grid-template-columns: 1fr; }
  .pg-main { padding: 20px 16px; }
}

/* Footer */
.pg-footer {
  padding: 16px 32px;
  border-top: 1px solid #EAEAEA;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  flex-shrink: 0;
}

.pg-btn-primary {
  padding: 10px 20px;
  background: #000;
  color: #fff;
  border: 1px solid #000;
  border-radius: 3px;
  font-family: 'Space Grotesk', system-ui, sans-serif;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
}

.pg-btn-primary:hover { background: #FF4500; border-color: #FF4500; }

.pg-btn-secondary {
  padding: 10px 14px;
  background: transparent;
  color: #666;
  border: 1px solid #CCC;
  border-radius: 3px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.15s;
}

.pg-btn-secondary:hover { border-color: #999; color: #333; }
</style>
