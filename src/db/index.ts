import "server-only";
import { drizzle } from "drizzle-orm/libsql/http";
import * as schema from "./schema";

const url = process.env.TURSO_DATABASE_URL;
if (!url) throw new Error("TURSO_DATABASE_URL belum diisi (lihat .env.example)");

export const db = drizzle({
  connection: { url, authToken: process.env.TURSO_AUTH_TOKEN },
  schema,
});
