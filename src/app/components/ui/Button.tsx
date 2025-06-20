import * as React from "react";
import { cn } from "../../../lib/util";

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  return (
    <button
      className={cn(
        "w-full py-2 px-4 rounded-md transition-colors",
        "bg-blue-600 text-white hover:bg-blue-700",
        "disabled:bg-gray-500 disabled:cursor-not-allowed",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button };