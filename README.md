<img src="public/phenome-logo-full.png" alt="Phenome" width="220" />

# Phenome Picture Stash

An AI product-photography studio in the browser. Upload a product photo, pick a lighting setup and a shot style, and generate polished, on-brand product shots with fal.ai image models — no design or photo studio required.

> "the science of you" — built for Phenome by the Phenome team.

---

## Contents

- [What it does](#what-it-does)
- [How it works](#how-it-works)
- [Quick start](#quick-start)
- [Configuring your fal.ai API key](#configuring-your-falai-api-key)
- [Using the app](#using-the-app)
  - [1. Upload a product photo](#1-upload-a-product-photo)
  - [2. Choose a model](#2-choose-a-model)
  - [3. Add reference images (optional)](#3-add-reference-images-optional)
  - [4. Pick a Product Placement preset](#4-pick-a-product-placement-preset)
  - [5. Dial in lighting](#5-dial-in-lighting)
  - [6. Generate, compare, export](#6-generate-compare-export)
  - [Gallery](#gallery)
- [Project structure](#project-structure)
- [Environment variables](#environment-variables)
- [Local development](#local-development)
- [Deploying to Vercel](#deploying-to-vercel)
- [Troubleshooting](#troubleshooting)
- [Tech stack](#tech-stack)

---

## What it does

Phenome Picture Stash takes a plain product photo (bottle, jar, box, tube, etc.) and turns it into a studio-quality shot by:

1. **Relighting** the product — change the lighting direction, color, intensity, time-of-day mood, and blend mode.
2. **Recomposing** the shot using one of 50+ **Product Placement** presets — things like a bottle mid-toss, capsules cascading out, a flat-lay grid, a macro label close-up, or a lifestyle tabletop scene.
3. Sending the photo (and any extra reference images) to an AI image model on [fal.ai](https://fal.ai) to render the final image.
4. Letting you compare original vs. generated side-by-side, keep a history per workspace, and export the result.

## How it works

- Each uploaded photo becomes its own **workspace** (a tab), with its own lighting settings, product placement, generation history, and reference images.
- A **prompt engine** (`src/services/promptEngine.ts`) turns your lighting/placement settings into a natural-language prompt for the AI model. You can always override the auto-built prompt manually in the Advanced panel.
- Generation requests go through `src/services/falClient.ts`, which talks to fal.ai either directly (using a key from Settings, or `VITE_FAL_KEY` in dev) or through a serverless proxy at `/api/fal` (using the `FAL_KEY` environment variable) so a server key never has to be exposed to the browser.
- Finished generations are saved locally (IndexedDB) and, if Vercel Blob is configured, mirrored to a shared cloud gallery so the whole team can see everyone's outputs.

## Quick start

```bash
git clone https://github.com/felipephenome/phenome-product-shots.git
cd phenome-product-shots
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`), click the gear icon in the header, paste a fal.ai API key, and start uploading images. That's the fastest path — no environment variables required.

## Configuring your fal.ai API key

The app needs a fal.ai API key to generate images. There are two ways to provide one, and you only need one of them:

| Method | Where | Best for |
|---|---|---|
| **In-app Settings (recommended)** | Click the gear icon in the header → paste your key → **Save key** | Anyone running the app, local or deployed. Stored only in your browser's `localStorage`, never sent anywhere except directly to fal.ai. |
| **Server-side env var** | `FAL_KEY` set on your hosting provider (e.g. Vercel project settings) | Shared/team deployments where you don't want every user to need their own key. Requests are routed through the `/api/fal` proxy so the key stays server-side. |

Get a key from the [fal.ai dashboard](https://fal.ai/dashboard/keys).

If **Generate** fails with an unauthorized/401 error, the key saved in Settings is invalid or expired — copy a fresh one, or click **Clear** in Settings to fall back to the server key (if one is configured).

## Using the app

### 1. Upload a product photo

Drag and drop an image onto the canvas, or click to browse. Uploading multiple files at once creates a separate workspace (tab) for each one, so you can work on several products in parallel.

### 2. Choose a model

Pick a generation model from the **Model** dropdown in the sidebar:

| Model | Notes | Cost |
|---|---|---|
| **Nano Banana Pro** | Best quality, full prompt-based control, supports multiple reference images | ~$0.15/img |
| **Quick Relight** | Fast, preset-based lighting styles | ~$0.04/img |
| **IC-Light v2** | Advanced relighting with background control | ~$0.10/mpx |
| **Fibo Relight** | Structured direction + type control | ~$0.04/img |

### 3. Add reference images (optional)

Below the model picker, the **Reference images** panel lets you attach up to 6 extra photos (other angles, packaging close-ups, unboxed contents, etc.). These are only used by **Nano Banana Pro**, which accepts multiple images and uses them to better understand the product's true shape, label, and materials before recomposing the shot. Other models ignore this panel since fal.ai's single-image models only accept one input image.

### 4. Pick a Product Placement preset

The **Picture Stash** panel is a searchable grid of 50+ shot templates grouped into categories like *Hero Still*, *Bottle Toss*, *Capsules Cascade*, *Spill / Pour*, *Levitate*, *Flat Lay*, *Deconstructed*, *Dynamic Tumble*, *Macro Label*, *Tabletop Lifestyle*, *Impact Scatter*, *Studio Sweep*, and *Group Lineup*.

- Click a preset to activate it — its prompt clause gets merged into the auto-built generation prompt.
- Every preset's starting prompt is fully **editable**: select it, edit the text area, and click **Save** to store your own version for that preset (kept per-browser).
- Click **Revert** at any time to restore a preset's original default wording.
- A small dot on a preset tile means you have a custom override saved for it.
- Choose **Relight only** to skip recomposition entirely and just apply lighting changes to the original composition.

### 5. Dial in lighting

Use the light source editor, brightness/intensity sliders, color picker, and day/night toggle to art-direct the mood. The **Advanced** panel exposes additional controls (extra light sources, effects like fog/bloom/godrays, blend modes) plus a raw **Prompt Override** box if you want to write the generation prompt from scratch.

### 6. Generate, compare, export

Click **Generate**. Progress is shown on the button itself (uploading → queued → generating). When done:

- Use the comparison slider / magnifying lens in the viewport to inspect original vs. result.
- Every generation is added to that workspace's history in the **Folder** panel.
- Use the **Toolbar** to download the result as PNG, JPEG, or WebP.

### Gallery

The Gallery (header button) shows every generation that has been persisted to the cloud (Vercel Blob), so teammates can browse each other's outputs across sessions and devices — this only works when `BLOB_READ_WRITE_TOKEN` is configured on the deployment; locally without it, generations still work but only stay in your browser's IndexedDB.

## Project structure

```
src/
  components/
    layout/         Header, MainLayout, ControlPanel (sidebar)
    viewport/        Upload zone, image viewport, comparison slider, magnifier
    controls/        Model selector, product placement, reference images, generate button, light controls
    advanced/        Extra light sources, effects, blend modes, manual prompt override
    settings/        API key Settings panel
    workspace/       Workspace tabs, toolbar (export/download)
    folder/          Per-workspace generation history cards
  services/
    falClient.ts     fal.ai client config + generateRelight()
    promptEngine.ts  Turns LightingSettings + presets into a prompt string
    storageService.ts   IndexedDB persistence (local history)
    blobService.ts   Cloud persistence via /api/blob/*
  stores/            Zustand stores: workspace, lighting, settings (API key), theme
  types/             Shared types + the 50+ PRODUCT_SHOT_PRESETS definitions
api/
  fal/proxy.ts       Serverless proxy that injects FAL_KEY server-side
  blob/*.ts          Upload/list/delete for the cloud gallery (Vercel Blob)
public/              Phenome logo/icon/favicon assets
```

## Environment variables

Copy `.env.example` to `.env.local` for local dev. **None of these are required** — the in-app Settings key covers the common case.

| Variable | Where it's used | Required? |
|---|---|---|
| `VITE_FAL_KEY` | Local dev only (`npm run dev`), as a fallback when no key is saved in Settings | No |
| `FAL_KEY` | Server-side, by the `/api/fal` proxy (`api/fal/proxy.ts`) | Only if you want generation to work for users without their own key in Settings |
| `BLOB_READ_WRITE_TOKEN` | Server-side, by `/api/blob/*` routes for the shared cloud gallery | Only if you want cloud persistence / the shared Gallery |

On Vercel, set these under **Project Settings → Environment Variables** (never commit real keys to `.env` files — they're git-ignored by default).

## Local development

```bash
npm install
npm run dev        # start Vite dev server with HMR
npm run build      # type-check (tsc -b) + production build to dist/
npm run preview    # preview the production build locally
```

## Deploying to Vercel

This repo is already configured for Vercel (see `vercel.json`, which routes `/api/fal*` requests to the proxy function).

```bash
npx vercel --prod
```

The first time, the CLI will prompt you to link the local folder to a Vercel project. After that, set `FAL_KEY` and (optionally) `BLOB_READ_WRITE_TOKEN` in the Vercel dashboard so server-side generation and the cloud gallery work for everyone, not just users who've saved their own key in Settings.

## Troubleshooting

**"Generation failed: ApiError" / unauthorized / 401** — Your fal.ai key is missing or invalid.
- If you saved a key in Settings, it's likely expired or mistyped — grab a fresh one from the [fal.ai dashboard](https://fal.ai/dashboard/keys), or click **Clear** to fall back to the server key.
- If you're relying on the server key, make sure `FAL_KEY` is set in your deployment's environment variables and redeploy.

**Reference images don't seem to change the output** — Reference images are currently only honored by the **Nano Banana Pro** model. Switch models in the sidebar.

**Cloud Gallery is empty / uploads fail silently** — `BLOB_READ_WRITE_TOKEN` isn't configured on this deployment. Generations still work and are saved locally in your browser either way.

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vite.dev/)
- [Zustand](https://github.com/pmndrs/zustand) for state management (with `persist` for Settings/Theme)
- [Tailwind CSS](https://tailwindcss.com/) + Sass, themed with Phenome's brand colors and Inter/Fraunces typefaces
- [@fal-ai/client](https://fal.ai/) for AI image generation (Nano Banana Pro, IC-Light v2, Fibo Relight, and more)
- [Vercel](https://vercel.com/) for hosting + serverless API routes + [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) for the shared cloud gallery
- [idb-keyval](https://github.com/jakearchibald/idb-keyval) for local IndexedDB history
