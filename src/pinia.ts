import { QRCodeErrorCorrectionLevel } from "qrcode"
import { defineStore } from 'pinia'
import { ref } from 'vue'

export type RenderStyle = 'default'|'dots'|'rorschach'

export interface RenderOptions {
  margin: number
  scale: number
  width?: number
  logo?: string // base64 data for a logo in the center of the QR code
  logoSize: 'S'|'M'|'L'
  style: RenderStyle
  foregroundColor: string,
  backgroundColor: string
}

export interface State extends RenderOptions {
  data: string
  errorCorrection: QRCodeErrorCorrectionLevel
}

/**
 * Returns a clean state
 *
 * @return  {State}   The clean state with defaults
 */
export function cleanState (): State {
  return {
    data: '',
    errorCorrection: 'M',
    scale: 10,
    margin: 1,
    logoSize: 'L',
    width: undefined,
    style: "default",
    foregroundColor: '#000000ff',
    backgroundColor: '#ffffffff'
  }
}

export const useStore = defineStore('state', () => {
  const state = ref<State>(cleanState())

  function updateState (newState: Partial<State>) {
    for (const prop in state.value) {
      if (prop in newState) {
        // @ts-expect-error
        state.value[prop] = newState[prop]
      }
    }
  }

  function setQRData (data: string): void {
    state.value.data = data
  }

  return { state, updateState, setQRData }
})
