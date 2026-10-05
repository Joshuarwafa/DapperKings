import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Photos are imported from the Pictures folder via import.meta.glob (see src/lib/format.js),
// so they get hashed filenames and long-term caching in production builds.
export default defineConfig({
  plugins: [react()],
})
