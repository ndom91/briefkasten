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

In these environment variable files, make sure to at least fill in the `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `PUBLIC_WORKER_URL` and one [Better Auth](https://www.better-auth.com) authentication provider, so for example `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`. The rest of the environment variables depend on the services / features you want to use.

4. Start the server!

```sh
// First time only; create the schema by applying the migrations
$ pnpm db:deploy

// dev
$ pnpm dev

// prod
$ pnpm build
$ pnpm start
```

> [!NOTE]
> `pnpm db:deploy` runs `prisma migrate deploy` against a **fresh** database. If you are upgrading an existing database whose schema already matches (e.g. a previous v2 instance), baseline it instead with `pnpm --filter sveltekasten-web exec prisma migrate resolve --applied 0_init` so the migration is recorded without re-running the DDL. For quick local iteration you can still use `pnpm db:push` to sync `schema.prisma` directly.

## 🐋 Docker

You can run the entire stack yourself via Docker, there are multiple variants depending on if you want to self-host everything or want to rely on some cloud services.

- `docker-compose.yml` - Containers for the frontend and backend components of the application
- `docker-compose.storage.yml` - Additional `postgres` and `rustfs` containers for a database and S3-compatible object storage. You can skip these if you want to use a hosted database provider and an object storage provider, for example.

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

4. Initialize the database

On first run you need to create the schema. The web container ships without the Prisma CLI, so apply the baseline migration directly to Postgres. If you started the bundled `database` container from `docker-compose.storage.yml`:

```sh
docker compose exec -T database \
  psql -U ${POSTGRES_USER:-postgres} -d ${POSTGRES_DB:-briefkasten} \
  < apps/web/prisma/migrations/0_init/migration.sql
```

If you use an external / managed database instead, apply the same baseline from a checkout of this repo:

```sh
psql "$DATABASE_URL" -f apps/web/prisma/migrations/0_init/migration.sql
# or, with the repo's dependencies installed: pnpm db:deploy
```

## 👷 Contributing

This project is open to all contributions. Please stick to the repo settings and I'll be happy to take a look at your issue / PR!

## 📝 License

MIT
