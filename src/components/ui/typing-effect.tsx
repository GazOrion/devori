"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: unknown[]) {
  return twMerge(clsx(inputs));
}

export type TypingOrchestrationStep =
  | { type: "type"; text: string }
  | { type: "delete"; until: string };

interface TypingEffectProps {
  texts?: string[];
  className?: string;
  rotationInterval?: number;
  typingSpeed?: number;
  deleteSpeed?: number;
  /** Для выбранного индекса в `texts` — кастомная сцепка фаз вместо простой печати строки целиком. */
  orchestrations?: Record<number, TypingOrchestrationStep[]>;
}

const DEMO = ["Дизайн", "Разработка", "Маркетинг"];

export const TypingEffect = ({
  texts = DEMO,
  className,
  rotationInterval = 3000,
  typingSpeed = 150,
  deleteSpeed = 55,
  orchestrations = {},
}: TypingEffectProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [orchPhase, setOrchPhase] = useState(0);
  const [orchSubIndex, setOrchSubIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });

  const currentText = texts[currentTextIndex % texts.length];
  const currentOrch = orchestrations[currentTextIndex % texts.length];

  useEffect(() => {
    if (!isInView) return;

    if (currentOrch?.length) {
      if (orchPhase >= currentOrch.length) {
        const t = setTimeout(() => {
          setDisplayedText("");
          setCharIndex(0);
          setOrchPhase(0);
          setOrchSubIndex(0);
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        }, rotationInterval);
        return () => clearTimeout(t);
      }

      const step = currentOrch[orchPhase]!;

      if (step.type === "type") {
        if (orchSubIndex < step.text.length) {
          const t = setTimeout(() => {
            setDisplayedText((prev) => prev + step.text.charAt(orchSubIndex));
            setOrchSubIndex((i) => i + 1);
          }, typingSpeed);
          return () => clearTimeout(t);
        }
        const t = setTimeout(() => {
          setOrchPhase((p) => p + 1);
          setOrchSubIndex(0);
        }, 0);
        return () => clearTimeout(t);
      }

      if (displayedText !== step.until) {
        const t = setTimeout(() => {
          setDisplayedText((prev) => prev.slice(0, -1));
        }, deleteSpeed);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => {
        setOrchPhase((p) => p + 1);
        setOrchSubIndex(0);
      }, 0);
      return () => clearTimeout(t);
    }

    if (charIndex < currentText.length) {
      const typingTimeout = setTimeout(() => {
        setDisplayedText((prev) => prev + currentText.charAt(charIndex));
        setCharIndex(charIndex + 1);
      }, typingSpeed);

      return () => clearTimeout(typingTimeout);
    }

    const changeLabelTimeout = setTimeout(() => {
      setDisplayedText("");
      setCharIndex(0);
      setOrchPhase(0);
      setOrchSubIndex(0);
      setCurrentTextIndex((prev) => (prev + 1) % texts.length);
    }, rotationInterval);

    return () => clearTimeout(changeLabelTimeout);
  }, [
    charIndex,
    currentOrch,
    currentText,
    deleteSpeed,
    displayedText,
    isInView,
    orchPhase,
    orchSubIndex,
    rotationInterval,
    texts.length,
    typingSpeed,
  ]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative inline-flex items-center justify-center text-center text-4xl font-bold",
        className,
      )}
    >
      {displayedText}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
        className={cn("ml-1 h-[1em] w-1 rounded-sm bg-current")}
      />
    </div>
  );
};

export default TypingEffect;
