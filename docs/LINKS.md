# Phenome Picture Stash — Quick Reference

## Links

| What | Link |
|---|---|
| **Live app** | https://phenome-picture-stash.vercel.app |
| **GitHub repo** | https://github.com/felipephenome/phenome-product-shots |
| **Vercel project (dashboard, env vars, deploys)** | https://vercel.com/felipephenomes-projects/phenome-picture-stash |
| **fal.ai dashboard (get/manage API keys)** | https://fal.ai/dashboard/keys |
| **Original Figma design reference** | https://www.figma.com/design/bJXKgXXKYXdoiwdWfBz2tB/-Explorations--Phenome-Longevity?node-id=36-15838 |

## Getting started (local dev)

```bash
git clone https://github.com/felipephenome/phenome-product-shots.git
cd phenome-product-shots
npm install
npm run dev
```

Then open the printed local URL, click the **gear icon** in the header, and paste a fal.ai API key from the dashboard link above.

## Deploying

```bash
npx vercel --prod
```

## Publishing changes

```bash
git add -A
git commit -m "your message"
git push
```

## More detail

See the main [`README.md`](../README.md) at the repo root for full usage instructions, environment variables, project structure, and troubleshooting.
