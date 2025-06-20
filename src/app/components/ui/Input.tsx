import * as React from "react";
import { cn } from "../../../lib/util";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
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
Input.displayName = "Input";

export { Input };