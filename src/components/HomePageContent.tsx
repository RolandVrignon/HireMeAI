'use client';

import { useContext, useState, useEffect } from 'react';
import { LanguageContext } from '@/providers/language-provider';
import { useTheme } from 'next-themes';
import { useActions, useUIState, readStreamableValue } from 'ai/rsc';
import { generateId } from 'ai';

import { ClientMessage, Language, UIInterface } from '@/types/types';

import { AuroraBackground } from '@/components/ui/aurora-background';
import MessageList from '@/components/MessageList';
import EmptyState from '@/components/EmptyState';
import InputForm from '@/components/InputForm';

export default function HomePageContent() {
    const [input, setInput] = useState<string>('');
    const [conversation, setConversation] = useUIState();
    const { continueConversation } = useActions();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { theme } = useTheme();
    const { language, setLanguage, translations, loadTranslations } = useContext(LanguageContext);

    const [ui, setUI] = useState<UIInterface>({
        theme: theme === 'dark' || theme === 'light' ? theme : 'dark',
        language: language,
        url: ''
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setUI((prevUI) => ({
                ...prevUI,
                url: window.location.origin
            }));
        }
    }, []);

    useEffect(() => {
        setUI((prevUI) => ({
            ...prevUI,
            theme: theme === 'dark' || theme === 'light' ? theme : 'dark',
        }));
    }, [theme]);

    useEffect(() => {
        setUI((prevUI) => ({
            ...prevUI,
            language: language,
        }));
        loadTranslations(language)
    }, [language]);

    const createMessage = (text: string) => {
        return {
            id: generateId(),
            role: 'user',
            display: text,
            date: new Date(),
        };
    };

    const handleSubmitPrePrompt = async (content: string) => {
        setConversation((currentConversation: ClientMessage[]) => [
            ...currentConversation,
            createMessage(content),
        ]);

        setInput('');
        setIsLoading(true);

        try {
            const { loadingState, ...message } = await continueConversation(content, ui);
            setConversation((currentConversation: ClientMessage[]) => [
                ...currentConversation,
                message,
            ]);

            for await (const state of readStreamableValue(loadingState)) {
                setIsLoading((state as { loading: boolean }).loading);
            }
        } catch (error) {
            console.error('Erreur lors de la conversation:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        setConversation((currentConversation: ClientMessage[]) => [
            ...currentConversation,
            createMessage(input),
        ]);

        setInput('');
        setIsLoading(true);

        try {
            const { loadingState, ...message } = await continueConversation(input, ui);
            setConversation((currentConversation: ClientMessage[]) => [
                ...currentConversation,
                message,
            ]);

            for await (const state of readStreamableValue(loadingState)) {
                setIsLoading((state as { loading: boolean }).loading);
            }
        } catch (error) {
            console.error('Erreur lors de la conversation:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLanguageChange = (newLanguage: Language) => {
        setLanguage(newLanguage);
        loadTranslations(newLanguage);
    };

    return (
        <AuroraBackground blur={conversation?.length > 0}>
            <div className="container flex flex-col h-[100dvh] p-2 md:px-8 w-full gap-2">
                <main className="flex-1 w-full bg-blue-700/5 dark:bg-white/5 backdrop-blur-md rounded-3xl overflow-hidden relative p-2">
                    <div className="rounded-2xl overflow-hidden h-full mask">
                        {conversation.length === 0 ? (
                            <EmptyState handleSubmitPrePrompt={handleSubmitPrePrompt} translations={translations} />
                        ) : (
                            <MessageList
                                conversation={conversation}
                                isLoading={isLoading}
                                handleSubmitPrePrompt={handleSubmitPrePrompt}
                                translations={translations}
                            />
                        )}
                    </div>
                </main>
                <div className="w-full">
                    <InputForm
                        input={input}
                        setInput={(e) => setInput(e.target.value)}
                        handleSubmit={handleSubmit}
                        isLoading={isLoading}
                        translations={translations}
                    />
                </div>
            </div>
        </AuroraBackground>
    );
}
