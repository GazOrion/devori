import { cn } from "@/lib/utils";

type SectionGradientDividerProps = {
  className?: string;
};

export function SectionGradientDivider({ className }: SectionGradientDividerProps) {
  return (
    <div
      className={cn(
        "relative z-[25] flex w-full justify-center bg-[#07030f] py-10",
        className,
      )}
      aria-hidden
    >
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#66B3FF]/55 to-transparent" />
    </div>
  );
}
