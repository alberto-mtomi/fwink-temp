import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between", className)}>
      <div>
        <h1 className="text-lg font-semibold text-[var(--gray-900)]">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-[var(--gray-500)]">{description}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
