"use client";

import { useState, useEffect } from 'react';
import { ClientMessage } from './actions';
import { useActions, useUIState, readStreamableValue } from 'ai/rsc';
import { generateId } from 'ai';

import { AuroraBackground } from "@/components/ui/aurora-background";
import Navbar from '../components/ui/Navbar';
import MessageList from '../components/ui/MessageList';
import EmptyState from '../components/ui/EmptyState';
import InputForm from '../components/ui/InputForm';
import { useRef } from 'react';

export default function Home() {
  const [input, setInput] = useState<string>('');
  const [conversation, setConversation] = useUIState();
  const { continueConversation } = useActions();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    console.log('conversation:', conversation);
  }, [conversation]);

  const handleSubmitPrePrompt = async (content : string) => {
    setConversation((currentConversation: ClientMessage[]) => [
      ...currentConversation,
      { id: generateId(), role: 'user', display: content },
    ]);

    setInput('');

    setIsLoading(true);
    abortControllerRef.current = new AbortController();

    try {
      const { loadingState, ...message } = await continueConversation(content, { signal: abortControllerRef.current.signal });
      setConversation((currentConversation: ClientMessage[]) => [
        ...currentConversation,
        message,
      ]);

      for await (const state of readStreamableValue(loadingState)) {
        setIsLoading((state as { loading: boolean }).loading);
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Requête annulée');
      } else {
        console.error('Erreur lors de la conversation:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    setConversation((currentConversation: ClientMessage[]) => [
      ...currentConversation,
      { id: generateId(), role: 'user', display: input },
    ]);

    setInput('');

    setIsLoading(true);
    abortControllerRef.current = new AbortController();

    try {
      const { loadingState, ...message } = await continueConversation(input, { signal: abortControllerRef.current.signal });
      setConversation((currentConversation: ClientMessage[]) => [
        ...currentConversation,
        message,
      ]);

      for await (const state of readStreamableValue(loadingState)) {
        setIsLoading((state as { loading: boolean }).loading);
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Requête annulée');
      } else {
        console.error('Erreur lors de la conversation:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      console.log('Requête annulée par l’utilisateur');
    }
  };

  return (
    <AuroraBackground>
      <div className="flex flex-col h-screen w-full z-40">
        <Navbar />
        <main className="flex-1 overflow-hidden relative">
          {conversation.length === 0 ? (
            <EmptyState handleSubmitPrePrompt={handleSubmitPrePrompt} />
          ) : (
            <MessageList conversation={conversation} isLoading={isLoading} handleSubmitPrePrompt={handleSubmitPrePrompt} />
          )}
        </main>
        <div className="z-30 fixed bottom-3 left-0 right-0 container mx-auto">
          <InputForm
            input={input}
            setInput={(e) => setInput(e.target.value)}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            handleStop={handleStop}
          />
        </div>
      </div>
    </AuroraBackground>
  );
}
