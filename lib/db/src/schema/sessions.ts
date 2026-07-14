import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { accountsTable } from "./accounts";

export const sessionsTable = pgTable("sessions", {
  id: serial("id").primaryKey(),
  token: text("token").notNull().unique(),
  accountId: integer("account_id")
    .notNull()
    .references(() => accountsTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Session = typeof sessionsTable.$inferSelect;
