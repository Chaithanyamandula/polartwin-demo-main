# 🧊 Deploying POLARTWIN Backend to Render (Docker)

This directory contains the deployment assets and requirements for hosting the **POLARTWIN FastAPI + WebSocket + Physics Simulation Engine** on **Render**.

---

## 📁 Files in this Directory

| File | Purpose |
|---|---|
| `Dockerfile` | Multi-stage Python 3.11 Docker container configured for Render |
| `.dockerignore` | Build optimization rules ignoring non-backend assets |
| `requirements.txt` | Python dependencies required for the containerized backend |
| `render.yaml` | Render Blueprint specification for 1-click deployment |
| `render.env.example` | Environment variable reference for Render |

---

## 🚀 How to Deploy on Render

### Option A: Using Render Blueprint (1-Click)
1. Go to [dashboard.render.com](https://dashboard.render.com).
2. Click **New +** > **Blueprint**.
3. Select your repository. Render automatically reads `render.yaml`.
4. Click **Apply**.

### Option B: Manual Web Service
1. Go to [dashboard.render.com](https://dashboard.render.com) > **New +** > **Web Service**.
2. Connect your repository.
3. Configure:
   - **Name**: `polartwin-backend`
   - **Runtime**: **Docker**
   - **Dockerfile Path**: `./backend/Dockerfile` (or `./deploy/render/Dockerfile`)
   - **Instance Type**: **Free**
4. Under **Environment Variables**, add:
   *(No database required — runs purely in RAM)*
   - `JWT_SECRET` = *(Any random string, e.g. `polartwin-prod-secret-2026`)*
   - `SIMULATION_TICK_SECONDS` = `4`
5. Click **Deploy Web Service**.
6. Once deployed, copy your backend URL (e.g. `https://polartwin-backend.onrender.com`).
