import * as React from "react";
import { cn } from "../../../lib/util";

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  return (
    <button
      className={cn(
        "w-full inline-flex items-center justify-center font-medium",
        "rounded-lg px-4 py-2.5",
        "bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 text-white",
        "shadow-card hover:shadow-cardHover hover:from-blue-500 hover:to-indigo-500",
        "transition-all duration-300 ease-out-expo active:scale-[.97]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button };