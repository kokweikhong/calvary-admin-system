import { cn } from "@/lib/utils";
import { FC, ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export const Card: FC<CardProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow",
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardHeader: FC<CardProps> = ({ children, className }) => {
  return (
    <div className={cn("px-4 py-5 sm:px-6", className)}>
      {/* Content goes here */}
      {/* We use less vertical padding on card headers on desktop than on body sections */}
      {children}
    </div>
  );
};

export const CardBody: FC<CardProps> = ({ children, className }) => {
  return (
    <div className={cn("px-4 py-5 sm:p-6", className)}>
      {/* Content goes here */}
      {children}
    </div>
  );
};

export const CardFooter: FC<CardProps> = ({ children, className }) => {
  return (
    <div className={cn("px-4 py-4 sm:px-6", className)}>
      {/* Content goes here */}
      {/* We use less vertical padding on card footers at all sizes than on headers or body sections */}
      {children}
    </div>
  );
};
