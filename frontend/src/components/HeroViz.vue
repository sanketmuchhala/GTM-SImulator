<template>
  <div class="hviz" ref="container">
    <svg ref="svgRef" class="hviz-svg"></svg>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as d3 from 'd3'

const container = ref(null)
const svgRef   = ref(null)

let simulation = null
let pulseTimer  = null
let verdictTimer = null

const TYPES = [
  'VP Sales', 'Founder', 'CFO', 'SDR Mgr', 'Head of Growth',
  'CRO', 'Account Exec', 'Ops Lead', 'Mktg VP', 'BizDev',
  'Product', 'CEO', 'RevOps', 'CMO', 'Co-Founder',
  'Dir Sales', 'Advisor', 'Sales Ops', 'Growth', 'CTO',
]

const VERDICT = ['interested', 'interested', 'interested', 'neutral', 'neutral', 'objection']
const COLOR   = { interested: '#4ade80', neutral: '#f59e0b', objection: '#f87171' }

function makeNodes(n) {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    label: TYPES[i % TYPES.length],
    verdict: VERDICT[i % VERDICT.length],
    r: 13 + (i % 3) * 3,
  }))
}

function makeLinks(nodes, density = 1.6) {
  const n = nodes.length
  const target = Math.floor(n * density)
  const used = new Set()
  const links = []
  let attempts = 0
  while (links.length < target && attempts < target * 10) {
    attempts++
    const a = Math.floor(Math.random() * n)
    const b = Math.floor(Math.random() * n)
    const key = `${Math.min(a, b)}-${Math.max(a, b)}`
    if (a !== b && !used.has(key)) {
      used.add(key)
      links.push({ id: key, source: a, target: b })
    }
  }
  return links
}

onMounted(() => {
  const W = container.value?.offsetWidth  || 480
  const H = container.value?.offsetHeight || 400

  const nodes = makeNodes(20)
  const links = makeLinks(nodes, 1.5)

  const svg = d3.select(svgRef.value).attr('width', W).attr('height', H)

  // Glow filter
  const defs  = svg.append('defs')
  const filter = defs.append('filter').attr('id', 'hviz-glow')
  filter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur')
  const merge = filter.append('feMerge')
  merge.append('feMergeNode').attr('in', 'coloredBlur')
  merge.append('feMergeNode').attr('in', 'SourceGraphic')

  // Subtle radial vignette
  const rad = defs.append('radialGradient').attr('id', 'hviz-fade')
    .attr('cx', '50%').attr('cy', '50%').attr('r', '50%')
  rad.append('stop').attr('offset', '60%').attr('stop-color', 'transparent')
  rad.append('stop').attr('offset', '100%').attr('stop-color', '#000')
  svg.append('rect').attr('width', W).attr('height', H)
    .attr('fill', 'url(#hviz-fade)').attr('pointer-events', 'none').attr('style', 'z-index:10')

  // Force simulation
  simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(70).strength(0.3))
    .force('charge', d3.forceManyBody().strength(-160))
    .force('center', d3.forceCenter(W / 2, H / 2).strength(0.05))
    .force('collision', d3.forceCollide(d => d.r + 20))
    .alphaDecay(0.003)
    .velocityDecay(0.55)

  // Links
  const linkSel = svg.append('g').selectAll('line')
    .data(links).join('line')
    .style('stroke', '#232340')
    .style('stroke-width', 1)
    .style('opacity', 0.7)

  // Node groups
  const nodeSel = svg.append('g').selectAll('g')
    .data(nodes).join('g')
    .style('cursor', 'default')

  // Outer ring (verdict color, dim)
  nodeSel.append('circle')
    .attr('r', d => d.r + 6)
    .style('fill', 'none')
    .style('stroke', d => COLOR[d.verdict])
    .style('stroke-width', 1)
    .style('opacity', 0.18)
    .attr('class', 'node-ring')

  // Core circle
  nodeSel.append('circle')
    .attr('r', d => d.r)
    .style('fill', '#0e0e18')
    .style('stroke', d => COLOR[d.verdict])
    .style('stroke-width', 1.5)
    .attr('class', 'node-core')

  // Label
  nodeSel.append('text')
    .text(d => d.label)
    .attr('text-anchor', 'middle')
    .attr('dy', d => d.r + 13)
    .style('fill', '#50507a')
    .style('font-family', "'Inter', sans-serif")
    .style('font-size', '9px')
    .style('font-weight', '600')
    .style('letter-spacing', '0.05em')
    .style('pointer-events', 'none')

  // Tick — clamp + update positions
  simulation.on('tick', () => {
    nodes.forEach(d => {
      d.x = Math.max(d.r + 14, Math.min(W - d.r - 14, d.x))
      d.y = Math.max(d.r + 14, Math.min(H - d.r - 14, d.y))
    })
    linkSel
      .attr('x1', d => d.source.x).attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x).attr('y2', d => d.target.y)
    nodeSel.attr('transform', d => `translate(${d.x},${d.y})`)
  })

  // Pulse: fire a small ball along a random link
  function firePulse() {
    const link = links[Math.floor(Math.random() * links.length)]
    const src  = link.source
    const tgt  = link.target
    const col  = COLOR[tgt.verdict]

    const ball = svg.append('circle')
      .attr('r', 3.5)
      .attr('cx', src.x).attr('cy', src.y)
      .style('fill', col)
      .style('opacity', 0.95)
      .style('filter', 'url(#hviz-glow)')

    ball.transition()
      .duration(700 + Math.random() * 500)
      .ease(d3.easeQuadInOut)
      .attr('cx', tgt.x).attr('cy', tgt.y)
      .style('opacity', 0)
      .on('end', () => {
        ball.remove()
        // Flash the target node
        nodeSel.filter(d => d.id === tgt.id).select('.node-core')
          .transition().duration(150).style('stroke-width', 3).style('stroke', col)
          .transition().duration(500).style('stroke-width', 1.5).style('stroke', COLOR[tgt.verdict])
        nodeSel.filter(d => d.id === tgt.id).select('.node-ring')
          .transition().duration(150).style('opacity', 0.45)
          .transition().duration(600).style('opacity', 0.18)
      })

    pulseTimer = setTimeout(firePulse, 400 + Math.random() * 700)
  }
  pulseTimer = setTimeout(firePulse, 800)

  // Periodically shift a node's verdict
  function shiftVerdict() {
    const all = ['interested', 'interested', 'neutral', 'objection']
    const node = nodes[Math.floor(Math.random() * nodes.length)]
    node.verdict = all[Math.floor(Math.random() * all.length)]
    const col = COLOR[node.verdict]
    nodeSel.filter(d => d.id === node.id).select('.node-core')
      .transition().duration(600).style('stroke', col)
    nodeSel.filter(d => d.id === node.id).select('.node-ring')
      .transition().duration(600).style('stroke', col)
    verdictTimer = setTimeout(shiftVerdict, 1200 + Math.random() * 1800)
  }
  verdictTimer = setTimeout(shiftVerdict, 2000)
})

onUnmounted(() => {
  if (simulation)   simulation.stop()
  if (pulseTimer)   clearTimeout(pulseTimer)
  if (verdictTimer) clearTimeout(verdictTimer)
})
</script>

<style scoped>
.hviz {
  width: 100%;
  height: 100%;
  position: relative;
}
.hviz-svg {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
