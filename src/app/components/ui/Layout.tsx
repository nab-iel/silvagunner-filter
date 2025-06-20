import { cn } from "../../../lib/util";

// A container for status messages like "Loading..." or "No results"
export const MessageContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex items-center justify-center h-full", className)}>
    <p className="text-gray-500 dark:text-gray-400">{children}</p>
  </div>
);

// The main grid for displaying video cards
export const VideoGrid = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8",
      className
    )}
  >
    {children}
  </div>
);

// A section container with a top border, used for the filter area
export const Section = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "flex flex-col gap-4 pt-4 border-t border-gray-200 dark:border-gray-700",
      className
    )}
  >
    {children}
  </div>
);