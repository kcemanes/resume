// Imported with `?raw` so Vite inlines the YAML into the bundle at build time.
// Reading it via node:fs would break, because the prerender bundle runs from a
// relocated directory where the source tree is not present.
import raw from "../data/resume.yml?raw";
import { parse } from "yaml";
import { resumeSchema, type Resume } from "./schema";

let cached: Resume | undefined;

/**
 * Parse and validate the resume data.
 *
 * Validation runs at build time, so a typo or a missing required field fails
 * `npm run build` with a pointer to the offending path instead of silently
 * rendering an empty section.
 */
export function loadResume(): Resume {
  if (cached) return cached;

  const result = resumeSchema.safeParse(parse(raw));

  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid src/data/resume.yml:\n${issues}`);
  }

  cached = result.data;
  return cached;
}
