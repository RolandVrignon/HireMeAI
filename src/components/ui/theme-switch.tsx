"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <motion.button
      className={`w-16 h-8 rounded-full p-1 transition-colors duration-200 ${
        isDark ? "bg-background/20 backdrop-blur-md" : "bg-gray-200"
      }`}
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
    >
      <motion.div
        className="w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center"
        animate={{
          x: isDark ? "130%" : "0%",
        }}
        transition={{
          type: "spring",
          stiffness: 700,
          damping: 30,
        }}
      >
        {isDark ? (
          <Moon className="w-4 h-4 text-blue-600" />
        ) : (
          <Sun className="w-4 h-4 text-yellow-500" />
        )}
      </motion.div>
    </motion.button>
  )
}