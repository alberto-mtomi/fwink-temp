import Link from "next/link";
import {
  ArrowUpRight,
  Upload,
  Cpu,
  Users,
  Send,
  FileText,
  Award,
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusDot } from "@/components/ui/status-dot";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import {
  projects,
  activityFeed,
  projectStatusLabel,
  projectStatusColor,
  type ActivityItem,
} from "@/lib/mock-data";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";

const stats = [
  { label: "Active Projects", value: projects.length, change: "+2 this month" },
  { label: "RFQs Sent", value: 2, change: "1 awaiting response" },
  { label: "Quotes Received", value: 2, change: "$270.5k total" },
  { label: "Avg. Lead Time", value: "16d", change: "−3d vs. last quarter" },
];

const activityIcons: Record<ActivityItem["type"], typeof Upload> = {
  upload: Upload,
  parse: Cpu,
  match: Users,
  rfq: Send,
  quote: FileText,
  award: Award,
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Overview of your manufacturing pipeline."
      >
        <Button size="md">
          <Upload className="h-4 w-4" />
          New Project
        </Button>
      </PageHeader>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <p className="text-xs font-medium text-[var(--gray-500)] uppercase tracking-wider">
              {stat.label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-[var(--gray-900)] tabular-nums">
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-[var(--gray-500)]">
              {stat.change}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Projects table */}
        <Card className="col-span-2 p-0">
          <CardHeader className="px-6 pt-5 pb-0">
            <CardTitle>Projects</CardTitle>
            <Link
              href="/projects/proj_01"
              className="text-xs font-medium text-forge-600 hover:text-forge-700 flex items-center gap-0.5"
            >
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <div className="mt-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--gray-200)] text-left text-xs font-medium text-[var(--gray-500)] uppercase tracking-wider">
                  <th className="px-6 py-2.5">Name</th>
                  <th className="px-6 py-2.5">Client</th>
                  <th className="px-6 py-2.5">Status</th>
                  <th className="px-6 py-2.5 text-right">Files</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr
                    key={project.id}
                    className="border-b border-[var(--gray-100)] last:border-0 hover:bg-[var(--gray-50)] transition-colors"
                  >
                    <td className="px-6 py-3">
                      <Link
                        href={`/projects/${project.id}`}
                        className="font-medium text-[var(--gray-900)] hover:text-forge-600"
                      >
                        {project.name}
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-[var(--gray-600)]">
                      {project.client}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <StatusDot
                          color={projectStatusColor[project.status]}
                          pulse={project.status === "parsing"}
                        />
                        <span className="text-[var(--gray-700)]">
                          {projectStatusLabel[project.status]}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-right tabular-nums text-[var(--gray-600)]">
                      {project.files.length}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Activity feed */}
        <Card className="p-0">
          <CardHeader className="px-5 pt-5 pb-0">
            <CardTitle>Activity</CardTitle>
          </CardHeader>
          <div className="mt-2 divide-y divide-[var(--gray-100)]">
            {activityFeed.slice(0, 6).map((item) => {
              const Icon = activityIcons[item.type];
              return (
                <div key={item.id} className="flex gap-3 px-5 py-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--gray-100)]">
                    <Icon className="h-3.5 w-3.5 text-[var(--gray-500)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] text-[var(--gray-700)] leading-snug">
                      {item.message}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[var(--gray-400)]">
                      {formatRelativeTime(item.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
