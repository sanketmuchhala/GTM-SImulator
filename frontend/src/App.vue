<template>
  <router-view />
  <Analytics />
</template>

<script setup>
import { Analytics } from '@vercel/analytics/vue'

// Use Vue Router to manage pages
</script>

<style>
/* ── Design tokens ──────────────────────────────────────────── */
:root {
  /* Backgrounds */
  --bg-base:     #000000;
  --bg-surface:  #080810;
  --bg-card:     #0e0e18;
  --bg-elevated: #151520;

  /* Borders */
  --border-subtle: #17172a;
  --border-muted:  #232338;

  /* Text */
  --text-primary:   #e8e8f0;
  --text-secondary: #8080a0;
  --text-tertiary:  #50507a;

  /* Accent — blue */
  --accent:     #3b82f6;
  --accent-dim: rgba(59, 130, 246, 0.12);

  /* Semantic */
  --green:  #4ade80;
  --amber:  #f59e0b;
  --red:    #f87171;

  /* Typography */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}

/* ── Global reset ───────────────────────────────────────────── */
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-primary);
  background-color: var(--bg-base);
}

/* Focus-visible for keyboard nav */
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* Scrollbar — dark for simulation views, light for home */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #555; }

button { font-family: inherit; cursor: pointer; }
</style>
