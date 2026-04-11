import { notFound } from "next/navigation";
import Link from "next/link";
import {
  FileBox,
  ArrowRight,
  Cpu,
  Upload,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusDot } from "@/components/ui/status-dot";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import {
  getProject,
  getRfqsForProject,
  projectStatusLabel,
  projectStatusColor,
} from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) return notFound();

  const rfqs = getRfqsForProject(project.id);

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title={project.name}
        description={`${project.client} · Created ${formatDate(project.createdAt)}`}
      >
        <div className="flex items-center gap-2">
          <StatusDot
            color={projectStatusColor[project.status]}
            pulse={project.status === "parsing"}
          />
          <Badge
            variant={
              project.status === "quoted" || project.status === "awarded"
                ? "success"
                : project.status === "parsing"
                  ? "info"
                  : "default"
            }
          >
            {projectStatusLabel[project.status]}
          </Badge>
        </div>
      </PageHeader>

      {/* Pipeline steps */}
      <div className="grid grid-cols-4 gap-3">
        {[
          {
            label: "Upload",
            icon: Upload,
            done: true,
            detail: `${project.files.length} files`,
          },
          {
            label: "Parse Scope",
            icon: Cpu,
            done: project.scope !== null,
            detail: project.scope
              ? `${project.scope.length} line items`
              : "Processing…",
          },
          {
            label: "Match & RFQ",
            icon: ArrowRight,
            done: rfqs.length > 0,
            detail: rfqs.length > 0 ? `${rfqs.length} RFQ(s)` : "Pending",
          },
          {
            label: "Quotes",
            icon: CheckCircle2,
            done: project.status === "quoted" || project.status === "awarded",
            detail:
              project.status === "quoted" || project.status === "awarded"
                ? "Received"
                : "Awaiting",
          },
        ].map((step, i) => (
          <Card
            key={step.label}
            className="flex items-center gap-3 p-4 border-[var(--gray-200)]"
          >
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                step.done
                  ? "bg-forge-50 text-forge-600"
                  : "bg-[var(--gray-100)] text-[var(--gray-400)]"
              }`}
            >
              <step.icon className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-[var(--gray-900)]">
                {step.label}
              </p>
              <p className="text-[12px] text-[var(--gray-500)]">
                {step.detail}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Deliverable files */}
        <Card className="col-span-2 p-0">
          <CardHeader className="px-5 pt-5 pb-0">
            <CardTitle>Deliverable Package</CardTitle>
            <Button variant="ghost" size="sm">
              <Upload className="h-3.5 w-3.5" />
              Upload
            </Button>
          </CardHeader>
          <div className="mt-3 divide-y divide-[var(--gray-100)]">
            {project.files.map((file) => (
              <div
                key={file}
                className="flex items-center gap-3 px-5 py-3 hover:bg-[var(--gray-50)] transition-colors"
              >
                <FileBox className="h-4 w-4 shrink-0 text-[var(--gray-400)]" />
                <span className="flex-1 truncate text-[13px] text-[var(--gray-700)] font-mono">
                  {file}
                </span>
                <Badge variant="outline">
                  {file.split(".").pop()?.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
          <div className="border-t border-[var(--gray-200)] px-5 py-3">
            <p className="text-[12px] text-[var(--gray-400)]">
              Drop CAD, BOM, or spec files to upload
            </p>
          </div>
        </Card>

        {/* Extracted scope */}
        <Card className="col-span-3 p-0">
          <CardHeader className="px-5 pt-5 pb-0">
            <CardTitle>Extracted Manufacturing Scope</CardTitle>
            {project.scope && (
              <Badge variant="success">{project.scope.length} items</Badge>
            )}
          </CardHeader>

          {project.scope ? (
            <div className="mt-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--gray-200)] text-left text-xs font-medium text-[var(--gray-500)] uppercase tracking-wider">
                    <th className="px-5 py-2">Category</th>
                    <th className="px-5 py-2">Description</th>
                    <th className="px-5 py-2 text-right">Qty</th>
                    <th className="px-5 py-2">Process</th>
                  </tr>
                </thead>
                <tbody>
                  {project.scope.map((item, i) => (
                    <tr
                      key={i}
                      className="border-b border-[var(--gray-100)] last:border-0"
                    >
                      <td className="px-5 py-2.5">
                        <Badge variant="outline">{item.category}</Badge>
                      </td>
                      <td className="px-5 py-2.5 text-[13px] text-[var(--gray-700)]">
                        {item.description}
                      </td>
                      <td className="px-5 py-2.5 text-right tabular-nums text-[13px] text-[var(--gray-600)]">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="px-5 py-2.5 text-[13px] text-[var(--gray-500)]">
                        {item.process ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                <Cpu className="h-5 w-5 text-blue-500 animate-pulse" />
              </div>
              <p className="mt-3 text-sm font-medium text-[var(--gray-700)]">
                Parsing deliverables…
              </p>
              <p className="mt-1 text-xs text-[var(--gray-500)]">
                The agent is extracting manufacturing scope from your files.
              </p>
            </div>
          )}

          {/* CTA */}
          {project.scope && rfqs.length === 0 && (
            <div className="border-t border-[var(--gray-200)] px-5 py-4 flex items-center justify-between">
              <p className="text-[13px] text-[var(--gray-500)]">
                Scope confirmed — ready to match contractors.
              </p>
              <Button size="sm">
                Find Contractors
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}

          {rfqs.length > 0 && (
            <div className="border-t border-[var(--gray-200)] px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[var(--gray-400)]" />
                <p className="text-[13px] text-[var(--gray-600)]">
                  {rfqs.length} RFQ(s) sent
                </p>
              </div>
              <Link href={`/rfq/${rfqs[0].id}`}>
                <Button variant="secondary" size="sm">
                  View RFQ
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
