import path from "node:path"
import { defineConfig } from "prisma/config"

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  datasource: {
    // process.env (not prisma's env()) so `prisma generate` works without
    // DATABASE_URL set, e.g. during docker build. migrate/db commands still
    // need it set at runtime.
    url: process.env.DATABASE_URL ?? "",
  },
})
