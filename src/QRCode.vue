<template>
  <div id="qr-code-container">
    <canvas id="qr-code"></canvas>
    <div class="button-container">
      <a class="button big" v-on:click.prevent="download('png')">Download as PNG</a>
      <a class="button big" v-on:click.prevent="download('jpg')">Download as JPG</a>
    </div>
    <details id="qr-code-info">
      <summary>QR Code information</summary>
      <pre><code>{{ qrInfo }}</code></pre>
    </details>
  </div>
</template>

<script setup lang="ts">
import { useStore } from './pinia'
import { create as createQRCode, GeneratedQRCodeSegment } from 'qrcode'
import { qrToCanvas } from './render-canvas'
import { onMounted, ref, computed } from 'vue'

const store = useStore()

// Whenever the state updates, update the QR code
store.$subscribe((mutation, state) => {
  updateQRRender()
})

const qrVersion = ref(0)
const qrMask = ref(0)
const qrData = ref('')
const qrSegments = ref<GeneratedQRCodeSegment[]>([])

// Displays some debug (?) info about the QR code
const qrInfo = computed(() => {
  const numSeg = qrSegments.value.filter(s => s.mode.id === 'Numeric').length
  const alnumSeg = qrSegments.value.filter(s => s.mode.id === 'Alphanumeric').length
  const bytesSeg = qrSegments.value.filter(s => s.mode.id === 'Byte').length
  const kanjiSeg = qrSegments.value.filter(s => s.mode.id === 'Kanji').length

  const segs = []
  if (numSeg > 0) {
    segs.push(`${numSeg}× Numeric`)
  }
  if (alnumSeg > 0) {
    segs.push(`${alnumSeg}× Alphanumeric`)
  }
  if (bytesSeg > 0) {
    segs.push(`${bytesSeg}× Bytes`)
  }
  if (kanjiSeg > 0) {
    segs.push(`${kanjiSeg}× Kanji`)
  }

  const content = [
    `QR version:   ${String(qrVersion.value).padStart(2, '0')}`,
    `QR mask:      ${String(qrMask.value).padStart(2, '0')}`,
    `QR segments:`,
    ...segs.map(s => ' '.repeat(4) + s),
    '='.repeat(20),
    qrData.value
  ]

  return content.join('\n')
})

// Do an initial render so that something is shown
onMounted(updateQRRender)

function updateQRRender () {
  const canvas: HTMLCanvasElement = document.querySelector('#qr-code')
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = 'rgba(255, 255, 255, 1)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Always ensure a QR code is being displayed
  const text = store.state.data.length > 0 ? store.state.data : 'http://www.example.com'

  const qr = createQRCode(text, { errorCorrectionLevel: store.state.errorCorrection })
  // Populate some info for the curious about this QR code
  qrVersion.value = qr.version
  qrMask.value = qr.maskPattern
  qrData.value = text
  qrSegments.value = qr.segments

  // Actually render the QR code
  qrToCanvas(canvas, qr, {
    margin: store.state.margin,
    scale: store.state.scale,
    style: store.state.style,
    logo: store.state.logo,
    logoSize: store.state.logoSize,
    foregroundColor: store.state.foregroundColor,
    backgroundColor: store.state.backgroundColor
  })
}

function download (type: 'jpg'|'png') {
  const canvas: HTMLCanvasElement = document.querySelector('#qr-code')
  canvas.toBlob(blob => {
    const file = new File([blob], type === 'png' ? 'qr.png' : 'qr.jpg')
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = URL.createObjectURL(file)
    a.download = file.name
    document.body.appendChild(a)
    a.addEventListener('mouseup', e => {
      URL.revokeObjectURL(a.href)
      a.parentElement.removeChild(a)
    })
    a.click()
  }, type === 'png' ? 'image/png' : 'image/jpeg', 1)

}
</script>

<style lang="css" scoped>
#qr-code-container {
  canvas {
    margin: 20px auto;
  }
}

.button-container {
  display: flex;
  gap: 20px;
  margin: 10px 0;
}

a.button.big {
  display: block;
  flex-grow: 1;
  background-color: var(--accent-bg-light);
  color: var(--accent-fg-light);
  border: 1px solid var(--input-border-light);
  line-height: 40px;
  font-size: 150%;
  cursor: pointer;
}

a.button.big:first-child {
  border-top-left-radius: var(--border-radius);
  border-bottom-left-radius: var(--border-radius);
}

a.button.big:last-child {
  border-top-right-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
}

#qr-code-info {
  text-align: left;
  padding: 10px;
  background-color: var(--header-bg-dark);
  color: var(--header-fg-dark);
  border-radius: var(--border-radius);

  summary {
    cursor: pointer;
  }

  &[open] summary {
    border-bottom: 1px solid var(--fg-dark);
  }
}

@media (prefers-color-scheme: dark) {
  a.button.big {
    background-color: var(--accent-bg-dark);
    color: var(--input-fg-dark);
    border-color: var(--input-border-dark);
  }
}
</style>
