import { cn } from "@/lib/utils";
import Image from "next/image";
import calvaryLogo from "../../public/admin_system_minimal.png";

const LoadingSpinner = ({
  className,
  label,
}: {
  className?: string;
  label?: string;
}) => {
  return (
    <div className="flex flex-col w-full items-center space-y-4">
      <div className="animate-pulse">
        <Image
          src={calvaryLogo}
          alt="Calvary Carpentry Pte Ltd"
          className="w-[200px] h-auto"
        />
      </div>

      <div className="flex space-x-4 items-center text-gray-500">
        <span
          className={cn(
            "border-gray-300 h-8 w-8 animate-spin rounded-full border-4 border-t-indigo-600",
            className
          )}
        ></span>
        <span className="font-medium">{`Loading${label ? " " + label + " " : ""
          }...`}</span>
      </div>

      <p className="text-gray-500">
        {`This may take a few seconds, please don't close this page.`}
      </p>
    </div>
  );
};

export default LoadingSpinner;
