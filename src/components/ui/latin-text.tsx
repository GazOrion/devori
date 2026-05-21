import type { ReactNode } from "react";

const LATIN_SEQUENCE = /[A-Za-z][A-Za-z0-9/.+-]*/g;

type LatinTextProps = {
  children: string;
  className?: string;
  latinClassName?: string;
};

export function LatinText({
  children,
  className,
  latinClassName = "tracking-[0.1em]",
}: LatinTextProps) {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of children.matchAll(LATIN_SEQUENCE)) {
    const start = match.index ?? 0;

    if (start > lastIndex) {
      nodes.push(children.slice(lastIndex, start));
    }

    nodes.push(
      <span key={start} className={latinClassName}>
        {match[0]}
      </span>,
    );

    lastIndex = start + match[0].length;
  }

  if (lastIndex < children.length) {
    nodes.push(children.slice(lastIndex));
  }

  return <span className={className}>{nodes}</span>;
}
