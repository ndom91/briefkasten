###########################
#     BASE CONTAINER      #
###########################
FROM node:24-bookworm-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Enable pnpm
RUN corepack enable

###########################
#    BUILDER CONTAINER    #
###########################
FROM base AS build
COPY . /app
WORKDIR /app

RUN mkdir -p /prod/web \
  && mkdir -p /prod/backend
 
# Install openssl for prisma
RUN apt-get update -qq \
  && apt-get install -y openssl git

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Generate prisma client
RUN cd apps/backend && pnpm exec prisma generate
RUN cd apps/web && pnpm exec prisma generate

RUN pnpm run -r build \
  && pnpm deploy --legacy --filter=sveltekasten-web --prod /prod/web \
  && pnpm deploy --legacy --filter=sveltekasten-backend --prod /prod/backend

###########################
#      WEB CONTAINER      #
###########################
FROM base AS web

ENV NODE_ENV production
 
# Install openssl for prisma
RUN apt-get update -qq \
  && apt-get install -y openssl

COPY --chown=node:node --from=build /prod/web /prod/web

# No prisma generate here: the build stage already generated the client (with
# engineType = "client", Rust-free) and vite bundled it into build/. The prod
# deploy excludes devDeps (prisma + prisma-zod-generator), so regenerating here
# would fail ("prisma-zod-generator: not found") and is unnecessary.

WORKDIR /prod/web
EXPOSE ${PORT:-3000}
# Run node directly, not `pnpm start`: pnpm would run a deps-status check that
# reinstalls + triggers the `prepare` (svelte-kit sync) script, which needs
# devDeps (vite) and git that aren't in the prod image. Env is injected by
# compose `env_file:`.
CMD [ "node", "build/index.js" ]

###########################
#    BACKEND CONTAINER    #
###########################
FROM base AS backend

ENV NODE_ENV production

# Install openssl for prisma
RUN apt-get update -qq \
  && apt-get install -y openssl

COPY --chown=node:node --from=build /prod/backend /prod/backend

# Install the Playwright browser the backend needs at runtime.
# Call the binary directly, NOT via `pnpm exec` - `pnpm exec` runs a deps-status
# check that re-installs in /prod/backend (re-pulling devDeps and failing on
# ERR_PNPM_IGNORED_BUILDS, since the allowBuilds config lives in the workspace
# root which isn't part of the deployed single package).
RUN cd /prod/backend \
  && node_modules/.bin/playwright install --with-deps chromium

WORKDIR /prod/backend
EXPOSE ${PORT:-8000}
# Run node directly, not `pnpm start` (avoids pnpm's runtime deps-status check /
# reinstall). Env is injected by compose `env_file:`.
CMD [ "node", "dist/index.js" ]
