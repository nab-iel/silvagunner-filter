import * as React from "react";
import { cn } from "../../../lib/util";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      className={cn(
        "w-full rounded-md border px-3 py-2.5 text-sm",
        "bg-white/80 dark:bg-gray-900/60 backdrop-blur",
        "border-gray-300/70 dark:border-gray-700/70",
        "placeholder:text-gray-400 dark:placeholder:text-gray-500",
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
Input.displayName = "Input";

export { Input };