import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Send,
  Star,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { getRfq, getQuotesForRfq } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

const rfqStatusVariant: Record<string, "default" | "success" | "warning" | "info"> = {
  draft: "default",
  sent: "info",
  responded: "success",
  expired: "warning",
};

export default async function RfqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rfq = getRfq(id);
  if (!rfq) return notFound();

  const quotes = getQuotesForRfq(rfq.id);
  const receivedQuotes = quotes.filter((q) => q.status === "received");

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title={`RFQ — ${rfq.projectName}`}
        description={`Sent ${rfq.sentAt ? formatDate(rfq.sentAt) : "—"} · Deadline ${formatDate(rfq.deadline)}`}
      >
        <Badge variant={rfqStatusVariant[rfq.status] ?? "default"}>
          {rfq.status === "responded"
            ? `${receivedQuotes.length} quote(s) received`
            : rfq.status.charAt(0).toUpperCase() + rfq.status.slice(1)}
        </Badge>
      </PageHeader>

      {/* Scope summary */}
      <Card className="p-0">
        <CardHeader className="px-5 pt-5 pb-0">
          <CardTitle>Scope Included in RFQ</CardTitle>
          <Badge variant="outline">{rfq.scopeItems.length} line items</Badge>
        </CardHeader>
        <div className="mt-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--gray-200)] text-left text-xs font-medium text-[var(--gray-500)] uppercase tracking-wider">
                <th className="px-5 py-2">Category</th>
                <th className="px-5 py-2">Description</th>
                <th className="px-5 py-2 text-right">Qty</th>
                <th className="px-5 py-2">Material</th>
                <th className="px-5 py-2">Process</th>
              </tr>
            </thead>
            <tbody>
              {rfq.scopeItems.map((item, i) => (
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
                    {item.material ?? "—"}
                  </td>
                  <td className="px-5 py-2.5 text-[13px] text-[var(--gray-500)]">
                    {item.process ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Matched contractors */}
      <div>
        <h2 className="text-sm font-semibold text-[var(--gray-900)] mb-3">
          Matched Contractors
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {rfq.contractors.map((contractor) => {
            const quote = quotes.find(
              (q) => q.contractor.id === contractor.id
            );
            const hasQuote = quote && quote.status === "received";

            return (
              <Card key={contractor.id} className="p-5 relative">
                {/* Match score pill */}
                <div className="absolute top-4 right-4">
                  <Badge variant="default">{contractor.matchScore}% match</Badge>
                </div>

                <h3 className="text-[15px] font-semibold text-[var(--gray-900)]">
                  {contractor.name}
                </h3>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-[var(--gray-500)]">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {contractor.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-amber-400" />
                    {contractor.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {contractor.leadTimeDays}d typical lead
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  {contractor.specialties.map((s) => (
                    <Badge key={s} variant="outline">
                      {s}
                    </Badge>
                  ))}
                </div>

                {/* Quote status */}
                <div className="mt-4 flex items-center justify-between border-t border-[var(--gray-200)] pt-3">
                  {hasQuote ? (
                    <div className="flex items-center gap-1.5 text-[13px] text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" />
                      Quote received
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[13px] text-[var(--gray-400)]">
                      <AlertCircle className="h-4 w-4" />
                      Awaiting response
                    </div>
                  )}
                  {hasQuote && quote && (
                    <Link href={`/quotes/${quote.id}`}>
                      <Button variant="secondary" size="sm">
                        View Quote
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* One-click RFQ action */}
      {rfq.status === "draft" && (
        <Card className="flex items-center justify-between p-5 border-forge-200 bg-forge-50">
          <div>
            <p className="text-sm font-medium text-[var(--gray-900)]">
              Ready to send RFQ
            </p>
            <p className="mt-0.5 text-[13px] text-[var(--gray-500)]">
              {rfq.contractors.length} contractors matched ·{" "}
              {rfq.scopeItems.length} scope items
            </p>
          </div>
          <Button>
            <Send className="h-4 w-4" />
            Send RFQ to All
          </Button>
        </Card>
      )}
    </div>
  );
}
