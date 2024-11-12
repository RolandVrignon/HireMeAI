"use client";

import { useChat } from 'ai/react';
import { AuroraBackground } from "@/components/ui/aurora-background";
import Navbar from '../components/ui/Navbar';
import MessageList from '../components/ui/MessageList';
import EmptyState from '../components/ui/EmptyState';
import InputForm from '../components/ui/InputForm';

export default function Home() {
    const { messages, input, handleInputChange, handleSubmit, isLoading, stop, setInput } = useChat();

    const handlePromptSelect = (content: string) => {
        setInput(content);
    };

    return (
        <AuroraBackground>
            <div className="flex flex-col h-screen w-full z-40">
                <Navbar />
                <main className="flex-1 overflow-hidden relative pt-[7vh] md:pt-[5vh]">
                    {messages.length === 0 ? (
                        <EmptyState onPromptSelect={handlePromptSelect} />
                    ) : (
                        <MessageList messages={messages} />
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
