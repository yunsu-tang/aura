import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  stage: text("stage").notNull(), // 'lust', 'labor', 'loyal', 'dead'
  lastContact: timestamp("last_contact").notNull(),
  lastMessage: text("last_message"),
  emotionalROI: integer("emotional_roi").notNull(), // 0-100
  aiSuggestion: text("ai_suggestion"),
  position: integer("position").notNull(), // for drag-and-drop ordering
});

export const emotionalCheckins = pgTable("emotional_checkins", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  confident: integer("confident").notNull(), // 1 for yes, 0 for no
  tookAction: integer("took_action").notNull(),
  readyToConnect: integer("ready_to_connect").notNull(),
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
});

export const insertCheckinSchema = createInsertSchema(emotionalCheckins).omit({
  id: true,
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;
export type InsertCheckin = z.infer<typeof insertCheckinSchema>;
export type Checkin = typeof emotionalCheckins.$inferSelect;

// Users table for compatibility
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
