# ForgeLink

**AI-powered production management platform connecting industrial designers with manufacturing contractors.**

ForgeLink automates the entire lifecycle from design intake to final delivery — parsing CAD files, matching RFQs, managing production, and coordinating teams with AI assistance at every step.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](#license)
[![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)](#)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#contributing)

---

## The Problem

Industrial design contractors juggle dozens of projects, each requiring manual CAD review, back-and-forth negotiation, production tracking, quality assurance, and multi-team coordination. Most of this work happens in spreadsheets, email threads, and disconnected tools. Mistakes compound. Timelines slip. Money leaks.

## The Solution

ForgeLink is an end-to-end platform that wraps AI around the entire production lifecycle:

- **Automated CAD intake** — Parses DWG, DXF, STEP, and IGES files to extract geometry, materials, tolerances, and manufacturability flags
- **Intelligent RFQ matching** — Benchmarks pricing against historical data, identifies cost drivers, and detects underspecified requirements before they become production problems
- **AI-assisted negotiation** — Drafts counter-proposals, models trade-offs in real time, and tracks decision history
- **Production Kanban** — Manages the full build cycle from tooling through shipping, with AI-powered bottleneck prediction and ETA drift alerts
- **Prototype feedback loop** — Structures designer critique, maps feedback to CAD features, and estimates rework impact
- **Multi-project portfolio management** — Prioritizes across concurrent projects, flags resource conflicts, and balances team capacity
- **Internal team coordination** — Routes tasks across shop floor, QA, procurement, and logistics with automated handoff notifications

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Client Layer                      │
│         React + TypeScript + Tailwind CSS            │
├─────────────────────────────────────────────────────┤
│                    API Gateway                       │
│              REST + WebSocket + GraphQL              │
├──────────┬──────────┬──────────┬────────────────────┤
│  Design  │Production│  Comms   │   AI Engine        │
│  Service │ Service  │ Service  │                    │
│          │          │          │ ┌────────────────┐ │
│ CAD parse│ Kanban   │ Threads  │ │ CAD Analysis   │ │
│ RFQ mgmt │ Tracking │ AI draft │ │ Price Bench    │ │
│ Matching │ QC/UAT   │ Routing  │ │ DFM Flags      │ │
│          │          │          │ │ NLP Extraction  │ │
│          │          │          │ │ Priority Engine │ │
├──────────┴──────────┴──────────┴─┴────────────────┴─┤
│                   Data Layer                         │
│       PostgreSQL + S3 (CAD files) + Redis            │
└─────────────────────────────────────────────────────┘
```

---

## Project Structure

```
forgelink/
├── apps/
│   ├── web/                    # React frontend
│   │   ├── src/
│   │   │   ├── components/     # Shared UI components
│   │   │   ├── features/
│   │   │   │   ├── intake/     # Design queue, CAD viewer, RFQ review
│   │   │   │   ├── negotiate/  # Negotiation workspace, kickoff
│   │   │   │   ├── prototype/  # Kanban, feedback, adjustments
│   │   │   │   ├── production/ # Production run, shipping, invoicing
│   │   │   │   ├── qa/         # UAT dashboard, finalization
│   │   │   │   ├── comms/      # Communication hub
│   │   │   │   ├── portfolio/  # Multi-project dashboard
│   │   │   │   └── team/       # Internal team workspace
│   │   │   ├── hooks/
│   │   │   ├── stores/
│   │   │   └── utils/
│   │   └── public/
│   └── mobile/                 # React Native (future)
│
├── services/
│   ├── design-service/         # CAD parsing, RFQ management, matching
│   │   ├── parsers/
│   │   │   ├── dwg-parser/
│   │   │   ├── dxf-parser/
│   │   │   ├── step-parser/
│   │   │   └── iges-parser/
│   │   ├── rfq/
│   │   └── matching/
│   │
│   ├── production-service/     # Kanban, tracking, QC, UAT
│   │   ├── kanban/
│   │   ├── scheduling/
│   │   ├── qc/
│   │   └── shipping/
│   │
│   ├── comms-service/          # Messaging, notifications, routing
│   │   ├── threads/
│   │   ├── notifications/
│   │   └── internal-chat/
│   │
│   └── ai-engine/              # All AI/ML capabilities
│       ├── cad-analysis/       # Geometry extraction, DFM flagging
│       ├── pricing/            # Historical benchmarking, cost modeling
│       ├── nlp/                # RFQ extraction, feedback parsing
│       ├── negotiation/        # Proposal drafting, trade-off modeling
│       ├── production-ai/      # Bottleneck prediction, batch optimization
│       └── priority/           # Multi-project ranking, resource balancing
│
├── packages/
│   ├── shared-types/           # TypeScript types shared across services
│   ├── ui-kit/                 # Design system components
│   └── cad-utils/              # CAD file utilities
│
├── infra/
│   ├── terraform/              # AWS infrastructure as code
│   ├── docker/                 # Container configs
│   └── k8s/                    # Kubernetes manifests
│
├── docs/
│   ├── architecture/           # Architecture decision records
│   ├── api/                    # OpenAPI specs
│   ├── flows/                  # User flow diagrams (SVG)
│   └── mockups/                # UI mockup prompts and exports
│
└── scripts/
    ├── seed-data/              # Sample RFQs and CAD files for dev
    └── migrations/             # Database migrations
```

---

## Production Lifecycle

The platform manages 12 sequential stages plus 3 persistent layers:

| Phase | Stages | What happens |
|---|---|---|
| **Intake** | 1. Receive designs → 2. Review CAD → 3. Review RFQ | AI validates files, extracts specs, benchmarks pricing |
| **Negotiate** | 4. Negotiate terms → 5. Accept + kick off | AI drafts proposals, generates project plan and Kanban |
| **Prototype** | 6. Build + track → 7. Ship prototype → 8. Adjust build | Kanban dashboard, structured feedback, revision tracking |
| **Production** | 9. Production run → 10. Ship + invoice | Batch optimization, QC sampling, auto-invoicing |
| **QA + Close** | 11. UAT → 12. Finalize | Spec comparison, retrospective, profile updates |

**Persistent layers** (active throughout all phases):
- **Communication hub** — AI-assisted messaging with designers, draft suggestions, action item detection
- **Multi-project management** — Portfolio dashboard, resource conflict detection, priority queue
- **Internal team coordination** — Task routing across shop floor, QA, procurement, and logistics

---

## Getting Started

### Prerequisites

- Node.js >= 20
- Docker + Docker Compose
- PostgreSQL 16
- Redis 7
- AWS CLI (for S3 file storage)

### Installation

```bash
# Clone the repo
git clone https://github.com/your-org/forgelink.git
cd forgelink

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start infrastructure
docker-compose up -d postgres redis minio

# Run database migrations
npm run db:migrate

# Seed sample data (RFQs, CAD files, projects)
npm run db:seed

# Start all services in development
npm run dev
```

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://forgelink:password@localhost:5432/forgelink

# Redis
REDIS_URL=redis://localhost:6379

# File storage (S3-compatible)
S3_ENDPOINT=http://localhost:9000
S3_BUCKET=forgelink-cad-files
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin

# AI Engine
AI_MODEL_PROVIDER=anthropic
AI_API_KEY=your-api-key
AI_MODEL=claude-sonnet-4-20250514

# Notifications
SMTP_HOST=localhost
SMTP_PORT=1025
WEBSOCKET_PORT=3001
```

### Running Tests

```bash
# Unit tests
npm run test

# Integration tests (requires Docker services running)
npm run test:integration

# E2E tests
npm run test:e2e

# CAD parser tests (uses sample files in scripts/seed-data/)
npm run test:parsers
```

---

## Key Screens

| Screen | Route | Description |
|---|---|---|
| Incoming design queue | `/intake` | Incoming submissions with AI validation status |
| CAD review workspace | `/intake/:id/review` | Split-panel CAD viewer + AI analysis |
| RFQ review | `/intake/:id/rfq` | Budget/timeline review with AI pricing benchmarks |
| Negotiation workspace | `/projects/:id/negotiate` | Chat + AI negotiation assistant |
| Project kickoff | `/projects/:id/kickoff` | Finalized terms + AI-generated project plan |
| Kanban dashboard | `/projects/:id/kanban` | Production tracking with AI bottleneck alerts |
| Prototype feedback | `/projects/:id/prototype` | Photo/CAD comparison + structured critique |
| Adjustment tracker | `/projects/:id/revisions` | Feedback-to-CAD mapping with cost/time impact |
| Production run | `/projects/:id/production` | Gantt chart, batch tracking, AI optimization |
| Shipping + invoicing | `/projects/:id/shipping` | Tracking, auto-invoicing, payment milestones |
| UAT dashboard | `/projects/:id/uat` | Defect logging, spec comparison, AI analysis |
| Project finalization | `/projects/:id/close` | Retrospective, ratings, profile updates |
| Communication hub | `/comms` | All threads with AI drafts + action items |
| Portfolio dashboard | `/dashboard` | Multi-project overview with AI priority queue |
| Internal team workspace | `/team` | Task board + team chat with AI routing |

---

## AI Engine

The AI engine is the core differentiator. It operates across six capability domains:

### CAD Analysis
Parses uploaded files to extract geometric features, material callouts, and manufacturing constraints. Runs DFM (Design for Manufacturability) checks and flags issues before quoting begins.

### Pricing Intelligence
Benchmarks incoming RFQs against historical project data. Generates cost breakdowns, identifies margin risks, and detects unrealistic budget/timeline combinations.

### NLP Extraction
Processes unstructured RFQ documents (PDFs, emails, free text) to extract structured specs. Parses designer feedback into categorized, actionable items mapped to specific CAD features.

### Negotiation Support
Drafts counter-proposals based on trade-off analysis. Models the impact of scope, timeline, and budget adjustments in real time. Tracks negotiation history and decision patterns.

### Production Optimization
Predicts bottlenecks based on Kanban velocity and dependency chains. Recommends batch sizing, parallel workstream opportunities, and QC sampling plans. Monitors ETA drift and alerts proactively.

### Priority Engine
Ranks tasks and projects across the entire portfolio. Detects resource conflicts, flags overloaded team members, and recommends focus areas based on deadline proximity, risk level, and revenue impact.

---

## API Overview

```
POST   /api/v1/designs/upload          Upload CAD files
GET    /api/v1/designs/:id/analysis    Get AI analysis results
POST   /api/v1/rfqs                    Create or import an RFQ
GET    /api/v1/rfqs/:id/pricing        Get AI pricing benchmark
POST   /api/v1/projects                Create project from accepted RFQ
GET    /api/v1/projects/:id/kanban     Get Kanban board state
PATCH  /api/v1/projects/:id/kanban     Update card positions
POST   /api/v1/projects/:id/feedback   Submit prototype feedback
GET    /api/v1/projects/:id/revisions  Get revision tracking data
POST   /api/v1/projects/:id/production Start production run
GET    /api/v1/projects/:id/uat        Get UAT results
POST   /api/v1/projects/:id/close      Finalize project

GET    /api/v1/comms/threads           List all threads
POST   /api/v1/comms/threads/:id/send  Send message
GET    /api/v1/comms/threads/:id/ai    Get AI draft suggestions

GET    /api/v1/portfolio               Portfolio dashboard data
GET    /api/v1/portfolio/priorities     AI priority recommendations
GET    /api/v1/team/load               Team capacity overview
POST   /api/v1/team/tasks              Create internal task

WS     /ws/kanban/:projectId           Real-time Kanban updates
WS     /ws/comms/:threadId             Real-time messaging
WS     /ws/alerts                      AI alert stream
```

Full API documentation available at `/api/docs` when running locally (Swagger UI).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Tailwind CSS, Zustand, React Query |
| CAD Viewer | Three.js (3D), custom DXF renderer (2D) |
| API | Node.js, Fastify, GraphQL (subscriptions), WebSocket |
| AI | Anthropic Claude API, custom embeddings, pgvector |
| Database | PostgreSQL 16, pgvector (embeddings), Redis (cache + pub/sub) |
| File Storage | S3 (CAD files, images, documents) |
| Search | Elasticsearch (full-text + semantic) |
| Infrastructure | Docker, Kubernetes, Terraform, AWS |
| CI/CD | GitHub Actions |
| Monitoring | Prometheus, Grafana, Sentry |

---

## Roadmap

### v0.1 — Foundation (current)
- [x] Project structure and monorepo setup
- [x] User flow diagrams and UI mockup prompts
- [ ] Database schema and migrations
- [ ] Authentication and authorization
- [ ] Basic CAD file upload and storage

### v0.2 — Intake + Review
- [ ] DWG/DXF parser with geometry extraction
- [ ] AI-powered manufacturability analysis
- [ ] RFQ intake form with AI enrichment
- [ ] Pricing benchmark engine (seed with synthetic data)

### v0.3 — Negotiation + Kickoff
- [ ] Threaded messaging system
- [ ] AI negotiation assistant (draft proposals, trade-off modeling)
- [ ] Project plan generation and Kanban auto-setup

### v0.4 — Production + Prototype
- [ ] Kanban board with drag-and-drop and real-time sync
- [ ] Bottleneck prediction engine
- [ ] Prototype feedback workspace
- [ ] Revision tracking with CAD diff

### v0.5 — Scale + Ship
- [ ] Production run dashboard with batch management
- [ ] QC sampling plan generator
- [ ] Shipping integration and auto-invoicing
- [ ] UAT dashboard with defect logging

### v0.6 — Multi-Project + Team
- [ ] Portfolio dashboard with AI priority queue
- [ ] Internal team workspace and task routing
- [ ] Team capacity visualization and overload alerts

### v1.0 — Launch
- [ ] STEP/IGES parser support
- [ ] Mobile app (React Native)
- [ ] Advanced analytics and reporting
- [ ] Marketplace expansion (designer-facing portal)
- [ ] Webhook integrations (ERP, accounting, shipping APIs)

---

## Contributing

We welcome contributions. Please read the [Contributing Guide](CONTRIBUTING.md) before submitting a PR.

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Commit your changes (`git commit -m 'feat: add CAD layer parser'`)
4. Push to the branch (`git push origin feat/your-feature`)
5. Open a Pull Request

Please use [Conventional Commits](https://www.conventionalcommits.org/) for all commit messages.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Acknowledgments

Built with [Anthropic Claude](https://www.anthropic.com) for AI capabilities. Product architecture and user flows designed collaboratively with AI-assisted product management.
