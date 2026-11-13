import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// On GitHub Pages the site lives at /<repo-name>/, so derive the base from the repo in CI
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1]

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES && repo ? `/${repo}/` : '/',
})
