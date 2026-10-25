import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
const envDir = fs.existsSync(path.resolve(import.meta.dirname, '../.env')) ? '../' : '.'

export default defineConfig({
  plugins: [react()],
  envDir,
})
