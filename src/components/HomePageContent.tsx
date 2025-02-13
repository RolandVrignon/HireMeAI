'use client';

import { useContext, useState, useEffect, useRef, useCallback } from 'react';
import { LanguageContext } from '@/providers/language-provider';
import { useTheme } from 'next-themes';
import { useChat } from 'ai/react';
import { UIInterface } from '@/types/types';
import { AuroraBackground } from '@/components/ui/aurora-background';
import MessageList from '@/components/MessageList';
import EmptyState from '@/components/EmptyState';
import InputForm, { InputFormRef } from '@/components/InputForm';

export default function HomePageContent() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isFinished, setIsFinished] = useState<boolean>(true);
    const { theme } = useTheme();

    const { language, setLanguage, translations, loadTranslations } = useContext(LanguageContext);
    const { messages, setMessages, input, setInput, handleInputChange, handleSubmit, stop } = useChat({
        api: '/api/chat',
        sendExtraMessageFields: true,
        onResponse: () => {
            setIsLoading(false);
        },
        onFinish: () => {
            setIsFinished(true);
        }
    });

    const inputFormRef = useRef<InputFormRef>(null);

    const [pendingSubmit, setPendingSubmit] = useState(false);

    const [ui, setUI] = useState<UIInterface>({
        theme: theme === 'dark' || theme === 'light' ? theme : 'dark',
        language: language,
        url: ''
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setUI(prev => ({ ...prev, url: window.location.origin }));
        }
    }, []);

    useEffect(() => {
        setUI(prev => ({
            ...prev,
            theme: theme === 'dark' || theme === 'light' ? theme : 'dark',
        }));
    }, [theme]);

    useEffect(() => {
        setUI(prev => ({ ...prev, language }));
        loadTranslations(language);
    }, [language]);

    useEffect(() => {
        if (pendingSubmit && input) {
            inputFormRef.current?.submitForm();
            setPendingSubmit(false);
        }
    }, [input, pendingSubmit]);

    const handleSubmitPrePrompt = async (content: string) => {
        setInput(content);
        setIsLoading(true);
        setIsFinished(false);
        setPendingSubmit(true);
    };

    const handleSubmitMain = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setIsFinished(false);
        handleSubmit(e);
    };

    return (
        <AuroraBackground>
            <div className="container flex flex-col h-[100dvh] p-2 md:px-8 w-full gap-2">
                <main className="flex-1 w-full glass-gradient-border overflow-hidden p-2 text-white bg-white/5 dark:bg-black/5 backdrop-blur-2xl">
                    <div className="absolute inset-0 bg-[url('/textures/noise.svg')] opacity-10 pointer-events-none" />
                    <div className="rounded-2xl overflow-hidden h-full mask">
                        {messages.length === 0 ? (
                            <EmptyState
                                handleSubmitPrePrompt={handleSubmitPrePrompt}
                                translations={translations}
                            />
                        ) : (
                            <MessageList
                                messages={messages}
                                isLoading={isLoading}
                                handleSubmitPrePrompt={handleSubmitPrePrompt}
                                translations={translations}
                                isFinished={isFinished}
                            />
                        )}
                    </div>
                </main>



                <div className="w-full">
                    <InputForm
                        ref={inputFormRef}
                        input={input}
                        setInput={handleInputChange}
                        handleSubmit={handleSubmitMain}
                        isLoading={isLoading}
                        isFinished={isFinished}
                        translations={translations}
                    />
                </div>
            </div>
        </AuroraBackground>
    );
}