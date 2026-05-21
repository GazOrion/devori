"use client";

import { cn } from "@/lib/utils";
import type { CSSProperties, ReactNode } from "react";

type TColorProp = string | string[];

export interface ShineBorderProps {
  borderRadius?: number;
  borderWidth?: number;
  duration?: number;
  color?: TColorProp;
  className?: string;
  /** Фон карточки под контентом */
  surfaceClassName?: string;
  /** Бесконечная анимация обводки — дорого для CPU; по умолчанию выкл. */
  animated?: boolean;
  children: React.ReactNode;
}

/**
 * Анимированная обводка: маска оставляет только кольцо; слой рисуется поверх контента (pointer-events: none).
 */
function ShineBorder({
  borderRadius,
  borderWidth = 1,
  duration = 14,
  color = "#000000",
  className,
  surfaceClassName,
  animated = false,
  children,
}: ShineBorderProps) {
  const radialStops = typeof color === "string" ? color : color.join(", ");

  const outerStyle = {
    ...(borderRadius != null ? { "--border-radius": `${borderRadius}px` } : {}),
    "--border-width": `${borderWidth}px`,
  } as CSSProperties;

  const shineStyle = {
    "--border-width": `${borderWidth}px`,
    ...(borderRadius != null ? { "--border-radius": `${borderRadius}px` } : {}),
    "--shine-pulse-duration": `${duration}s`,
    "--mask-linear-gradient": "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    "--background-radial-gradient": `radial-gradient(transparent, transparent, ${radialStops}, transparent, transparent)`,
  } as CSSProperties;

  const radiusBefore =
    borderRadius != null ? "before:rounded-[length:var(--border-radius)]" : "before:rounded-[inherit]";

  return (
    <div
      style={outerStyle}
      className={cn(
        "relative flex h-full w-full min-h-0 flex-col overflow-hidden",
        className,
      )}
    >
      {surfaceClassName ? (
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 z-0",
            borderRadius != null ? "rounded-[length:var(--border-radius)]" : "rounded-[inherit]",
            surfaceClassName,
          )}
        />
      ) : null}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">{children}</div>
      <div
        style={shineStyle}
        className={cn(
          "pointer-events-none absolute inset-0 z-20",
          borderRadius != null ? "rounded-[length:var(--border-radius)]" : "rounded-[inherit]",
          "before:absolute before:inset-0 before:aspect-square before:size-full",
          radiusBefore,
          "before:p-[length:var(--border-width)] before:will-change-[background-position] before:content-['']",
          "before:[-webkit-mask-composite:xor] before:![mask-composite:exclude]",
          "before:[-webkit-mask:var(--mask-linear-gradient)] before:[mask:var(--mask-linear-gradient)]",
          "before:[background-image:var(--background-radial-gradient)] before:[background-size:300%_300%]",
          animated &&
            "motion-safe:before:animate-[shine-pulse_var(--shine-pulse-duration)_linear_infinite]",
          "motion-reduce:before:animate-none",
          !animated && "before:bg-[position:50%_50%]",
        )}
      />
    </div>
  );
}

export { ShineBorder };
