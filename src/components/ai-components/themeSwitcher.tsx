"use client";

import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { Sun, Moon, Ban } from "lucide-react";
import { FunctionAlert } from "@/components/ui/functionAlert";

type ThemeProps = {
    themeProvided: string
};

export const ThemeSwitcher = ({ themeProvided }: ThemeProps) => {
    const { theme, setTheme } = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    const [themeChanged, setThemeChanged] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            if (theme !== themeProvided && (themeProvided === "dark" || themeProvided === "light")) {
                setTheme(themeProvided);
                setThemeChanged(true);
            } else {
                setThemeChanged(false);
            }
            setIsLoading(false);
        }, 1000);
    }, [themeProvided]);

    if (isLoading) {
        return (
            <FunctionAlert
                status="pending"
                message="Changing theme"
            />
        );
    }
    if (!isLoading && themeChanged) {
        return (
            <FunctionAlert
                status="success"
                message={`Theme changed to ${themeProvided} mode`}
                icon={themeProvided === "light" ? Sun : Moon}
            />
        );
    } else if (!isLoading && !themeChanged) {
        return (
            <FunctionAlert
                status="error"
                message={`Theme already set to ${themeProvided} mode`}
                icon={Ban}
            />
        )
    }
};
