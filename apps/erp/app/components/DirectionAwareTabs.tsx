"use client";

import { cn } from "@carbon/react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import useMeasure from "react-use-measure";

type Tab = {
  id: number;
  label: string | ReactNode;
  content: ReactNode;
  disabled?: boolean;
};

interface OgImageSectionProps {
  tabs: Tab[];
  className?: string;
  rounded?: string;
  onChange?: () => void;
  initialTabId?: number;
  tabsListClassName?: string;
  tabClassName?: string;
}

function DirectionAwareTabs({
  tabs,
  className,
  rounded,
  onChange,
  initialTabId,
  tabsListClassName,
  tabClassName
}: OgImageSectionProps) {
  const fallbackTabId = tabs[0]?.id ?? 0;
  const [activeTab, setActiveTab] = useState(
    tabs.some((tab) => tab.id === initialTabId)
      ? (initialTabId ?? fallbackTabId)
      : fallbackTabId
  );
  const [direction, setDirection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [ref, bounds] = useMeasure();

  useEffect(() => {
    const nextTabId = tabs.some((tab) => tab.id === initialTabId)
      ? (initialTabId ?? fallbackTabId)
      : fallbackTabId;

    setActiveTab((currentTab) =>
      tabs.some((tab) => tab.id === currentTab) ? currentTab : nextTabId
    );
  }, [fallbackTabId, initialTabId, tabs]);

  const content = useMemo(() => {
    const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;
    return activeTabContent || null;
  }, [activeTab, tabs]);

  const handleTabClick = (newTabId: number) => {
    if (newTabId !== activeTab && !isAnimating) {
      const newDirection = newTabId > activeTab ? 1 : -1;
      setDirection(newDirection);
      setActiveTab(newTabId);
      onChange?.();
    }
  };

  const variants = {
    initial: (direction: number) => ({
      x: 300 * direction,
      opacity: 0,
      filter: "blur(4px)"
    }),
    active: {
      x: 0,
      opacity: 1,
      filter: "blur(0px)"
    },
    exit: (direction: number) => ({
      x: -300 * direction,
      opacity: 0,
      filter: "blur(4px)"
    })
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        filter: "blur(4px)"
      }}
      animate={{
        opacity: 1,
        filter: "blur(0px)"
      }}
      transition={{ duration: 0.2, delay: 0.3 }}
      className="flex flex-col items-center w-full"
    >
      <div
        className={cn(
          "flex w-auto flex-wrap gap-1 rounded-lg cursor-pointer bg-muted p-1 shadow-inner",
          className,
          tabsListClassName,
          rounded
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            disabled={tab.disabled}
            onClick={() => handleTabClick(tab.id)}
            className={cn(
              "relative flex flex-initial items-center justify-center gap-2 rounded-md px-3.5 py-1.5 text-sm font-medium text-foreground/80 transition focus-visible:outline-1 focus-visible:outline-none focus-visible:ring-2 ring-ring ring-offset-ring",
              activeTab === tab.id
                ? "text-foreground"
                : "hover:text-foreground/60 text-foreground/80",
              rounded,
              tab.disabled && "cursor-not-allowed opacity-50",
              tabClassName
            )}
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            {activeTab === tab.id && (
              <motion.span
                layoutId="bubble"
                className="absolute inset-0 z-10 bg-background text-foreground rounded-md border"
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              />
            )}
            <span className="z-20 min-w-0 text-center">{tab.label}</span>
          </button>
        ))}
      </div>
      <MotionConfig transition={{ duration: 0.4, type: "spring", bounce: 0 }}>
        <motion.div
          className="relative mx-auto h-full w-full min-w-0 overflow-hidden"
          initial={false}
          animate={{ height: bounds.height }}
        >
          <div className="min-w-0 p-1" ref={ref}>
            <AnimatePresence
              custom={direction}
              mode="popLayout"
              onExitComplete={() => setIsAnimating(false)}
            >
              <motion.div
                className="min-w-0"
                key={activeTab}
                variants={variants}
                initial="initial"
                animate="active"
                exit="exit"
                custom={direction}
                onAnimationStart={() => setIsAnimating(true)}
                onAnimationComplete={() => setIsAnimating(false)}
              >
                {content}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </MotionConfig>
    </motion.div>
  );
}
export { DirectionAwareTabs };
