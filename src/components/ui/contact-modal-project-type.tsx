"use client";

import { memo } from "react";

import { cn } from "@/lib/utils";

import styles from "./contact-modal-project-type.module.css";

export const PROJECT_TYPES = [
  { id: "development", label: "Разработка" },
  { id: "support", label: "Тех. поддержка" },
  { id: "outstaff", label: "Аутстафф" },
] as const;

export type ProjectTypeId = (typeof PROJECT_TYPES)[number]["id"];

type ContactModalProjectTypeProps = {
  value: ProjectTypeId[];
  onToggle: (id: ProjectTypeId) => void;
  error: string | null;
  errorId?: string;
};

export const ContactModalProjectType = memo(function ContactModalProjectType({
  value,
  onToggle,
  error,
  errorId,
}: ContactModalProjectTypeProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-[0.86rem] font-medium text-[#b8cceb]">Тип проекта</legend>
      <div
        role="group"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={styles.tiles}
      >
        {PROJECT_TYPES.map((type) => {
          const selected = value.includes(type.id);

          return (
            <button
              key={type.id}
              type="button"
              role="checkbox"
              aria-checked={selected}
              onClick={() => onToggle(type.id)}
              className={cn(
                styles.tile,
                selected && styles.tileSelected,
                error && !selected && styles.tileError,
              )}
            >
              {type.label}
            </button>
          );
        })}
      </div>
      {error ? (
        <p id={errorId} className="text-[0.84rem] text-red-300">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
});
