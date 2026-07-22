export function resumeFileName(fullName: string, extension: string): string {
  const slug = fullName.trim()
    ? fullName.trim().replace(/[^a-z0-9]+/gi, "-").toLowerCase()
    : "resume";
  return `${slug}-resume.${extension}`;
}
