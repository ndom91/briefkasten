# 📬 Briefkasten

![GitHub](https://img.shields.io/badge/License-MIT-brightgreen?style=for-the-badge&color=black)
[![Demo](https://img.shields.io/badge/demo-click%20here-brightgreen?style=for-the-badge&color=black)](https://briefkastenhq.com)
[![Demo](https://img.shields.io/badge/docs-click%20here-brightgreen?style=for-the-badge&color=black)](https://docs.briefkastenhq.com)

> [!NOTE]
> This is **Briefkasten v2**, a complete rewrite in SvelteKit. The previous version (v1) is available on the [`v1` branch](https://github.com/ndom91/briefkasten/tree/v1).
>
> If you were using the cloud instance, all of your data has been migrated to the new instance available at the same URL as before.

## 🚀 Getting Started

This is setup as a monorepo with **(1)** `apps/web` being a SvelteKit web application and **(2)** `apps/backend` being a Hono-based API. There are npm scripts in the root `package.json` to control most things.

1. Clone the repository

```sh
$ git clone git@github.com:ndom91/briefkasten.git && cd briefkasten
```

2. Install dependencies

```sh
$ pnpm install
```

This will install the dependencies for both apps.

3. Both `web` and `backend` need separate `.env` files. Copy both `/apps/{web,backend}/.env.example` files to `.env`, and open them with your favorite text editor to fill in your environment variables.

```sh
$ cd apps/web && cp .env.example .env
$ cd apps/backend && cp .env.example .env
```

In these environment variable files, make sure to at least fill in the `DATABASE_URL`, `AUTH_SECRET`, `JWT_SECRET`, `WORKER_URL` and one [Auth.js](https://authjs.dev) authentication provider, so for example `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`. The rest of the environment variables depend on the services / features you want to use.

4. Start the server!

```sh
// First time only; apply the schema to your database
$ pnpm db:push

// dev
$ pnpm dev

// prod
$ pnpm build
$ pnpm start
```

## 🐋 Docker

You can run the entire stack yourself via Docker, there are multiple variants depending on if you want to self-host everything or want to rely on some cloud services.

- `docker-compose.yml` - Containers for the frontend and backend components of the application
- `docker-compose.storage.yml` - Additional `postgres` and `minio` containers for a database and object storage. You can skip this container if you want to use a hosted database provider and an S3-compatible object storage provider, for example.

1. Run web and backend in the background

```sh
docker compose up -d
```

2. Run web and backend and additional database and object storage containers

```sh
docker compose -f docker-compose.yml -f docker-compose.storage.yml up -d
```

3. Run web and backend containers with local code mounted in for development

```sh
docker compose -f docker-compose.local-dev.yml up -d
```

## 👷 Contributing

This project is open to all contributions. Please stick to the repo settings and I'll be happy to take a look at your issue / PR!

## 📝 License

MIT
