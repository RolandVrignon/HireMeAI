'use client';

import { useContext, useState, useEffect, useRef, useCallback } from 'react';
import { LanguageContext } from '@/providers/language-provider';
import { useTheme } from 'next-themes';
import { Message, useChat } from 'ai/react';
import { UIInterface } from '@/types/types';
import { AuroraBackground } from '@/components/ui/aurora-background';
import MessageList from '@/components/MessageList';
import EmptyState from '@/components/EmptyState';
import InputForm, { InputFormRef } from '@/components/InputForm';

export default function HomePageContent() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isFinished, setIsFinished] = useState<boolean>(true);
    const { theme } = useTheme();
    const containerRef = useRef<HTMLDivElement>(null);
    const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
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
        theme: theme === 'dark' ? 'dark' : 'light',
        language: language,
        url: ''
    });

    const [hasUserScrolled, setHasUserScrolled] = useState(false);

    useEffect(() => {
        setUI(prev => ({
            ...prev,
            theme: theme === 'dark' ? 'dark' : 'light',
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

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            setHasUserScrolled(true);
        };

        container.addEventListener('wheel', handleScroll);
        return () => container.removeEventListener('wheel', handleScroll);
    }, []);

    useEffect(() => {
        const handleImagesLoaded = () => {
            // Vérifier si le dernier message contient un PhotoGrid
            const lastMessage = messages[messages.length - 1];
            const hasPhotoGrid = lastMessage?.parts?.some(
                part => part.type === 'tool-invocation' && part.toolInvocation.toolName === 'getPhotos'
            );

            if (messages.length > 1 && 
                messages[messages.length - 1].role === 'user' && 
                !hasUserScrolled &&
                hasPhotoGrid) {
                scrollToLastUserMessage(messages[messages.length - 1]);
            }
        };

        window.addEventListener('imagesLoaded', handleImagesLoaded);
        return () => window.removeEventListener('imagesLoaded', handleImagesLoaded);
    }, [messages, hasUserScrolled]);

    // Garder l'effet de scroll original pour les autres cas
    useEffect(() => {
        if (messages.length > 1 && 
            messages[messages.length - 1].role === 'user' && 
            !hasUserScrolled) {
            scrollToLastUserMessage(messages[messages.length - 1]);
        }
    }, [messages, hasUserScrolled]);

    const handleSubmitPrePrompt = async (content: string) => {
        setInput(content);
        setIsLoading(true);
        setIsFinished(false);
        setPendingSubmit(true);
        setHasUserScrolled(false);
    };

    const handleSubmitMain = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setIsFinished(false);
        handleSubmit(e);
    };
    
    const scrollToLastUserMessage = (message: Message) => {
        const messageElement = messageRefs.current[message.id];
        if (messageElement) {
            messageElement.scrollIntoView({ behavior: 'smooth' });
        }   
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
                                ui={ui}
                            />
                        ) : (
                            <MessageList
                                messages={messages}
                                isLoading={isLoading}
                                handleSubmitPrePrompt={handleSubmitPrePrompt}
                                translations={translations}
                                isFinished={isFinished}
                                containerRef={containerRef}
                                messageRefs={messageRefs}
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