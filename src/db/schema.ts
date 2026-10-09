import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// PRD §6.1. v1 hanya menyimpan leads; tabel projects ditunda ke v2.
export const leads = sqliteTable(
  "leads",
  {
    id: text("id").primaryKey(), // crypto.randomUUID()
    scope: text("scope").notNull(), // 'landing' | 'webapp' | 'internal'
    visual: text("visual").notNull(), // 'minimal' | 'motion' | 'three'
    backend: text("backend").notNull(), // 'none' | 'db' | 'multirole'
    addons: text("addons", { mode: "json" }).$type<string[]>().notNull().default([]),
    timeline: text("timeline").notNull(), // 'standard' | 'priority'
    estimatedPrice: integer("estimated_price").notNull(), // dihitung di server, Rupiah
    ipHash: text("ip_hash"),
    source: text("source").notNull().default("estimator_wa_click"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    notifiedAt: integer("notified_at", { mode: "timestamp" }),
  },
  (t) => [index("leads_ip_created_idx").on(t.ipHash, t.createdAt)],
);
