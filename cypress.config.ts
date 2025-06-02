import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000', // ou a porta que sua aplicação usa
    setupNodeEvents(on, config) {
      // implementar listeners de eventos aqui
    }
  }
})