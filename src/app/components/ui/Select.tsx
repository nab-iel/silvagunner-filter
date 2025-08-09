import * as React from "react";
import { cn } from "../../../lib/util";

const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => {
  return (
    <select
      className={cn(
        "w-full rounded-md border px-3 py-2.5 text-sm",
        "bg-white/80 dark:bg-gray-900/60 backdrop-blur",
        "border-gray-300/70 dark:border-gray-700/70",
        "transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Select.displayName = "Select";

export { Select };