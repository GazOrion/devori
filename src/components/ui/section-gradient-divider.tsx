import { zSection } from "@/lib/layer-z-index";
import { cn } from "@/lib/utils";

type SectionGradientDividerProps = {
  className?: string;
};

export function SectionGradientDivider({ className }: SectionGradientDividerProps) {
  return (
    <div
      className={cn(
        `relative ${zSection.gradientDivider} flex w-full justify-center bg-[#07030f] px-[5vw] py-8 md:px-[6vw] md:py-10 lg:px-[7vw]`,
        className,
      )}
      aria-hidden
    >
      <div className="h-px w-full max-w-[1680px] bg-gradient-to-r from-transparent via-[#66B3FF]/70 to-transparent" />
    </div>
  );
}
