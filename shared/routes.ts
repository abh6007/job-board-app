import { z } from 'zod';
import { 
  insertJobSchema, 
  insertSocialLinkSchema, 
  insertAutomationLinkSchema, 
  insertAboutMeSchema,
  jobs,
  socialLinks,
  automationLinks,
  aboutMe
} from './schema';

export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;

export type SocialLink = typeof socialLinks.$inferSelect;
export type InsertSocialLink = z.infer<typeof insertSocialLinkSchema>;

export type AutomationLink = typeof automationLinks.$inferSelect;
export type InsertAutomationLink = z.infer<typeof insertAutomationLinkSchema>;

export type AboutMe = typeof aboutMe.$inferSelect;
export type InsertAboutMe = z.infer<typeof insertAboutMeSchema>;

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  // Jobs
  jobs: {
    list: {
      method: 'GET' as const,
      path: '/api/jobs',
      input: z.object({
        search: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof jobs.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/jobs/:id',
      responses: {
        200: z.custom<typeof jobs.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/jobs',
      input: insertJobSchema,
      responses: {
        201: z.custom<typeof jobs.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/jobs/:id',
      input: insertJobSchema.partial(),
      responses: {
        200: z.custom<typeof jobs.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
    trackClick: {
      method: 'POST' as const,
      path: '/api/jobs/:id/click',
      responses: {
        200: z.object({ success: z.boolean() }),
        404: errorSchemas.notFound,
      },
    },
  },

  // Admin Stats
  admin: {
    stats: {
      method: 'GET' as const,
      path: '/api/admin/stats',
      responses: {
        200: z.object({
          jobsPosted: z.number(),
          jobsActive: z.number(),
          jobsInactive: z.number(),
          mostSearchedJobs: z.array(z.custom<typeof jobs.$inferSelect>()),
          mostClickedJobs: z.array(z.custom<typeof jobs.$inferSelect>()),
        }),
        401: errorSchemas.unauthorized,
      },
    },
  },

  // Social Links
  socialLinks: {
    list: {
      method: 'GET' as const,
      path: '/api/social-links',
      responses: {
        200: z.array(z.custom<typeof socialLinks.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/social-links',
      input: insertSocialLinkSchema,
      responses: {
        201: z.custom<typeof socialLinks.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/social-links/:id',
      responses: {
        204: z.void(),
        401: errorSchemas.unauthorized,
      },
    },
  },

  // Automation Links
  automationLinks: {
    list: {
      method: 'GET' as const,
      path: '/api/automation-links',
      responses: {
        200: z.array(z.custom<typeof automationLinks.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/automation-links',
      input: insertAutomationLinkSchema,
      responses: {
        201: z.custom<typeof automationLinks.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/automation-links/:id',
      responses: {
        204: z.void(),
        401: errorSchemas.unauthorized,
      },
    },
  },

  // About Me
  aboutMe: {
    get: {
      method: 'GET' as const,
      path: '/api/about-me',
      responses: {
        200: z.custom<typeof aboutMe.$inferSelect>().nullable(),
      },
    },
    update: {
      method: 'POST' as const,
      path: '/api/about-me',
      input: insertAboutMeSchema,
      responses: {
        200: z.custom<typeof aboutMe.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
