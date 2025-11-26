import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
// import fs from "fs"
// import path from "path"
// import { fileURLToPath } from "url"

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

const isLocal = process.env.NODE_ENV !== "production"

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  // server: {
  //       allowedHosts: ['cc1b8bb1502d.ngrok-free.app'] // Allows any subdomain under ngrok-free.app
  // }
  server: isLocal
    ? {
        // https: {
        //   key: fs.readFileSync(path.resolve(__dirname, "certs/key.pem")),
        //   cert: fs.readFileSync(path.resolve(__dirname, "certs/cert.pem")),
        // },
        host: "localhost",
        port: 5173,
      }
    : {
        host: "0.0.0.0",
        port: 5173,
      },
})
