# Legacy Nuxt 2 app (deprecated)

All Vue/Nuxt source lives **in this directory** — not repo root.

```
apps/legacy/
├── components/   # Vue SFC + JSX panels
├── layouts/
├── pages/        # file-based routes
├── plugins/
├── services/
├── store/        # Vuex
├── static/       # json, less, lang, icons
├── nuxt.config.js
├── app.json      # Heroku-style deploy metadata
└── pm2.json
```

```bash
# from repo root
npm run dev:legacy
```

Default Nuxt dev port: **3000** (unchanged from original app).

Remove this package once vinext cutover is complete.
