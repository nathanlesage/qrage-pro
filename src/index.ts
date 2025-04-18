import App from './App.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
// @ts-expect-error Despite the error, this line works as expected
import Aura from '@primevue/themes/aura'
import { definePreset } from '@primevue/themes'

// Import the icons CSS
import 'primeicons/primeicons.css'

const QRageProPreset = definePreset(Aura, {
  components: {
    stepper: {
      steppanel: { padding: '10px' }
    }
  },
  // Change Emerald color theme to blue
  semantic: {
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.500}',
      600: '{blue.600}',
      700: '{blue.700}',
      800: '{blue.800}',
      900: '{blue.900}',
      950: '{blue.950}'
    }
  }
})

document.addEventListener('DOMContentLoaded', () => {
  console.log('Starting app')
  const pinia = createPinia()
  const app = createApp(App)
    .use(PrimeVue, { theme: { preset: QRageProPreset } })
    .use(pinia)
  app.mount('#app')
})
