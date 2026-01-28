import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Export auth models
export * from "./models/auth";

// Jobs Table
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  type: text("type").notNull(), // 'Full-time', 'Part-time', etc.
  status: text("status").notNull().default("Active"), // 'Active', 'Inactive', 'Hidden'
  clickCount: integer("click_count").default(0),
  searchCount: integer("search_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  clickCount: true,
  searchCount: true
});

// Social Media Links (Contact Section)
export const socialLinks = pgTable("social_links", {
  id: serial("id").primaryKey(),
  platform: text("platform").notNull(),
  url: text("url").notNull(),
  isVisible: boolean("is_visible").default(true),
});

export const insertSocialLinkSchema = createInsertSchema(socialLinks).omit({ id: true });

// Automation Websites (Admin Dashboard)
export const automationLinks = pgTable("automation_links", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  isVisible: boolean("is_visible").default(true),
});

export const insertAutomationLinkSchema = createInsertSchema(automationLinks).omit({ id: true });

// About Me
export const aboutMe = pgTable("about_me", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
});

export const insertAboutMeSchema = createInsertSchema(aboutMe).omit({ id: true });

// Types
export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;

export type SocialLink = typeof socialLinks.$inferSelect;
export type InsertSocialLink = z.infer<typeof insertSocialLinkSchema>;

export type AutomationLink = typeof automationLinks.$inferSelect;
export type InsertAutomationLink = z.infer<typeof insertAutomationLinkSchema>;

export type AboutMe = typeof aboutMe.$inferSelect;
export type InsertAboutMe = z.infer<typeof insertAboutMeSchema>;
