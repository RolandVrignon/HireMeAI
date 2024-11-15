"use client";

import React, { useEffect, useContext, useState } from "react";
import { LanguageContext, Language } from '@/providers/language-provider';
import { FunctionAlert } from "@/components/ui/functionAlert";
import { Languages, Ban } from "lucide-react";

export const LanguageSwitcher = ({ newLanguage }: { newLanguage: any }) => {
    const { language, setLanguage } = useContext(LanguageContext);
    const [isLoading, setIsLoading] = useState(true);
    const [languageChange, setLanguageChanged] = useState(false);

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
                message="Changing Language"
            />
        );
    }
    if (!isLoading && languageChange) {
        return (
            <FunctionAlert
                status="success"
                message={`Language changed to ${newLanguage}`}
                icon={Languages}
            />
        );
    } else if (!isLoading && !languageChange) {
        return (
            <FunctionAlert
                status="error"
                message={`Language already set to ${newLanguage}`}
                icon={Ban}
            />
        )
    }
};
