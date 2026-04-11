import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Star,
  MapPin,
  Clock,
  ArrowLeft,
  CheckCircle2,
  Shield,
  FileText,
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { getQuote, getQuotesForRfq } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function QuotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const quote = getQuote(id);
  if (!quote) return notFound();

  // Get sibling quotes for comparison
  const allQuotes = getQuotesForRfq(quote.rfqId).filter(
    (q) => q.status === "received"
  );
  const isLowest =
    allQuotes.length > 1 &&
    quote.totalPrice !== null &&
    quote.totalPrice <= Math.min(...allQuotes.map((q) => q.totalPrice ?? Infinity));
  const isFastest =
    allQuotes.length > 1 &&
    quote.leadTimeDays !== null &&
    quote.leadTimeDays <= Math.min(...allQuotes.map((q) => q.leadTimeDays ?? Infinity));

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link
        href={`/rfq/${quote.rfqId}`}
        className="inline-flex items-center gap-1.5 text-sm text-[var(--gray-500)] hover:text-[var(--gray-700)] transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to RFQ
      </Link>

      {/* Header */}
      <PageHeader
        title={`Quote from ${quote.contractor.name}`}
        description={`${quote.projectName} · Submitted ${quote.submittedAt ? formatDate(quote.submittedAt) : "—"}`}
      >
        <div className="flex items-center gap-2">
          {isLowest && <Badge variant="success">Lowest Price</Badge>}
          {isFastest && <Badge variant="info">Fastest Lead</Badge>}
          <Button>Accept Quote</Button>
        </div>
      </PageHeader>

      {/* Top-level metrics */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-5">
          <p className="text-xs font-medium text-[var(--gray-500)] uppercase tracking-wider">
            Total Price
          </p>
          <p className="mt-2 text-2xl font-semibold text-[var(--gray-900)] tabular-nums">
            {quote.totalPrice !== null ? formatCurrency(quote.totalPrice) : "—"}
          </p>
          {allQuotes.length > 1 && (
            <p className="mt-1 text-xs text-[var(--gray-500)]">
              {isLowest ? "Best price" : `vs. ${formatCurrency(Math.min(...allQuotes.map((q) => q.totalPrice ?? Infinity)))}`}
            </p>
          )}
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium text-[var(--gray-500)] uppercase tracking-wider">
            Lead Time
          </p>
          <p className="mt-2 text-2xl font-semibold text-[var(--gray-900)] tabular-nums">
            {quote.leadTimeDays !== null ? `${quote.leadTimeDays}d` : "—"}
          </p>
          {isFastest && (
            <p className="mt-1 text-xs text-[var(--gray-500)]">Fastest option</p>
          )}
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium text-[var(--gray-500)] uppercase tracking-wider">
            Rating
          </p>
          <p className="mt-2 text-2xl font-semibold text-[var(--gray-900)] tabular-nums flex items-center gap-1.5">
            <Star className="h-5 w-5 text-amber-400" />
            {quote.contractor.rating}
          </p>
          <p className="mt-1 text-xs text-[var(--gray-500)]">
            {quote.contractor.location}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium text-[var(--gray-500)] uppercase tracking-wider">
            Match Score
          </p>
          <p className="mt-2 text-2xl font-semibold text-forge-600 tabular-nums">
            {quote.contractor.matchScore}%
          </p>
          <p className="mt-1 text-xs text-[var(--gray-500)]">Capability fit</p>
        </Card>
      </div>

      {/* Line items */}
      <Card className="p-0">
        <CardHeader className="px-5 pt-5 pb-0">
          <CardTitle>Line Items</CardTitle>
          <span className="text-xs text-[var(--gray-500)]">
            {quote.lineItems.length} items
          </span>
        </CardHeader>
        <div className="mt-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--gray-200)] text-left text-xs font-medium text-[var(--gray-500)] uppercase tracking-wider">
                <th className="px-5 py-2">Description</th>
                <th className="px-5 py-2 text-right">Qty</th>
                <th className="px-5 py-2 text-right">Unit Price</th>
                <th className="px-5 py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {quote.lineItems.map((item, i) => (
                <tr
                  key={i}
                  className="border-b border-[var(--gray-100)] last:border-0"
                >
                  <td className="px-5 py-2.5 text-[13px] text-[var(--gray-700)]">
                    {item.description}
                  </td>
                  <td className="px-5 py-2.5 text-right tabular-nums text-[13px] text-[var(--gray-600)]">
                    {item.quantity}
                  </td>
                  <td className="px-5 py-2.5 text-right tabular-nums text-[13px] text-[var(--gray-600)]">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="px-5 py-2.5 text-right tabular-nums text-[13px] font-medium text-[var(--gray-900)]">
                    {formatCurrency(item.total)}
                  </td>
                </tr>
              ))}
              {/* Total row */}
              <tr className="border-t border-[var(--gray-300)] bg-[var(--gray-50)]">
                <td
                  colSpan={3}
                  className="px-5 py-3 text-right text-[13px] font-semibold text-[var(--gray-900)]"
                >
                  Total
                </td>
                <td className="px-5 py-3 text-right tabular-nums text-[15px] font-semibold text-[var(--gray-900)]">
                  {quote.totalPrice !== null
                    ? formatCurrency(quote.totalPrice)
                    : "—"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Notes & comparison */}
      <div className="grid grid-cols-2 gap-6">
        {/* Contractor notes */}
        <Card className="p-5">
          <CardTitle className="mb-3">Contractor Notes</CardTitle>
          <p className="text-[13px] text-[var(--gray-600)] leading-relaxed">
            {quote.notes || "No notes provided."}
          </p>
        </Card>

        {/* Quick comparison */}
        {allQuotes.length > 1 && (
          <Card className="p-0">
            <CardHeader className="px-5 pt-5 pb-0">
              <CardTitle>Quote Comparison</CardTitle>
            </CardHeader>
            <div className="mt-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--gray-200)] text-left text-xs font-medium text-[var(--gray-500)] uppercase tracking-wider">
                    <th className="px-5 py-2">Contractor</th>
                    <th className="px-5 py-2 text-right">Price</th>
                    <th className="px-5 py-2 text-right">Lead</th>
                    <th className="px-5 py-2 text-right">Match</th>
                  </tr>
                </thead>
                <tbody>
                  {allQuotes.map((q) => (
                    <tr
                      key={q.id}
                      className={`border-b border-[var(--gray-100)] last:border-0 ${
                        q.id === quote.id ? "bg-forge-50" : ""
                      }`}
                    >
                      <td className="px-5 py-2.5">
                        <Link
                          href={`/quotes/${q.id}`}
                          className="text-[13px] font-medium text-[var(--gray-900)] hover:text-forge-600"
                        >
                          {q.contractor.name}
                          {q.id === quote.id && (
                            <span className="ml-1.5 text-[11px] text-forge-500">
                              (viewing)
                            </span>
                          )}
                        </Link>
                      </td>
                      <td className="px-5 py-2.5 text-right tabular-nums text-[13px] text-[var(--gray-700)]">
                        {q.totalPrice !== null
                          ? formatCurrency(q.totalPrice)
                          : "—"}
                      </td>
                      <td className="px-5 py-2.5 text-right tabular-nums text-[13px] text-[var(--gray-600)]">
                        {q.leadTimeDays !== null ? `${q.leadTimeDays}d` : "—"}
                      </td>
                      <td className="px-5 py-2.5 text-right tabular-nums text-[13px] text-[var(--gray-600)]">
                        {q.contractor.matchScore}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
