import { cn } from "@/lib/utils";

type StatusColor = "green" | "yellow" | "red" | "blue" | "gray";

const colorStyles: Record<StatusColor, string> = {
  green: "bg-emerald-500",
  yellow: "bg-amber-500",
  red: "bg-red-500",
  blue: "bg-blue-500",
  gray: "bg-[var(--gray-400)]",
};

export function StatusDot({
  color = "gray",
  pulse = false,
  className,
}: {
  color?: StatusColor;
  pulse?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("relative inline-flex h-2 w-2", className)}>
      {pulse && (
        <span
          className={cn(
            "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
            colorStyles[color]
          )}
        />
      )}
      <span
        className={cn(
          "relative inline-flex h-2 w-2 rounded-full",
          colorStyles[color]
        )}
      />
    </span>
  );
}
