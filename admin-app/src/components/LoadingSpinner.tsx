import { cn } from "@/lib/utils";

const LoadingSpinner = ({
  className,
  label,
}: {
  className?: string;
  label?: string;
}) => {
  return (
    <div className="flex space-x-4 items-center">
      <span
        className={cn(
          "border-gray-300 h-8 w-8 animate-spin rounded-full border-8 border-t-indigo-600",
          className
        )}
      ></span>
      <span className="font-medium">{`Loading${
        label ? " " + label + " " : ""
      }...`}</span>
    </div>
  );
};

export default LoadingSpinner;
