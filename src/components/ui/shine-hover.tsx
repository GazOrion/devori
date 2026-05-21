import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const shineBeforeBase =
  "relative cursor-pointer overflow-hidden before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.6)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat";

/**
 * Блик только при наведении (градиент + сдвиг background-position).
 */
export const shineHoverClassName = cn(
  shineBeforeBase,
  "before:transition-[background-position] before:duration-1000 before:ease-out hover:before:bg-[position:-100%_0,0_0] motion-reduce:before:transition-none motion-reduce:hover:before:bg-[position:200%_0,0_0]",
);

/**
 * Блик по циклу + ускорение при hover (тот же градиент, animation вместо transition).
 */
export const shineAutoClassName = cn(
  shineBeforeBase,
  "before:[animation:devori-shine-sweep_3.6s_ease-in-out_infinite] hover:before:[animation-duration:1.1s] motion-reduce:before:[animation:none]",
);

export type ShineHoverProps = React.ComponentPropsWithoutRef<"a"> & {
  asChild?: boolean;
  /** Бесконечный блик без наведения (для нижней CTA). */
  autoShine?: boolean;
};

export function ShineHover({
  className,
  asChild = false,
  autoShine = false,
  ...props
}: ShineHoverProps) {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp className={cn(autoShine ? shineAutoClassName : shineHoverClassName, className)} {...props} />
  );
}

/** Демо из гида; проект использует Base UI Button, не radix-обёртку из старого shadcn. */
export function ButtonShineHoverDemo() {
  return (
    <Button
      className={cn(
        shineHoverClassName,
        "rounded-md text-white hover:bg-blue-500/80",
        "border-0 bg-blue-500 shadow-none focus-visible:ring-offset-0",
      )}
    >
      Shine Hover
    </Button>
  );
}
