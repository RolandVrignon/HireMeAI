"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  handleSubmitPrePrompt,
  className,
}: {
  items: {
    title: string;
    content: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  handleSubmitPrePrompt: (content : string) => void;
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
    if (handleSubmitPrePrompt) {
        handleSubmitPrePrompt(content);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl mt-2 overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
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
              className={cn('group rounded-full bg-gray-700/5 text-black dark:text-white dark:bg-white/5 dark:hover:bg-white/10 dark:backdrop-blur-md text-base transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5')}
              onClick={() => handleItemClick(item.content)}
            >
              <div className="flex items-center justify-center px-2 py-1 transition ease-out">
                <span className="font-doto text-xs" >{item.title}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
