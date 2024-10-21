import { BitMatrix, QRCode } from "qrcode"
import { RenderOptions } from "./pinia"

// Determines the margin for some special drawing patterns between the block
// edges and the actual module. If set to 0 then the blocks fill each square.
const BLOCK_MARGIN = 0.05 // 5% margin looks good

interface Color {
  r: number
  g: number
  b: number
  a: number
}

/**
 * Determines the block size (in pixels) based on the options.
 *
 * @param   {number}                  modules        Number of QR code modules per side
 * @param   {Partial<RenderOptions>}  opts           Options
 *
 * @return  {number}                                 The block size in px
 */
function getBlocksize (modules: number, opts: Partial<RenderOptions>) {
  if (opts.width && opts.width >= modules + opts.margin * 2) {
    return opts.width / (modules + opts.margin * 2)
  } else {
    return opts.scale
  }
}

function hex2rgba (hex: string): Color {
  hex = hex.toUpperCase()
  if (hex.charAt(0) === '#') {
    hex = hex.slice(1)
  }

  if (hex.length === 3) {
    hex = hex.split('').map(c => `${c}${c}`).join('')
  }

  if (hex.length === 6) {
    hex += 'FF'
  }

  const hexValue = parseInt(hex, 16)

  return {
    r: (hexValue >> 24) & 255,
    g: (hexValue >> 16) & 255,
    b: (hexValue >> 8) & 255,
    a: hexValue & 255
  }
}

/**
 * Draws a debug grid on the image to check for drawing problems
 *
 * @param   {CanvasRenderingContext2D}  ctx        The Canvas context
 * @param   {number}                    modules    The amount of modules (per side)
 * @param   {number}                    margin     The amount of margin (in modules)
 * @param   {number}                    blockSize  The pixel size of each block
 */
function drawGrid (ctx: CanvasRenderingContext2D, modules: number, margin: number, blockSize: number) {
  const totalBlocks = 2 * margin + modules
  for (let block = 0; block <= totalBlocks; block++) {
    ctx.beginPath() // Horizontal
    ctx.moveTo(0, blockSize * block)
    ctx.lineTo(totalBlocks * blockSize, blockSize * block)
    ctx.stroke()
    ctx.beginPath() // Vertical
    ctx.moveTo(blockSize * block, 0)
    ctx.lineTo(blockSize * block, totalBlocks * blockSize)
    ctx.stroke()
  }
}

function drawLogo (ctx: CanvasRenderingContext2D, nModules: number, blockSize: number, opts: RenderOptions) {
  // Finally, we'll add the logo (if available)
  if (opts.logo === undefined) {
    return
  }

  const N = nModules * nModules

  // Determine the size in modules depending on the wanted logo size. The logo
  // sizes roughly correlates with the ideal error correction level for that
  // size (the logo covers as much of the QR code as the error correction will
  // be able to recover). The numbers are a bit smaller to prevent slightly too
  // large logos.
  let size = N * 0.05
  if (opts.logoSize === 'M') {
    size = N * 0.10
  } else if (opts.logoSize === 'L') {
    size = N * 0.15
  }

  // Now we know the total logo size in modules, and after sqrt() per side
  size = Math.round(Math.sqrt(size))
  const sizePx = size * blockSize // modules -> pixel

  // One step before actually drawing the logo: Clear the area entirely with the
  // background color
  const bg = hex2rgba(opts.backgroundColor)
  ctx.fillStyle = `rgba(${bg.r}, ${bg.g}, ${bg.b}, ${bg.a})`
  const x = (opts.margin + Math.round(nModules / 2) - Math.round(size / 2)) * blockSize
  const y = (opts.margin + Math.round(nModules / 2) - Math.round(size / 2)) * blockSize
  ctx.fillRect(x, y, sizePx, sizePx)

  // drawImage doesn't accept data URLs, so we'll simply provide an image tag.
  const img = document.createElement('img')
  img.onload = () => {
    const aspect = img.naturalWidth / img.naturalHeight
    if (aspect < 1) {
      // Portrait picture
      const imgWidth = sizePx * aspect
      const offset = Math.floor(sizePx / 2 - imgWidth / 2)
      ctx.drawImage(img, x + offset, y, imgWidth, sizePx)
    } else {
      // Landscape picture
      const imgHeight = sizePx / aspect
      const offset = Math.floor(sizePx / 2 - imgHeight / 2)
      ctx.drawImage(img, x, y + offset, sizePx, imgHeight)
    }
  }
  img.src = opts.logo
}

/**
 * Draws a single module to construct a Rorschach-blot type pattern/aesthetic.
 *
 * @param  {CanvasRenderingContext2D}  ctx        The Canvas rendering context
 * @param  {number}                    row        The current x-index to draw
 * @param  {number}                    col        The current y-index to draw
 * @param  {number}                    x          The x-position in pixels (left)
 * @param  {number}                    y          The y-position in pixels (top)
 * @param  {number}                    blockSize  The block size in pixels
 * @param  {BitMatrix}                 m          The matrix with all values (to check neighbors)
 */
function drawRorschachBlotPoint (
  ctx: CanvasRenderingContext2D,
  row: number,
  col: number,
  x: number,
  y: number,
  blockSize: number,
  m: BitMatrix
): void {
  // Retrieve the matrix of points around the target
  const [
    m00, m01, m02,
    m10, m11, m12,
    m20, m21, m22
  ] = [
    row > 0 && col > 0 ? m.get(row - 1, col - 1) : 0,
    row > 0 ? m.get(row - 1, col) : 0,
    row > 0 && col < m.size - 1 ? m.get(row - 1, col + 1) : 0,
    col > 0 ? m.get(row, col - 1) : 0,
    m.get(row, col), // Target point
    col < m.size - 1 ? m.get(row, col + 1) : 0,
    row < m.size - 1 && col > 0 ? m.get(row + 1, col - 1) : 0,
    row < m.size - 1 ? m.get(row + 1, col) : 0,
    row < m.size - 1 && col < m.size - 1 ? m.get(row + 1, col + 1) : 0
  ]

  if (m11 === 0) {
    return // No need to draw anything here -> empty module
  }

  // Set up variables
  const margin = blockSize * BLOCK_MARGIN
  const rPoint = (blockSize - (2 * margin)) / 2 // Radius for dots
  const rInner = margin // Inner radius
  const sizeInner = blockSize - 2 * margin // Inner width
  // Midpoints of each square/module
  const midX = x + (blockSize / 2)
  const midY = y + (blockSize / 2)

  // First, draw a circle in the middle
  ctx.beginPath()
  ctx.ellipse(midX, midY, rPoint, rPoint, Math.PI / 4, 0, 2 * Math.PI)
  ctx.fill()

  // Second, squares to fill to the sides (top, left, right, bottom)
  if (m01 === 1) {
    ctx.fillRect(x + margin, y, sizeInner, blockSize / 2)
  }
  if (m10 === 1) {
    ctx.fillRect(x, y + margin, blockSize / 2, sizeInner)
  }
  if (m12 === 1) {
    ctx.fillRect(midX, y + margin, blockSize / 2, sizeInner)
  }
  if (m21 === 1) {
    ctx.fillRect(x + margin, midY, sizeInner, blockSize / 2)
  }

  // Third, close corners where necessary (top-left, top-right, bottom-left, bottom-right)
  // The else-if checks if the corner should be smoothed out instead
  // Top-left
  if (m00 + m01 + m10 === 3) {
    ctx.fillRect(x, y, margin, margin)
  } else if (m01 + m10 === 2) {
    ctx.beginPath()
    ctx.moveTo(x, y + margin)
    ctx.arcTo(x + margin, y + margin, x + margin, y, rInner)
    ctx.lineTo(x + margin, y + margin)
    ctx.fill()
  }

  // Top-right
  if (m01 + m02 + m12 === 3) {
    ctx.fillRect(x + blockSize - margin, y, margin, margin)
  } else if (m01 + m12 === 2) {
    ctx.beginPath()
    ctx.moveTo(x + blockSize - margin, y)
    ctx.arcTo(x + blockSize - margin, y + margin, x + blockSize, y + margin, rInner)
    ctx.lineTo(x + blockSize - margin, y + margin)
    ctx.fill()
  }

  // Bottom-left
  if (m10 + m20 + m21 === 3) {
    ctx.fillRect(x, y + blockSize - margin, margin, margin)
  } else if (m10 + m21 === 2) {
    ctx.beginPath()
    ctx.moveTo(x, y + blockSize - margin)
    ctx.arcTo(x + margin, y + blockSize - margin, x + margin, y + blockSize, rInner)
    ctx.lineTo(x + margin, y + blockSize - margin)
    ctx.fill()
  }

  // Bottom-right
  if (m12 + m21 + m22 === 3) {
    ctx.fillRect(x + blockSize - margin, y + blockSize - margin, margin, margin)
  } else if (m12 + m21 === 2) {
    ctx.beginPath()
    ctx.moveTo(x + blockSize, y + blockSize - margin)
    ctx.arcTo(x + blockSize - margin, y + blockSize - margin, x + blockSize - margin, y + blockSize, rInner)
    ctx.lineTo(x + blockSize - margin, y + blockSize - margin)
    ctx.fill()
  }
}

/**
 * Inspired by the function from the qrcode library, but with customizations.
 *
 * @param   {HTMLCanvasElement}  canvas  The canvas to render to
 * @param   {QRCode}             qr      The QR code data
 * @param   {RenderOptions}      opts    Rendering options
 */
export function qrToCanvas (canvas: HTMLCanvasElement, qr: QRCode, opts: RenderOptions) {
  const blockSize = getBlocksize(qr.modules.size, opts)
  const pixels = Math.floor((qr.modules.size + opts.margin * 2) * blockSize)
  const fg = hex2rgba(opts.foregroundColor)
  const bg = hex2rgba(opts.backgroundColor)
  const margin = blockSize * BLOCK_MARGIN // Margin between printed area and edges

  // First, resize the canvas to what the settings tell us (including the scale)
  canvas.width = pixels
  canvas.height = pixels

  // Then, clear the entire thing with the background color
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, pixels, pixels)
  ctx.fillStyle = `rgba(${bg.r}, ${bg.g}, ${bg.b}, ${bg.a})`
  ctx.fillRect(0, 0, pixels, pixels)

  // Now set the fill style to the foreground
  ctx.fillStyle = `rgba(${fg.r}, ${fg.g}, ${fg.b}, ${fg.a})`

  // Uncomment the next line to draw a debug grid
  // drawGrid(ctx, qr.modules.size, opts.margin, blockSize)

  // Now, draw all modules at their corresponding positions
  for (let row = 0; row < qr.modules.size; row++) {
    for (let col = 0; col < qr.modules.size; col++) {
      if (qr.modules.get(row, col) === 0) {
        continue // Empty module -> keep bg color
      }

      const x = (opts.margin + col) * blockSize
      const y = (opts.margin + row) * blockSize
      const w = blockSize
      const h = blockSize

      if (opts.style === 'dots') {
        // Make the QR code consist of dots
        const radius = blockSize / 2
        ctx.beginPath()
        ctx.ellipse(
          x + radius,
          y + radius,
          radius - margin,
          radius - margin,
          Math.PI / 4, 0, 2 * Math.PI
        )
        ctx.fill()
      } else if (opts.style === 'rorschach') {
        // Create a Rorschach blot-type QR code
        drawRorschachBlotPoint(ctx, row, col, x, y, blockSize, qr.modules)
      } else {
        // Default: Simple squares
        ctx.fillRect(x, y, w, h)
      }
    }
  }

  // Finally, draw a logo if applicable
  drawLogo(ctx, qr.modules.size, blockSize, opts)
}
