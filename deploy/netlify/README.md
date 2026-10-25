# 🌐 Deploying POLARTWIN Frontend to Netlify

This directory contains the deployment configuration and requirements for hosting the **POLARTWIN React 19 + Vite 8 + Three.js Frontend** on **Netlify**.

---

## 📁 Files in this Directory

| File | Purpose |
|---|---|
| `netlify.toml` | Build settings (`base = "frontend"`, `publish = "dist"`, Node 20) and security headers |
| `_redirects` | Single-Page Application (SPA) rewrite rule to prevent 404s on page refresh |
| `package.json` | Exact Node packages & Vite build dependencies required |
| `netlify.env.example` | Environment variables template to link Netlify with the Render backend |

---

## 🚀 How to Deploy on Netlify

1. Go to [app.netlify.com](https://app.netlify.com).
2. Click **Add new site** > **Import an existing project** > **GitHub**.
3. Select your repository. Netlify detects `netlify.toml` automatically:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
4. Under **Environment Variables**, add:
   - `VITE_API_BASE_URL` = `https://<YOUR-RENDER-BACKEND>.onrender.com/api`
   - `VITE_WS_BASE_URL` = `wss://<YOUR-RENDER-BACKEND>.onrender.com`
5. Click **Deploy polartwin**.
