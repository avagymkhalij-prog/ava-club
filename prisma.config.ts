import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  datasource: {
    url: process.env.DATABASE_URL
      ? process.env.DATABASE_URL.replace("file:./", "file:./prisma/")
      : "file:./prisma/dev.db",
  },
});
