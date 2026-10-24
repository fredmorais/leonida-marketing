import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { parse } from 'yaml'

export default defineConfig({
  plugins: [
    {
      name: 'yaml-data',
      enforce: 'pre',
      transform(source, id) {
        if (!/\.ya?ml$/.test(id.split('?')[0])) return
        return { code: `export default ${JSON.stringify(parse(source))}`, map: null }
      },
    },
    react(),
  ],
})
