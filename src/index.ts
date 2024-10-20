import App from './App.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

document.addEventListener('DOMContentLoaded', () => {
  console.log('Starting app')
  const pinia = createPinia()
  const app = createApp(App).use(pinia)
  app.mount('#app')
})
