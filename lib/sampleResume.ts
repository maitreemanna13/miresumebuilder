import type { Resume } from "@/lib/schema/resume";
import { SECTION_IDS } from "@/lib/schema/resume";

// Sample data used to seed the builder workspace so templates/preview can
// be exercised before the manual-entry forms (M2) exist.
export const SAMPLE_RESUME: Resume = {
  schemaVersion: 1,
  contact: {
    fullName: "Jordan Rivera",
    headline: "Senior Backend Engineer",
    email: "jordan.rivera@example.com",
    phone: "(555) 123-4567",
    location: "Austin, TX",
    website: "https://jordanrivera.dev",
    linkedin: "https://linkedin.com/in/jordanrivera",
    github: "https://github.com/jordanrivera",
  },
  summary:
    "Backend engineer with 7+ years building high-throughput distributed systems. Led migration of a monolith to event-driven microservices, cutting p99 latency by 60%. Enjoys mentoring and cross-team technical design.",
  experience: [
    {
      id: "exp-1",
      company: "Northwind Systems",
      role: "Senior Backend Engineer",
      location: "Austin, TX",
      startDate: "Jun 2021",
      endDate: undefined,
      current: true,
      bullets: [
        "Designed and led migration from a monolithic Rails app to event-driven microservices, reducing p99 latency by 60%.",
        "Built an internal rate-limiting and quota service now used by 12 downstream teams.",
        "Mentored 4 junior engineers; two were promoted to mid-level within a year.",
      ],
      projects: [],
    },
    {
      id: "exp-2",
      company: "Beacon Analytics",
      role: "Backend Engineer",
      location: "Remote",
      startDate: "Jul 2018",
      endDate: "May 2021",
      current: false,
      bullets: [
        "Owned the billing pipeline processing $2M+/month in transactions with zero data-loss incidents.",
        "Introduced contract testing between services, cutting integration bugs in production by 35%.",
      ],
      projects: [],
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "University of Texas at Austin",
      degree: "B.S.",
      fieldOfStudy: "Computer Science",
      startDate: "Aug 2014",
      endDate: "May 2018",
      gpa: "3.7",
      bullets: [],
    },
  ],
  skills: [
    { id: "skill-1", label: "Languages", items: ["TypeScript", "Go", "Python", "SQL"] },
    { id: "skill-2", label: "Infrastructure", items: ["AWS", "Kubernetes", "Kafka", "Postgres"] },
  ],
  projects: [
    {
      id: "proj-1",
      name: "queuely",
      link: "https://github.com/jordanrivera/queuely",
      description: "Lightweight, open-source job queue for Node.js backed by Redis streams.",
      bullets: ["620+ GitHub stars", "Used in production by 3 companies"],
      technologies: ["TypeScript", "Redis"],
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      date: "2022",
      credentialUrl: "",
    },
  ],
  awards: [
    {
      id: "award-1",
      name: "Engineering Excellence Award",
      issuer: "Northwind Systems",
      date: "2023",
      description: "Recognized for leading the microservices migration that cut p99 latency by 60%.",
    },
  ],
  sectionOrder: [...SECTION_IDS],
};
