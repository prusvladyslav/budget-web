import { randomUUID } from "crypto";
import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  prefferedStartDate: text("preffered_start_date"),
  prefferedEndDate: text("preffered_end_date"),
});

export const cyclesTable = sqliteTable("cycles", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  dateFrom: text("date_from").notNull(),
  dateTo: text("date_to").notNull(),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const weeksTable = sqliteTable("weeks", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  monthId: text("month_id")
    .notNull()
    .references(() => cyclesTable.id, { onDelete: "cascade" }),
  dateFrom: text("date_from").notNull(),
  dateTo: text("date_to").notNull(),
});

export const categoriesTable = sqliteTable("categories", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  cycleId: text("cycle_id")
    .notNull()
    .references(() => cyclesTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  planned: integer("planned").notNull(),
});

export const expensesTable = sqliteTable("expenses", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  // cycleId: text("cycle_id")
  //   .notNull()
  //   .references(() => cyclesTable.id),
  categoryId: text("category_id")
    .notNull()
    .references(() => categoriesTable.id, { onDelete: "cascade" }),
  weekId: text("week_id")
    .notNull()
    .references(() => weeksTable.id),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date()
  ),
  comment: text("comment"),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertCategory = typeof categoriesTable.$inferInsert;
