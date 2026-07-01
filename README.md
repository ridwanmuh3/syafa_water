# Syafa Water Demo

TanStack Start, React, TypeScript, and Tailwind CSS v4 demo MVP for Syafa Water operations. Data is in-memory demo data; no external service required.

## Structure

```text
src/                  TanStack Start application
```

## Setup

Requirements: Node.js 24.x, npm, and Make.

```bash
cp .env.example .env
npm install
npm run dev
```

Application runs at `http://127.0.0.1:3000`.

## Demo Account

- Username: `admin`
- Password: `admin123`

## Deploy

```bash
npm install
npm run build
npm run start
```

Required deploy environment:

```text
SESSION_SECRET=replace-with-at-least-32-characters
```

### Vercel

This app is configured for Vercel through Nitro and `vercel.json`.

Project settings:

```text
Framework Preset: Other
Install Command: npm ci
Build Command: npm run build
Node.js Version: 24.x
```

Required Vercel environment variable:

```text
SESSION_SECRET=replace-with-at-least-32-characters
```

The current demo store is in memory. Data changes are shared across sections during a running server instance, but they reset on a fresh deployment or serverless cold start.

Docker build:

```bash
docker build -t syafa-water-demo .
docker run --rm -p 3000:3000 \
  -e SESSION_SECRET=replace-with-at-least-32-characters \
  syafa-water-demo
```

Common commands:

```bash
make help
make dev
make check
```
