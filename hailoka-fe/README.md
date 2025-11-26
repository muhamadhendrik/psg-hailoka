# 🚀 Project Overview
Hailoka Frontend

🧩 Tech Stack

| **Category**                      | **Technology / Library**                                                        | **Description**                                              |
| --------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| 🟢 **Frontend Framework**         | [Vue 3](https://vuejs.org/)                                                     | Progressive JavaScript framework with Composition API        |
|                                   | [Vite](https://vitejs.dev/)                                                     | Next-generation frontend tooling for fast builds and HMR     |
|                                   | [TypeScript](https://www.typescriptlang.org/)                                   | Strongly-typed JavaScript for safer and scalable development |
| 🎨 **UI & Styling**               | [PrimeVue](https://primevue.org/)                                               | Rich UI component library for Vue 3                          |
|                                   | [PrimeFlex](https://primeflex.org/)                                             | Utility-first CSS library for layout and spacing             |
|                                   | [PrimeIcons](https://www.primefaces.org/primeicons/)                            | Icon pack for PrimeVue components                            |
|                                   | [Tailwind CSS](https://tailwindcss.com/)                                        | Utility-first CSS framework for rapid UI development         |
|                                   | [@primeuix/themes](https://www.primefaces.org/primeuix/)                        | Theme and style utilities for PrimeVue                       |
| 🧭 **State Management & Routing** | [Pinia](https://pinia.vuejs.org/)                                               | Official Vue state management library                        |
|                                   | [Vue Router](https://router.vuejs.org/)                                         | Official router for Vue.js applications                      |
| 🌐 **Utilities & APIs**           | [Axios](https://axios-http.com/)                                                | Promise-based HTTP client for REST API calls                 |
|                                   | [Google One Tap](https://developers.google.com/identity/one-tap/web)            | Easy one-tap sign-in authentication                          |
|                                   | [@zxing/library](https://github.com/zxing-js/library)                           | Barcode and QR code processing library                       |
|                                   | [html5-qrcode](https://github.com/mebjas/html5-qrcode)                          | QR code scanner using HTML5 camera API                       |
|                                   | [vue-qrcode-reader](https://gruhn.github.io/vue-qrcode-reader/)                 | Vue component for QR scanning                                |
|                                   | [RxJS](https://rxjs.dev/)                                                       | Reactive programming utilities for handling async streams    |
| 🧩 **Icons & Enhancements**       | [@iconify/vue](https://iconify.design/docs/vue/)                                | Universal icon component supporting thousands of icon sets   |
| 🛠️ **Development Tools**         | [Vue TSC](https://github.com/vuejs/language-tools/tree/master/packages/vue-tsc) | Type-checking for Vue single-file components                 |
|                                   | [@vitejs/plugin-vue](https://vitejs.dev/guide/features.html#vue)                | Official Vite plugin to support Vue SFCs                     |
|                                   | [@vue/tsconfig](https://github.com/vuejs/tsconfig)                              | Recommended TypeScript configurations for Vue projects       |
| 📦 **Package Management**         | [pnpm](https://pnpm.io/)                                                        | Fast and efficient Node.js package manager                   |

# Instalasi & Running Docker Container

### 1. clone repository
```
git clone https://github.com/PT-Pasifik-Hoki-Indonesia/hailoka-fe.git
```

### 2. CD into hailoka-fe and create .env file
```bash
# cd into directory
cd hailoka-fe

# create .env file
nano .env
```

**Variables .env**
```bash

VITE_API_URL=https://hailoka-be.pasifiksgroup.com:8443

# google client id untuk google auth
VITE_GOOGLE_CLIENT_ID=
```

### 3. Run Docker container
```bash
sudo docker compose up --build -d
```

# RUN on local without docker

### 1. Install dependency
```bash
pnpm install
```

### 2. Create .env file 

### 2. Run Development:
```bash
pnpm run dev
```

The App will run on `http://localhost:5173`

