import { pgTable, date, varchar, integer} from "drizzle-orm/pg-core";

export const childrens = pgTable("childrens", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  full_name: varchar("full_name", { length: 100 }).notNull(),
  class_id: integer("class_id").notNull(),
  birth_date: date("birth_date").notNull(),
  category: varchar("category", { length: 50 }),
  guardian_name: varchar("guardian_name", { length: 100 }),
  notes: varchar("notes", { length: 20 }).default("Mẹ"),
  amount: integer("amount").notNull().default(0),
  month: integer("month").notNull().default(0),
  total: integer("total").notNull().default(0),
  bank_number: varchar("bank_number", { length: 15 }),
  bank_name: varchar("bank_name", { length: 15 }),
  status: varchar("status", { length: 20 }).default("Đang học"),
});

export const classes = pgTable("classes", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  class_name: varchar("class_name", { length: 30 }).notNull(),
  quantity: integer("quantity").notNull().default(0),
});

export const employees = pgTable("employees", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  full_name: varchar("full_name", { length: 100 }).notNull(),
  birth_date: date("birth_date").notNull(),
});