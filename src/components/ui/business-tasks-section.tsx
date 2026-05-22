import { businessTaskRows } from "@/data/business-tasks";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { cn } from "@/lib/utils";
import sectionHeading from "./section-heading.module.css";
import styles from "./business-tasks-section.module.css";

export function BusinessTasksSection() {
  return (
    <section
      id="business-tasks"
      className={`relative z-20 -mt-24 w-full rounded-[3.25rem] ${styles.section}`}
    >
      <ScrollReveal className="mx-auto w-full max-w-[1680px] px-[5vw] py-28 md:px-[6vw] md:py-32 lg:px-[7vw]">
        <h2 className={`font-heading ${sectionHeading.heading} ${sectionHeading.dark} ${sectionHeading.center}`}>
          Реализация любой задачи бизнеса
        </h2>

        <div className={styles.rows}>
          {businessTaskRows.map((row, rowIndex) => (
            <div key={rowIndex} className={styles.row}>
              {row.map((item) => (
                <div
                  key={item.label}
                  className={`${styles.tile} ${styles.tileClickable}`}
                >
                  <span
                    className={cn(
                      styles.tileLabel,
                      item.compact && styles.tileLabelCompact,
                    )}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <p className={styles.footerNote}>и многие другие</p>
      </ScrollReveal>
    </section>
  );
}
