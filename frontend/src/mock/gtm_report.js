/**
 * Frontend mock GTM report for Phase 5.
 * Used as fallback when the backend API is unavailable.
 */

export const MOCK_REPORT = {
  id: 'rpt_mock0001',
  created_at: '2026-05-14T10:00:00Z',
  brief_id: 'gtm_mock_brief',
  executive_summary:
    'Your simulation shows strongest purchase intent from founder-led and early operator personas, particularly for the ROI-first message angle (avg interest 7.1/10). Finance buyers and enterprise procurement contacts scored significantly lower, signaling you should prioritize seed-to-Series-A companies over enterprise accounts in your first outbound run. Lead with the ROI case study angle and prepare a one-pager CFOs can evaluate independently.',
  best_icp: {
    segment: 'Seed-to-Series-A SaaS founders and startup operators running founder-led outbound with a team of 1–5 people',
    reasoning:
      'Startup operators scored 9.0/10 and founder sellers scored 8.5/10 on pain-first messages, and 8.2–8.5/10 on ROI-first. Both segments have urgent, personal pain and short buying cycles with no procurement committee. They also have the lowest objection scores and the highest willingness to trial.',
    confidence_score: 0.84,
  },
  winning_message: {
    angle: 'roi_first',
    reasoning:
      'ROI-first scored highest across 8 of 12 personas because it anchors the conversation in a concrete, peer-validated outcome. Finance buyers, RevOps leads, and VP Sales all responded positively — segments that typically ignore pain-first messages.',
    average_score: 7.13,
    recommended_subject_line: "3x meeting rate — here's what changed",
    recommended_body:
      "Hi {first_name},\n\nOne of our customers went from 2% to 6% cold-email reply rate in 30 days — not by writing better copy, but by targeting better.\n\nWe help RevOps and sales leaders identify the exact accounts most likely to convert this quarter, so outbound stops feeling random.\n\nOpen to a quick look at your current pipeline math?",
  },
  top_objections: [
    {
      objection: "Show me the methodology — 3x sounds like vendor math",
      frequency: 4,
      suggested_response:
        "Fair. Here's the exact setup: [Company] was sending 200 emails/week to a broad list. We narrowed it to 60 accounts matching their ICP, enriched with hiring signals. Reply rate went from 2% to 6.1%. Happy to share the anonymized data sheet — or connect you with their VP Revenue for a 10-min reference call.",
    },
    {
      objection: 'We already have a sales engagement tool for this',
      frequency: 3,
      suggested_response:
        "That makes sense — most teams do. The difference is that those tools help you send faster, not target better. We sit upstream of your SEP: we identify which 50 accounts to prioritize this week before you ever open Outreach or Salesloft. Takes about 15 minutes to set up the first list.",
    },
    {
      objection: "What's the payback period and total cost?",
      frequency: 3,
      suggested_response:
        "Depends on your ACV and current meeting rate. For a team booking 10 qualified meetings/month at $25k ACV, one additional meeting per week pays back the annual cost in under 30 days. I can run the math for your specific numbers on a 15-min call — no slides, just your inputs.",
    },
  ],
  buyer_readiness: {
    score: 6.4,
    label: 'medium',
    reasoning:
      'A 6.4/10 average interest score means your product resonates with roughly half the market but faces real friction with finance buyers, enterprise procurement, and highly skeptical veterans. The spread is wide (3.0 to 9.0) which is healthy — it means you have a clear winning segment rather than weak signal everywhere. To improve readiness: add one peer reference, publish a short case study with actual numbers, and offer a free 7-day trial to reduce perceived risk.',
  },
  risk_signals: [
    {
      signal: 'Tool sprawl and adoption concern',
      severity: 'high',
      mitigation:
        "Lead with a 'works alongside your existing stack' message. Emphasize that this sits upstream of Outreach/HubSpot, not replacing them. Offer a trial that doesn't require a CRM integration to start.",
    },
    {
      signal: 'CFO and finance buyers demand hard ROI before engaging',
      severity: 'medium',
      mitigation:
        'Build a one-page financial model (cost per meeting booked vs. current baseline). Add an ROI calculator to your landing page and include a business case PDF in the follow-up sequence.',
    },
    {
      signal: 'Enterprise procurement cycle mismatch',
      severity: 'medium',
      mitigation:
        'Remove enterprise accounts from your initial outbound list. Filter for companies under 200 employees. Enterprise contacts scored 2.8–4.5/10 and cited security review and procurement as blockers.',
    },
  ],
  recommended_workflow: {
    title: 'Agentic GTM Workflow — First Outbound Run',
    steps: [
      'Discover 50 seed-to-Series-A SaaS companies matching the best ICP: 5–50 employees, sales headcount 1–5, recent funding signal or active hiring in sales roles.',
      'Enrich each account with: company size, recent funding round, LinkedIn headcount growth, job postings mentioning SDR or AE roles, and tech stack.',
      'Identify the primary contact at each account: founder (if <20 employees) or VP Sales / Head of Sales (if 20–100 employees).',
      'Send the winning ROI-first message to the first 25 accounts. Personalize only the first line with one specific company signal.',
      'Monitor replies over 48 hours. Log every reply by category: interested, requests info, raises objection, politely declines, no reply.',
      'Send a follow-up to all non-replies on Day 5 using the pain-first angle as a second touch — only 1 follow-up.',
      'Route positive replies to a 15-minute founder-led discovery call.',
      'After the 7-day run: feed real reply objections back into the next simulation to refine the persona model.',
    ],
  },
  seven_day_experiment: [
    {
      day: 1,
      goal: 'Build the initial target account list',
      action:
        'Use Apollo, Clay, or LinkedIn Sales Navigator to pull 50 seed-to-Series-A SaaS companies with 5–50 employees and an active sales team. Export to a spreadsheet with: company name, size, funding stage, founder or VP Sales name and email.',
      success_metric: '50 qualified accounts identified with contact information for the primary decision-maker',
    },
    {
      day: 2,
      goal: 'Enrich accounts with urgency signals',
      action:
        'For each account, check: (1) funding announcement in the last 90 days, (2) active SDR or AE job posting, (3) tech stack. Prioritize the top 25 accounts with the strongest urgency signal.',
      success_metric: 'Top 25 accounts ranked by urgency signal with one specific personalization hook per account',
    },
    {
      day: 3,
      goal: 'Send the winning message angle to the first 25 accounts',
      action:
        'Send the ROI-first message to the top 25 accounts. Personalize only the first line with the urgency signal identified on Day 2. Do not A/B test on this batch.',
      success_metric: '25 emails sent, open rate tracked, at least 2 replies of any kind within 48 hours',
    },
    {
      day: 4,
      goal: 'Review initial replies and log objections by category',
      action:
        'Categorize every reply: interested, requests info, raises objection, politely declines, no reply. For objections, note the exact wording and compare against top simulation objections.',
      success_metric: 'All replies categorized; at least 1 qualified reply routed to a discovery call',
    },
    {
      day: 5,
      goal: 'Send follow-up to non-replies using the pain-first angle',
      action:
        'Send one follow-up to non-reply accounts using the pain-first message as a second touch. Keep it 2–3 sentences max. Reference the first email in the subject line.',
      success_metric: 'Follow-up sent to all non-reply accounts; at least 1 additional reply generated',
    },
    {
      day: 6,
      goal: 'Send the ROI-first message to the remaining 25 accounts',
      action:
        'Send the same winning message to the second batch of 25 accounts. This gives a controlled comparison between your highest-signal and lower-signal accounts.',
      success_metric: 'Compare reply rate vs. Day 3 batch to quantify the value of urgency signal targeting',
    },
    {
      day: 7,
      goal: 'Compile results and update your GTM hypothesis',
      action:
        'Tally total replies, qualified conversations, and objections raised. Write a 5-bullet summary: which accounts responded, which objections appeared, what you would change in the next run.',
      success_metric: 'Summary written; 1+ discovery call booked; clear hypothesis for the next 7-day experiment',
    },
  ],
  next_experiment:
    'Run the pain-first angle as the primary message for a second batch of SDR Manager and Sales Enablement contacts at Series A companies — these personas scored highly on pain-first (8.8/10) but were underrepresented in the first batch.',
}
