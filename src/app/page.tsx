"use client";

import { useEffect, useState } from 'react';
import { ClientMessage, UIInterface } from './actions';
import { useActions, useUIState, readStreamableValue } from 'ai/rsc';
import { generateId } from 'ai';

import { AuroraBackground } from "@/components/ui/aurora-background";
import MessageList from '../components/ui/MessageList';
import EmptyState from '../components/ui/EmptyState';
import InputForm from '../components/ui/InputForm';
import { useTheme } from 'next-themes';

export default function Home() {
  const [input, setInput] = useState<string>('');
  const [conversation, setConversation] = useUIState();
  const { continueConversation } = useActions();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { theme, setTheme } = useTheme();

  const [ui, setUI] = useState<UIInterface>({
    theme: theme === 'dark' || theme === 'light' ? theme : 'dark',
    language: 'en',
  });

  useEffect(() => {
    setUI({
      theme: theme === 'dark' || theme === 'light' ? theme : 'dark',
      language: ui.language,
    })
  }, [theme])

  useEffect(() => {
    console.log('ui:', ui)
  }, [ui])

  const createMessage = (text : string) => {
    return {
      id: generateId(), 
      role: 'user', 
      display: text, 
      date: new Date(),
    }
  }

  const handleSubmitPrePrompt = async (content : string) => {
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
      createMessage(input),
    ]);

    setInput('');

    setIsLoading(true);

    try {
      const { loadingState, ...message } = await continueConversation(input, ui);
      console.log('message:', message)
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

  return (
    <AuroraBackground blur={conversation?.length > 0 ? true : false} >
      <div className="container flex flex-col h-[100dvh] p-2 md:px-8 w-full gap-2">
        <main className="flex-1 w-full bg-blue-700/5 dark:bg-white/5 backdrop-blur-md rounded-3xl overflow-hidden relative p-2">
          <div className='rounded-2xl overflow-hidden h-full mask'>
            {conversation.length === 0 ? (
              <EmptyState handleSubmitPrePrompt={handleSubmitPrePrompt} />
            ) : (
              <MessageList conversation={conversation} isLoading={isLoading} handleSubmitPrePrompt={handleSubmitPrePrompt} />
            )}
          </div>
        </main>
        <div className="w-full">
          <InputForm
            input={input}
            setInput={(e) => setInput(e.target.value)}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </AuroraBackground>
  );
}
