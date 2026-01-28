import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAdmin } from "./auth";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth Setup
  await setupAuth(app);

  // Helper to check admin status (using our new auth middleware)
  const requireAdmin = isAdmin;

  // Jobs
  app.get(api.jobs.list.path, async (req, res) => {
    const search = req.query.search as string | undefined;
    const jobs = await storage.getJobs(search);
    res.json(jobs);
  });

  app.get(api.jobs.get.path, async (req, res) => {
    const job = await storage.getJob(Number(req.params.id));
    if (!job) return res.status(404).json({ message: "Job not found" });
    // Increment searchCount as a proxy for view count
    // await storage.updateJob(job.id, { searchCount: (job.searchCount || 0) + 1 }); 
    // Actually, let's keep it simple.
    res.json(job);
  });

  app.post(api.jobs.create.path, requireAdmin, async (req, res) => {
    try {
      const input = api.jobs.create.input.parse(req.body);
      const job = await storage.createJob(input);
      res.status(201).json(job);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.put(api.jobs.update.path, requireAdmin, async (req, res) => {
    try {
      const input = api.jobs.update.input.parse(req.body);
      const job = await storage.updateJob(Number(req.params.id), input);
      if (!job) return res.status(404).json({ message: "Job not found" });
      res.json(job);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.post(api.jobs.trackClick.path, async (req, res) => {
    await storage.trackJobClick(Number(req.params.id));
    res.json({ success: true });
  });

  // Admin Stats
  app.get(api.admin.stats.path, requireAdmin, async (req, res) => {
    const stats = await storage.getStats();
    res.json(stats);
  });

  // Social Links
  app.get(api.socialLinks.list.path, async (req, res) => {
    const links = await storage.getSocialLinks();
    res.json(links);
  });

  app.post(api.socialLinks.create.path, requireAdmin, async (req, res) => {
    const input = api.socialLinks.create.input.parse(req.body);
    const link = await storage.createSocialLink(input);
    res.status(201).json(link);
  });

  app.delete(api.socialLinks.delete.path, requireAdmin, async (req, res) => {
    await storage.deleteSocialLink(Number(req.params.id));
    res.status(204).send();
  });

  // Automation Links
  app.get(api.automationLinks.list.path, requireAdmin, async (req, res) => {
    const links = await storage.getAutomationLinks();
    res.json(links);
  });

  app.post(api.automationLinks.create.path, requireAdmin, async (req, res) => {
    const input = api.automationLinks.create.input.parse(req.body);
    const link = await storage.createAutomationLink(input);
    res.status(201).json(link);
  });

  app.delete(api.automationLinks.delete.path, requireAdmin, async (req, res) => {
    await storage.deleteAutomationLink(Number(req.params.id));
    res.status(204).send();
  });

  // About Me
  app.get(api.aboutMe.get.path, async (req, res) => {
    const about = await storage.getAboutMe();
    res.json(about || null);
  });

  app.post(api.aboutMe.update.path, requireAdmin, async (req, res) => {
    const input = api.aboutMe.update.input.parse(req.body);
    const about = await storage.updateAboutMe(input);
    res.json(about);
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const jobs = await storage.getJobs();
  if (jobs.length === 0) {
    await storage.createJob({
      title: "Senior Frontend Developer",
      description: "We are looking for an experienced React developer to join our team. You will be building modern web applications using the latest technologies.",
      location: "Remote",
      type: "Full-time",
      status: "Active"
    });
    await storage.createJob({
      title: "Backend Engineer (Node.js)",
      description: "Join our backend team to build scalable APIs and microservices. Experience with Node.js, PostgreSQL, and Docker required.",
      location: "New York, NY",
      type: "Full-time",
      status: "Active"
    });
    await storage.createJob({
      title: "Product Designer",
      description: "Design intuitive user interfaces and experiences for our products. Must have a strong portfolio.",
      location: "San Francisco, CA",
      type: "Contract",
      status: "Active"
    });
    await storage.createJob({
      title: "DevOps Specialist",
      description: "Manage our cloud infrastructure and CI/CD pipelines. AWS and Kubernetes experience preferred.",
      location: "Remote",
      type: "Part-time",
      status: "Inactive"
    });
  }

  const about = await storage.getAboutMe();
  if (!about) {
    await storage.updateAboutMe({
      content: "Hello! I'm a passionate developer with over 5 years of experience in building web applications. I love solving complex problems and creating beautiful, user-friendly interfaces. Connect with me to learn more!"
    });
  }

  const socialLinks = await storage.getSocialLinks();
  if (socialLinks.length === 0) {
    await storage.createSocialLink({ platform: "LinkedIn", url: "https://linkedin.com", isVisible: true });
    await storage.createSocialLink({ platform: "GitHub", url: "https://github.com", isVisible: true });
    await storage.createSocialLink({ platform: "Twitter", url: "https://twitter.com", isVisible: true });
  }
}
