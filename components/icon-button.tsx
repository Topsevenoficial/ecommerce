import { cn } from "@/lib/utils";
import React from "react";

interface IconButtonProps {
  onClick: () => void;
  icon: React.ReactElement;
  className?: string;
}

const IconButton = (props: IconButtonProps) => {
  const { onClick, icon, className } = props;

  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full flex items-center bg-white dark:bg-secondary border shadow-md p-2 hover:opacity-80 transition",
        className
      )}
    >
      {icon}
    </button>
  );
};

export default IconButton;
