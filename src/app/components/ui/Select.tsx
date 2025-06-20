import * as React from "react";
import { cn } from "../../../lib/util";

const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => {
  return (
    <select
      className={cn(
        "w-full px-3 py-2 border rounded-md",
        "bg-white dark:bg-gray-800",
        "border-gray-300 dark:border-gray-700",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Select.displayName = "Select";

export { Select };