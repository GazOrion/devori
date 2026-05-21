"use client";

import { type ElementType, type JSX, useCallback, useEffect, useState } from "react";
import { motion, type MotionProps } from "framer-motion";

type TextScrambleProps = {
  children: string;
  duration?: number;
  speed?: number;
  characterSet?: string;
  as?: ElementType;
  className?: string;
  trigger?: boolean;
  onScrambleComplete?: () => void;
} & MotionProps;

const defaultChars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function TextScramble({
  children,
  duration = 0.8,
  speed = 0.04,
  characterSet = defaultChars,
  className,
  as: Component = "span",
  trigger = true,
  onScrambleComplete,
  ...props
}: TextScrambleProps) {
  const MotionComponent = motion.create(
    Component as keyof JSX.IntrinsicElements,
  );
  const [displayText, setDisplayText] = useState(children);
  const [isAnimating, setIsAnimating] = useState(false);
  const text = children;

  useEffect(() => {
    setDisplayText(children);
  }, [children]);

  const scramble = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);

    const steps = Math.max(1, Math.floor(duration / speed));
    let step = 0;

    const interval = window.setInterval(() => {
      const progress = step / steps;
      let scrambled = "";

      for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") {
          scrambled += " ";
          continue;
        }

        if (progress * text.length > i) {
          scrambled += text[i];
        } else {
          scrambled +=
            characterSet[Math.floor(Math.random() * characterSet.length)];
        }
      }

      setDisplayText(scrambled);
      step++;

      if (step > steps) {
        window.clearInterval(interval);
        setDisplayText(text);
        setIsAnimating(false);
        onScrambleComplete?.();
      }
    }, speed * 1000);
  }, [characterSet, duration, isAnimating, onScrambleComplete, speed, text]);

  useEffect(() => {
    if (!trigger) return;
    scramble();
  }, [scramble, trigger]);

  return (
    <MotionComponent className={className} {...props}>
      {displayText}
    </MotionComponent>
  );
}
