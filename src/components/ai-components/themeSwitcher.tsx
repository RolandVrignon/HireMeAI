"use client";

import { useTheme } from "next-themes";
import React, { useEffect, useContext, useState } from "react";
import { Sun, Moon, Ban } from "lucide-react";
import { FunctionAlert } from "@/components/ui/functionAlert";
import { Language, Theme } from "@/types/types"

// Importation des fichiers JSON de textes par langue
import enText from '@/locales/en/text.json';
import frText from '@/locales/fr/text.json';
import esText from '@/locales/es/text.json';
import nlText from '@/locales/nl/text.json';
import deText from '@/locales/de/text.json';

const themeTextMap = {
    en: enText,
    fr: frText,
    es: esText,
    nl: nlText,
    de: deText
};

type ThemeProps = {
    themeProvided: Theme,
    language: Language
};

export const ThemeSwitcher = ({ themeProvided, language }: ThemeProps) => {
    const { theme, setTheme } = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    const [themeChanged, setThemeChanged] = useState(false);

    const currentThemeText = themeTextMap[language];

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
                message={currentThemeText?.functions.theme.loading || "Changing theme"}
            />
        );
    }

    if (!isLoading && themeChanged) {
        return (
            <FunctionAlert
                status="success"
                message={currentThemeText?.functions.theme.success.replace("{{theme}}", currentThemeText?.themes[themeProvided]) || `Theme changed to ${themeProvided} mode`}
                icon={themeProvided === "light" ? Sun : Moon}
            />
        );
    }
    
    if (!isLoading && !themeChanged) {
        return (
            <FunctionAlert
                status="error"
                message={currentThemeText?.functions.theme.error.replace("{{theme}}", currentThemeText?.themes[themeProvided]) || `Theme already set to ${themeProvided} mode`}
                icon={Ban}
            />
        );
    }
};
