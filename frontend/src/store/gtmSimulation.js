/**
 * GTM simulation session state.
 * Reactive singleton — same pattern as store/pendingUpload.js.
 * Holds the brief and preview data between Home.vue and downstream steps.
 */
import { reactive } from 'vue'

const state = reactive({
  /** @type {object|null} Raw normalized form data */
  brief: null,
  /** @type {string|null} brief_id returned from POST /api/gtm/brief */
  briefId: null,
  /** @type {'idle'|'submitting'|'preview'|'error'} */
  status: 'idle',
  /** @type {object|null} Preview data from GET /api/gtm/brief/<id>/preview */
  preview: null,
  /** @type {string|null} */
  error: null,
})

export function setGTMBrief(briefData) {
  state.brief = briefData
  state.status = 'submitting'
  state.error = null
}

export function setSimulationPreview(briefId, previewData) {
  state.briefId = briefId
  state.preview = previewData
  state.status = 'preview'
}

export function setGTMError(message) {
  state.error = message
  state.status = 'error'
}

export function getGTMState() {
  return {
    brief: state.brief,
    briefId: state.briefId,
    status: state.status,
    preview: state.preview,
    error: state.error,
  }
}

export function resetGTMState() {
  state.brief = null
  state.briefId = null
  state.status = 'idle'
  state.preview = null
  state.error = null
}

export default state
