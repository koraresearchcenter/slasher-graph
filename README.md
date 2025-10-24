# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

## 🚀 Project Structure


```
/
├── public/
│   ├── data3.json          # Slasher data
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Hero.astro      # Hero section
│   │   └── P5Background.astro  # Animated background
│   ├── layouts/
│   │   └── Layout.astro    # Base layout with GA
│   ├── pages/
│   │   └── index.astro     # Main page
│   ├── styles/
│   │   └── global.css      # All styles
│   └── script.js           # Chart.js & interactions
├── astro.config.mjs
└── package.json
```


Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
