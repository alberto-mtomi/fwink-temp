// ─── Types ────────────────────────────────────────────────────────────────────

export type ProjectStatus =
  | "draft"
  | "parsing"
  | "matched"
  | "rfq_sent"
  | "quoting"
  | "quoted"
  | "awarded";

export type RfqStatus = "draft" | "sent" | "responded" | "expired";
export type QuoteStatus = "pending" | "received" | "accepted" | "declined";

export interface Project {
  id: string;
  name: string;
  client: string;
  status: ProjectStatus;
  files: string[];
  scope: ScopeItem[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface ScopeItem {
  category: string;
  description: string;
  quantity: number;
  unit: string;
  material?: string;
  process?: string;
}

export interface Contractor {
  id: string;
  name: string;
  specialties: string[];
  location: string;
  rating: number;
  leadTimeDays: number;
  matchScore: number;
}

export interface Rfq {
  id: string;
  projectId: string;
  projectName: string;
  contractors: Contractor[];
  status: RfqStatus;
  sentAt: string | null;
  deadline: string;
  scopeItems: ScopeItem[];
}

export interface Quote {
  id: string;
  rfqId: string;
  projectName: string;
  contractor: Contractor;
  status: QuoteStatus;
  totalPrice: number | null;
  leadTimeDays: number | null;
  lineItems: QuoteLineItem[];
  submittedAt: string | null;
  notes: string;
}

export interface QuoteLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface ActivityItem {
  id: string;
  type: "upload" | "parse" | "match" | "rfq" | "quote" | "award";
  message: string;
  projectId: string;
  timestamp: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const projects: Project[] = [
  {
    id: "proj_01",
    name: "Hydraulic Manifold Assembly",
    client: "Apex Industrial",
    status: "quoted",
    files: ["manifold_v3.step", "BOM_manifold.xlsx", "spec_sheet.pdf"],
    scope: [
      { category: "CNC Machining", description: "Aluminum manifold body — 6061-T6", quantity: 200, unit: "pcs", material: "Aluminum 6061-T6", process: "5-axis CNC" },
      { category: "CNC Machining", description: "End caps — 303 SS", quantity: 400, unit: "pcs", material: "Stainless 303", process: "CNC Turning" },
      { category: "Surface Treatment", description: "Hard anodize — Type III, Class 2", quantity: 200, unit: "pcs", process: "Anodizing" },
      { category: "Assembly", description: "Final assembly with O-rings and fittings", quantity: 200, unit: "pcs" },
    ],
    createdAt: "2026-03-28T14:30:00Z",
    updatedAt: "2026-04-10T09:15:00Z",
  },
  {
    id: "proj_02",
    name: "EV Battery Enclosure",
    client: "VoltDrive Motors",
    status: "rfq_sent",
    files: ["enclosure_asm.step", "BOM_enclosure.csv", "thermal_analysis.pdf", "drawing_pkg.pdf"],
    scope: [
      { category: "Sheet Metal", description: "Enclosure tray — 5052-H32 aluminum", quantity: 500, unit: "pcs", material: "Aluminum 5052-H32", process: "Progressive stamping" },
      { category: "Sheet Metal", description: "Cover panel — 5052-H32 aluminum", quantity: 500, unit: "pcs", material: "Aluminum 5052-H32", process: "Laser cut + brake form" },
      { category: "Welding", description: "Seal-weld tray seams — TIG", quantity: 500, unit: "pcs", process: "TIG Welding" },
      { category: "Surface Treatment", description: "E-coat — cathodic epoxy", quantity: 1000, unit: "pcs", process: "E-coating" },
    ],
    createdAt: "2026-04-02T10:00:00Z",
    updatedAt: "2026-04-09T16:45:00Z",
  },
  {
    id: "proj_03",
    name: "Surgical Instrument Handles",
    client: "MedForm Devices",
    status: "parsing",
    files: ["handle_asm.step", "BOM_handles.xlsx"],
    scope: null,
    createdAt: "2026-04-10T08:00:00Z",
    updatedAt: "2026-04-10T08:02:00Z",
  },
  {
    id: "proj_04",
    name: "Drone Frame Kit",
    client: "SkyForge Robotics",
    status: "matched",
    files: ["frame_v2.step", "BOM_frame.csv", "assembly_instructions.pdf"],
    scope: [
      { category: "CNC Machining", description: "Carbon fiber frame plates", quantity: 1000, unit: "pcs", material: "Carbon Fiber Composite", process: "CNC Router" },
      { category: "CNC Machining", description: "Motor mount brackets — 7075-T6", quantity: 4000, unit: "pcs", material: "Aluminum 7075-T6", process: "3-axis CNC" },
      { category: "3D Printing", description: "Landing gear struts — Nylon PA12", quantity: 2000, unit: "pcs", material: "Nylon PA12", process: "MJF" },
    ],
    createdAt: "2026-04-05T11:30:00Z",
    updatedAt: "2026-04-10T14:20:00Z",
  },
];

export const contractors: Contractor[] = [
  { id: "ctr_01", name: "Precision Works LLC", specialties: ["CNC Machining", "5-axis"], location: "Detroit, MI", rating: 4.8, leadTimeDays: 18, matchScore: 96 },
  { id: "ctr_02", name: "Pacific Sheet Metal", specialties: ["Sheet Metal", "Stamping", "Welding"], location: "Portland, OR", rating: 4.6, leadTimeDays: 21, matchScore: 92 },
  { id: "ctr_03", name: "Apex Manufacturing", specialties: ["CNC Machining", "Surface Treatment"], location: "Chicago, IL", rating: 4.9, leadTimeDays: 14, matchScore: 88 },
  { id: "ctr_04", name: "SouthBay Fabrication", specialties: ["Sheet Metal", "Welding", "Assembly"], location: "San Jose, CA", rating: 4.5, leadTimeDays: 25, matchScore: 85 },
  { id: "ctr_05", name: "NorthStar Additive", specialties: ["3D Printing", "MJF", "SLS"], location: "Minneapolis, MN", rating: 4.7, leadTimeDays: 10, matchScore: 94 },
];

export const rfqs: Rfq[] = [
  {
    id: "rfq_01",
    projectId: "proj_01",
    projectName: "Hydraulic Manifold Assembly",
    contractors: [contractors[0], contractors[2]],
    status: "responded",
    sentAt: "2026-04-05T10:00:00Z",
    deadline: "2026-04-12T23:59:00Z",
    scopeItems: projects[0].scope!,
  },
  {
    id: "rfq_02",
    projectId: "proj_02",
    projectName: "EV Battery Enclosure",
    contractors: [contractors[1], contractors[3]],
    status: "sent",
    sentAt: "2026-04-09T17:00:00Z",
    deadline: "2026-04-16T23:59:00Z",
    scopeItems: projects[1].scope!,
  },
];

export const quotes: Quote[] = [
  {
    id: "quote_01",
    rfqId: "rfq_01",
    projectName: "Hydraulic Manifold Assembly",
    contractor: contractors[0],
    status: "received",
    totalPrice: 142000,
    leadTimeDays: 18,
    lineItems: [
      { description: "Aluminum manifold body — 5-axis CNC", quantity: 200, unitPrice: 385, total: 77000 },
      { description: "End caps — CNC Turning", quantity: 400, unitPrice: 62, total: 24800 },
      { description: "Hard anodize — Type III", quantity: 200, unitPrice: 45, total: 9000 },
      { description: "Final assembly", quantity: 200, unitPrice: 156, total: 31200 },
    ],
    submittedAt: "2026-04-09T14:30:00Z",
    notes: "Tooling included. Volume discount available at 500+ pcs. Can expedite to 14 days for 8% surcharge.",
  },
  {
    id: "quote_02",
    rfqId: "rfq_01",
    projectName: "Hydraulic Manifold Assembly",
    contractor: contractors[2],
    status: "received",
    totalPrice: 128500,
    leadTimeDays: 14,
    lineItems: [
      { description: "Aluminum manifold body — 5-axis CNC", quantity: 200, unitPrice: 350, total: 70000 },
      { description: "End caps — CNC Turning", quantity: 400, unitPrice: 55, total: 22000 },
      { description: "Hard anodize — Type III", quantity: 200, unitPrice: 40, total: 8000 },
      { description: "Final assembly", quantity: 200, unitPrice: 142.50, total: 28500 },
    ],
    submittedAt: "2026-04-10T09:00:00Z",
    notes: "Includes first-article inspection. ISO 9001 and AS9100 certified. Tooling amortized over first run.",
  },
  {
    id: "quote_03",
    rfqId: "rfq_02",
    projectName: "EV Battery Enclosure",
    contractor: contractors[1],
    status: "pending",
    totalPrice: null,
    leadTimeDays: null,
    lineItems: [],
    submittedAt: null,
    notes: "",
  },
];

export const activityFeed: ActivityItem[] = [
  { id: "act_01", type: "quote", message: "Apex Manufacturing submitted quote for Hydraulic Manifold Assembly", projectId: "proj_01", timestamp: "2026-04-10T09:00:00Z" },
  { id: "act_02", type: "rfq", message: "RFQ sent to 2 contractors for EV Battery Enclosure", projectId: "proj_02", timestamp: "2026-04-09T17:00:00Z" },
  { id: "act_03", type: "quote", message: "Precision Works submitted quote for Hydraulic Manifold Assembly", projectId: "proj_01", timestamp: "2026-04-09T14:30:00Z" },
  { id: "act_04", type: "match", message: "3 contractors matched for Drone Frame Kit", projectId: "proj_04", timestamp: "2026-04-08T11:00:00Z" },
  { id: "act_05", type: "parse", message: "Scope extracted from EV Battery Enclosure — 4 line items", projectId: "proj_02", timestamp: "2026-04-07T09:30:00Z" },
  { id: "act_06", type: "upload", message: "Surgical Instrument Handles package uploaded by MedForm Devices", projectId: "proj_03", timestamp: "2026-04-10T08:00:00Z" },
  { id: "act_07", type: "parse", message: "Parsing Surgical Instrument Handles — extracting scope…", projectId: "proj_03", timestamp: "2026-04-10T08:02:00Z" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function getRfq(id: string): Rfq | undefined {
  return rfqs.find((r) => r.id === id);
}

export function getQuote(id: string): Quote | undefined {
  return quotes.find((q) => q.id === id);
}

export function getQuotesForRfq(rfqId: string): Quote[] {
  return quotes.filter((q) => q.rfqId === rfqId);
}

export function getRfqsForProject(projectId: string): Rfq[] {
  return rfqs.filter((r) => r.projectId === projectId);
}

export const projectStatusLabel: Record<ProjectStatus, string> = {
  draft: "Draft",
  parsing: "Parsing",
  matched: "Matched",
  rfq_sent: "RFQ Sent",
  quoting: "Quoting",
  quoted: "Quoted",
  awarded: "Awarded",
};

export const projectStatusColor: Record<ProjectStatus, "gray" | "blue" | "yellow" | "green"> = {
  draft: "gray",
  parsing: "blue",
  matched: "yellow",
  rfq_sent: "blue",
  quoting: "yellow",
  quoted: "green",
  awarded: "green",
};
