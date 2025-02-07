'use client';

import { useContext, useState, useEffect, useRef } from 'react';
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
    const { theme } = useTheme();

    const { language, setLanguage, translations, loadTranslations } = useContext(LanguageContext);
    const { messages, input, setInput, handleInputChange, handleSubmit, stop } = useChat({
        api: '/api/chat',
        onResponse: () => {
            console.log('onResponse')
            setIsLoading(false);
        }
    });

    const inputFormRef = useRef<InputFormRef>(null);

    const [pendingSubmit, setPendingSubmit] = useState(false);

    useEffect(() => {
        console.log('messages:', messages)
        console.log('translations:', translations)
    }, [])

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
        setPendingSubmit(true);
    };

    const handleSubmitMain = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        handleSubmit(e);
    };

    return (
        <AuroraBackground blur={true}>
            <div className="container flex flex-col h-[100dvh] p-2 md:px-8 w-full gap-2">
                <main className="flex-1 w-full bg-blue-700/5 dark:bg-white/5 backdrop-blur-md rounded-3xl overflow-hidden relative p-2">
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
                        translations={translations}
                    />
                </div>
            </div>
        </AuroraBackground>
    );
}