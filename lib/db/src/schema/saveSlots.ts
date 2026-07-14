import {
  pgTable,
  serial,
  integer,
  text,
  jsonb,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { accountsTable } from "./accounts";

export const saveSlotsTable = pgTable(
  "save_slots",
  {
    id: serial("id").primaryKey(),
    accountId: integer("account_id")
      .notNull()
      .references(() => accountsTable.id, { onDelete: "cascade" }),
    slot: integer("slot").notNull(),
    name: text("name").notNull(),
    summary: text("summary").notNull().default(""),
    state: jsonb("state").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [unique("save_slots_account_slot_unique").on(t.accountId, t.slot)],
);

export const insertSaveSlotSchema = createInsertSchema(saveSlotsTable).omit({
  id: true,
  updatedAt: true,
});
export type InsertSaveSlot = z.infer<typeof insertSaveSlotSchema>;
export type SaveSlotRow = typeof saveSlotsTable.$inferSelect;
