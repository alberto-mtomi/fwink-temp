// ─── Stage machine ────────────────────────────────────────────────────────────

// Stage maps to the primary step. Step 6 (Read match rationale) is a view
// within the `shortlisted` stage — reached by clicking into a candidate.

export const STAGES = [
  "draft",            // Step 1: contractor is filling out the brief
  "reviewing_reqs",   // Step 2: AI extracted specs, contractor reviews
  "setting_prefs",    // Step 3: soft preferences (budget, timeline, style)
  "live",             // Step 4: RFQ goes live, waiting for designers
  "shortlisted",      // Steps 5 + 6: AI ranked candidates; rationale available
  "engaged",          // Step 7: selected designer, iterating
  "complete",         // Step 8: rated and closed
] as const;

export type RfqStage = (typeof STAGES)[number];

export const stageStep: Record<RfqStage, number> = {
  draft: 1,
  reviewing_reqs: 2,
  setting_prefs: 3,
  live: 4,
  shortlisted: 5,
  engaged: 7,
  complete: 8,
};

export const stageLabel: Record<RfqStage, string> = {
  draft: "Draft",
  reviewing_reqs: "Reviewing Requirements",
  setting_prefs: "Setting Preferences",
  live: "Live",
  shortlisted: "Shortlisted",
  engaged: "Engaged",
  complete: "Complete",
};

// ─── RFQ input ────────────────────────────────────────────────────────────────

export type BriefInputType = "form" | "pdf" | "paste";

export interface Brief {
  rawInput: string;
  inputType: BriefInputType;
  sourceFilename?: string;
}

// ─── AI Step 1: extracted specs ───────────────────────────────────────────────

export interface ExtractedSpec {
  field: string;           // "Product category", "Target user", etc.
  value: string;           // extracted value
  confidence: "high" | "medium" | "low";
}

// ─── AI Step 2: inferred requirements (with user review state) ────────────────

export type RequirementStatus = "pending" | "accepted" | "modified" | "dismissed";

export type RequirementCategory =
  | "compliance"
  | "material"
  | "manufacturing"
  | "performance"
  | "aesthetic"
  | "usability";

export interface InferredRequirement {
  id: string;
  category: RequirementCategory;
  title: string;
  detail: string;
  source: "extracted" | "enriched";   // extracted = from brief; enriched = AI added
  status: RequirementStatus;
  userModification?: string;
}

// ─── Step 3: soft preferences + AI calibration ────────────────────────────────

export interface SoftPreferences {
  budgetUsd: [number, number];         // min, max
  timelineDays: number;
  stylePreferences: string[];          // e.g., "Minimalist", "Industrial"
  riskTolerance: "low" | "medium" | "high";
}

export interface CalibrationFlag {
  severity: "info" | "warning" | "blocker";
  message: string;
  suggestion?: string;
}

// ─── Step 5+6: candidates, scorecards, rationale ──────────────────────────────

export interface ScoreBreakdown {
  specMatch: number;       // 0-100
  reputation: number;      // 0-100
  fit: number;             // 0-100 (style + preferences + availability)
}

export interface Candidate {
  id: string;
  designerName: string;
  designerHandle: string;
  avatarInitials: string;
  accentColor: string;      // for avatar bg
  portfolio: PortfolioItem[];
  scoreBreakdown: ScoreBreakdown;
  totalScore: number;
  rating: number;           // 0-5
  completedProjects: number;
  location: string;
  leadTimeDays: number;
  quotedPriceUsd: number;
  specialties: string[];
  rationale: MatchRationale;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
}

export interface MatchRationale {
  summary: string;            // plain-language one-liner
  strengths: string[];        // bullet list of reasons this is a good match
  considerations: string[];   // things to consider / weaknesses
  specMatchHighlights: string[];
}

// ─── Step 7: engagement / revisions ───────────────────────────────────────────

export type RevisionStatus = "requested" | "in_progress" | "submitted" | "approved";

export interface Revision {
  id: string;
  roundNumber: number;
  requestedAt: string;
  requestText: string;
  status: RevisionStatus;
  designerResponse?: string;
  submittedAt?: string;
  scopeDriftScore?: number;   // AI-detected drift 0-100
}

export interface MonitoringSignal {
  type: "scope_drift" | "satisfaction" | "timeline" | "communication";
  severity: "positive" | "neutral" | "warning";
  message: string;
  detectedAt: string;
}

// ─── Step 8: rating + preference model ────────────────────────────────────────

export interface Rating {
  overall: number;         // 0-5
  quality: number;
  communication: number;
  timeliness: number;
  comment: string;
  submittedAt: string;
}

export interface PreferenceInsight {
  dimension: string;       // e.g., "Design style preference"
  observation: string;     // e.g., "You consistently select minimalist designers"
  confidence: number;      // 0-100
  dataPoints: number;      // how many RFQs informed this
}

// ─── Main Rfq ────────────────────────────────────────────────────────────────

export interface Rfq {
  id: string;
  title: string;
  productCategory: string;
  submittedAt: string;
  stage: RfqStage;

  brief: Brief;
  extractedSpecs: ExtractedSpec[];
  inferredRequirements: InferredRequirement[];
  preferences: SoftPreferences | null;
  calibrationFlags: CalibrationFlag[];

  candidates: Candidate[];
  selectedCandidateId: string | null;

  revisions: Revision[];
  monitoringSignals: MonitoringSignal[];

  rating: Rating | null;
}
