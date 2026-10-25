# 🚀 POLARTWIN Deployment Guide: Render (Backend) & Netlify (Frontend)

This guide walks you through deploying the **POLARTWIN Antarctic Digital Twin** to production:
- **Backend**: Hosted on **Render** using **Docker** (FastAPI, WebSockets, Physics Engine, AI)
- **Frontend**: Hosted on **Netlify** (React 19, TypeScript, Vite 8, Three.js 3D Twin)

---

## 📋 Architecture & Data Flow

```
[ User Browser ]
       │
       ├─── HTTPS (Static Assets / React App) ───► [ Netlify CDN ]
       │
       ├─── REST API Requests (HTTPS) ───────────► [ Render Web Service (Docker) ]
       └─── Real-Time Telemetry (WSS) ───────────►   FastAPI + Uvicorn + SQLite/PostgreSQL
```

---

## 🛠️ Step 1: Push Code to GitHub

Render and Netlify both deploy directly from your GitHub repository.

1. Open PowerShell / Terminal in the project root:
   ```bash
   cd c:\Users\chait\Downloads\polartwin-demo-main\polartwin-demo-main
   ```

2. Initialize Git (if not already done) and commit:
   ```bash
   git init
   git add .
   git commit -m "feat: configure Docker for Render and SPA routing for Netlify"
   ```

3. Create a new repository on [GitHub](https://github.com/new) (e.g. `polartwin-demo`) and push:
   ```bash
   git remote add origin https://github.com/<your-username>/polartwin-demo.git
   git branch -M main
   git push -u origin main
   ```

---

## 🐳 Step 2: Deploy Backend to Render (Docker)

### Method A: Blueprint Deploy (Automatic - Recommended)
1. Go to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** > **Blueprint**.
3. Connect your GitHub repository `polartwin-demo`.
4. Render will detect `render.yaml` automatically.
5. Click **Apply**. Render will automatically build the Docker image and deploy.

---

### Method B: Manual Web Service Setup
1. Go to [Render Dashboard](https://dashboard.render.com) > **New +** > **Web Service**.
2. Connect your repository.
3. Configure the following settings:
   - **Name**: `polartwin-backend`
   - **Region**: Choose the closest region (e.g., Oregon or Frankfurt)
   - **Branch**: `main`
   - **Root Directory**: Leave blank (or enter `backend`)
   - **Runtime**: **Docker**
   - **Dockerfile Path**: `./backend/Dockerfile` (or `./Dockerfile`)
   - **Instance Type**: **Free** (or Starter for non-sleeping instances)

4. **Environment Variables** (under *Advanced*):
   *(Note: No database is required! The backend runs entirely in-memory in RAM).*
   | Key | Value | Notes |
   |---|---|---|
   | `JWT_SECRET` | *(Any random string, e.g. `polartwin-prod-secret-2026`)* | App security key |
   | `SIMULATION_TICK_SECONDS` | `4` | Telemetry tick interval |
   | `FRONTEND_ORIGIN` | `https://<your-netlify-app>.netlify.app` | Netlify domain (Netlify regex already pre-configured) |

5. Click **Deploy Web Service**.
6. When deployment finishes, copy your Render URL:
   - Example: `https://polartwin-backend.onrender.com`

> **Note on Free Tier Sleeping**: Render's free tier spins down after 15 minutes of inactivity. When a request arrives, it takes ~45 seconds to wake up. Once awake, the 4-second simulation tick and WebSockets run continuously.

---

## 🌐 Step 3: Deploy Frontend to Netlify

1. Go to [Netlify Dashboard](https://app.netlify.com).
2. Click **Add new site** > **Import an existing project** > **GitHub**.
3. Select your repository `polartwin-demo`.
4. Netlify will automatically detect settings from `netlify.toml`:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist` (or `dist`)
5. Click **Add environment variables** and enter:
   | Key | Value | Example |
   |---|---|---|
   | `VITE_API_BASE_URL` | `https://<your-render-url>/api` | `https://polartwin-backend.onrender.com/api` |
   | `VITE_WS_BASE_URL` | `wss://<your-render-url>` | `wss://polartwin-backend.onrender.com` |

   *(Notice the `wss://` secure WebSocket prefix — mandatory when the frontend is served over HTTPS!)*

6. Click **Deploy polartwin**.
7. Once deployed, Netlify will provide your live site URL:
   - Example: `https://polartwin-demo.netlify.app`

---

## 🔄 Step 4: Final CORS Verification

The backend is configured with:
- `allow_origin_regex=r"^https?://([a-zA-Z0-9_-]+\.)*netlify\.app$"`: This automatically permits any Netlify app domain.
- If you use a custom domain (e.g., `https://polartwin.yourdomain.com`), set `FRONTEND_ORIGIN=https://polartwin.yourdomain.com` in Render's environment variables.

---

## 🔓 Direct Open Access (No Login Required)

The application is configured for **immediate open access**:
- Anyone visiting the Netlify URL is directly routed into the live digital twin console.
- Full access to all 16 operational domains, 3D Spatial Twin, What-If simulation sandbox, optimization engine, and administrative controls is granted automatically without prompting for credentials.
- All WebSockets and API endpoints connect and stream without requiring JWT authentication.
