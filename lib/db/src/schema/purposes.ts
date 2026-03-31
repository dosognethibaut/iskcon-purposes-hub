import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

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
  approved: boolean("approved").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const messagesTable = pgTable("messages", {
  id: serial("id").primaryKey(),
  purposeId: integer("purpose_id").notNull().references(() => purposesTable.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  authorName: text("author_name").notNull(),
  approved: boolean("approved").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const activityCommentsTable = pgTable("activity_comments", {
  id: serial("id").primaryKey(),
  activityId: integer("activity_id").notNull().references(() => activitiesTable.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  authorName: text("author_name").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const commentsTable = pgTable("comments", {
  id: serial("id").primaryKey(),
  messageId: integer("message_id").notNull().references(() => messagesTable.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  authorName: text("author_name").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertActivitySchema = createInsertSchema(activitiesTable).omit({ id: true, createdAt: true, approved: true });
export const insertMessageSchema = createInsertSchema(messagesTable).omit({ id: true, createdAt: true, approved: true });
export const insertCommentSchema = createInsertSchema(commentsTable).omit({ id: true, createdAt: true });
export const insertActivityCommentSchema = createInsertSchema(activityCommentsTable).omit({ id: true, createdAt: true });

export type Purpose = typeof purposesTable.$inferSelect;
export type Activity = typeof activitiesTable.$inferSelect;
export type Message = typeof messagesTable.$inferSelect;
export type Comment = typeof commentsTable.$inferSelect;
export type ActivityComment = typeof activityCommentsTable.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type InsertActivityComment = z.infer<typeof insertActivityCommentSchema>;
