import { 
  jobs, socialLinks, automationLinks, aboutMe, designSettings,
  type Job, type InsertJob, 
  type SocialLink, type InsertSocialLink,
  type AutomationLink, type InsertAutomationLink,
  type AboutMe, type InsertAboutMe,
  type DesignSettings, type InsertDesignSettings
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, count } from "drizzle-orm";

export interface IStorage {
  // Jobs
  getJobs(search?: string): Promise<Job[]>;
  getJob(id: number): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: number, job: Partial<InsertJob>): Promise<Job>;
  trackJobClick(id: number): Promise<void>;
  
  // Stats
  getStats(): Promise<{
    jobsPosted: number;
    jobsActive: number;
    jobsInactive: number;
    mostSearchedJobs: Job[];
    mostClickedJobs: Job[];
  }>;

  // Social Links
  getSocialLinks(): Promise<SocialLink[]>;
  createSocialLink(link: InsertSocialLink): Promise<SocialLink>;
  deleteSocialLink(id: number): Promise<void>;

  // Automation Links
  getAutomationLinks(): Promise<AutomationLink[]>;
  createAutomationLink(link: InsertAutomationLink): Promise<AutomationLink>;
  deleteAutomationLink(id: number): Promise<void>;

  // About Me
  getAboutMe(): Promise<AboutMe | undefined>;
  updateAboutMe(content: InsertAboutMe): Promise<AboutMe>;

  // Design Settings
  getDesignSettings(): Promise<DesignSettings | undefined>;
  updateDesignSettings(settings: Partial<InsertDesignSettings>): Promise<DesignSettings>;
}

export class DatabaseStorage implements IStorage {
  async getJobs(search?: string): Promise<Job[]> {
    if (search) {
      return await db.select().from(jobs)
        .where(sql`lower(${jobs.title}) LIKE ${`%${search.toLowerCase()}%`}`)
        .orderBy(desc(jobs.createdAt));
    }
    return await db.select().from(jobs).orderBy(desc(jobs.createdAt));
  }

  async getJob(id: number): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job;
  }

  async createJob(job: InsertJob): Promise<Job> {
    const [newJob] = await db.insert(jobs).values(job).returning();
    return newJob;
  }

  async updateJob(id: number, jobUpdates: Partial<InsertJob>): Promise<Job> {
    const [updatedJob] = await db
      .update(jobs)
      .set({ ...jobUpdates, updatedAt: new Date() })
      .where(eq(jobs.id, id))
      .returning();
    return updatedJob;
  }

  async trackJobClick(id: number): Promise<void> {
    await db
      .update(jobs)
      .set({ clickCount: sql`${jobs.clickCount} + 1` })
      .where(eq(jobs.id, id));
  }

  async getStats() {
    const [total] = await db.select({ count: count() }).from(jobs);
    const [active] = await db.select({ count: count() }).from(jobs).where(eq(jobs.status, "Active"));
    const [inactive] = await db.select({ count: count() }).from(jobs).where(eq(jobs.status, "Inactive"));
    
    // Most Searched (using searchCount logic, assuming we increment it on detail view or search match)
    const mostSearched = await db.select().from(jobs).orderBy(desc(jobs.searchCount)).limit(5);
    
    // Most Clicked
    const mostClicked = await db.select().from(jobs).orderBy(desc(jobs.clickCount)).limit(5);

    return {
      jobsPosted: total?.count || 0,
      jobsActive: active?.count || 0,
      jobsInactive: inactive?.count || 0,
      mostSearchedJobs: mostSearched,
      mostClickedJobs: mostClicked,
    };
  }

  async getSocialLinks(): Promise<SocialLink[]> {
    return await db.select().from(socialLinks);
  }

  async createSocialLink(link: InsertSocialLink): Promise<SocialLink> {
    const [newLink] = await db.insert(socialLinks).values(link).returning();
    return newLink;
  }

  async deleteSocialLink(id: number): Promise<void> {
    await db.delete(socialLinks).where(eq(socialLinks.id, id));
  }

  async getAutomationLinks(): Promise<AutomationLink[]> {
    return await db.select().from(automationLinks);
  }

  async createAutomationLink(link: InsertAutomationLink): Promise<AutomationLink> {
    const [newLink] = await db.insert(automationLinks).values(link).returning();
    return newLink;
  }

  async deleteAutomationLink(id: number): Promise<void> {
    await db.delete(automationLinks).where(eq(automationLinks.id, id));
  }

  async getAboutMe(): Promise<AboutMe | undefined> {
    const [data] = await db.select().from(aboutMe).limit(1);
    return data;
  }

  async updateAboutMe(content: InsertAboutMe): Promise<AboutMe> {
    // Upsert logic (always ID 1 or just one row)
    // Let's check if exists
    const existing = await this.getAboutMe();
    if (existing) {
      const [updated] = await db.update(aboutMe).set(content).where(eq(aboutMe.id, existing.id)).returning();
      return updated;
    } else {
      const [created] = await db.insert(aboutMe).values(content).returning();
      return created;
    }
  }

  async getDesignSettings(): Promise<DesignSettings | undefined> {
    const [data] = await db.select().from(designSettings).limit(1);
    return data;
  }

  async updateDesignSettings(settings: Partial<InsertDesignSettings>): Promise<DesignSettings> {
    const existing = await this.getDesignSettings();
    if (existing) {
      const [updated] = await db
        .update(designSettings)
        .set({ ...settings, updatedAt: new Date() })
        .where(eq(designSettings.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(designSettings).values(settings).returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage();
