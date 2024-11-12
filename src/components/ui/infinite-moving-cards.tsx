"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { ArrowRightIcon } from 'lucide-react';
import { HoverBorderGradient } from "./hover-border-gradient";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  onPromptSelect,
  className,
}: {
  items: {
    title: string;
    content: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  onPromptSelect: (content: string) => void;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);
  const [duplicatedItems, setDuplicatedItems] = useState(items);

  useEffect(() => {
    setDuplicatedItems([...items, ...items]);
    if (containerRef.current) {
      getDirection();
      getSpeed();
    }
  }, [items]);
  
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards"
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse"
        );
      }
    }
  };

  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };

  const handleItemClick = (content: string) => {
    if (onPromptSelect) {
      onPromptSelect(content);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller container relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-4 w-max flex-nowrap animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {duplicatedItems.map((item, idx) => (
          <li
            className="flex-shrink-0"
            key={`${item.title}-${idx}`}
          >
            <div
              className={cn('group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800')}
              onClick={() => handleItemClick(item.content)}
            >
              <HoverBorderGradient className="inline-flex items-center justify-center px-4 py-1 transition ease-out">
                <span>{item.title}</span>
                <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
              </HoverBorderGradient>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
