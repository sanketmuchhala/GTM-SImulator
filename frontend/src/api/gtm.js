import service, { requestWithRetry } from './index'

/**
 * Submit a new GTM brief.
 * @param {object} data - normalized payload from formatGTMBrief()
 * @returns {Promise<{success: boolean, data: {brief_id: string, brief: object}}>}
 */
export const submitGTMBrief = (data) =>
  requestWithRetry(() => service.post('/api/gtm/brief', data), 3, 1000)

/**
 * Retrieve a stored GTM brief by ID.
 * @param {string} briefId
 */
export const getGTMBrief = (briefId) =>
  service.get(`/api/gtm/brief/${briefId}`)

/**
 * Get mock simulation preview data for a brief.
 * Returns 3 buyer persona previews + 2 message angle teasers.
 * @param {string} briefId
 */
export const getGTMPreview = (briefId) =>
  service.get(`/api/gtm/brief/${briefId}/preview`)

/**
 * List recent GTM briefs.
 * @param {number} limit
 */
export const listGTMBriefs = (limit = 20) =>
  service.get('/api/gtm/briefs', { params: { limit } })
