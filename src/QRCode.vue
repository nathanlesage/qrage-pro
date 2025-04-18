<template>
  <div class="qr-code-container">
    <canvas ref="qrCode"></canvas>
  </div>

  <div v-if="props.showButtons === true" class="button-container">
    <Button v-on:click.prevent="download('png')">Download as PNG</Button>
    <Button v-on:click.prevent="download('jpg')">Download as JPG</Button>
  </div>

  <details v-if="props.showInfo === true" class="qr-code-info">
    <summary>QR Code information</summary>
    <pre><code>{{ qrInfo }}</code></pre>
  </details>
</template>

<script setup lang="ts">
import { useStore } from './pinia'
import { create as createQRCode, GeneratedQRCodeSegment } from 'qrcode'
import { qrToCanvas } from './render-canvas'
import { onMounted, ref, computed } from 'vue'
import { Button } from 'primevue'

const props = defineProps<{
  /**
   * Should the component display QR code Debug info?
   */
  showInfo?: boolean
  /**
   * Should the component display download buttons?
   */
  showButtons?: boolean
}>()

const store = useStore()

const qrCode = ref<HTMLCanvasElement|null>(null)

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
  const canvas = qrCode.value
  if (canvas === null) {
    return
  }

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
  const canvas = qrCode.value
  if (canvas === null) {
    return
  }

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
.qr-code-container {
  display: flex;
  canvas {
    margin: 20px auto;
    max-width: 100%;
  }
}

.button-container {
  display: flex;
  gap: 20px;
  margin: 10px 0;
  justify-content: center;
}

.qr-code-info {
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
</style>
