"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import styles from "@/components/ui/faq-accordion-block.module.css";
import { cn } from "@/lib/utils";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqAccordionBlockProps = {
  items: FaqItem[];
};

export function FaqAccordionBlock({ items }: FaqAccordionBlockProps) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className={styles.list}>
      {items.map((item, index) => {
        const open = index === openIndex;

        return (
          <article
            key={item.question}
            className={cn(styles.glassItem, styles.item, open && styles.open)}
          >
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? -1 : index)}
              className={styles.titleBox}
            >
              <h3 className={styles.title}>{item.question}</h3>
              <ChevronDown className={styles.titleButton} aria-hidden />
            </button>
            <div className={styles.textBox}>
              <div className={styles.textBoxContent}>
                <p className={styles.answer}>{item.answer}</p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
