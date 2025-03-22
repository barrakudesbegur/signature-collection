# Signature collection

A iniciative website for collecting signatures to support a community initiative in Begur. Built with Astro and Tailwind CSS.

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

## 🚚 Deployment

### Option 1: Self hosted

Use `docker compose up -d` to start the app from the server. You will need to expose the port 4321 of the `app` service to access it directly.

If you are using a reverse proxy like Nginx or Caddy, you can expose the port or set them to share the same docker network and use the service name directly.

### Option 2: Third party hosted

Find a service to deploy the astro application, and another to host a libsql database.
