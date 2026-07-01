import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'

const deploymentPreset = process.env.VERCEL ? 'vercel' : 'node-server'

export default defineConfig({
  publicDir: false,
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tanstackStart(),
    nitro({
      compatibilityDate: '2026-06-28',
      preset: deploymentPreset,
      vercel: {
        entryFormat: 'node',
        functions: {
          runtime: 'nodejs24.x',
        },
      },
    }),
    tailwindcss(),
    viteReact(),
  ],
})
