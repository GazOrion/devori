"use client";

import { type ReactNode, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface NativeHoverCardProps {
  imageSrc: string;
  imageAlt?: string;
  name: string;
  username?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  buttonContent?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  variant?: "default" | "glass" | "bordered";
}

const imageSizeVariants = {
  sm: "h-16 w-16",
  md: "h-24 w-24",
  lg: "h-32 w-32",
  xl: "h-40 w-40",
};

const cardWidthVariants = {
  sm: "w-56",
  md: "w-72",
  lg: "w-80",
  xl: "w-96",
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export function AvatarHoverCard({
  imageSrc,
  imageAlt,
  name,
  username,
  description,
  buttonText = "Открыть профиль",
  onButtonClick,
  buttonContent,
  size = "md",
  className,
  variant = "glass",
}: NativeHoverCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getVariantStyles = () => {
    switch (variant) {
      case "glass":
        return "bg-background/80 backdrop-blur-md border border-white/10";
      case "bordered":
        return "bg-card border-2 border-primary/20";
      default:
        return "bg-card border border-border";
    }
  };

  const avatarElement = (
    <Avatar className="h-full w-full">
      <AvatarImage src={imageSrc || "/placeholder.svg"} alt={imageAlt || name} />
      <AvatarFallback>{getInitials(name)}</AvatarFallback>
    </Avatar>
  );

  return (
    <motion.div
      className={cn("relative inline-block", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={false}
      animate={{ width: isHovered ? "auto" : "fit-content" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <motion.div
        className={cn(
          "relative overflow-hidden rounded-full border border-white/10 bg-white/6",
          imageSizeVariants[size],
        )}
        layout
        animate={{ padding: isHovered ? "8px" : "0px" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {avatarElement}
      </motion.div>

      <AnimatePresence>
        {isHovered ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute left-0 top-0 z-10 overflow-hidden rounded-xl shadow-lg",
              cardWidthVariants[size],
              getVariantStyles(),
            )}
            style={{ pointerEvents: "auto" }}
          >
            <div className="relative">
              <motion.div className={cn("relative p-2", imageSizeVariants[size])}>
                {avatarElement}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                transition={{ delay: 0.1, duration: 0.2 }}
                className="space-y-3 p-4"
              >
                <div>
                  <motion.h3
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="text-lg font-bold leading-tight text-foreground"
                  >
                    {name}
                  </motion.h3>
                  {username ? (
                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.18 }}
                      className="text-sm text-muted-foreground"
                    >
                      @{username}
                    </motion.p>
                  ) : null}
                </div>

                {description ? (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="line-clamp-2 text-sm leading-relaxed text-foreground/80"
                  >
                    {description}
                  </motion.p>
                ) : null}

                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  {buttonContent ? (
                    buttonContent
                  ) : (
                    <Button onClick={onButtonClick} size="sm" className="w-full">
                      {buttonText}
                    </Button>
                  )}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
