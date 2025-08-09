import { cn } from "../../../lib/util";

// A container for status messages like "Loading..." or "No results"
export const MessageContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex items-center justify-center py-24", className)}>
    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 tracking-wide">
      {children}
    </p>
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
      "grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 auto-rows-fr",
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
      "flex flex-col gap-5 pt-5 border-t border-gray-200/70 dark:border-gray-700/60",
      className
    )}
  >
    {children}
  </div>
);