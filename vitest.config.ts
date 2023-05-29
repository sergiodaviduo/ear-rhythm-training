import { defineConfig } from 'vitest/config'

export default defineConfig({

    test: {
        name: 'input',
        root: './js_test',
        include: ['*.js']
  }
})