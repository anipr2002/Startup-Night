import { HTMLProps, ReactNode, FC } from "react";
import { cn } from "../lib/utils";

interface MaxWidthWrapperProps {
  children: ReactNode;
  className?: HTMLProps<HTMLElement>["className"];
}

const MaxWidthWrapper: FC<MaxWidthWrapperProps> = ({ children, className }) => {
  return (
    <div
      className={cn("mx-auto w-full max-w-screen-sm px-7 md:px-32", className)}
    >
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
