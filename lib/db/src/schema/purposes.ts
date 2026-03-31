import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const purposesTable = pgTable("purposes", {
  id: serial("id").primaryKey(),
  number: integer("number").notNull(),
  title: text("title").notNull(),
  shortDescription: text("short_description").notNull(),
  fullDescription: text("full_description").notNull(),
  icon: text("icon").notNull(),
});

export const activitiesTable = pgTable("activities", {
  id: serial("id").primaryKey(),
  purposeId: integer("purpose_id").notNull().references(() => purposesTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  authorName: text("author_name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const messagesTable = pgTable("messages", {
  id: serial("id").primaryKey(),
  purposeId: integer("purpose_id").notNull().references(() => purposesTable.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  authorName: text("author_name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertActivitySchema = createInsertSchema(activitiesTable).omit({ id: true, createdAt: true });
export const insertMessageSchema = createInsertSchema(messagesTable).omit({ id: true, createdAt: true });

export type Purpose = typeof purposesTable.$inferSelect;
export type Activity = typeof activitiesTable.$inferSelect;
export type Message = typeof messagesTable.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
