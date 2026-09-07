import { z } from "zod";

/**
 * A single achievement line, optionally with nested sub-points.
 * YAML may write either a bare string (no children) or a mapping.
 */
export const highlightSchema = z.union([
  z.string().min(1),
  z.object({
    text: z.string().min(1),
    children: z.array(z.string().min(1)).default([]),
  }),
]);

/**
 * A date range or year. YAML parses a bare `2019` as a number, so accept both
 * and normalize to a string rather than making the author remember quotes.
 */
export const timeSchema = z.union([z.string().min(1), z.number()]).transform((v) => String(v));

export const profileSchema = z.object({
  name: z.string().min(1),
  tagline: z.string().min(1),
  avatar: z.string().min(1).optional(),
  email: z.email(),
  phone: z.string().optional(),
  location: z.string().optional(),
  citizenship: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  website: z.url().optional(),
});

export const experienceSchema = z.object({
  role: z.string().min(1),
  company: z.string().min(1),
  time: timeSchema,
  summary: z.string().optional(),
  highlights: z.array(highlightSchema).default([]),
});

export const educationSchema = z.object({
  degree: z.string().min(1),
  institution: z.string().min(1),
  time: timeSchema,
});

export const certificationSchema = z.object({
  name: z.string().min(1),
  organization: z.string().min(1),
  credentialId: z.string().optional(),
});

export const projectSchema = z.object({
  title: z.string().min(1),
  link: z.url().optional(),
  description: z.string().min(1),
  /** Optional technologies, rendered as chips below the description. */
  stack: z.array(z.string().min(1)).default([]),
});

export const skillGroupSchema = z.object({
  title: z.string().min(1),
  items: z.array(z.string().min(1)).min(1),
});

export const resumeSchema = z.object({
  profile: profileSchema,
  summary: z.string().min(1),
  services: z.array(z.string().min(1)).default([]),
  skills: z.array(skillGroupSchema).default([]),
  experience: z.array(experienceSchema).default([]),
  education: z.array(educationSchema).default([]),
  certifications: z.array(certificationSchema).default([]),
  projects: z.array(projectSchema).default([]),
  personalProjects: z.array(projectSchema).default([]),
});

export type Resume = z.infer<typeof resumeSchema>;
export type Highlight = z.infer<typeof highlightSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type Project = z.infer<typeof projectSchema>;

/** Normalize a highlight into its object form for uniform rendering. */
export function toHighlight(h: Highlight): { text: string; children: string[] } {
  return typeof h === "string" ? { text: h, children: [] } : h;
}
