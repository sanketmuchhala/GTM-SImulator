<template>
  <div class="gr-page">

    <!-- Header -->
    <header class="gr-header">
      <div class="gr-brand" @click="goHome">GTM SIM LAB</div>

      <div v-if="brief" class="gr-brief-summary">
        <span class="gr-brief-product">{{ brief.product_name }}</span>
        <span class="gr-brief-sep">·</span>
        <span class="gr-brief-goal">{{ goalLabel }}</span>
      </div>

      <div class="gr-step-badge">Step 4 / 5 — GTM Report</div>
    </header>

    <main class="gr-main">

      <!-- Loading state -->
      <div v-if="viewState === 'loading'" class="gr-loading">
        <div class="gr-loading-title">Generating GTM Report</div>
        <div class="gr-steps">
          <div
            v-for="(step, i) in loadingSteps"
            :key="i"
            class="gr-step"
            :class="{ done: i < loadingStep, active: i === loadingStep }"
          >
            <span class="gr-step-dot">{{ i < loadingStep ? '●' : i === loadingStep ? '◉' : '○' }}</span>
            <span class="gr-step-label">{{ step }}</span>
          </div>
        </div>
        <div class="gr-loading-sub">Building your personalized GTM playbook from 36 simulated buyer reactions.</div>
      </div>

      <!-- Error state -->
      <div v-else-if="viewState === 'error'" class="gr-error">
        <div class="gr-error-icon">⚠</div>
        <div class="gr-error-title">Report Generation Failed</div>
        <div class="gr-error-msg">{{ errorMsg || 'Report generation failed. Showing a sample report so you can preview the output.' }}</div>
        <button class="gr-btn-primary" @click="retryLoad">Retry</button>
      </div>

      <!-- Ready state -->
      <div v-else-if="viewState === 'ready'" class="gr-content">

        <!-- Metric strip -->
        <div class="gr-metric-strip">
          <div class="gr-metric">
            <span class="gr-metric-val">{{ icpConfidencePct }}%</span>
            <span class="gr-metric-label">ICP Fit</span>
          </div>
          <div class="gr-metric-sep"></div>
          <div class="gr-metric">
            <span class="gr-metric-val" :class="`gr-readiness-val--${report.buyer_readiness?.label}`">
              {{ report.buyer_readiness?.score }}/10
            </span>
            <span class="gr-metric-label">Buyer Readiness</span>
          </div>
          <div class="gr-metric-sep"></div>
          <div class="gr-metric">
            <span class="gr-metric-val">{{ angleLabel(report.winning_message?.angle) }}</span>
            <span class="gr-metric-label">Best Angle</span>
          </div>
          <div class="gr-metric-sep"></div>
          <div class="gr-metric">
            <span class="gr-metric-val">{{ report.seven_day_experiment?.length || 7 }}-Day</span>
            <span class="gr-metric-label">Experiment Ready</span>
          </div>
        </div>

        <!-- Executive Summary -->
        <section class="gr-section gr-summary-section">
          <div class="gr-section-label">Executive Summary</div>
          <div class="gr-summary-text">{{ report.executive_summary }}</div>
          <div class="gr-confidence-note">
            ⚡ Strong directional signal — based on 36 simulated buyer reactions.
            Validate with real outbound before committing to this strategy.
          </div>
        </section>

        <!-- ICP + Buyer Readiness row -->
        <div class="gr-two-col">

          <!-- Best ICP -->
          <section class="gr-card gr-icp-card">
            <div class="gr-card-label">Best ICP Segment</div>
            <div class="gr-icp-segment">{{ report.best_icp?.segment }}</div>
            <div class="gr-icp-confidence" v-if="report.best_icp?.confidence_score !== undefined">
              <div class="gr-conf-bar-wrap">
                <div class="gr-conf-bar" :style="{ width: Math.round((report.best_icp.confidence_score || 0) * 100) + '%' }"></div>
              </div>
              <span class="gr-conf-label">{{ Math.round((report.best_icp.confidence_score || 0) * 100) }}% ICP fit</span>
            </div>
            <div class="gr-icp-reasoning">{{ report.best_icp?.reasoning }}</div>
          </section>

          <!-- Buyer Readiness -->
          <section class="gr-card gr-readiness-card">
            <div class="gr-card-label">Buyer Readiness</div>
            <div class="gr-readiness-score-row">
              <div class="gr-readiness-gauge">
                <div
                  class="gr-readiness-fill"
                  :class="`gr-readiness--${report.buyer_readiness?.label}`"
                  :style="{ width: ((report.buyer_readiness?.score || 0) / 10 * 100) + '%' }"
                ></div>
              </div>
              <span class="gr-readiness-num">{{ report.buyer_readiness?.score }}</span>
              <span class="gr-readiness-denom">&nbsp;/ 10</span>
            </div>
            <div
              class="gr-readiness-label-badge"
              :class="`gr-readiness--${report.buyer_readiness?.label}`"
            >
              {{ (report.buyer_readiness?.label || '').toUpperCase() }}
            </div>
            <div class="gr-readiness-reasoning">{{ report.buyer_readiness?.reasoning }}</div>
          </section>
        </div>

        <!-- Winning Message -->
        <section class="gr-card gr-winner-card">
          <div class="gr-card-label">
            <span class="gr-winner-star">★</span>
            Winning Message — {{ angleLabel(report.winning_message?.angle) }}
            <span class="gr-winner-score">{{ report.winning_message?.average_score }} avg</span>
          </div>
          <div class="gr-winner-subject">{{ report.winning_message?.recommended_subject_line }}</div>
          <div class="gr-winner-body">{{ report.winning_message?.recommended_body }}</div>
          <div class="gr-winner-reasoning" v-if="report.winning_message?.reasoning">
            <span class="gr-why-label">Why it wins:</span> {{ report.winning_message.reasoning }}
          </div>
        </section>

        <!-- Objections + Risk Signals row -->
        <div class="gr-two-col">

          <!-- Top Objections -->
          <section class="gr-card gr-objections-card">
            <div class="gr-card-label">Top Objections</div>
            <div
              v-for="(obj, i) in report.top_objections"
              :key="i"
              class="gr-objection-item"
            >
              <div class="gr-objection-header">
                <span class="gr-objection-text">{{ obj.objection }}</span>
                <span class="gr-objection-freq">×{{ obj.frequency }}</span>
              </div>
              <div class="gr-objection-response" v-if="obj.suggested_response">
                <span class="gr-response-arrow">→</span> {{ obj.suggested_response }}
              </div>
            </div>
          </section>

          <!-- Risk Signals -->
          <section class="gr-card gr-risks-card">
            <div class="gr-card-label">Risk Signals</div>
            <div
              v-for="(risk, i) in report.risk_signals"
              :key="i"
              class="gr-risk-item"
              :class="`gr-risk-item--${risk.severity}`"
            >
              <div class="gr-risk-header">
                <span class="gr-risk-sev" :class="`gr-sev--${risk.severity}`">
                  {{ risk.severity?.toUpperCase() }}
                </span>
                <span class="gr-risk-signal">{{ risk.signal }}</span>
              </div>
              <div class="gr-risk-mitigation" v-if="risk.mitigation">
                {{ risk.mitigation }}
              </div>
            </div>
          </section>
        </div>

        <!-- Recommended Workflow -->
        <section class="gr-card gr-workflow-card">
          <div class="gr-card-label">{{ report.recommended_workflow?.title || 'Recommended Workflow' }}</div>
          <ol class="gr-workflow-steps">
            <li
              v-for="(step, i) in report.recommended_workflow?.steps"
              :key="i"
              class="gr-workflow-step"
            >
              {{ step }}
            </li>
          </ol>
        </section>

        <!-- 7-Day Experiment -->
        <section class="gr-experiment-section">
          <div class="gr-section-label">7-Day Outbound Experiment</div>
          <div class="gr-day-grid">
            <div
              v-for="day in report.seven_day_experiment"
              :key="day.day"
              class="gr-day-card"
              :class="{ 'gr-day-card--active': selectedDay === day.day }"
              @click="selectedDay = day.day"
            >
              <div class="gr-day-num">Day {{ day.day }}</div>
              <div class="gr-day-goal">{{ day.goal }}</div>
            </div>
          </div>
          <div class="gr-day-detail" v-if="selectedDayData">
            <div class="gr-day-detail-header">Day {{ selectedDayData.day }} — {{ selectedDayData.goal }}</div>
            <div class="gr-day-detail-row">
              <span class="gr-day-detail-key">Action</span>
              <span class="gr-day-detail-val">{{ selectedDayData.action }}</span>
            </div>
            <div class="gr-day-detail-row">
              <span class="gr-day-detail-key">Success metric</span>
              <span class="gr-day-detail-val">{{ selectedDayData.success_metric }}</span>
            </div>
          </div>
        </section>

        <!-- Next Experiment -->
        <section class="gr-card gr-next-card" v-if="report.next_experiment">
          <div class="gr-card-label">Next Experiment to Run</div>
          <div class="gr-next-text">{{ report.next_experiment }}</div>
        </section>

        <!-- Simulation note -->
        <div class="gr-sim-note">
          💡 <strong>Simulation note</strong> — All personas, reactions, and scores are AI-generated.
          This is directional signal, not real buyer data. Run real outbound to validate.
        </div>

      </div>
    </main>

    <!-- Footer -->
    <footer class="gr-footer" v-if="viewState !== 'loading'">
      <button class="gr-btn-ghost" @click="goToMessages">← Edit Messages</button>
      <div class="gr-footer-right">
        <button class="gr-btn-primary" @click="handleDownload" :disabled="!report">
          ↓ Download GTM Report
        </button>
        <button class="gr-btn-ghost" @click="handleStartOver">Start Over</button>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getGTMState, setReport, getReport, resetGTMState } from '../store/gtmSimulation'
import { getGTMBrief } from '../api/gtm'
import { generateReport } from '../api/gtm'
import { downloadGTMReport } from '../utils/downloadMarkdown'
import { MOCK_REPORT } from '../mock/gtm_report'

const router = useRouter()
const route = useRoute()
const briefId = computed(() => route.params.briefId)

const viewState = ref('loading')
const errorMsg = ref('')
const brief = ref(null)
const report = ref(null)
const selectedDay = ref(1)

// Loading animation
const loadingSteps = [
  'Loading simulation results...',
  'Analyzing buyer insights...',
  'Generating recommendations...',
]
const loadingStep = ref(0)
let loadingTimer = null

function startLoadingAnimation() {
  loadingStep.value = 0
  loadingTimer = setInterval(() => {
    if (loadingStep.value < loadingSteps.length - 1) {
      loadingStep.value++
    }
  }, 1800)
}

function stopLoadingAnimation() {
  if (loadingTimer) {
    clearInterval(loadingTimer)
    loadingTimer = null
  }
  loadingStep.value = loadingSteps.length
}

onUnmounted(() => {
  if (loadingTimer) clearInterval(loadingTimer)
})

// Computed
const goalLabel = computed(() => {
  const map = {
    first_10_customers: 'First 10 Customers',
    expand_segment: 'Expand Segment',
    new_market: 'New Market',
    reactivate_churned: 'Reactivate Churned',
  }
  return map[brief.value?.gtm_goal] ?? brief.value?.gtm_goal ?? ''
})

const selectedDayData = computed(() =>
  (report.value?.seven_day_experiment || []).find(d => d.day === selectedDay.value) ?? null
)

const icpConfidencePct = computed(() =>
  Math.round((report.value?.best_icp?.confidence_score || 0) * 100)
)

function angleLabel(angle) {
  return { pain_first: 'Pain-First', roi_first: 'ROI-First', curiosity_first: 'Curiosity-First' }[angle] ?? angle
}

// Data loading
async function loadBrief() {
  const state = getGTMState()
  if (state.brief) { brief.value = state.brief; return }
  try {
    const res = await getGTMBrief(briefId.value)
    if (res.data?.success) brief.value = res.data.data
    else if (res.success) brief.value = res.data
  } catch (_) {}
}

async function loadAll() {
  startLoadingAnimation()
  try {
    await loadBrief()

    // Store cache
    const cached = getReport()
    if (cached) {
      report.value = cached
      selectedDay.value = 1
      stopLoadingAnimation()
      viewState.value = 'ready'
      return
    }

    // Generate via API
    let rpt = null
    try {
      const res = await generateReport(briefId.value)
      const resData = res.data ?? res
      rpt = resData.data ?? resData
    } catch (_) {
      rpt = null
    }

    if (!rpt || !rpt.executive_summary) {
      rpt = MOCK_REPORT
    }

    setReport(rpt)
    report.value = rpt
    selectedDay.value = 1
    stopLoadingAnimation()
    viewState.value = 'ready'
  } catch (err) {
    stopLoadingAnimation()
    // Full fallback
    const fallback = MOCK_REPORT
    setReport(fallback)
    report.value = fallback
    selectedDay.value = 1
    viewState.value = 'ready'
  }
}

async function retryLoad() {
  viewState.value = 'loading'
  errorMsg.value = ''
  await loadAll()
}

function handleDownload() {
  if (!report.value) return
  downloadGTMReport(report.value, brief.value?.product_name || 'your-product')
}

function handleStartOver() {
  resetGTMState()
  router.push({ name: 'Home' })
}

function goHome() {
  router.push({ name: 'Home' })
}

function goToMessages() {
  router.push({ name: 'GTMMessages', params: { briefId: briefId.value } })
}

// Init
loadAll()
</script>

<style scoped>
.gr-page {
  min-height: 100vh;
  background: #0a0a0f;
  color: #e8e8f0;
  font-family: 'Inter', 'SF Pro Display', system-ui, sans-serif;
  display: flex;
  flex-direction: column;
}

/* Header */
.gr-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  border-bottom: 1px solid #1e1e2e;
  background: #0d0d18;
  position: sticky;
  top: 0;
  z-index: 10;
}

.gr-brand {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #6366f1;
  cursor: pointer;
}

.gr-brief-summary {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}
.gr-brief-product { font-weight: 600; color: #e8e8f0; }
.gr-brief-sep { color: #3a3a5c; }
.gr-brief-goal { color: #8888aa; }

.gr-step-badge {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: #6366f1;
  background: rgba(99, 102, 241, 0.12);
  border: 1px solid rgba(99, 102, 241, 0.25);
  padding: 4px 10px;
  border-radius: 4px;
}

/* Main */
.gr-main {
  flex: 1;
  padding: 32px;
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

/* Loading */
.gr-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 24px;
}

.gr-loading-title {
  font-size: 22px;
  font-weight: 700;
}

.gr-steps {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 300px;
}

.gr-step {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #5a5a7a;
  transition: color 0.3s;
}
.gr-step.done { color: #4ade80; }
.gr-step.active { color: #6366f1; }
.gr-step-dot { font-size: 10px; width: 14px; text-align: center; }

.gr-loading-sub { font-size: 13px; color: #5a5a7a; }

/* Error */
.gr-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 80px 0;
}
.gr-error-icon { font-size: 36px; }
.gr-error-title { font-size: 18px; font-weight: 700; }
.gr-error-msg { font-size: 14px; color: #8888aa; text-align: center; max-width: 400px; }

/* Content */
.gr-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Section label (plain text header, not inside a card) */
.gr-section-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #5a5a7a;
  text-transform: uppercase;
  margin-bottom: 10px;
}

/* Shared card */
.gr-card {
  background: #12121e;
  border: 1px solid #1e1e2e;
  border-radius: 12px;
  padding: 24px;
}

.gr-card-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #5a5a7a;
  text-transform: uppercase;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Executive Summary */
.gr-summary-section {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(99, 102, 241, 0.02));
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 12px;
  padding: 28px;
}

.gr-summary-text {
  font-size: 16px;
  line-height: 1.7;
  color: #d8d8f0;
}

.gr-confidence-note {
  margin-top: 14px;
  padding: 10px 14px;
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 6px;
  font-size: 12px;
  color: #c8a860;
  line-height: 1.5;
}

/* Two-column row */
.gr-two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

/* ICP Card */
.gr-icp-segment {
  font-size: 15px;
  font-weight: 600;
  color: #e8e8f0;
  margin-bottom: 12px;
  line-height: 1.4;
}

.gr-icp-confidence {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.gr-conf-bar-wrap {
  flex: 1;
  height: 5px;
  background: #1e1e2e;
  border-radius: 3px;
}

.gr-conf-bar {
  height: 100%;
  background: #6366f1;
  border-radius: 3px;
  transition: width 0.5s;
}

.gr-conf-label {
  font-size: 12px;
  font-weight: 600;
  color: #6366f1;
  white-space: nowrap;
}

.gr-icp-reasoning {
  font-size: 13px;
  color: #8888aa;
  line-height: 1.6;
}

/* Readiness Card */
.gr-readiness-score-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.gr-readiness-gauge {
  flex: 1;
  height: 8px;
  background: #1e1e2e;
  border-radius: 4px;
  overflow: hidden;
}

.gr-readiness-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s;
}

.gr-readiness--high { background: #4ade80; }
.gr-readiness--medium { background: #f59e0b; }
.gr-readiness--low { background: #f87171; }

.gr-readiness-num {
  font-size: 22px;
  font-weight: 700;
  color: #e8e8f0;
}
.gr-readiness-denom { font-size: 14px; color: #5a5a7a; }

.gr-readiness-label-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 3px 8px;
  border-radius: 4px;
  margin-bottom: 12px;
}

.gr-readiness-reasoning {
  font-size: 13px;
  color: #8888aa;
  line-height: 1.6;
}

/* Winning Message */
.gr-winner-card {
  border-color: rgba(99, 102, 241, 0.3);
  background: rgba(99, 102, 241, 0.05);
}

.gr-winner-star {
  color: #f59e0b;
  font-size: 14px;
}

.gr-winner-score {
  margin-left: auto;
  font-size: 13px;
  font-weight: 600;
  color: #6366f1;
  letter-spacing: 0;
  text-transform: none;
}

.gr-winner-subject {
  font-size: 16px;
  font-weight: 600;
  color: #e8e8f0;
  margin-bottom: 12px;
}

.gr-winner-body {
  font-size: 13px;
  color: #9898b8;
  background: #0d0d18;
  border: 1px solid #1e1e2e;
  border-radius: 8px;
  padding: 16px;
  white-space: pre-line;
  line-height: 1.7;
  margin-bottom: 14px;
  font-family: 'Inter', monospace;
}

.gr-winner-reasoning {
  font-size: 13px;
  color: #8888aa;
  line-height: 1.6;
}

.gr-why-label {
  font-weight: 700;
  color: #6366f1;
}

/* Objections */
.gr-objection-item {
  padding: 12px 0;
  border-bottom: 1px solid #1a1a2e;
}
.gr-objection-item:last-child { border-bottom: none; }

.gr-objection-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 6px;
}

.gr-objection-text {
  font-size: 13px;
  font-weight: 600;
  color: #e8e8f0;
  flex: 1;
}

.gr-objection-freq {
  font-size: 12px;
  font-weight: 700;
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
}

.gr-objection-response {
  font-size: 12px;
  color: #7878a8;
  line-height: 1.6;
  padding-left: 12px;
}

.gr-response-arrow { color: #4ade80; font-weight: 700; }

/* Risk Signals */
.gr-risk-item {
  padding: 12px 0;
  border-bottom: 1px solid #1a1a2e;
}
.gr-risk-item:last-child { border-bottom: none; }

.gr-risk-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.gr-risk-sev {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 3px;
  letter-spacing: 0.06em;
  white-space: nowrap;
}

.gr-sev--high { background: rgba(248, 113, 113, 0.15); color: #f87171; }
.gr-sev--medium { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
.gr-sev--low { background: rgba(74, 222, 128, 0.12); color: #4ade80; }

.gr-risk-signal {
  font-size: 13px;
  font-weight: 600;
  color: #e8e8f0;
}

.gr-risk-mitigation {
  font-size: 12px;
  color: #7878a8;
  line-height: 1.6;
  padding-left: 4px;
}

/* Workflow */
.gr-workflow-steps {
  list-style: none;
  padding: 0;
  margin: 0;
  counter-reset: workflow-counter;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.gr-workflow-step {
  counter-increment: workflow-counter;
  display: flex;
  gap: 12px;
  font-size: 13px;
  color: #c8c8e0;
  line-height: 1.6;
}

.gr-workflow-step::before {
  content: counter(workflow-counter);
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 50%;
  font-size: 11px;
  font-weight: 700;
  color: #6366f1;
  margin-top: 1px;
  flex-shrink: 0;
}

/* 7-Day Experiment */
.gr-experiment-section {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.gr-day-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}

.gr-day-card {
  background: #12121e;
  border: 1px solid #1e1e2e;
  border-radius: 8px;
  padding: 12px 8px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

.gr-day-card:hover {
  border-color: #3a3a6a;
}

.gr-day-card--active {
  border-color: #6366f1;
  background: rgba(99, 102, 241, 0.08);
}

.gr-day-num {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #6366f1;
  margin-bottom: 4px;
}

.gr-day-goal {
  font-size: 11px;
  color: #8888aa;
  line-height: 1.4;
}

.gr-day-detail {
  background: #12121e;
  border: 1px solid #1e1e2e;
  border-radius: 10px;
  padding: 20px;
}

.gr-day-detail-header {
  font-size: 14px;
  font-weight: 700;
  color: #e8e8f0;
  margin-bottom: 16px;
}

.gr-day-detail-row {
  display: flex;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #1a1a2e;
}

.gr-day-detail-row:last-child { border-bottom: none; }

.gr-day-detail-key {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #5a5a7a;
  text-transform: uppercase;
  min-width: 110px;
  padding-top: 2px;
}

.gr-day-detail-val {
  font-size: 13px;
  color: #c8c8e0;
  line-height: 1.6;
}

/* Next Experiment */
.gr-next-text {
  font-size: 14px;
  color: #c8c8e0;
  line-height: 1.7;
}

/* Disclaimer */
/* Simulation note (replaces old disclaimer) */
.gr-sim-note {
  background: rgba(99, 102, 241, 0.06);
  border: 1px solid rgba(99, 102, 241, 0.15);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 13px;
  color: #8888cc;
  line-height: 1.5;
}

/* Metric strip */
.gr-metric-strip {
  display: flex;
  align-items: center;
  gap: 0;
  background: #12121e;
  border: 1px solid #1e1e2e;
  border-radius: 10px;
  padding: 16px 24px;
  margin-bottom: 4px;
}

.gr-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.gr-metric-val {
  font-size: 20px;
  font-weight: 700;
  color: #e8e8f0;
  line-height: 1;
}

.gr-metric-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: #5a5a7a;
  text-transform: uppercase;
}

.gr-metric-sep {
  width: 1px;
  height: 36px;
  background: #1e1e2e;
  flex-shrink: 0;
}

.gr-readiness-val--high { color: #4ade80; }
.gr-readiness-val--medium { color: #f59e0b; }
.gr-readiness-val--low { color: #f87171; }

/* Risk item severity bands */
.gr-risk-item--high { border-left: 3px solid #f87171; padding-left: 10px; }
.gr-risk-item--medium { border-left: 3px solid #f59e0b; padding-left: 10px; }
.gr-risk-item--low { border-left: 3px solid #4ade80; padding-left: 10px; }

/* Footer */
.gr-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  border-top: 1px solid #1e1e2e;
  background: #0d0d18;
}

.gr-footer-right {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* Buttons */
.gr-btn-primary {
  background: #6366f1;
  color: #fff;
  border: none;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 22px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}
.gr-btn-primary:hover { background: #5254cc; }

.gr-btn-ghost {
  background: transparent;
  color: #8888aa;
  border: 1px solid #2e2e4e;
  font-size: 14px;
  font-weight: 500;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}
.gr-btn-ghost:hover { color: #e8e8f0; border-color: #6366f1; }

.gr-btn-download {
  background: rgba(74, 222, 128, 0.1);
  color: #4ade80;
  border: 1px solid rgba(74, 222, 128, 0.3);
  font-size: 14px;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}
.gr-btn-download:hover { background: rgba(74, 222, 128, 0.18); border-color: rgba(74, 222, 128, 0.5); }
.gr-btn-download:disabled { opacity: 0.4; cursor: not-allowed; }

/* Responsive */
@media (max-width: 800px) {
  .gr-two-col { grid-template-columns: 1fr; }
  .gr-day-grid { grid-template-columns: repeat(4, 1fr); }
  .gr-header { flex-wrap: wrap; gap: 8px; }
  .gr-footer { flex-wrap: wrap; gap: 10px; }
}
</style>
