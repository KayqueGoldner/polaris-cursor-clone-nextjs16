import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

import { getItemPadding } from "./constants";

export const LoadingRow = ({
  level = 0,
  className,
}: {
  level?: number;
  className?: string;
}) => {
  return (
    <div
      className={cn("flex h-5.5 items-center text-muted-foreground", className)}
      style={{
        paddingLeft: getItemPadding(level, true),
      }}
    >
      <Spinner className="ml-0.5 size-4 shrink-0 text-ring" />
    </div>
  );
};
