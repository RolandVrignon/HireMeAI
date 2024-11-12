"use client";

import { useChat } from 'ai/react';
import { AuroraBackground } from "@/components/ui/aurora-background";
import Navbar from '../components/ui/Navbar';
import MessageList from '../components/ui/MessageList';
import EmptyState from '../components/ui/EmptyState';
import InputForm from '../components/ui/InputForm';
import { useEffect, useRef } from 'react';

export default function Home() {
    const { messages, input, handleInputChange, handleSubmit, isLoading, stop, setInput } = useChat();
    const pendingSubmitRef = useRef<string | null>(null);

    useEffect(() => {
        if (pendingSubmitRef.current && pendingSubmitRef.current === input) {
            const syntheticEvent = {
                preventDefault: () => {},
            } as React.FormEvent;
            
            handleSubmit(syntheticEvent);
            pendingSubmitRef.current = null;
        }
    }, [input, handleSubmit]);

    const handlePromptSelect = (content: string) => {
        pendingSubmitRef.current = content;
        setInput(content);
    };

    const onSubmit = () => {
        const syntheticEvent = {
            preventDefault: () => {},
        } as React.FormEvent;

        if (input.trim()) {
            handleSubmit(syntheticEvent);
        }
    };

    return (
        <AuroraBackground>
            <div className="flex flex-col h-screen w-full z-40">
                <Navbar />
                <main className="flex-1 overflow-hidden relative">
                    {messages.length === 0 ? (
                        <EmptyState 
                            onPromptSelect={handlePromptSelect} 
                            onSubmit={onSubmit}
                        />
                    ) : (
                        <MessageList messages={messages} onPromptSelect={handlePromptSelect} onSubmit={onSubmit} isLoading={isLoading}/>
                    )}
                </main>
                <div className="fixed bottom-3 left-0 right-0 container mx-auto">
                    <InputForm 
                        input={input} 
                        handleInputChange={handleInputChange} 
                        handleSubmit={handleSubmit}
                        isLoading={isLoading}
                        stop={stop}
                    />
                </div>
            </div>
        </AuroraBackground>
    );
}
