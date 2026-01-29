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

// Design Settings - For customizing website appearance
export const designSettings = pgTable("design_settings", {
  id: serial("id").primaryKey(),
  // Colors
  primaryColor: text("primary_color").default("#3b82f6"), // Blue
  secondaryColor: text("secondary_color").default("#8b5cf6"), // Purple
  backgroundColor: text("background_color").default("#ffffff"), // White
  textColor: text("text_color").default("#1f2937"), // Dark gray
  buttonColor: text("button_color").default("#3b82f6"), // Blue
  buttonTextColor: text("button_text_color").default("#ffffff"), // White
  
  // Typography
  fontFamily: text("font_family").default("Inter"), // Default font
  headingFont: text("heading_font").default("Inter"),
  fontSize: text("font_size").default("medium"), // small, medium, large
  
  // Layout
  layoutStyle: text("layout_style").default("modern"), // modern, classic, minimal
  borderRadius: text("border_radius").default("medium"), // none, small, medium, large
  
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertDesignSettingsSchema = createInsertSchema(designSettings).omit({ 
  id: true, 
  updatedAt: true 
});

// Recovery Codes - For password reset
export const recoveryCodes = pgTable("recovery_codes", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertRecoveryCodeSchema = createInsertSchema(recoveryCodes).omit({ 
  id: true, 
  createdAt: true 
});

// Types
export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;

export type SocialLink = typeof socialLinks.$inferSelect;
export type InsertSocialLink = z.infer<typeof insertSocialLinkSchema>;

export type AutomationLink = typeof automationLinks.$inferSelect;
export type InsertAutomationLink = z.infer<typeof insertAutomationLinkSchema>;

export type AboutMe = typeof aboutMe.$inferSelect;
export type InsertAboutMe = z.infer<typeof insertAboutMeSchema>;

export type DesignSettings = typeof designSettings.$inferSelect;
export type InsertDesignSettings = z.infer<typeof insertDesignSettingsSchema>;

export type RecoveryCode = typeof recoveryCodes.$inferSelect;
export type InsertRecoveryCode = z.infer<typeof insertRecoveryCodeSchema>;
