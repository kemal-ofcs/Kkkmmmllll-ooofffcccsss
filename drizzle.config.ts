import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "turso",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL ?? "", // generate tidak butuh kredensial
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
});
