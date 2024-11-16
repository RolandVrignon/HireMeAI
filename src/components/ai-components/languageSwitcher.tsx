"use client";

import React, { useEffect, useContext, useState } from "react";
import { LanguageContext } from '@/providers/language-provider';
import { FunctionAlert } from "@/components/ui/functionAlert";
import { Languages, Ban } from "lucide-react";
import { Language } from "@/types/types"

// Importation des fichiers JSON de textes par langue
import enText from '@/locales/en/text.json';
import frText from '@/locales/fr/text.json';
import esText from '@/locales/es/text.json';
import nlText from '@/locales/nl/text.json';
import deText from '@/locales/de/text.json';

const languageTextMap = {
    en: enText,
    fr: frText,
    es: esText,
    nl: nlText,
    de: deText
};

type LanguageProps = {
    newLanguage: Language
};

export const LanguageSwitcher = ({ newLanguage }: LanguageProps) => {
    const { language, setLanguage } = useContext(LanguageContext);
    const [isLoading, setIsLoading] = useState(true);
    const [languageChange, setLanguageChanged] = useState(false);

    const currentLanguageText = languageTextMap[newLanguage];

    useEffect(() => {
        setTimeout(() => {
            if (language !== newLanguage) {
                setLanguage(newLanguage);
                setLanguageChanged(true);
            } else {
                setLanguageChanged(false);
            }
            setIsLoading(false);
        }, 1000);
    }, [newLanguage]);

    if (isLoading) {
        return (
            <FunctionAlert
                status="pending"
                message={currentLanguageText?.functions.language.loading || "Changing Language"}
            />
        );
    }

    if (!isLoading && languageChange) {
        return (
            <FunctionAlert
                status="success"
                message={currentLanguageText?.functions.language.success.replace("{{language}}", currentLanguageText?.languages[newLanguage]) || `Language changed to ${newLanguage}`}
                icon={Languages}
            />
        );
    }
    
    if (!isLoading && !languageChange) {
        return (
            <FunctionAlert
                status="error"
                message={currentLanguageText?.functions.language.error.replace("{{language}}", currentLanguageText?.languages[newLanguage]) || `Language already set to ${newLanguage}`}
                icon={Ban}
            />
        );
    }
};
