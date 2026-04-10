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

## 🔓 Exporting signator data

Signator ID documents are stored RSA-OAEP encrypted. The server only holds the **public** key (to encrypt new records); the **private** key must be kept off-server so a compromised server can't read the data. Exporting is a two-step process: a safe encrypted export you can archive anywhere (e.g. Google Drive), and a local-only decryption step.

### Initial setup (once)

1. Generate a keypair with `generateKeys()` from [src/utils/encryption.ts](src/utils/encryption.ts).
2. Put `BASE64_ENCODED_ENCRYPT_KEY` (public) in the server's `.env`.
3. Store `BASE64_ENCODED_DECRYPT_KEY` (private) in a safe place (password manager, offline backup). **Do not** put it on the server or commit it.

### Step 1 — Export (encrypted, safe to archive)

1. Copy the `data/` folder from the server to your local machine.
2. Run `bash scripts/export.sh` — writes a timestamped file like `exports/signators-YYYYMMDD-HHMMSS.csv` with the ID documents still encrypted.
3. The file is safe to upload to Google Drive, etc. No private key needed for this step.

### Step 2 — Decrypt (local only, when you need the data)

1. Add `BASE64_ENCODED_DECRYPT_KEY="..."` to your local `.env`, using the private key from your safe storage.
2. Run `bash scripts/decrypt-csv.sh exports/signators-<timestamp>.csv` — writes `exports/signators-<timestamp>-decrypted.csv` next to it. An explicit output path can be passed as a second argument.
3. Delete the decrypted file (and the private key from `.env`) when you're done. The `exports/` folder is git-ignored.

To decrypt a single value instead, use `bash scripts/decrypt.sh <encrypted_string>`.
