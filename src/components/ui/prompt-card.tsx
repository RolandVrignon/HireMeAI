"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PromptCardProps {
  children: React.ReactNode;
  containerClassName?: string;
  className?: string;
  image: string;
  title: string;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  children,
  containerClassName,
  className,
  image,
  title
}) => {
  return (
    <motion.div
      whileHover={{
        rotateX: 5,
        rotateY: 5,
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      className={cn(
        "w-[300px] h-[200px] relative rounded-xl overflow-hidden cursor-pointer",
        containerClassName
      )}
    >
      {/* Image de fond */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      />
      
      {/* Dégradé pour le contraste */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Contenu */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <div className="text-sm opacity-90">
          {children}
        </div>
      </div>
    </motion.div>
  );
}; 