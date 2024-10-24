FROM node:18-bookworm-slim as dependencies

LABEL org.opencontainers.image.title="Briefkasten" \
  org.opencontainers.image.description="Modern Bookmarking Application" \
  org.opencontainers.image.authors="Nico Domino <yo@ndo.dev>" \
  org.opencontainers.image.url="https://briefkastenhq.com" \
  org.opencontainers.image.documentation="https://docs.briefkastenhq.com" \
  org.opencontainers.image.source="https://github.com/ndom91/briefkasten" \
  org.opencontainers.image.version="0.1.0" \
  org.opencontainers.image.licenses="MIT"

# ---- Dependencies ----
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm; \
  pnpm --version; \
  pnpm setup; \
  mkdir -p /usr/local/share/pnpm &&\
  export PNPM_HOME="/usr/local/share/pnpm" &&\
  export PATH="$PNPM_HOME:$PATH";

RUN apt-get update && apt-get install -y python3 make g++

# Copy package and lockfile
COPY package.json pnpm-lock.yaml prisma ./

# install dependencies
RUN pnpm install --frozen-lockfile

# ---- Build ----
FROM node:18-bookworm-slim as build
WORKDIR /app

# Install pnpm
# @TODO: Copy from 'dependencies'
RUN npm install -g pnpm; \
  pnpm --version; \
  pnpm setup; \
  mkdir -p /usr/local/share/pnpm &&\
  export PNPM_HOME="/usr/local/share/pnpm" &&\
  export PATH="$PNPM_HOME:$PATH";

# copy all dependencies
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# openssl for prisma generate
RUN apt-get update && apt-get install -y openssl

# build project
RUN pnpm dlx prisma generate
RUN pnpm build

# ---- Release ----
FROM node:18-bookworm-slim as release
WORKDIR /app

# openssl for prisma
RUN apt-get update && apt-get install -y openssl

# Install pnpm
# @TODO: Copy from 'build'
RUN npm install -g pnpm; \
  pnpm --version; \
  pnpm setup; \
  mkdir -p /usr/local/share/pnpm &&\
  export PNPM_HOME="/usr/local/share/pnpm" &&\
  export PATH="$PNPM_HOME:$PATH";

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN pnpm setup;\
  addgroup --system --gid 1001 nodejs;\
  adduser --system --uid 1001 nextjs

# copy build
COPY --from=build --chown=nextjs:nodejs /app/next.config.mjs ./
COPY --from=build --chown=nextjs:nodejs /app/.next ./.next
COPY --from=build --chown=nextjs:nodejs /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=build --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=build --chown=nextjs:nodejs /app/node_modules ./node_modules

# dont run as root
USER nextjs

# expose and set port number to 3000
EXPOSE 3000
ENV PORT 3000

# enable run as production
ENV NODE_ENV=production

# start app
CMD ["pnpm", "start"]
